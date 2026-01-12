import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ProductForm from './ProductForm';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Alertas y confirmación
  const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, product: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filter, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  // Handlers para modal de producto
  const handleOpenProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSuccess = () => {
    handleCloseProductModal();
    fetchProducts();
  };

  // Handlers para eliminar
  const handleDelete = (product) => {
    setConfirmDelete({ isOpen: true, product });
  };

  const confirmDeleteProduct = async () => {
    const product = confirmDelete.product;
    setConfirmDelete({ isOpen: false, product: null });
    try {
      await api.delete(`/products/${product.id}`);
      showAlert('success', 'Éxito', 'Producto eliminado del menú');
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showAlert('error', 'Error', 'No se pudo eliminar el producto');
    }
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, product: null });
  };

  // Toggle activo/inactivo
  const handleToggleActive = async (product) => {
    try {
      await api.patch(`/products/${product.id}/toggle`);
      fetchProducts();
      showAlert('success', 'Éxito', `Producto ${product.is_active ? 'desactivado' : 'activado'}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showAlert('error', 'Error', 'No se pudo cambiar el estado del producto');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-container">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h2>Menú del Bar</h2>
          <p className="subtitle">Gestiona los productos disponibles para venta</p>
        </div>
        <button className="btn-primary" onClick={handleOpenProductModal}>
          + Añadir Producto
        </button>
      </div>

      <div className="products-filter">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos en el menú</p>
          <button className="btn-secondary" onClick={handleOpenProductModal}>
            Añadir primer producto
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio Venta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="product-name">{product.name}</td>
                  <td className="product-price">{formatPrice(product.sale_price)}</td>
                  <td>
                    <span 
                      className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(product)}
                    >
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEditProduct(product)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para añadir/editar producto */}
      {isProductModalOpen && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseProductModal}
          onSuccess={handleProductSuccess}
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

      {/* Modal de confirmación de eliminación */}
      {confirmDelete.isOpen && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={cancelDelete}>✕</button>
            <div className="modal-icon warning">⚠</div>
            <h2 className="modal-title">Confirmar eliminación</h2>
            <p className="modal-message">
              ¿Estás seguro de eliminar "{confirmDelete.product?.name}" del menú?
            </p>
            <div className="confirm-buttons">
              <button className="btn-cancel-confirm" onClick={cancelDelete}>
                Cancelar
              </button>
              <button className="btn-delete-confirm" onClick={confirmDeleteProduct}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
