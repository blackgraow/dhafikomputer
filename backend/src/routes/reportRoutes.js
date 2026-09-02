const express = require('express');
const router = express.Router();
const { getInventoryReport, getBarangMasukReport, getBarangKeluarReport } = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

router.get('/inventory', authenticateToken, getInventoryReport);
router.get('/transactions-in', authenticateToken, getBarangMasukReport);
router.get('/transactions-out', authenticateToken, getBarangKeluarReport);

module.exports = router;
