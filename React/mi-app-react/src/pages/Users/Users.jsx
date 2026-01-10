import { useState, useEffect } from 'react';
import api from '../../services/api';
import UserForm from './UserForm';
import Modal from '../../components/common/Modal';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/users/${id}`);
        showAlert('success', 'Éxito', 'Usuario eliminado correctamente');
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        showAlert('error', 'Error', 'No se pudo eliminar el usuario');
      }
    }
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    fetchUsers();
    showAlert('success', 'Éxito', editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="subtitle">Administra los usuarios del sistema</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          + Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Cargando usuarios...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>No hay usuarios registrados</p>
          <button className="btn-secondary" onClick={handleCreate}>
            Crear primer usuario
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="username">{user.username}</td>
                  <td>
                    <span className={`role-badge role-${user.role_id}`}>
                      {getRoleName(user.role_id)}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <UserForm
          user={editingUser}
          roles={roles}
          onClose={() => setShowModal(false)}
          onSuccess={handleSaveSuccess}
        />
      )}

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

export default Users;
