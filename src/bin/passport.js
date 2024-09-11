import passport from 'passport'
import {jwtConfig} from './jwtConfig.js'
import {Strategy, ExtractJwt } from 'passport-jwt'
import prisma from '../../prismaClient.js'

passport.use(new Strategy({
    _jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    _secretOrKeyProvider: jwtConfig.secret
}, async (jwtPayload, done) =>{
    try {
        // Busca o usuário no banco de dados
        const user = await prisma.usuario.findUnique({
            where: { id_usuario: jwtPayload.userId }
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

passport.initialize();