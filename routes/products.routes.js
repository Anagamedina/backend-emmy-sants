// routes/product.routes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const fileUploader = require('../config/cloudinary.config');
const multer = require('multer');



router.post('/create', fileUploader.single('product-image'), (req, res) => {
    const { nombre, descripcion, precio, categoria, imagen } = req.body;
   
    Product.create({ nombre, descripcion, precio, categoria, imagen: req?.file?.path })
      .then(newlyCreatedProductFromDB => {
        res.json(newlyCreatedProductFromDB);
      })
      .catch(error => console.log(`Error while creating a new movie: ${error}`));
  });

  router.get('/', (req, res) => {
    Product.find()
      .then(products => {
        res.json(products);
      })
      .catch(error => {
        console.log(`Error while fetching products: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  

// Ruta para obtener detalles de un producto específico (accesible solo para administradores)
router.get('/:id' , (req, res) => {
  let id = req.params.id
  Product.findById(id).then(data=>{
    res.send(data)
  }) 
});

// Ruta para actualizar un producto existente (accesible solo para administradores)

//put ->  http://localhost:5005/api/products/:id
router.put('/:id' /*,isAdmin*/, (req, res) => {
  let id = req.params.id
  let body = req.body

  Product.findByIdAndUpdate(id,body, { new: true })
  .then(data=>{
    res.send(data)
  }) 
});

router.put('/:id/update-image', fileUploader.single('new-product-image'), (req, res) => {
  const productId = req.params.id;
  const newImage = req.file;

  if (!newImage) {
    return res.status(400).json({ error: 'Debes proporcionar una nueva imagen para actualizar.' });
  }

  // Actualiza la imagen del producto en la base de datos
  Product.findByIdAndUpdate(
    productId,
    { imagen: newImage.path },
    { new: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }
      res.json(updatedProduct);
    })
    .catch((error) => {
      console.error(`Error al actualizar la imagen del producto: ${error}`);
      res.status(500).json({ error: 'Error interno del servidor.' });
    });
});


// Ruta para eliminar un producto (accesible solo para administradores)
router.delete('/:id',/* isAdmin,*/ (req, res) => {
  let id = req.params.id 

  Product.findByIdAndDelete(id ).then(data=>{
    res.send(data)
  })  
});



module.exports = router;
