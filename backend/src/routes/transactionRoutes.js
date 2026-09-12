const express = require('express');
const router = express.Router();
const { createBarangMasuk, createBarangKeluar, getTransactions, getTransactionDetail } = require('../controllers/transactionController');
const { createBarangMasuk, createBarangKeluar, getTransactions, getTransactionDetail, deleteTransaction } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

router.post('/in', authenticateToken, createBarangMasuk);
router.post('/out', authenticateToken, createBarangKeluar);
router.get('/', authenticateToken, getTransactions);
router.get('/:id', authenticateToken, getTransactionDetail);
router.delete('/:id', authenticateToken, deleteTransaction);

module.exports = router;
