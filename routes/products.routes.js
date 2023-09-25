const router = require("express").Router();
const Product = require('../models/Product.model');
const fileUploader = require('../config/cloudinary.config');
const multer = require('multer');
const Storage = require('../models/Storage.model');

// Importa el middleware isLoggedIn que contiene la función isAdmin
const { isAdmin } = require('../middleware/isLoggedIn');

//Lista para mostrar lista de productos 
router.get('/' , async (req, res) => { 
  Product.find().then(data=>{
    res.send(data)
  }) 
});



 
// Ruta para crear un nuevo producto (accesible solo para administradores)
router.post('/create', isAdmin, fileUploader.single('product-image'), (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  
    // Utiliza el método create para crear y guardar un nuevo producto en la base de datos
    Product.create({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen: req?.file?.path,
    })
      .then(newlyCreatedProductFromDB => {

        //crear storage
        Storage.create({
          product: newlyCreatedProductFromDB,
          amount: 10 //cantidad <input type="number" name="cantidad" placeholder="Cantidad de unidades disponibles">
        }).then(str=>console.log(str))

        //enviar respuesta
        res.json(newlyCreatedProductFromDB);
      })
      .catch(error => console.log(`Error while creating a new product: ${error}`));
  });
  

// Ruta para obtener detalles de un producto específico (accesible solo para administradores)
router.get('/:id' , (req, res) => {
  let id = req.params.id
  Product.findById(id).then(data=>{
    res.send(data)
  }) 
});

// Ruta para actualizar un producto existente (accesible solo para administradores)

//put ->  http://localhost:5005/api/products/650b3a7a44f240378c459dae
router.put('/:id' ,fileUploader.single('product-image') /*,isAdmin*/, (req, res) => {
  let id = req.params.id
  let body = req.body
  body.imagen =  req?.file?.path,
  Product.findByIdAndUpdate(id,body).then(data=>{
    res.send(data)
  }) 
});

// Ruta para eliminar un producto (accesible solo para administradores)
router.delete('/:id',/* isAdmin,*/ (req, res) => {
  let id = req.params.id 

  Product.findByIdAndDelete(id ).then(data=>{
    res.send(data)
  })  
});



module.exports = router;
