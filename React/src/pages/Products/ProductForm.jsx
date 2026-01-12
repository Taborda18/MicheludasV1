import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../Inventory/Modal.css';

const ProductForm = ({ product, onClose, onSuccess, showAlert }) => {
  const [availableInventory, setAvailableInventory] = useState([]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [formData, setFormData] = useState({
    inventory_id: '',
    sale_price: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      // Modo edición
      setFormData({
        inventory_id: product.id,
        sale_price: product.sale_price?.toString() || '',
        is_active: product.is_active
      });
      fetchInventoryItem(product.id);
    } else {
      // Modo creación
      fetchAvailableInventory();
    }
  }, [product]);

  const fetchAvailableInventory = async () => {
    try {
      const response = await api.get('/products/available-inventory');
      setAvailableInventory(response.data);
    } catch (error) {
      console.error('Error al cargar inventario disponible:', error);
    }
  };

  const fetchInventoryItem = async (id) => {
    try {
      const response = await api.get(`/inventory/${id}`);
      setSelectedInventoryItem(response.data);
    } catch (error) {
      console.error('Error al obtener info del inventario:', error);
      setSelectedInventoryItem(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'inventory_id' && value) {
      const item = availableInventory.find(inv => inv.id === parseInt(value));
      setSelectedInventoryItem(item || null);
    } else if (name === 'inventory_id' && !value) {
      setSelectedInventoryItem(null);
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!product && !formData.inventory_id) {
      newErrors.inventory_id = 'Selecciona un producto del inventario';
    }
    
    if (!formData.sale_price || isNaN(formData.sale_price) || parseFloat(formData.sale_price) <= 0) {
      newErrors.sale_price = 'Ingresa un precio de venta válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (product) {
        await api.put(`/products/${product.id}`, {
          name: product.name,
          sale_price: parseFloat(formData.sale_price),
          is_active: formData.is_active
        });
        showAlert('success', 'Éxito', 'Producto actualizado correctamente');
      } else {
        await api.post(`/products/from-inventory/${formData.inventory_id}`, {
          sale_price: parseFloat(formData.sale_price),
          is_active: formData.is_active
        });
        showAlert('success', 'Éxito', 'Producto añadido al menú correctamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrors({ submit: 'Error al guardar el producto' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>{product ? 'Editar Producto' : 'Añadir Producto al Menú'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {!product && (
            <div className="form-group">
              <label htmlFor="inventory_id">Producto del Inventario *</label>
              <select
                id="inventory_id"
                name="inventory_id"
                value={formData.inventory_id}
                onChange={handleChange}
                disabled={loading}
                className={errors.inventory_id ? 'error' : ''}
              >
                <option value="">Selecciona un producto</option>
                {availableInventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.categories} (Stock: {item.stock})
                  </option>
                ))}
              </select>
              {errors.inventory_id && (
                <span className="error-message">{errors.inventory_id}</span>
              )}
              {availableInventory.length === 0 && (
                <span className="info-message">
                  No hay productos disponibles. Primero añade productos al inventario.
                </span>
              )}
            </div>
          )}

          {!product && selectedInventoryItem && (
            <div className="form-group">
              <label>Precio de Compra (Inventario)</label>
              <input
                type="text"
                value={formatPrice(selectedInventoryItem.price)}
                disabled
                className="disabled-input"
              />
            </div>
          )}

          {product && (
            <div className="form-group">
              <label>Producto</label>
              <input
                type="text"
                value={product.name}
                disabled
                className="disabled-input"
              />
            </div>
          )}

          {product && selectedInventoryItem && (
            <div className="form-group">
              <label>Precio de Compra (Inventario)</label>
              <input
                type="text"
                value={formatPrice(selectedInventoryItem.price)}
                disabled
                className="disabled-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="sale_price">Precio de Venta *</label>
            <input
              type="number"
              id="sale_price"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              placeholder="Ingresa el precio de venta"
              disabled={loading}
              className={errors.sale_price ? 'error' : ''}
              min="0"
              step="100"
            />
            {errors.sale_price && (
              <span className="error-message">{errors.sale_price}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              Producto activo (disponible para venta)
            </label>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || (!product && availableInventory.length === 0)}
            >
              {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Añadir')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
