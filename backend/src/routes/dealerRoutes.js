const express = require('express');
const router = express.Router();
const { getDealers, getDealerById, createDealer, updateDealer, deleteDealer } = require('../controllers/dealerController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getDealers);
router.get('/:id', authenticateToken, getDealerById);
router.post('/', authenticateToken, createDealer);
router.put('/:id', authenticateToken, updateDealer);
router.delete('/:id', authenticateToken, deleteDealer);

module.exports = router;
