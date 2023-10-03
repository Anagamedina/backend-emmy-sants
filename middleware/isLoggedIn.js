// const { getTokenFromHeaders } = require('./jwt.middleware'); 
 

// function isAdmin(req, res, next) {
     
//     // console.log(req.user);
//     console.log(req.payload);
//     // console.log(req.isAdmin);
//     // console.log(req.header("auth-token"));
//     if (req.user && req.isAdmin === true){
//         next();
//     } else { 
//         res.status(403).json ({error:'Acceso no autorizado'}); 
//     }
    
// }
// module.exports= {isAdmin};


const isAdmin = (req, res, next) => {
    if (req.payload.isAdmin) {
      next();
    } else {
        res.status(403).json ({error:'Acceso no autorizado'}); 
    }
  };
  
  module.exports = {
    isAdmin,
  };