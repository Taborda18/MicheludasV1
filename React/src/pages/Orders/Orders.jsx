import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import CreateSessionModal from './CreateSessionModal';
import CreateOrderModal from './CreateOrderModal';
import OrderDetailsModal from './OrderDetailsModal';
import './Orders.css';
import MesaAltaIcon from '../../assets/images/mesa-alta.webp';

const Orders = () => {
    const [sessions, setSessions] = useState([]);
    const [sessionsWithPending, setSessionsWithPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('zonas'); // 'zonas' o 'pedidos'

    // Modal para crear pedido
    const [selectedSession, setSelectedSession] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Modal para crear nueva sesión
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Alertas
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    useEffect(() => {
        fetchSessions();
        fetchSessionsWithPending();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/sessions/open');
            setSessions(response.data);
        } catch (error) {
            console.error('Error al cargar sesiones:', error);
            showAlert('error', 'Error', 'No se pudieron cargar las sesiones');
        } finally {
            setLoading(false);
        }
    };

    const fetchSessionsWithPending = async () => {
        try {
            const response = await api.get('/sessions/with-pending-tickets');
            setSessionsWithPending(response.data);
        } catch (error) {
            console.error('Error al cargar sesiones con pendientes:', error);
        }
    };

    const showAlert = (type, title, message) => {
        setAlert({ isOpen: true, type, title, message });
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchSessions();
    };

    const handleCloseSession = async (sessionId) => {
        try {
            // Cerrar sesión - cambiar a Closed
            await api.patch(`/sessions/${sessionId}/status`, { status: 'Closed' });
            showAlert('success', 'Éxito', 'Mesa cerrada correctamente');
            fetchSessions();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            showAlert('error', 'Error', 'No se pudo cerrar la mesa');
        }
    };

    const handleSelectTable = (session) => {
        setSelectedSession(session);
        if (activeTab === 'zonas') {
            setIsOrderModalOpen(true);
        } else {
            setIsDetailsModalOpen(true);
        }
    };

    const handleOrderSuccess = () => {
        setIsOrderModalOpen(false);
        setSelectedSession(null);
        fetchSessions();
        fetchSessionsWithPending(); // Actualizar pedidos pendientes
    };

    const handleDetailsSuccess = () => {
        setIsDetailsModalOpen(false);
        setSelectedSession(null);
        fetchSessions();
        fetchSessionsWithPending(); // Actualizar pedidos pendientes
    };

    const getTagIcon = (tableIdentifier) => {
        const lower = tableIdentifier?.toLowerCase() || '';
       return <img    src={MesaAltaIcon} alt="Mesa Alta" className="card-header imag"
        />

    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price || 0);
    };

    // Calcular el total de pedidos pendientes
    const totalPendingTickets = sessionsWithPending.reduce((sum, session) => sum + session.pending_tickets_count, 0);

    if (loading) {
        return (
            <div className="orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando mesas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            {/* Tabs de navegación */}
            <div className="orders-tabs">
                <button
                    className={`tab-btn ${activeTab === 'zonas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('zonas')}
                >
                    📍 Zonas
                </button>
                <button
                    className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pedidos')}
                >
                    📋 Pedidos {totalPendingTickets > 0 && <span className="badge-count">{totalPendingTickets}</span>}
                </button>
            </div>

            {/* Header con acciones */}
            <div className="orders-header">
                <button className="btn-create" onClick={() => setIsCreateModalOpen(true)}>
                    + Crear
                </button>
            </div>

            {/* Grid de mesas/sesiones */}
            {activeTab === 'zonas' && (
                <div className="tables-grid">
                    {sessions.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay mesas abiertas</p>
                            <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                                Abrir primera mesa
                            </button>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                className="table-card active"
                                onClick={() => handleSelectTable(session)}
                            >
                                <div className="card-header">
                                    <span className="table-icon">{getTagIcon(session.table_identifier)}</span>
                                </div>
                                <div className="card-body">
                                    <h3 className="table-name">{session.table_identifier}</h3>
                                    {session.tag && (
                                        <span className="table-tag">{session.tag}</span>
                                    )}
                                    <span className="status-label active">
                                        Abierta
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Vista de pedidos */}
            {activeTab === 'pedidos' && (
                <div className="tables-grid">
                    {sessionsWithPending.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay mesas abiertas</p>
                        </div>
                    ) : (
                        sessionsWithPending.map((session) => (
                            <div
                                key={session.id}
                                className={`table-card ${session.pending_tickets_count > 0 ? 'pending' : 'approved'}`}
                                onClick={() => handleSelectTable(session)}
                            >
                                <div className="card-header">
                                    <span className="table-icon">{getTagIcon(session.table_identifier)}</span>
                                </div>
                                <div className="card-body">
                                    <h3 className="table-name">{session.table_identifier}</h3>
                                    {session.tag && (
                                        <span className="table-tag">{session.tag}</span>
                                    )}
                                    <span className={`status-label ${session.pending_tickets_count > 0 ? 'pending' : 'approved'}`}>
                                        {session.pending_tickets_count > 0 
                                            ? `${session.pending_tickets_count} ${session.pending_tickets_count === 1 ? 'Pedido' : 'Pedidos'}` 
                                            : 'Completada'}
                                    </span>
                                    <div className="table-info">
                                        <span className="table-total">{formatPrice(session.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal para crear mesa */}
            {isCreateModalOpen && (
                <CreateSessionModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                    showAlert={showAlert}
                />
            )}

            {/* Modal para crear pedido */}
            {isOrderModalOpen && selectedSession && (
                <CreateOrderModal
                    session={selectedSession}
                    onClose={() => {
                        setIsOrderModalOpen(false);
                        setSelectedSession(null);
                    }}
                    onSuccess={handleOrderSuccess}
                    showAlert={showAlert}
                />
            )}

            {/* Modal para ver detalles de pedidos pendientes */}
            {isDetailsModalOpen && selectedSession && (
                <OrderDetailsModal
                    session={selectedSession}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setSelectedSession(null);
                    }}
                    onSuccess={handleDetailsSuccess}
                    showAlert={showAlert}
                />
            )}

            {/* Modal de alerta */}
            <Modal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                type={alert.type}
                title={alert.title}
                message={alert.message}
            />
        </div>
    );
};

export default Orders;
