const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productControllers');  // Corrected import path
const { authenticateUser } = require('../middlewares/authentication');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now(), path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.post('/product/createProduct', authenticateUser, productController.createProduct);
router.get('/product/view', productController.getAllProducts);
router.get('/product/admin', productController.getAllProductsForAdmin);
router.get('/product/view/:id', productController.getSinleProduct);
router.delete('/product', authenticateUser, productController.removeProducts);
router.delete('/product/:id', authenticateUser, productController.removeSingleProduct);
router.put("/product/update/:id", productController.updateProduct);
router.post('/product/review/:id',productController.createProductReview)
// ****************Farmer's routes ****************** //
router.get('/product/by-farmer', authenticateUser, productController.getAllProductsOfFarmer);

module.exports = router;
