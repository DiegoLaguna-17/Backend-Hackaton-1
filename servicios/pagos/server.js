require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares básicos
app.use(cors());
app.use(express.json());

// Importar rutas
const pagosRoutes = require('./routes/pagosRoutes');

// Usar rutas
app.use('/api/pagos', pagosRoutes);

// endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servicio de pagos funcionando');
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'pagos-microservice' });
});

const PORT = 3004;

app.listen(PORT, () => {
    console.log(`🟢 Servicio corriendo en puerto ${PORT}`);
    console.log(`Endpoint de registro: POST http://localhost:${PORT}/api/pagos/registrar`);
});