import { useState, useEffect } from 'react';
import api from '../../services/api';
import './RecipeModal.css';

const RecipeModal = ({ item, onClose, showAlert }) => {
    const [ingredients, setIngredients] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Nuevo ingrediente
    const [newIngredient, setNewIngredient] = useState({
        inventory_id: '',
        quantity_required: '',
        unit_measure: 'ml'
    });

    const unitOptions = ['ml', 'g', 'oz', 'unidad', 'cucharada', 'pizca'];

    useEffect(() => {
        fetchIngredients();
        fetchAvailableIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            // Usamos el inventory_id del item como product_id para las recetas
            const response = await api.get(`/product-ingredients/product/${item.id}`);
            setIngredients(response.data);
        } catch (error) {
            console.error('Error al cargar ingredientes:', error);
            setIngredients([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableIngredients = async () => {
        try {
            // Obtener todos los items del inventario que sean INSUMOS o BEBIDAS base
            const response = await api.get('/inventory');
            const insumos = response.data.filter(inv => {
                const cat = inv.categories?.toUpperCase();
                // Solo mostrar categorías que son ingredientes, no productos finales
                return cat === 'INSUMOS' || 
                       cat === 'BEBIDAS' ||
                       cat === 'CERVEZAS' ||
                       cat === 'SALSAS' ||
                       cat === 'FRUTAS' ||
                       cat === 'LICORES';
            });
            setAvailableIngredients(insumos);
        } catch (error) {
            console.error('Error al cargar ingredientes disponibles:', error);
        }
    };

    const handleAddIngredient = async () => {
        if (!newIngredient.inventory_id || !newIngredient.quantity_required) {
            showAlert('error', 'Error', 'Selecciona un ingrediente y cantidad');
            return;
        }

        try {
            setSaving(true);
            await api.post('/product-ingredients', {
                product_id: item.id, // El inventory_id del item de michelada
                inventory_id: parseInt(newIngredient.inventory_id),
                quantity_required: parseFloat(newIngredient.quantity_required),
                unit_measure: newIngredient.unit_measure
            });
            
            showAlert('success', 'Éxito', 'Ingrediente agregado a la receta');
            setNewIngredient({ inventory_id: '', quantity_required: '', unit_measure: 'ml' });
            fetchIngredients();
        } catch (error) {
            console.error('Error al agregar ingrediente:', error);
            showAlert('error', 'Error', 'No se pudo agregar el ingrediente');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveIngredient = async (ingredientId) => {
        try {
            await api.delete(`/product-ingredients/${ingredientId}`);
            showAlert('success', 'Éxito', 'Ingrediente eliminado de la receta');
            fetchIngredients();
        } catch (error) {
            console.error('Error al eliminar ingrediente:', error);
            showAlert('error', 'Error', 'No se pudo eliminar el ingrediente');
        }
    };

    const getIngredientStock = (inventoryId) => {
        const ingredient = availableIngredients.find(i => i.id === inventoryId);
        return ingredient ? ingredient.stock : 0;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
                <div className="recipe-modal-header">
                    <h3>🍹 Receta: {item.name}</h3>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="recipe-modal-body">
                    {/* Lista de ingredientes actuales */}
                    <div className="current-ingredients">
                        <h4>Ingredientes de la receta</h4>
                        {loading ? (
                            <p>Cargando ingredientes...</p>
                        ) : ingredients.length === 0 ? (
                            <p className="no-ingredients">No hay ingredientes. Agrega los insumos necesarios para preparar esta bebida.</p>
                        ) : (
                            <table className="ingredients-table">
                                <thead>
                                    <tr>
                                        <th>Ingrediente</th>
                                        <th>Cantidad</th>
                                        <th>Stock Actual</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients.map((ing) => {
                                        const stock = getIngredientStock(ing.inventory_id);
                                        const isLowStock = stock < ing.quantity_required;
                                        return (
                                            <tr key={ing.id}>
                                                <td>{ing.inventory_name}</td>
                                                <td>{ing.quantity_required} {ing.unit_measure}</td>
                                                <td className={isLowStock ? 'low-stock' : ''}>
                                                    {stock} {isLowStock && '⚠️'}
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn-remove"
                                                        onClick={() => handleRemoveIngredient(ing.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Formulario para agregar ingrediente */}
                    <div className="add-ingredient-form">
                        <h4>Agregar ingrediente</h4>
                        <div className="form-row">
                            <select
                                value={newIngredient.inventory_id}
                                onChange={(e) => setNewIngredient({ ...newIngredient, inventory_id: e.target.value })}
                            >
                                <option value="">Selecciona un ingrediente</option>
                                {availableIngredients
                                    .filter(ing => !ingredients.find(i => i.inventory_id === ing.id))
                                    .map((ing) => (
                                        <option key={ing.id} value={ing.id}>
                                            {ing.name} (Stock: {ing.stock})
                                        </option>
                                    ))
                                }
                            </select>

                            <input
                                type="number"
                                placeholder="Cantidad"
                                value={newIngredient.quantity_required}
                                onChange={(e) => setNewIngredient({ ...newIngredient, quantity_required: e.target.value })}
                                min="0.01"
                                step="0.01"
                            />

                            <select
                                value={newIngredient.unit_measure}
                                onChange={(e) => setNewIngredient({ ...newIngredient, unit_measure: e.target.value })}
                            >
                                {unitOptions.map((unit) => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>

                            <button 
                                className="btn-add-ingredient"
                                onClick={handleAddIngredient}
                                disabled={saving}
                            >
                                {saving ? 'Agregando...' : '+ Agregar'}
                            </button>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="recipe-info">
                        <p>💡 <strong>Tip:</strong> Los ingredientes que agregues aquí se descontarán automáticamente del inventario cuando se venda esta bebida.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
