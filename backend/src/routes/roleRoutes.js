const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Rutas personalizadas para roles
router.get('/list', roleController.getAllRoles);           // GET /api/roles/list
router.get('/find/:id', roleController.getRoleById);       // GET /api/roles/find/1
router.post('/create', roleController.createRole);         // POST /api/roles/create
router.put('/update/:id', roleController.updateRole);      // PUT /api/roles/update/1
router.delete('/remove/:id', roleController.deleteRole);   // DELETE /api/roles/remove/1

module.exports = router;
