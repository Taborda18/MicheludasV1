import { useState, useEffect } from 'react';
import api from '../../services/api';
import './Modal.css';

const InventoryForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    categories: '',
    price: '',
    stock: '',
    suppliers_id: ''
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSuppliers();
    if (item) {
      setFormData({
        name: item.name || '',
        categories: item.categories || '',
        price: item.price?.toString() || '',
        stock: item.stock?.toString() || '',
        suppliers_id: item.suppliers_id?.toString() || ''
      });
    }
  }, [item]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.categories.trim()) {
      newErrors.categories = 'La categoría es requerida';
    }

    if (!formData.price.trim() || isNaN(formData.price)) {
      newErrors.price = 'El precio debe ser un número válido';
    }

    if (!formData.stock.trim() || isNaN(formData.stock)) {
      newErrors.stock = 'El stock debe ser un número válido';
    }

    if (!formData.suppliers_id.trim()) {
      newErrors.suppliers_id = 'El ID del proveedor es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (item) {
        await api.put(`/inventory/${item.id}`, formData);
      } else {
        await api.post('/inventory', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar inventario:', error);
      setErrors({ submit: 'Error al guardar el inventario' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <h3>{item ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="inventory-form">
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del producto"
              disabled={loading}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categories">Categoría *</label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="Ingresa la categoría del producto"
              disabled={loading}
              className={errors.categories ? 'error' : ''}
            />
            {errors.categories && <span className="error-message">{errors.categories}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio *</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ingresa el precio del producto"
              disabled={loading}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="text"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Ingresa el stock del producto"
              disabled={loading}
              className={errors.stock ? 'error' : ''}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="suppliers_id">Proveedor *</label>
            <select
              id="suppliers_id"
              name="suppliers_id"
              value={formData.suppliers_id}
              onChange={handleChange}
              disabled={loading}
              className={errors.suppliers_id ? 'error' : ''}
            >
              <option value="">Selecciona un proveedor</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.suppliers_id && <span className="error-message">{errors.suppliers_id}</span>}
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
              disabled={loading}
            >
              {loading ? 'Guardando...' : (item ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;