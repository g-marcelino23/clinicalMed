const roleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
        const perfil = req.usuario.perfil;

        if (!rolesPermitidos.includes(perfil)) {
            return res.status(403).json({
                erro: 'Acesso negado'
            });
        }

        next();
    };
};

module.exports = roleMiddleware;