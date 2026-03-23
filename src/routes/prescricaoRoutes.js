const express = require('express');
const router = express.Router();

const prescricaoController = require('../controllers/prescricaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['MEDICO']),
    prescricaoController.criarPrescricao
);

router.get(
    '/',
    authMiddleware,
    roleMiddleware(['MEDICO', 'SECRETARIO']),
    prescricaoController.listarPrescricoes
);

router.get(
    '/:id',
    authMiddleware,
    roleMiddleware(['MEDICO', 'SECRETARIO']),
    prescricaoController.buscarPrescricaoPorId
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['MEDICO']),
    prescricaoController.atualizarPrescricao
);

module.exports = router;