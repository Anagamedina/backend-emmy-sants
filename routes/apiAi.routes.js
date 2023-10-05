const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();
const apiKey = process.env.APIKEY_AI_SECRET;

router.get('/info-planta', (req, res, next) => {
  const { prompt } = req.query; // Obtiene el prompt de la consulta

  console.log('apikey', apiKey);

  axios
    .post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",
      prompt: prompt, // Usa el prompt recibido en la solicitud
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
      res.status(500).json({ error: 'Error al generar la información.' });
    });
});

  
module.exports = router;