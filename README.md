<br />

<h2 align="center">Cinema Tech API</h2>

<p align="center">
  Projeto avaliativo para LP3 (Linguagem de Programação 3)!
  <br/>
  <a href="https://github.com/BrunoF2P/cinema-tech-api/issues/new?labels=bug&template=bug-report.md">Reporte um Bug</a>
  ·
  <a href="https://github.com/BrunoF2P/cinema-tech-api/issues/new?labels=enhancement&template=feature-request.md">Solicite um Recurso</a>
</p>



## 🛠️ Tecnologias Utilizadas

---

* [![Node.js][Node.js]][Node-url]
* [![Express][Express]][Express-url]
* [![MySQL][MySQL]][MySQL-url]
* [![Prisma][Prisma]][Prisma-url]


## 1. ⚙️ Configuração

---

1. **Instalação das Dependências**

   Clone este repositório e instale as dependências:
   ```bash
   git clone https://github.com/BrunoF2P/cinema-tech-api.git
   cd cinema-tech-api
   npm install

2. **Configuração do Ambiente e Banco de Dados**

   Na raiz do projeto, crie um arquivo chamado `.env`.

3. **Adicione as variáveis de ambiente necessárias**

   Abra o arquivo `.env` e adicione as seguintes variáveis (ajuste conforme necessário):
   ```env
   DATABASE_URL="mysql://usuario:senha@localhost:porta/banco_dados"

## 2. 📊 Inicialização do Banco de Dados

Para configurar e inicializar o banco de dados para o projeto, siga os passos abaixo:

1. **Aplicar Migrações**

    As migrações são usadas para criar e atualizar a estrutura do banco de dados de acordo com o esquema definido pelo Prisma. Execute o seguinte comando para aplicar as migrações:

    ```bash
    npx prisma migrate deploy

Após configurar e inicializar o banco de dados, você pode adicionar dados iniciais usando o script de seed. Este script é projetado para inserir dados padrão no banco de dados, facilitando o desenvolvimento e os testes.

2. **Executar o Script de Seed**

    O script de seed está localizado na pasta `prisma` e é chamado `seed.js`. Para executar o script e popular o banco de dados, use o seguinte comando:

    ```bash
    npm run seed


## 3. 🚀 Inicie o Servidor

Depois de configurar e popular o banco de dados, o próximo passo é iniciar o servidor para que a API comece a aceitar requisições.

1. **Iniciar o Servidor**

    Para iniciar o servidor, use o seguinte comando:

    ```bash
    npm start

## 📜 Licença

Este projeto está licenciado sob a [MIT License](LICENSE.txt).

---

A [MIT License](https://opensource.org/licenses/MIT) é uma licença permissiva que permite a qualquer pessoa fazer praticamente qualquer coisa com o código, desde que a licença original e o aviso de direitos autorais sejam incluídos em todas as cópias ou partes substanciais do software.

Para mais detalhes sobre a licença, consulte o arquivo [LICENSE](LICENSE.txt) no repositório.

<!-- LINKS & IMAGENS -->
[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/

[Express]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/

[MySQL]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/