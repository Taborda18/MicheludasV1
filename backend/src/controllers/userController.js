const User = require('../models/User');

const userController = {
    // Obtener todos los usuarios
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener usuario por ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo usuario
    createUser: async (req, res) => {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar usuario
    updateUser: async (req, res) => {
        try {
            const updatedUser = await User.update(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar usuario
    deleteUser: async (req, res) => {
        try {
            await User.delete(req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;
