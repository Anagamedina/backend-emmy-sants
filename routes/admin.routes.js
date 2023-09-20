// routes/admin.routes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const fileUploader = require('../config/cloudinary.config');
const multer = require('multer');



router.post('/product/create', fileUploader.single('product-image'), (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;
   
    Product.create({ nombre, descripcion, precio, categoria, imageUrl: req.file.path })
      .then(newlyCreatedProductFromDB => {
        res.json(newlyCreatedProductFromDB);
      })
      .catch(error => console.log(`Error while creating a new movie: ${error}`));
  });









module.exports = router;

