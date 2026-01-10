const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// REST: /api/roles
router.get('/', roleController.getAllRoles);        // GET /api/roles
router.get('/:id', roleController.getRoleById);     // GET /api/roles/:id
router.post('/', roleController.createRole);        // POST /api/roles
router.put('/:id', roleController.updateRole);      // PUT /api/roles/:id
router.delete('/:id', roleController.deleteRole);   // DELETE /api/roles/:id

module.exports = router;
