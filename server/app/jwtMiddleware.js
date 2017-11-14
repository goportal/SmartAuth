const jwt = require('jsonwebtoken');
const jwt_key = "H4v31Y0u2Ev3r353en47he5R41n";

module.exports = function (req, res, next) {

    const token = req.body.token
        || req.params.token
        || req.headers['x-access-token']
        || req.headers['X-Access-Token']
        || req.headers['authorization']
        || req.headers['token'];

    if (token) {
        jwt.verify(token, jwt_key, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Sessão expirada, por favor fazer login novamente.',
                })
            } else {
                req.sessao = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Você não possui o token',
        })
    }
};