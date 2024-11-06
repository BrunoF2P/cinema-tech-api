import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routers from './routes/index.js';
import YAML from 'yamljs';
import passport from './bin/passport.js';
import path from 'path';
import url from 'url';
import { apiReference } from '@scalar/express-api-reference';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Configurando variaveis de ambiente
dotenv.config();

// Criando uma instância do aplicativo Express
const app = express();

// Carrega o arquivo YAML para Swagger
const swaggerDocument = YAML.load('docs/swagger.yaml');
swaggerDocument.servers[0].url = `${process.env.SERVER_URL}/v1`;

const corsOptions = {
    origin: 'http://localhost:5173', // URL do seu frontend local
    credentials: true, // Permite o envio de cookies e outras credenciais
};

// Configurando middlewares
app.use(logger(process.env.MODE_SYS));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home', { apiDocsUrl: process.env.SERVER_URL || 'http://localhost:3000' });
});

// Integrando o Scalar para API Reference
app.use('/api-docs', apiReference({
    spec:{
        content: swaggerDocument
    }
}));

// Configurando rotas
app.use('/v1', routers);

export default app;
