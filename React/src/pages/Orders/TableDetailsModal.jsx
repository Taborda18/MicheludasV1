import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import './TableDetailsModal.css';

const TableDetailsModal = ({ session, approvedTickets, onClose, showAlert }) => {
    const [details, setDetails] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState(new Set());

    useEffect(() => {
        loadTableDetails();
    }, [session.id, approvedTickets]);

    const loadTableDetails = async () => {
        try {
            setLoading(true);
            
            // Collect all details from approved tickets
            const allDetails = [];
            approvedTickets.forEach((ticket, ticketIndex) => {
                if (ticket.details && ticket.details.length > 0) {
                    ticket.details.forEach(detail => {
                        allDetails.push({
                            ...detail,
                            ticket_id: ticket.id,
                            ticket_created_at: ticket.created_at,
                            ticketIndex: ticketIndex
                        });
                    });
                }
            });

            // Sort by ticket creation time to group into rounds
            allDetails.sort((a, b) => 
                new Date(a.ticket_created_at) - new Date(b.ticket_created_at)
            );

            setDetails(allDetails);

            // Group details into rounds based on unique tickets
            const ticketGroups = {};
            const groupOrder = [];
            
            allDetails.forEach(detail => {
                if (!ticketGroups[detail.ticket_id]) {
                    ticketGroups[detail.ticket_id] = {
                        ticket_id: detail.ticket_id,
                        created_at: detail.ticket_created_at,
                        items: []
                    };
                    groupOrder.push(detail.ticket_id);
                }
                ticketGroups[detail.ticket_id].items.push(detail);
            });

            const roundsList = groupOrder.map((ticketId, index) => ({
                round: index + 1,
                ticket_id: ticketId,
                ...ticketGroups[ticketId]
            }));

            setRounds(roundsList);
        } catch (error) {
            console.error('Error loading table details:', error);
            showAlert('error', 'Error', 'No se pudieron cargar los detalles de la mesa');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value || 0);

    const handleQuantityChange = async (detailId, newQuantity) => {
        // Optimistic update
        const updatedDetails = details.map(d => 
            d.id === detailId ? { ...d, quantity: newQuantity } : d
        );
        setDetails(updatedDetails);

        // Update rounds display
        const updatedRounds = rounds.map(round => ({
            ...round,
            items: round.items.map(item =>
                item.id === detailId ? { ...item, quantity: newQuantity } : item
            )
        }));
        setRounds(updatedRounds);

        // Call API
        setUpdatingIds(prev => new Set([...prev, detailId]));
        
        try {
            const response = await orderService.updateTicketDetailQuantity(detailId, newQuantity);
            
            // Update with response data to ensure consistency
            const updatedDetailsFromServer = details.map(d =>
                d.id === detailId ? { ...d, ...response } : d
            );
            setDetails(updatedDetailsFromServer);

            const updatedRoundsFromServer = rounds.map(round => ({
                ...round,
                items: round.items.map(item =>
                    item.id === detailId ? { ...item, ...response } : item
                )
            }));
            setRounds(updatedRoundsFromServer);

            showAlert('success', 'Actualizado', `Cantidad actualizada a ${newQuantity}`);
        } catch (error) {
            console.error('Error updating quantity:', error);
            showAlert('error', 'Error', 'No se pudo actualizar la cantidad');
            
            // Rollback on error
            loadTableDetails();
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(detailId);
                return newSet;
            });
        }
    };

    const incrementQuantity = (detail) => {
        handleQuantityChange(detail.id, detail.quantity + 1);
    };

    const decrementQuantity = (detail) => {
        if (detail.quantity > 1) {
            handleQuantityChange(detail.id, detail.quantity - 1);
        }
    };

    const handleDeleteProduct = async (detailId) => {
        try {
            setUpdatingIds(prev => new Set(prev).add(detailId));
            await orderService.deleteTicketDetail(detailId);
            
            // Actualizar estado local inmediatamente
            const updatedDetails = details.filter(d => d.id !== detailId);
            setDetails(updatedDetails);

            // Actualizar rounds removiendo el item eliminado y filtrando rounds vacías
            const updatedRounds = rounds.map(round => ({
                ...round,
                items: round.items.filter(item => item.id !== detailId)
            })).filter(round => round.items.length > 0);
            setRounds(updatedRounds);

            showAlert('success', 'Eliminado', 'Producto eliminado del pedido');
        } catch (error) {
            console.error('Error deleting product:', error);
            showAlert('error', 'Error', 'No se pudo eliminar el producto');
            // Recargar si hay error para sincronizar
            loadTableDetails();
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(detailId);
                return newSet;
            });
        }
    };

    const calculateRoundTotal = (round) => {
        return round.items.reduce((sum, item) =>
            sum + (item.quantity * item.unit_price_at_sale), 0
        );
    };

    const calculateGrandTotal = () => {
        return details.reduce((sum, item) =>
            sum + (item.quantity * item.unit_price_at_sale), 0
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content table-details-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-x" onClick={onClose}>✕</button>

                <div className="table-details-header">
                    <h2 className="modal-title">Detalle Mesa</h2>
                    <p className="table-identifier">{session.table_identifier}</p>
                </div>

                <div className="table-details-content">
                    {loading ? (
                        <div className="loading-state">
                            <p>Cargando detalles de la mesa...</p>
                        </div>
                    ) : details.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay productos aprobados para esta mesa</p>
                        </div>
                    ) : (
                        <div className="rounds-container">
                            {rounds.map((round) => (
                                <div key={round.ticket_id} className="round-section">
                                    <div className="round-header">
                                        <h3 className="round-title">
                                            Ronda {round.round}
                                        </h3>
                                        <span className="round-time">
                                            {new Date(round.created_at).toLocaleTimeString('es-CO', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    <div className="round-items">
                                        {round.items.map((item) => (
                                            <div key={item.id} className="detail-item">
                                                <div className="item-left">
                                                    <div className="item-details">
                                                        <span className="item-name">{item.product_name}</span>
                                                        <span className="item-price">
                                                            {formatPrice(item.unit_price_at_sale)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="item-right">
                                                    <div className="quantity-editor">
                                                        <button
                                                            className="qty-btn qty-minus"
                                                            onClick={() => decrementQuantity(item)}
                                                            disabled={updatingIds.has(item.id) || item.quantity <= 1}
                                                            title="Disminuir cantidad"
                                                        >
                                                            −
                                                        </button>
                                                        <input
                                                            type="number"
                                                            className="qty-input"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value, 10);
                                                                if (val > 0) {
                                                                    handleQuantityChange(item.id, val);
                                                                }
                                                            }}
                                                            disabled={updatingIds.has(item.id)}
                                                            min="1"
                                                        />
                                                        <button
                                                            className="qty-btn qty-plus"
                                                            onClick={() => incrementQuantity(item)}
                                                            disabled={updatingIds.has(item.id)}
                                                            title="Aumentar cantidad"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span className="item-subtotal">
                                                        {formatPrice(item.quantity * item.unit_price_at_sale)}
                                                    </span>
                                                    <button
                                                        className="btn-delete-product"
                                                        onClick={() => handleDeleteProduct(item.id)}
                                                        disabled={updatingIds.has(item.id)}
                                                        title="Eliminar producto"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="round-footer">
                                        <span className="round-label">Subtotal ronda</span>
                                        <span className="round-total">
                                            {formatPrice(calculateRoundTotal(round))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {details.length > 0 && (
                    <div className="table-details-footer">
                        <div className="grand-total">
                            <span className="total-label">Total Mesa</span>
                            <span className="total-amount">
                                {formatPrice(calculateGrandTotal())}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableDetailsModal;
