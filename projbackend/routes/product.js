const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// All of params
router.param("userId", getUserById);
router.param("productId", getProductById);

// ALl routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

router.put(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);
module.exports = router;
