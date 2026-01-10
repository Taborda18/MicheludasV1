import { useState } from 'react';
import './Dashboard.css';
import logo from '../../assets/images/logo-micheludos.webp';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('mesas');

  const menuItems = [
    { id: 'mesas', label: 'Mesas' },
    { id: 'inventario', label: 'Inventario' },
    { id: 'productos', label: 'Productos' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'ordenes', label: 'Órdenes' },
    { id: 'reportes', label: 'Reportes' },
    { id: 'administrador_de_usuarios', label: 'Admin de usuarios' },
  ];

  const handleLogout = () => {
    // Lógica de logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Micheludos Logo" className="dashboard-logo" />
        </div>
        
        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <span className="menu-label">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Dashboard - {menuItems.find(item => item.id === activeSection)?.label}</h1>
          <div className="user-info">
            <span>Usuario</span>
          </div>
        </header>

        <div className="content-area">
          {activeSection === 'mesas' && (
            <div className="mesas-section">
              <h2>Gestión de Mesas</h2>
              <div className="tables-grid">
                {/* Aquí irá la gestión de mesas */}
                <p>Aquí trabajaremos con las mesas del bar</p>
              </div>
            </div>
          )}

          {activeSection === 'inventario' && (
            <div className="section-placeholder">
              <h2>Inventario</h2>
              <p>Gestión de inventario</p>
            </div>
          )}

          {activeSection === 'productos' && (
            <div className="section-placeholder">
              <h2>Productos</h2>
              <p>Gestión de productos</p>
            </div>
          )}

          {activeSection === 'ventas' && (
            <div className="section-placeholder">
              <h2>Ventas</h2>
              <p>Gestión de ventas</p>
            </div>
          )}

          {activeSection === 'ordenes' && (
            <div className="section-placeholder">
              <h2>Órdenes</h2>
              <p>Gestión de órdenes</p>
            </div>
          )}

          {activeSection === 'reportes' && (
            <div className="section-placeholder">
              <h2>Reportes</h2>
              <p>Reportes y estadísticas</p>
            </div>
          )}
          
          {activeSection === 'administrador_de_usuarios' && (
            <div className="section-placeholder">
              <h2>Configuración</h2>
              <p>Gestión de configuración y usuarios</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
