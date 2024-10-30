import passport from 'passport';

function authenticateJwt(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Altere para o URL do seu frontend
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ msg: 'Erro de autenticação', error: err });
        }
        if (!user) {
            return res.status(401).json({ msg: 'Não autorizado' });
        }
        req.user = user;
        next();
    })(req, res, next);
}

function authorizeAdmin(req, res, next) {
    if (req.user && req.user.id_tipo_usuario === 1) {
        next();
    } else {
        res.status(403).json({ msg: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
    }
}

export { authenticateJwt, authorizeAdmin };
