Preparação do ambiente dentro da pasta do projeto 
Iniciar projeto node  : npm init -y
Instalar Dependencias : 
principal - npm install express cors dotenv @prisma/client
De Desenvolvimento - npm install -D typescript ts-node-dev prisma @types/node @types/express
Criar o TypeScript : npx tsc --init
iniciar o prisma : npx prisma init (cria o .env) 

Configurar MySQL no .env



API REST — Inicialização e Testes de Conectividade
📌 Descrição

Este projeto consiste na construção e inicialização de uma API REST integrada a um banco de dados MySQL, permitindo realizar operações de cadastro e consulta de dados através de requisições HTTP.

Durante o desenvolvimento, foram realizados testes de conectividade entre:

servidor backend;
banco de dados MySQL;
rotas da API;
requisições realizadas no Postman.

O projeto teve como objetivo validar toda a comunicação entre aplicação, servidor e banco de dados.

🚀 Tecnologias Utilizadas
Node.js
Express.js
MySQL Workbench
MySQL Server
Postman
dotenv
JavaScript
🗄️ Validação no Banco de Dados

Os dados enviados pela API foram visualizados diretamente nas tabelas através do:

MySQL Workbench

Também foram realizados comandos SQL para conferência manual dos registros.

✅ Resultados Obtidos
API inicializada corretamente;
servidor respondendo requisições HTTP;
conexão estabelecida com MySQL;
testes de conectividade concluídos com sucesso;
integração entre Postman, API e banco funcionando corretamente.
🎯 Objetivos do Projeto
Praticar criação de APIs REST;
Implementar conexão com banco de dados;
Testar rotas HTTP;
Validar integração backend;
Desenvolver conhecimento em Node.js e MySQL.
