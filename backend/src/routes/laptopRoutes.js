const express = require('express');
const router = express.Router();
const { getLaptops, getLaptopDetail, createLaptop, updateLaptop, deleteLaptop } = require('../controllers/laptopController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getLaptops);
router.get('/:id', authenticateToken, getLaptopDetail);
router.post('/', authenticateToken, createLaptop);
router.put('/:id', authenticateToken, updateLaptop);
router.delete('/:id', authenticateToken, deleteLaptop);

module.exports = router;
