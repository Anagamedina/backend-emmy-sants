const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

//const { isAuthenticated, isAdmin } = require("../middleware/jwt.middleware.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const saltRounds = 10;

// // Ruta para el panel de control de administradores
// router.get("/admin-panel", isAuthenticated, isAdmin, (req, res, next) => {
//   // Aquí deberías renderizar la página del panel de control para administradores
//   // o enviar algún tipo de respuesta adecuada.
// });

// // Ruta para la tienda en línea de compradores
// router.get("/online-store", isAuthenticated, (req, res, next) => {
//   // Aquí deberías renderizar la página de la tienda en línea para compradores
//   // o enviar algún tipo de respuesta adecuada.
// });


// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { email, password, name } = req.body;

  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }


  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "The email you entered is already registered, please try with another one." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      return User.create({ email, password: hashedPassword, name });  //isAdmin: false
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser; //isAdmin?

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };  //isAdmin?
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); 
});



// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name , isAdmin} = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, isAdmin };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); 
});



// router.post("/login", (req, res, next) => {
//   // ... (código de autenticación)

//   if (passwordCorrect) {
//     // ...

//     if (isAdmin) {
//       // Redirigir al panel de control de administradores
//       res.redirect("/admin-panel");
//     } else {
//       // Redirigir a la tienda en línea para compradores
//       res.redirect("/online-store");
//     }
//   } else {
//     res.status(401).json({ message: "Unable to authenticate the user" });
//   }
// });

















// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
