const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/clientes', authMiddleware, adminMiddleware, adminController.getAllClients);
router.get('/libros', authMiddleware, adminMiddleware, adminController.getAllBooks);
router.put('/libros/:id', authMiddleware, adminMiddleware, adminController.updateBook);
router.post('/libros', authMiddleware, adminMiddleware, adminController.addBook);

module.exports = router;
