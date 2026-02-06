import { useState, useEffect, useContext } from 'react';
import { orderService } from '../../services/orderService';
import { invoiceService } from '../../services/invoiceService';
import { cashSessionService } from '../../services/cashSessionService';
import { AuthContext } from '../../context/AuthContext';
import TableDetailsModal from './TableDetailsModal';
import './OrderDetailsModal.css';
import socket from '../../services/socket';

const OrderDetailsModal = ({ session, onClose, onSuccess, showAlert }) => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [approvedTickets, setApprovedTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [showTableDetails, setShowTableDetails] = useState(false);

    useEffect(() => {
        loadTickets();

        const refreshIfSame = ({ session_id }) => {
            if (session_id === session.id) {
                loadTickets();
            }
        };
        socket.on('ticket:changed', refreshIfSame);
        socket.on('orderSession:changed', refreshIfSame);
        socket.on('invoice:created', refreshIfSame);
        return () => {
            socket.off('ticket:changed', refreshIfSame);
            socket.off('orderSession:changed', refreshIfSame);
            socket.off('invoice:created', refreshIfSame);
        };
    }, [session.id]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await orderService.getTicketsBySession(session.id);
            const pending = data.filter(t => t.status === 'Pending');
            const approved = data.filter(t => t.status === 'Approved');
            setTickets(pending);
            setApprovedTickets(approved);
        } catch (error) {
            console.error('Error al cargar tickets:', error);
            showAlert('error', 'Error', 'No se pudieron cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value || 0);

    const calculateTicketTotal = (ticket) => {
        if (!ticket.details || ticket.details.length === 0) return 0;
        return ticket.details.reduce((sum, detail) =>
            sum + (detail.quantity * detail.unit_price_at_sale), 0
        );
    };

    const handleApproveTicket = async (ticketId) => {
        try {
            await orderService.updateTicketStatus(ticketId, 'Approved');
            showAlert('success', 'Aprobado', 'Pedido aprobado y agregado a la cuenta');

            // Recargar y verificar si quedan pendientes
            const updatedData = await orderService.getTicketsBySession(session.id);
            const remainingPending = updatedData.filter(t => t.status === 'Pending');

            // Mantener el modal abierto: solo recargar contenido
            loadTickets();
        } catch (error) {
            console.error('Error al aprobar ticket:', error);
            showAlert('error', 'Error', 'No se pudo aprobar el pedido');
        }
    };

    const handleRejectTicket = async (ticketId) => {
        try {
            await orderService.updateTicketStatus(ticketId, 'Rejected');
            showAlert('warning', 'Rechazado', 'Pedido rechazado exitosamente');
            socket.emit('ticket:changed', { session_id: session.id });

            loadTickets();

            onSuccess?.();
        } catch (error) {
            console.error('Error al rechazar ticket:', error);
            showAlert('error', 'Error', 'No se pudo rechazar el pedido');
        }
    };

    const handleGenerateInvoice = async () => {
        try {
            setGenerating(true);

            if (!user?.id) {
                showAlert('error', 'Sesión', 'No se encontró el usuario logueado');
                setGenerating(false);
                return;
            }

            // Obtener sesión de caja abierta de forma GLOBAL (CAJA/MESERO)
            let cashSessionId = null;
            if (user.role_id === 2 || user.role_id === 3) {
                try {
                    const openSessions = await cashSessionService.getOpen();
                    if (openSessions && openSessions.length > 0) {
                        cashSessionId = openSessions[0].id;
                    }
                } catch (error) {
                    console.error('Error al obtener sesión de caja:', error);
                }
            }

            // Crear factura y cerrar mesa
            await invoiceService.generateInvoice({
                session_id: session.id,
                total_amount: totalGeneral,
                payment_method: paymentMethod,
                cashier_id: user.id,
                cash_session_id: cashSessionId
            });

            showAlert('success', 'Factura Generada', 'Venta cerrada y mesa lista para nuevo cliente');

            // Cerrar el modal y actualizar
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error al generar factura:', error);
            showAlert('error', 'Error', 'No se pudo generar la factura');
        } finally {
            setGenerating(false);
        }
    };

    const totalPending = tickets.reduce((sum, ticket) => sum + calculateTicketTotal(ticket), 0);
    const totalApproved = approvedTickets.reduce((sum, ticket) => sum + calculateTicketTotal(ticket), 0);
    const totalGeneral = totalPending + totalApproved;

    // Consolidar productos aprobados
    const consolidatedApprovedProducts = () => {
        const products = {};
        approvedTickets.forEach(ticket => {
            if (ticket.details) {
                ticket.details.forEach(detail => {
                    if (!products[detail.product_id]) {
                        products[detail.product_id] = {
                            product_id: detail.product_id,
                            product_name: detail.product_name,
                            quantity: 0,
                            unit_price: detail.unit_price_at_sale
                        };
                    }
                    products[detail.product_id].quantity += detail.quantity;
                });
            }
        });
        return Object.values(products);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-x" onClick={onClose}>✕</button>

                <div className="details-header">
                    <div className="header-left">
                        <div className="session-info-header">
                            <h2 className="modal-title">{session.table_identifier}</h2>
                            {session.tag && <span className="session-tag-header">{session.tag}</span>}
                        </div>
                        <div className="pending-summary">
                            <span className="pending-label"></span>
                            <span className="pending-count">{tickets.length}</span>
                        </div>
                    </div>
                </div>

                <div className="details-container">
                    <div className="details-body">
                        {loading ? (
                            <div className="loading-tickets">Cargando pedidos...</div>
                        ) : tickets.length === 0 ? (
                            <div className="empty-tickets">
                                <p>✓ Todos los pedidos han sido aprobados</p>
                            </div>
                        ) : (
                            <div className="tickets-list">
                                {tickets.map((ticket, index) => (
                                    <div key={ticket.id} className="ticket-card">
                                        <div className="ticket-header">
                                            <div className="ticket-info">
                                                <span className="ticket-number">Pedido #{index + 1}</span>
                                                <span className="ticket-status pending">Pendiente</span>
                                            </div>
                                            <span className="ticket-time">
                                                {new Date(ticket.created_at).toLocaleTimeString('es-CO', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <div className="ticket-items">
                                            {ticket.details && ticket.details.map((detail) => (
                                                <div key={detail.id} className="ticket-item">
                                                    <div className="item-info">
                                                        <span className="item-qty">{detail.quantity}x</span>
                                                        <span className="item-name">{detail.product_name}</span>
                                                    </div>
                                                    <span className="item-price">
                                                        {formatPrice(detail.quantity * detail.unit_price_at_sale)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="ticket-footer">
                                            <div className="ticket-total">
                                                <span>Subtotal</span>
                                                <strong>{formatPrice(calculateTicketTotal(ticket))}</strong>
                                            </div>
                                            <div className="ticket-actions">
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleRejectTicket(ticket.id)}
                                                    title="Rechazar pedido"
                                                >
                                                    ✕ Rechazar
                                                </button>
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleApproveTicket(ticket.id)}
                                                >
                                                    ✓ Aprobar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="account-panel">
                        <div className="account-header">
                            <h3>Cuenta</h3>
                        </div>

                        <div className="account-items">
                            <div className="account-section">
                                <div className="section-title">Aprobados</div>
                                <div className="approved-list">
                                    {approvedTickets.length === 0 ? (
                                        <p className="empty-approved">Sin pedidos aprobados</p>
                                    ) : (
                                        <div className="approved-products-box">
                                            {consolidatedApprovedProducts().map((product) => (
                                                <div key={product.product_id} className="approved-product-item">
                                                    <div className="product-info">
                                                        <span className="product-qty">{product.quantity}x</span>
                                                        <span className="product-name">{product.product_name}</span>
                                                    </div>
                                                    <span className="product-subtotal">
                                                        {formatPrice(product.quantity * product.unit_price)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {approvedTickets.length > 0 && (
                                <div className="account-divider"></div>
                            )}

                            <div className="account-totals">
                                {approvedTickets.length > 0 && (
                                    <div className="total-row approved-total">
                                        <span>Subtotal aprobados</span>
                                        <strong>{formatPrice(totalApproved)}</strong>
                                    </div>
                                )}

                                <div className="total-row pending-total">
                                    <span>Pendiente</span>
                                    <strong>{formatPrice(totalPending)}</strong>
                                </div>

                                <div className="total-row general-total">
                                    <span>Total cuenta</span>
                                    <strong>{formatPrice(totalGeneral)}</strong>
                                </div>
                            </div>

                            {approvedTickets.length > 0 && (
                                <div className="detail-mesa-action">
                                    <button
                                        className="btn-detail-mesa"
                                        onClick={() => setShowTableDetails(true)}
                                        title="Ver detalle de productos por ronda"
                                    >
                                        📋 Detalle Mesa
                                    </button>
                                </div>
                            )}

                            {approvedTickets.length > 0 && (
                                <div className="invoice-action">
                                    <div className="payment-method">
                                        <label htmlFor="payment-method-select">Método de pago</label>
                                        <select
                                            id="payment-method-select"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="cash">Efectivo</option>
                                            <option value="transfer">Transferencia</option>
                                        </select>
                                    </div>
                                    <button
                                        className="btn-generate-invoice"
                                        onClick={handleGenerateInvoice}
                                        disabled={generating || tickets.length > 0}
                                        title={tickets.length > 0 ? 'Aprueba todos los pedidos antes de generar factura' : ''}
                                    >
                                        {generating ? '⏳ Generando...' : '🧾 Generar Factura'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showTableDetails && (
                    <TableDetailsModal
                        session={session}
                        approvedTickets={approvedTickets}
                        onClose={() => {
                            setShowTableDetails(false);
                            // Reload tickets to reflect any quantity changes
                            loadTickets();
                        }}
                        showAlert={showAlert}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderDetailsModal;
