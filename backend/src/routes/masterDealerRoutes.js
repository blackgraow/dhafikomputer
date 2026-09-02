const express = require('express');
const router = express.Router();
const { getMasterDealers, getMasterDealerById, createMasterDealer, updateMasterDealer, deleteMasterDealer } = require('../controllers/masterDealerController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getMasterDealers);
router.get('/:id', authenticateToken, getMasterDealerById);
router.post('/', authenticateToken, createMasterDealer);
router.put('/:id', authenticateToken, updateMasterDealer);
router.delete('/:id', authenticateToken, deleteMasterDealer);

module.exports = router;
