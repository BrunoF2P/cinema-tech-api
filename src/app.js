import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routers from './routes/index.js';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import passport from "./bin/passport.js";

// Configurando variaveis de ambiente
dotenv.config();

// Criando uma instância do aplicativo Express
const app = express();

// Carrega o arquivo YAML para Swagger
const swaggerDocument = YAML.load('docs/swagger.yaml');

// Configurando middlewares
app.use(logger('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Configurando rotas
app.use('/v1', routers);

export default app;
