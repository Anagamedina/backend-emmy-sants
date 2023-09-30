const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');



dotenv.config();
const apiKey = process.env.APIKEY_AI_SECRET;

router.get('/info-planta', (req, res, next) => {
    const productName = req.query.productName; 
    const prompt = `caracteristicas de la planta ${productName}, clima donde habita, cuidados que debe tener.`;
    
    console.log('apikey', apiKey);
    
    axios
    .post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",
      prompt: prompt, 
      max_tokens: 4000,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })
    .then((response) => {
      const planta = response.data.choices[0].text.trim();
      console.log('Response from API:', response.data);
      res.json({ planta });
    })
    .catch(error => {
      console.error(error.response.data);
      res.status(500).json({ error: 'Error al obtener información de la planta.' });
    });
});
  
module.exports = router;
