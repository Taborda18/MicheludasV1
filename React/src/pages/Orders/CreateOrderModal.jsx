import { useEffect, useMemo, useState } from 'react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';
import './CreateOrderModal.css';

const CreateOrderModal = ({ session, onClose, onSuccess, showAlert }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [search, setSearch] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const data = await productService.getActive();
            setProducts(data || []);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            showAlert('error', 'Error', 'No se pudo cargar la carta');
        } finally {
            setLoadingProducts(false);
        }
    };

    const filteredProducts = useMemo(() => {
        const query = search.toLowerCase();
        return products.filter((product) =>
            (Number(product.stock || 0) > 0) &&
            product.name.toLowerCase().includes(query)
        );
    }, [products, search]);

    const formatPrice = (value) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value || 0);

    const handleAddProduct = (product) => {
        setOrderItems((prev) => {
            const exists = prev.find((item) => item.product_id === product.id);
            if (exists) {
                return prev.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    product_id: product.id,
                    name: product.name,
                    price: product.sale_price,
                    quantity: 1
                }
            ];
        });
    };

    const handleDecreaseProduct = (productId) => {
        setOrderItems((prev) =>
            prev
                .map((item) =>
                    item.product_id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemoveProduct = (productId) => {
        setOrderItems((prev) => prev.filter((item) => item.product_id !== productId));
    };

    const total = useMemo(() =>
        orderItems.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0),
        [orderItems]
    );

    const handleCreateOrder = async () => {
        if (!orderItems.length) {
            showAlert('warning', 'Sin productos', 'Agrega al menos un producto al pedido.');
            return;
        }

        if (!session?.id) {
            showAlert('error', 'Error', 'No hay una mesa seleccionada.');
            return;
        }

        try {
            setSaving(true);
            const ticket = await orderService.createTicket({
                session_id: session.id,
                waiter_id: user?.id,
                status: 'Pending'
            });

            await Promise.all(
                orderItems.map((item) =>
                    orderService.addTicketDetail({
                        ticket_id: ticket.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price_at_sale: item.price
                    })
                )
            );

            showAlert('success', 'Pedido creado', 'Se creó el ticket en estado pendiente.');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error al crear pedido:', error);
            showAlert('error', 'Error', 'No se pudo crear el pedido. Intenta nuevamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content create-order-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-x" onClick={onClose}>✕</button>

                <div className="order-modal-header">
                    <div className="session-info">
                        <p className="session-label">Mesa</p>
                        <h2 className="modal-title">{session.table_identifier}</h2>
                        {session.tag && <span className="session-tag">{session.tag}</span>}
                    </div>
                    <div className="session-status">
                        <span className="status-chip">Nuevo pedido</span>
                        <span className="status-chip pending">Estado pendiente</span>
                    </div>
                </div>

                <div className="order-modal-body">
                    <div className="catalog-panel">
                        <div className="panel-header">
                            <div>
                                <h3>Carta</h3>
                                <p className="panel-subtitle">Agrega productos tocando cada tarjeta</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {loadingProducts ? (
                            <div className="loading-products">Cargando carta...</div>
                        ) : (
                            <div className="product-grid">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="product-card" onClick={() => handleAddProduct(product)}>
                                        <div className="product-info">
                                            <h4>{product.name}</h4>
                                            <span className="product-price">{formatPrice(product.sale_price)}</span>
                                        </div>
                                        <button
                                            className="btn-add"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddProduct(product);
                                            }}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                ))}

                                {filteredProducts.length === 0 && (
                                    <div className="empty-products">No se encontraron productos.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="summary-panel">
                        <div className="panel-header">
                            <div>
                                <h3>Pedido</h3>
                                <span className="items-count">{orderItems.length} items</span>
                            </div>
                        </div>

                        <button
                            className="btn-confirm full create-btn-top"
                            onClick={handleCreateOrder}
                            disabled={saving || orderItems.length === 0}
                        >
                            {saving ? 'Creando pedido...' : 'Crear ticket pendiente'}
                        </button>

                        <div className="order-items-scroll">
                            <div className="order-items">
                                {orderItems.length === 0 ? (
                                    <p className="empty-order">Aún no agregas productos.</p>
                                ) : (
                                    orderItems.map((item) => (
                                        <div key={item.product_id} className="order-item">
                                            <div>
                                                <p className="item-name">{item.name}</p>
                                                <span className="item-price">{formatPrice(item.price)}</span>
                                            </div>
                                            <div className="item-actions">
                                                <div className="qty-controls">
                                                    <button onClick={() => handleDecreaseProduct(item.product_id)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => handleAddProduct({ id: item.product_id, name: item.name, sale_price: item.price })}>+</button>
                                                </div>
                                                <button className="remove-btn" onClick={() => handleRemoveProduct(item.product_id)}>Eliminar</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {orderItems.length > 0 && (
                                <div className="total-row">
                                    <span>Total</span>
                                    <strong>{formatPrice(total)}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;
