const express = require('express');
const router = express.Router();
const { getBrands, getBrandDetail, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', getBrands);
router.get('/:id', getBrandDetail);
router.post('/', authenticateToken, createBrand);
router.put('/:id', authenticateToken, updateBrand);
router.delete('/:id', authenticateToken, deleteBrand);

module.exports = router;
