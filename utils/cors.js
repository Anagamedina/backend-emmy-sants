//CORS INVESTIGACION caso 1: metodos GET/HEAD/POST

//const ACCEPT_ORIGINS = `[
  //'http://localhost:3001', 'https://www.google.com/', 'https://www.facebook.com/'
  //]
// const origin = req.header ('origin')
// if (ACCEPT_ORIGINS.includes(origin) || !origin) {
 //res.header('Access-Control-Allow-Origin', origin)
 //}
  
// }

//CORS INVESTIGACION caso 2:
//metodos complejos: PUT/PACTH/DELETE
//CORS PRE-FLIGHT
//OPTIONS (peticion previa)
//app.options('/..., (req, res => {
  //const origin =req.header ('origin')
  // if (ACCEPT_ORIGINS.includes(origin) || !origin) {
 //res.header('Access-Control-Allow-Origin', origin)
 //res.header('Access-Control-Allow-Methods', GET, POST, PATCH, DELETE')
 //}
