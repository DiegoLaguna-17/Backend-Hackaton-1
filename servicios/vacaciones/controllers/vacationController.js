const vacationService = require('../services/vacationService');

const postVacation = async (req, res) => {
  try {
    const { id_personal, gestion } = req.body;
    const result = await vacationService.assignVacation(id_personal, gestion);
    res.status(201).json({ message: 'Vacaciones asignadas con éxito', data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { postVacation };
