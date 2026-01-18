import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { cashSessionService } from '../../services/cashSessionService';
import { AuthContext } from '../../context/AuthContext';
import './CashSessionOpenModal.css';

const CashSessionOpenModal = ({ isOpen, user, onOpened }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [openingBalance, setOpeningBalance] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const amount = parseFloat(openingBalance);
        if (Number.isNaN(amount) || amount < 0) {
            setError('Ingresa un monto válido (>= 0).');
            return;
        }

        try {
            setSubmitting(true);
            const session = await cashSessionService.openSession({
                user_id: user?.id,
                opening_balance: amount
            });
            onOpened?.(session);
        } catch (err) {
            console.error('Error opening cash session', err);
            setError('No se pudo abrir la sesión de caja. Intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cash-modal-overlay">
            <div className="cash-modal">
                <div className="cash-modal-header">
                    <h2>Apertura de turno</h2>
                    <button 
                        type="button" 
                        onClick={handleLogout} 
                        className="cash-modal-logout-btn"
                        title="Cerrar Sesión"
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
                <p className="cash-modal-subtitle">
                    Horario operativo: 3:00 PM - 3:00 AM. Registra el efectivo inicial para la caja.
                </p>

                <form onSubmit={handleSubmit} className="cash-modal-form">
                    <label className="cash-modal-label">
                        Dinero en caja al inicio
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={openingBalance}
                            onChange={(e) => setOpeningBalance(e.target.value)}
                            placeholder="0.00"
                            disabled={submitting}
                        />
                    </label>

                    {error && <div className="cash-modal-error">{error}</div>}

                    <button type="submit" className="cash-modal-btn" disabled={submitting}>
                        {submitting ? 'Guardando...' : 'Abrir turno'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CashSessionOpenModal;
