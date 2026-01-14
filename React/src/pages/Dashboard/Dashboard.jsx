import { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../assets/images/logo-micheludos.webp';
import Users from '../Users/Users';
import Inventory from '../Inventory/Inventory';
import Products from '../Products/Products';
import Orders from '../Orders/Orders';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('mesas');
  // Iniciar colapsado en mobile, expandido en desktop
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      // Auto colapsar en mobile, auto expandir en desktop
      if (window.innerWidth > 768) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'mesas', label: 'Mesas' },
    { id: 'productos', label: 'Productos' },
    { id: 'ordenes', label: 'Órdenes' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'reportes', label: 'Reportes' },
    { id: 'inventario', label: 'Inventario' },
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
      {/* Toggle Button - Fuera del sidebar para que siempre sea visible */}
      <button
        className="toggle-sidebar-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        <span className="toggle-icon">{isCollapsed ? '☰' : '✕'}</span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
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
            <Orders />
          )}

          {activeSection === 'inventario' && (
            <Inventory />
          )}

          {activeSection === 'productos' && (
            <Products />
          )}

          {activeSection === 'ventas' && (
            <div className="section-placeholder">
              <h2>Ventas</h2>
              <p>Gestión de ventas</p>
            </div>
          )}

          {activeSection === 'ordenes' && (
            <Orders />
          )}

          {activeSection === 'reportes' && (
            <div className="section-placeholder">
              <h2>Reportes</h2>
              <p>Reportes y estadísticas</p>
            </div>
          )}

          {activeSection === 'administrador_de_usuarios' && (
            <Users />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
