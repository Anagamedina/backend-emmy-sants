# Emmy Sants E-Commerce Website
This project has been developed by Ana Gabriela Medina and Alejandro van den Bussche, two passionate web developers with a deep commitment to excellence. Our project represents a fully functional e-commerce platform for the "Emmy Sants" florist, located in the beautiful city of Barcelona.

## About
Our project is centered around the development of an e-commerce platform for a florist specializing in the sale of plants and bouquets. This platform is not only designed to provide buyers with a convenient shopping experience but also offers a comprehensive control panel for the florist owner.
Owner's Control Panel

We've implemented a robust and user-friendly control panel for the florist owner. From this panel, she can manage all aspects of her online business:

    ##Product Management:
    Easily add new products, update details like name, description, price, and stock, and remove products that are no longer available.

    ##Order Management:
    Review all received orders, mark them as delivered, and maintain a record of past orders.

    ##Stock Control: 
    Keep product stock up-to-date, ensuring accurate product availability at all times.

    ##Image Management: 
    Simplify product image uploads using the Cloudinary library, ensuring visually appealing product presentation on the website.

    ##Secure Authentication:
    We provide a secure authentication system, allowing the owner to log into her control panel privately and securely.
![Project Image]")

## Deployment
You can check the app fully deployed [here]).

## Work structure
We utilize [Trello]()for task management and rely on Google Drive for communication. We also hold three weekly review sessions to maintain project alignment and completeness.
## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd Floristeria
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const uconst usuarioSchema = new Schema({
  nombre: String,
  correoElectronico: String,
  contrasena: String,
  IsAdmin: true
 });

});
```
#### Producto.model.js
```js
const productoSchema = new Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  Stock: Number,
  categoria: String, 
  imagen: String, // URL de la imagen del producto

});

```
#### Pedidos.model.js
```js
const pedidoSchema = new Schema({
  productos: [{
    producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number
  }],
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
 estado: String,

  });

````


## User roles
| Role  | Capabilities                                                                                                                               | Property       |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| User  | Can login/logout.                                                                                                                          | isAdmin: false |
| Admin | Can login/logout.                                                                                                                          | isAdmin: true  |

## API Reference
| Method | Endpoint                    | Require                                                                   | Response (200)                                                        | Action                                                                    |
| :----: | --------------------------- | ------------------------------------------------------------------------- |---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| POST   | /signup                     | const { username, email, password } = req.body                            | json({user: user})                                                    | Registers the user in the database and returns the logged in user.        |
| POST   | /login                      | const { email, password } = req.body                                      | json({authToken: authToken})                                          | Logs in a user already registered.                                        |
|Routes and Controllers for the Owner (Admin Interface):                                                                                                                                                                                                               |
| GET    | /admin/products             | -                                                                         | json([allProjects])                                                   | Retrieve a list of products                                               |
| POST   |/admin/products              | const { name, description, price, stock, category, image } = req.body     | json({project})                                                       | Create a new product.                                                     |
| GET    |/admin/products/:id          | -                                                                         | json({project})                                                       | Get specific product details.                                             |
| PUT    |/admin/products/:id          | const { name, description, price, stock, category, image } = req.body     | json({response})                                                      | Update an existing product                                                |
| DELETE |/admin/products/:id          | -                                                                         | json({response})                                                      | Delete a product.                                                         |
| GET    |/admin/orders                | -                                                                         | json({updatedProject})                                                | Get a list of orders.                                                     |
| GET    |/admin/orders/:id            | -                                                                         | json({updatedProject})                                                | Get specific order details.                                               |
| PUT    |/admin/orders/:id            | const { status } = req.body                                               | json({message: "Project with *projectId* was removed successfully."}) | Update the status of an order.                                            |
|Routes and Controllers for the Buyer (User Interface):                                                                                                                                                                                                                |
| GET    | /products                   | -                                                                         | json({thisUser})                                                      | Retrieve a list of available products for purchase                        |
| GET    | /orders                     | -                                                                         | json({message: "."})                                                  | Get the user's order history.                                             |
| POST   | /orders                     | const { products, usuario, estado } = req.body                            | json({message: "."})                                                  | Place a new order.                                                        |
| PUT    | /orders                     | const { products, usuario, estado } = req.body                            | json([])                                                              | Modify and update an existing order.                                      |
| DELETE | /orders                     | -                                                                         | json({order})                                                         | Cancel an existing order.                                                 |


---
