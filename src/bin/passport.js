import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtConfig } from './jwtConfig.js';
import prisma from '../../prismaClient.js';


const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor, // Extrai o JWT do cookie
    secretOrKey: jwtConfig().secret,
}, async (jwtPayload, done) => {
    try {
        // Busca o usuário no banco de dados
        const user = await prisma.usuario.findUnique({
            where: { id_usuario: jwtPayload.userId },
        });

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

export default passport;
