import { useState, useEffect } from 'react';
import api from '../../services/api';
import ProviderForm from './ProviderForm';
import InventoryForm from './InventoryForm';
import Modal from '../../components/common/Modal';
import './Inventory.css';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filter, setFilter] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, item: null });

    useEffect(() => {
        fetchInventory();
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const filtered = inventory.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.categories.toLowerCase().includes(filter.toLowerCase()) ||
            item.suppliers_id.toString().includes(filter.toLowerCase())
        );
        setFilteredInventory(filtered);
    }, [filter, inventory]);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/inventory');
            setInventory(response.data);
        } catch (error) {
            console.error('Error al cargar inventario:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.name : supplierId;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const showAlert = (type, title, message) => {
        setAlert({ isOpen: true, type, title, message });
    };

    const handleProviderSuccess = () => {
        setIsProviderModalOpen(false);
        fetchSuppliers();
        showAlert('success', 'Éxito', 'Proveedor agregado correctamente');
    };

    const handleInventorySuccess = () => {
        setIsInventoryModalOpen(false);
        fetchInventory();
        showAlert('success', 'Éxito', editingItem ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
        setEditingItem(null);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsInventoryModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsInventoryModalOpen(true);
    };

    const handleCloseInventoryModal = () => {
        setIsInventoryModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (item) => {
        setConfirmDelete({ isOpen: true, item });
    };

    const confirmDeleteItem = async () => {
        const item = confirmDelete.item;
        setConfirmDelete({ isOpen: false, item: null });
        try {
            await api.delete(`/inventory/${item.id}`);
            fetchInventory();
            showAlert('success', 'Éxito', 'Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            showAlert('error', 'Error', 'No se pudo eliminar el producto');
        }
    };

    const cancelDelete = () => {
        setConfirmDelete({ isOpen: false, item: null });
    };

    return (
        <div className="inventory-container">
            <header className="inventory-header">
                <h2>Inventario</h2>
                <div className="inventory-actions">
                    <button className="btn-primary" onClick={() => setIsProviderModalOpen(true)}>
                        + Agregar Proveedor
                    </button>
                    <button className="btn-primary" onClick={handleCreate}>
                        + Agregar Producto
                    </button>
                </div>
            </header>

            <div className="inventory-filter">
                <input
                    type="text"
                    placeholder="Filtrar por nombre, categoría o proveedor"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Proveedor</th>
                            <th>Fecha de creación</th>
                            <th>Fecha de actualización</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.categories}</td>
                                <td>${item.price}</td>
                                <td>{item.stock}</td>
                                <td>{getSupplierName(item.suppliers_id)}</td>
                                <td>{formatDate(item.create_date)}</td>
                                <td>{formatDate(item.update_date)}</td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(item)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isProviderModalOpen && (
                <ProviderForm
                    onClose={() => setIsProviderModalOpen(false)}
                    onSuccess={handleProviderSuccess}
                />
            )}

            {isInventoryModalOpen && (
                <InventoryForm
                    item={editingItem}
                    onClose={handleCloseInventoryModal}
                    onSuccess={handleInventorySuccess}
                />
            )}

            <Modal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                type={alert.type}
                title={alert.title}
                message={alert.message}
            />

            {confirmDelete.isOpen && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={cancelDelete}>✕</button>
                        <div className="modal-icon warning">⚠</div>
                        <h2 className="modal-title">Confirmar eliminación</h2>
                        <p className="modal-message">
                            ¿Estás seguro de eliminar "{confirmDelete.item?.name}"?
                        </p>
                        <div className="confirm-buttons">
                            <button className="btn-cancel-confirm" onClick={cancelDelete}>
                                Cancelar
                            </button>
                            <button className="btn-delete-confirm" onClick={confirmDeleteItem}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;