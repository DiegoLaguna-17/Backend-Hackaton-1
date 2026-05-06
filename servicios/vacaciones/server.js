require('dotenv').config();
const express = require('express');
const cors = require('cors');
const vacationRoutes = require('./routes/vacationRoutes');

const PORT = process.env.PORT || 3002;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servicio funcionando correctamente');
});

app.use('/api/vacaciones', vacationRoutes);

app.listen(PORT, () => {
  console.log(`Servicio VACACIONES corriendo en puerto ${PORT}`);
});
