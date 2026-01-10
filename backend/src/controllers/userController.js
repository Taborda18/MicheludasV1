const User = require('../models/User');
const hashHelper = require('../utils/hashHelper');
const jwtHelper = require('../utils/jwtHelper');

const userController = {
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async createUser(req, res) {
        try {
            const { username, password, role_id } = req.body;
            
            // Validar datos requeridos
            if (!username || !password) {
                return res.status(400).json({ message: 'Username y password son requeridos' });
            }
            
            // Encriptar la contraseña
            const password_hash = await hashHelper.hashPassword(password);
            
            const user = await User.create({ username, password_hash, role_id });
            
            // No devolver la contraseña
            delete user.password_hash;
            
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const { username, password, role_id } = req.body;
            let password_hash;
            
            // Solo encriptar si se envía una nueva contraseña
            if (password) {
                password_hash = await hashHelper.hashPassword(password);
            }
            
            const user = await User.update(req.params.id, { 
                username, 
                password_hash, 
                role_id 
            });
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            delete user.password_hash;
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            await User.delete(req.params.id);
            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            
            // Validar datos requeridos
            if (!username || !password) {
                return res.status(400).json({ message: 'Username y password son requeridos' });
            }
            
            const user = await User.findByUsername(username);
            
            if (!user) {
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }
            
            // Comparar contraseñas
            const isValidPassword = await hashHelper.comparePassword(password, user.password_hash);
            
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }
            
            // Generar token JWT
            const token = jwtHelper.generateToken({
                id: user.id,
                username: user.username,
                role_id: user.role_id
            });
            
            // No devolver la contraseña
            delete user.password_hash;
            
            res.json({ 
                message: 'Login exitoso',
                token,
                user 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;
