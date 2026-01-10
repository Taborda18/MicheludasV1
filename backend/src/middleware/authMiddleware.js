const jwtHelper = require('../utils/jwtHelper');

const authMiddleware = {
    verifyToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Token no proporcionado' });
            }
            
            const token = authHeader.split(' ')[1];
            const decoded = jwtHelper.verifyToken(token);
            
            if (!decoded) {
                return res.status(401).json({ message: 'Token inválido o expirado' });
            }
            
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Error de autenticación' });
        }
    },

    isAdmin(req, res, next) {
        if (req.user.role_id !== 1) {
            return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
        }
        next();
    }
};

module.exports = authMiddleware;