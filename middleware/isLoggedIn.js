function isAdmin(req, res, next) {
    if (req.user && req.isAdmin === true){
        next();
    } else { 
        res.status(403).json ({error:'Acceso no autorizado'});

    }
    
}
Module.exports= {isAdmin};