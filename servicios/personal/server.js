require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servicio funcionando 🚀');
});

const personalRoutes = require('./routes/personal.routes');
app.use('/api/personal', personalRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🟢 Servicio corriendo en puerto ${PORT}`);
});