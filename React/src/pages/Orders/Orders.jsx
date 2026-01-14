import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import CreateSessionModal from './CreateSessionModal';
import './Orders.css';
import MesaAltaIcon from '../../assets/images/mesa-alta.webp';

const Orders = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('zonas'); // 'zonas' o 'pedidos'

    // Modal para crear nueva sesión
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Alertas
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    useEffect(() => {
        fetchSessions();
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
        // Aquí se navegará a los detalles del pedido de la mesa
        console.log('Mesa seleccionada:', session);
        // TODO: Navegar a la vista de pedido de la mesa
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
                    📋 Pedidos
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
                <div className="orders-list">
                    <p className="coming-soon">Vista de pedidos en desarrollo...</p>
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
