const express = require('express');
const router = express.Router();
const { getPublicProducts, getPublicProductDetail, getPublicMetadata } = require('../controllers/publicController');

router.get('/products', getPublicProducts);
router.get('/products/:id', getPublicProductDetail);
router.get('/metadata', getPublicMetadata);

module.exports = router;
