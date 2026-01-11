import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Modal from '../../components/common/Modal';
import logo from '../../assets/images/logo-micheludos.webp';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const showModal = (type, title, message) => {
        setModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const closeModal = () => {
        const wasSuccess = modal.type === 'success';
        setModal({
            ...modal,
            isOpen: false
        });
        if (wasSuccess) {
            navigate('/dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(formData.username, formData.password);
            showModal(
                'success',
                '¡Login Exitoso!',
                `Bienvenido ${response.user.username}. Has iniciado sesión correctamente.`
            );
        } catch (err) {
            console.error('Error en login:', err);
            
            let errorMessage = 'Ocurrió un error inesperado. Por favor, verifica que el servidor esté corriendo.';
            
            if (err.response) {
                // El servidor respondió con un error
                errorMessage = err.response.data?.message || 'Usuario o contraseña incorrectos.';
            } else if (err.request) {
                // La petición fue hecha pero no hubo respuesta
                errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 5000.';
            }
            
            showModal(
                'error',
                'Error de Autenticación',
                errorMessage
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Logo Micheludas" className="login-logo" />
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Ingresa tu usuario"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Ingresa tu contraseña"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
}

export default Login;
