const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

// Crear server de express
const app = express();

// DB
dbConnection();

//CORS
app.use(cors());

// Directorio publico
app.use(express.static('public'));

// Leer y pasear body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

//Escuhar peticiones
app.listen(process.env.PORT, () => {
   console.log(`Server running on port: ${process.env.PORT}`);
});
