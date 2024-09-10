import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const baseURL = 'https://servicodados.ibge.gov.br/api/v1/localidades';



const getEstados = async () => {
    const response = await axios.get(`${baseURL}/estados`);
    return response.data;
};

const getCidadesByEstado = async (idEstado) => {
    const response = await axios.get(`${baseURL}/estados/${idEstado}/municipios`);
    return response.data;
};

// Adicionando estados e cidades no banco de dados
const seed = async () => {
    try {
        // Adiciona estados
        const estados = await getEstados();
        console.log('Estados recebidos:', estados.length);

        for (const estado of estados) {
            console.log(`Inserindo estado: ${estado.nome}`);

            await prisma.estado.upsert({
                where: { sigla_estado: estado.sigla },
                update: {},
                create: {
                    id_estado: estado.id,
                    nome_estado: estado.nome,
                    sigla_estado: estado.sigla,
                },
            });

            // Adiciona cidades para cada estado
            const cidades = await getCidadesByEstado(estado.id);
            console.log(`Cidades para o estado ${estado.nome}:`, cidades.length);

            for (const cidade of cidades) {
                await prisma.cidade.create({
                    data: {
                        nome_cidade: cidade.nome,
                        id_estado: estado.id,
                    },
                });
            }
        }

        console.log('Dados inseridos com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


// Precarregando informações basicos no banco de dados
async function main() {
    // Adicionar Tipos de usuario
    await prisma.tipoUsuario.createMany({
        data: [
            { descricao: 'Admin' },
            { descricao: 'Cliente' },
        ],
        skipDuplicates: true,
    });

    // Adicionar TipoSala
    await prisma.tipoSala.createMany({
        data: [
            { descricao: 'IMAX' },
            { descricao: '3D' },
            { descricao: 'Normal' },
            { descricao: 'VIP' },
            { descricao: 'Legendado'},
            { descricao: 'Dublado'}
        ],
        skipDuplicates: true,
    });

    // Adicionar Tipos de ingresso
    await prisma.tipoIngresso.createMany({
        data: [
            { descricao: 'Inteira' },
            { descricao: 'Meia' },
        ],
        skipDuplicates: true,
    });

    console.log('Dados iniciais carregados com sucesso.');
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
