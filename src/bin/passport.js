import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { jwtConfig } from './jwtConfig.js';
import prisma from '../../prismaClient.js';

// Usando o cabeçalho Authorization: Bearer <token>
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extrai o JWT do cabeçalho Authorization
    secretOrKey: jwtConfig().secret,  // Usando a chave secreta configurada
}, async (jwtPayload, done) => {
    try {
        // Buscando o usuário na base de dados
        const user = await prisma.usuario.findUnique({
            where: { id_usuario: jwtPayload.userId },
        });

        if (user) {
            return done(null, user);  // Usuário encontrado
        } else {
            return done(null, false);  // Usuário não encontrado
        }
    } catch (err) {
        return done(err, false);  // Erro durante a busca do usuário
    }
}));

export default passport;
