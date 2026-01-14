import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import './CreateSessionModal.css';

const CreateSessionModal = ({ onClose, onSuccess, showAlert }) => {
    const [tables, setTables] = useState([]); // Mesas disponibles de la BD
    const [activeTables, setActiveTables] = useState([]); // Mesas activas actualmente
    const [searchText, setSearchText] = useState('');
    const [filteredTables, setFilteredTables] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isNewTable, setIsNewTable] = useState(false);
    
    // Campos para nueva mesa
    const [newTableData, setNewTableData] = useState({
        tag: '',
        status: 'disponible'
    });
    
    const inputRef = useRef(null);

    useEffect(() => {
        fetchTables();
        fetchActiveTables();
    }, []);

    useEffect(() => {
        if (searchText.trim()) {
            // Filtrar solo mesas CERRADAS que coincidan con la búsqueda
            const uniqueTables = [];
            const seenIdentifiers = new Set();
            
            tables.forEach(table => {
                const identifier = table.table_identifier.toLowerCase();
                // Solo mostrar mesas cerradas y que coincidan con la búsqueda
                if (!seenIdentifiers.has(identifier) && 
                    identifier.includes(searchText.toLowerCase()) &&
                    table.status === 'Closed') {
                    seenIdentifiers.add(identifier);
                    uniqueTables.push(table);
                }
            });
            
            setFilteredTables(uniqueTables);
            
            // Verificar si es una mesa nueva (no existe en ningún estado)
            const exactMatch = tables.find(t => 
                t.table_identifier.toLowerCase() === searchText.toLowerCase()
            );
            setIsNewTable(!exactMatch && searchText.trim().length > 0);
        } else {
            setFilteredTables([]);
            setIsNewTable(false);
        }
    }, [searchText, tables, activeTables]);

    const fetchTables = async () => {
        try {
            // Obtener TODAS las mesas para el autocomplete
            const response = await api.get('/sessions');
            setTables(response.data);
        } catch (error) {
            console.error('Error al cargar mesas:', error);
        }
    };

    const fetchActiveTables = async () => {
        try {
            const response = await api.get('/sessions/open');
            setActiveTables(response.data);
        } catch (error) {
            console.error('Error al cargar mesas abiertas:', error);
        }
    };

    const handleSelectTable = (table) => {
        setSelectedTable(table);
        setSearchText(table.table_identifier);
        setShowSuggestions(false);
        setIsNewTable(false);
        // Cargar la etiqueta existente
        setNewTableData({ ...newTableData, tag: table.tag || '' });
    };

    const handleCreate = async () => {
        if (!searchText.trim()) {
            showAlert('error', 'Error', 'Ingresa un identificador para la mesa');
            return;
        }

        try {
            setSaving(true);
            
            if (selectedTable) {
                // Mesa existente - actualizar estado y etiqueta
                await api.put(`/sessions/${selectedTable.id}`, { 
                    table_identifier: selectedTable.table_identifier,
                    tag: newTableData.tag || null,
                    status: 'Open' 
                });
            } else if (isNewTable) {
                // Mesa nueva - crear desde cero
                await api.post('/sessions', {
                    table_identifier: searchText,
                    tag: newTableData.tag || null,
                    status: 'Open'
                });
            } else {
                // Buscar mesa existente cerrada y abrirla con etiqueta
                const tableToUse = tables.find(t => 
                    t.table_identifier.toLowerCase() === searchText.toLowerCase() &&
                    t.status === 'Closed'
                );
                if (tableToUse) {
                    await api.put(`/sessions/${tableToUse.id}`, { 
                        table_identifier: tableToUse.table_identifier,
                        tag: newTableData.tag || null,
                        status: 'Open' 
                    });
                }
            }
            
            showAlert('success', 'Éxito', 'Mesa abierta correctamente');
            onSuccess();
        } catch (error) {
            console.error('Error al crear sesión:', error);
            showAlert('error', 'Error', 'No se pudo abrir la mesa');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content create-session-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-x" onClick={onClose}>✕</button>
                <h2 className="modal-title">Abrir Mesa</h2>
                
                <div className="form-group autocomplete-container">
                    <label>Mesa / Identificador</label>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Escribe para buscar o crear... Ej: Mesa 1, Bar 2"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setSelectedTable(null);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    
                    {/* Lista de sugerencias */}
                    {showSuggestions && filteredTables.length > 0 && (
                        <ul className="suggestions-list">
                            {filteredTables.map((table, index) => (
                                <li 
                                    key={index}
                                    onClick={() => handleSelectTable(table)}
                                    className="suggestion-item"
                                >
                                    <span className="suggestion-icon">🪑</span>
                                    <div className="suggestion-info">
                                        <span className="suggestion-text">{table.table_identifier}</span>
                                        {table.tag && (
                                            <span className="suggestion-tag">{table.tag}</span>
                                        )}
                                    </div>
                                    <span className="suggestion-badge available">
                                        Disponible
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Campos adicionales para mesa nueva */}
                {isNewTable && searchText.trim() && (
                    <div className="new-table-indicator">
                        <span className="new-icon">✨</span>
                        <span>Se creará una nueva mesa: <strong>{searchText}</strong></span>
                    </div>
                )}

                {/* Mesa seleccionada */}
                {selectedTable && (
                    <div className="selected-table-info">
                        <span className="check-icon">✓</span>
                        <div className="selected-details">
                            <span>Mesa seleccionada: <strong>{selectedTable.table_identifier}</strong></span>
                        </div>
                    </div>
                )}

                {/* Campo de etiqueta - siempre visible cuando hay mesa nueva o seleccionada */}
                {(isNewTable || selectedTable) && (
                    <div className="form-group">
                        <label>Etiqueta / Tag <span className="optional">(opcional)</span></label>
                        <input
                            type="text"
                            placeholder="Ej: Junto a la ventana, VIP, etc."
                            value={newTableData.tag}
                            onChange={(e) => setNewTableData({ ...newTableData, tag: e.target.value })}
                        />
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirm" 
                        onClick={handleCreate} 
                        disabled={saving || !searchText.trim()}
                    >
                        {saving ? 'Abriendo...' : isNewTable ? 'Crear y Abrir' : 'Abrir Mesa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSessionModal;
