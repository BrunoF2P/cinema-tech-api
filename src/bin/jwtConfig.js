import dotenv from 'dotenv';

dotenv.config();

export function jwtConfig() {
    return {
        secret: process.env.SECRET,
        expiresIn: '1D',
        algorithm: 'HS256'
    };
}

