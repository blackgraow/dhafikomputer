const express = require('express');
const router = express.Router();
const { createBarangMasuk, createBarangKeluar, getTransactions, getTransactionDetail } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

router.post('/in', authenticateToken, createBarangMasuk);
router.post('/out', authenticateToken, createBarangKeluar);
router.get('/', authenticateToken, getTransactions);
router.get('/:id', authenticateToken, getTransactionDetail);

module.exports = router;
