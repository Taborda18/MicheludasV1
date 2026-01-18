/**
 * Middleware para verificar que el usuario autenticado tiene uno de los roles permitidos
 * @param {Array<number>} allowedRoles - Array de role_id permitidos [1, 2, 3]
 */
const roleGate = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const userRole = Number(req.user.role_id);

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'No tienes permisos para acceder a este recurso',
                requiredRoles: allowedRoles,
                yourRole: userRole
            });
        }

        next();
    };
};

module.exports = roleGate;
