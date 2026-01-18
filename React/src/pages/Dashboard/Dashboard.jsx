import { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import logo from '../../assets/images/logo-micheludos.webp';
import Users from '../Users/Users';
import Inventory from '../Inventory/Inventory';
import Products from '../Products/Products';
import Orders from '../Orders/Orders';
import CashSessionOpenModal from '../../components/cash/CashSessionOpenModal';
import CashSessionCloseModal from '../../components/cash/CashSessionCloseModal';
import { AuthContext } from '../../context/AuthContext';
import { cashSessionService } from '../../services/cashSessionService';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const roleId = user?.role_id !== undefined ? Number(user.role_id) : null;
  const [activeSection, setActiveSection] = useState('mesas');
  // Iniciar colapsado en mobile, expandido en desktop
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
  const [showCashModal, setShowCashModal] = useState(null); // null = checking, true = show, false = hide
  const [cashSessionChecked, setCashSessionChecked] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Solo CAJA (role_id=2) y MESERO (role_id=3) necesitan sesión de caja
  // ADMIN (role_id=1) NO necesita
  const needsCashSession = roleId === 2 || roleId === 3;

  useEffect(() => {
    const checkCashSession = async () => {
      // Esperar a que termine de cargar el usuario
      if (loading) {
        return;
      }

      // Si no hay usuario o no necesita sesión de caja
      if (!user || !needsCashSession) {
        setShowCashModal(false);
        setCashSessionChecked(true);
        setCurrentSessionId(null);
        return;
      }
      
      // Resetear el estado de checking cuando el usuario cambia
      setCashSessionChecked(false);
      
      try {
        const openSessions = await cashSessionService.getOpenByUser(user.id);
        
        if (!openSessions || openSessions.length === 0) {
          // No mostrar modal automáticamente, solo marcar que no hay sesión
          setShowCashModal(false);
          setCurrentSessionId(null);
        } else {
          setShowCashModal(false);
          setCurrentSessionId(openSessions[0].id); // Guardar ID de sesión abierta
        }
      } catch (error) {
        console.error('Error verificando sesiones:', error);
        setCurrentSessionId(null);
      } finally {
        setCashSessionChecked(true);
      }
    };

    checkCashSession();
  }, [user?.id, needsCashSession, loading]);

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

  const handleOpenedSession = (session) => {
    setShowCashModal(false);
    setCurrentSessionId(session?.id);
  };

  const handleCloseSession = (success) => {
    setShowCloseModal(false);
    if (success) {
      // Recargar para forzar nueva apertura
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Bloqueo mientras se verifica sesión de caja */}
      {!cashSessionChecked && needsCashSession && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          color: '#fff',
          fontSize: '18px'
        }}>
          Verificando sesión de caja...
        </div>
      )}

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
            <span className="user-greeting">Hola, {user?.username || 'Usuario'}</span>
            {needsCashSession && (
              currentSessionId ? (
                <button className="close-cash-button" onClick={() => setShowCloseModal(true)}>
                  Cierre Caja
                </button>
              ) : (
                <button className="open-cash-button" onClick={() => setShowCashModal(true)}>
                  Abrir Caja
                </button>
              )
            )}
          </div>
        </header>

        <div className="content-area">
          {activeSection === 'mesas' && (() => {
            // Si no hay usuario aún, mostrar verificación
            if (!user) {
              return (
                <div className="section-locked">
                  <div className="locked-content">
                    <div className="lock-icon">⏳</div>
                    <h2>Verificando Sesión...</h2>
                    <p>Espera un momento mientras verificamos tu sesión de caja</p>
                  </div>
                </div>
              );
            }
            
            // Mostrar loading mientras carga el usuario o verifica la sesión
            if (loading || (needsCashSession && !cashSessionChecked)) {
              return (
                <div className="section-locked">
                  <div className="locked-content">
                    <div className="lock-icon">⏳</div>
                    <h2>Verificando Sesión...</h2>
                    <p>Espera un momento mientras verificamos tu sesión de caja</p>
                  </div>
                </div>
              );
            }
            
            if (needsCashSession && !currentSessionId) {
              return (
                <div className="section-locked">
                  <div className="locked-content">
                    <div className="lock-icon">🔒</div>
                    <h2>Sección Bloqueada</h2>
                    <p>Debes abrir tu sesión de caja para acceder a las mesas</p>
                    <button 
                      className="btn-open-cash" 
                      onClick={() => setShowCashModal(true)}
                    >
                      🔓 Abrir Sesión de Caja
                    </button>
                  </div>
                </div>
              );
            }
            
            return <Orders />;
          })()}

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

      {needsCashSession && (
        <>
          <CashSessionOpenModal
            isOpen={showCashModal}
            user={user}
            onOpened={handleOpenedSession}
          />
          <CashSessionCloseModal
            isOpen={showCloseModal}
            onClose={handleCloseSession}
            user={user}
            currentSessionId={currentSessionId}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
