const router = require("express").Router();
const Product = require('../models/Product.model');
const fileUploader = require('../config/cloudinary.config');
const Storage = require('../models/Storage.model');

// Importa el middleware isLoggedIn que contiene la función isAdmin
const { isAdmin } = require('../middleware/isLoggedIn');
const { isAuthenticated } = require("../middleware/jwt.middleware.js");


//Lista para mostrar lista de productos 
router.get('/' ,  (req, res) => { 
  Product.find().then(data=>{
    res.send(data)
  }) 
});



// Ruta para crear un nuevo producto (accesible solo para administradores)
router.post('/create', isAuthenticated, isAdmin, fileUploader.single('product-image'), (req, res) => {
    const { nombre, descripcion, precio, categoria, imagen ,cantidad} = req.body; 
  
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
          amount: cantidad ||  1  //cantidad <input type="number" name="cantidad" placeholder="Cantidad de unidades disponibles">
        }).then(str=>console.log(str))

        //enviar respuesta
        res.json(newlyCreatedProductFromDB);
      })
      .catch(error => console.log(`Error while creating a new product: ${error}`));
  });
  
  router.post("/:id/setStorage", (req, res)=>{
    const {id} = req.params
    const {stock} = req.body
    Storage.findOneAndUpdate({product:id}, {amount:stock}).then(data=>{
      console.log(data);
      res.send({message:"updated!"})
    })
  })

// Ruta para obtener detalles de un producto específico 
router.get('/:id' , (req, res) => {
  let id = req.params.id
  Product.findById(id).then(dataProduct=>{
    Storage.findOne({product:id} ).then((dataStorage)=>{
        
        let toSend = dataProduct.toJSON() 
        toSend.amount = dataStorage?.amount || "No hay"
        res.send( toSend ) 
    }).catch(err => console.log(err))

  }).catch(err => console.log(err)) 
});
 

// Ruta para actualizar un producto existente 

// Ruta para actualizar un producto existente
router.put('/:id', isAuthenticated, isAdmin, fileUploader.single('product-image'), async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, precio, categoria, imagen, cantidad } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        precio,
        categoria,
        imagen: req.file ? req.file.path : imagen, // Si se proporciona una nueva imagen, usa esa; de lo contrario, usa la imagen existente
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Actualiza la cantidad en el almacenamiento
    const storage = await Storage.findOne({ product: id });
    if (storage) {
      storage.amount = cantidad || 1; // Usar el valor proporcionado o 1 si no se proporciona cantidad
      await storage.save();
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(`Error al actualizar el producto: ${error}`);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});





// //put ->  http://localhost:5005/api/products/650b3a7a44f240378c459dae
// router.put('/:id' , isAuthenticated, isAdmin, fileUploader.single('product-image'), (req, res) => {
//   let id = req.params.id
//   let body = req.body
  
  
//   Product.findByIdAndUpdate(id,body, { new: true }).then(data=>{

    
//     // Storage.findOneAndUpdate({product:id})

//     res.send(data)
//   }) 
// });


router.put('/:id/update-image', isAuthenticated, isAdmin,fileUploader.single('new-product-image'), (req, res) => {
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
  router.delete('/:id', isAuthenticated, isAdmin, (req, res) => {
  let id = req.params.id 
  
  Product.findByIdAndDelete(id ).then(data=>{
    res.send(data)
  })  
  });
  
  
  
  module.exports = router;