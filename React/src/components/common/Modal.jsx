import './Modal.css';

function Modal({ isOpen, onClose, type = 'info', title, message }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className={`modal-icon ${type}`}>
                    {getIcon()}
                </div>
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <button className="modal-button" onClick={onClose}>
                    Aceptar
                </button>
            </div>
        </div>
    );
}

export default Modal;
