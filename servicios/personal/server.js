require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares básicos
app.use(cors());
app.use(express.json());

// endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servicio funcionando 🚀');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🟢 Servicio corriendo en puerto ${PORT}`);
});