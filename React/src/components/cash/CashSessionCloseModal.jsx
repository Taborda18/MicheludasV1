import { useState, useEffect } from 'react';
import { cashSessionService } from '../../services/cashSessionService';
import './CashSessionCloseModal.css';

const CashSessionCloseModal = ({ isOpen, onClose, user, currentSessionId }) => {
    const [closingBalance, setClosingBalance] = useState('');
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && currentSessionId) {
            loadSessionData();
        }
    }, [isOpen, currentSessionId]);

    const loadSessionData = async () => {
        try {
            setLoading(true);
            const data = await cashSessionService.getSessionSummary(currentSessionId);
            setSessionData(data);
        } catch (err) {
            console.error('Error loading session data:', err);
            setError('No se pudo cargar la información de la sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const amount = parseFloat(closingBalance);
        if (Number.isNaN(amount) || amount < 0) {
            setError('Ingresa un monto válido (>= 0).');
            return;
        }

        try {
            setSubmitting(true);
            await cashSessionService.closeSession(currentSessionId, {
                closing_balance: amount,
                total_expected: sessionData?.total_expected
            });
            onClose(true); // true = cerrado exitosamente
        } catch (err) {
            console.error('Error closing session:', err);
            setError('No se pudo cerrar la sesión. Intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const formatPrice = (value) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value || 0);

    const difference = closingBalance ? parseFloat(closingBalance) - (sessionData?.total_expected || 0) : 0;
    const hasDifference = Math.abs(difference) > 0.01;

    return (
        <div className="cash-modal-overlay">
            <div className="cash-modal cash-close-modal">
                <button className="modal-close-x" onClick={() => onClose(false)}>✕</button>
                
                <h2>Cierre de caja</h2>
                <p className="cash-modal-subtitle">
                    Registra el efectivo final y verifica el balance del día.
                </p>

                {loading ? (
                    <div className="loading-session">Cargando información...</div>
                ) : (
                    <>
                        <div className="session-summary">
                            <div className="summary-row">
                                <span>Base inicial:</span>
                                <strong>{formatPrice(sessionData?.opening_balance)}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Ventas en efectivo:</span>
                                <strong>{formatPrice(sessionData?.cash_sales)}</strong>
                            </div>
                            <div className="summary-row highlight">
                                <span>Total esperado:</span>
                                <strong>{formatPrice(sessionData?.total_expected)}</strong>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="cash-modal-form">
                            <label className="cash-modal-label">
                                Efectivo contado en caja
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={closingBalance}
                                    onChange={(e) => setClosingBalance(e.target.value)}
                                    placeholder="0.00"
                                    disabled={submitting}
                                />
                            </label>

                            {closingBalance && (
                                <div className={`difference-box ${hasDifference ? (difference > 0 ? 'surplus' : 'shortage') : 'balanced'}`}>
                                    <div className="difference-label">
                                        {hasDifference ? (difference > 0 ? '⚠️ Sobrante' : '⚠️ Faltante') : '✅ Balance exacto'}
                                    </div>
                                    <div className="difference-amount">
                                        {formatPrice(Math.abs(difference))}
                                    </div>
                                </div>
                            )}

                            {error && <div className="cash-modal-error">{error}</div>}

                            <button type="submit" className="cash-modal-btn" disabled={submitting || !closingBalance}>
                                {submitting ? 'Cerrando...' : 'Cerrar caja'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CashSessionCloseModal;
