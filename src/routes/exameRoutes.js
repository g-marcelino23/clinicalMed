const express = require('express');
const router = express.Router();

const exameController = require('../controllers/exameController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['MEDICO']),
    exameController.criarExame
);

router.get(
    '/',
    authMiddleware,
    roleMiddleware(['MEDICO', 'SECRETARIO']),
    exameController.listarExames
);

router.get(
    '/:id',
    authMiddleware,
    roleMiddleware(['MEDICO', 'SECRETARIO']),
    exameController.buscarExamePorId
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['MEDICO', 'SECRETARIO']),
    exameController.atualizarExame
);

module.exports = router;