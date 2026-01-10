const Role = require('../models/Role');

const roleController = {
    // Obtener todos los roles
    getAllRoles: async (req, res) => {
        try {
            const roles = await Role.findAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener rol por ID
    getRoleById: async (req, res) => {
        try {
            const role = await Role.findById(req.params.id);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo rol
    createRole: async (req, res) => {
        try {
            const newRole = await Role.create(req.body);
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar rol
    updateRole: async (req, res) => {
        try {
            const updatedRole = await Role.update(req.params.id, req.body);
            if (!updatedRole) {
                return res.status(404).json({ message: 'Role not found' });
            }
            res.json(updatedRole);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar rol
    deleteRole: async (req, res) => {
        try {
            await Role.delete(req.params.id);
            res.json({ message: 'Role deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = roleController;
