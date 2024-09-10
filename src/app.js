import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routers from './routes/index.js';

// Configurando variaveis de ambiente
dotenv.config();

// Criando uma instância do aplicativo Express
const app = express();

// Configurando middlewares
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configurando rotas
app.use('/v1', routers);

export default app;
