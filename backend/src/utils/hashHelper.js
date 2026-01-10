const bcrypt = require('bcrypt');

const hashHelper = {
    // Encriptar contraseña
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    // Comparar contraseña
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
};

module.exports = hashHelper;