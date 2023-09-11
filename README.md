# Password manager
Com o constante aumento de senhas, cartões e chaves necessárias para acessar serviços online, muitos enfrentam desafios para gerenciar eficientemente e com segurança essas informações. Esta aplicação entra como a solução, oferecendo uma api abrangente para gerenciar cartões, textos secretos e informações de login(login e senha), com foco em segurança e facilidade de uso.

## Sobre
Este é um projeto de backend, uma API RESTful, projetada para capacitar os usuários a gerenciarem com segurança suas cartões, notas, e informações de login

- Desenvolvido com NestJs
- Banco de Dados: PostgreSQL
- PrismaORM
- Typescript
- Rotas autenticadas com jwt
- Testes automatizados de integração com Jest
- Documentado com swagger
- Próximos passos: Criar o frontend para a aplicação.

Caso queria explorar mais a API segue o link do deploy no render: <a href="https://password-manager-14jx.onrender.com"> password-manager-api </a> / 
<a href="https://password-manager-14jx.onrender.com/api">Documentação</a>

## Tecnologias
<p>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src='https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white'/>
  <img src='https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E'/>
  <img src='https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white'/>

</p>
O prisma foi utilizado para a criação do banco de dados e também para monitorar as migrações e as alterações realizadas. O Jest foi utilizado juntamente com a biblioteca <a href="https://fakerjs.dev/api/"> faker </a> para realização de testes de integração.

## Como rodar
1. Clone o repositório em https://github.com/CaioCZS/password-panager-backend
2. Instale as dependências
   ```
   npm i
   ```
3. Crie as variáveis de ambiente no arquivo .env
   ```
      DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
      JWT_SECRET="top_secret"
      CRYPTR_SECRET="myTotallySecretKey"
   ```
4. Inicialize o banco de dados com o Prisma
   ```
   npx prisma migrate dev
   ```
6. Inicialize a API
   ```
   npm run start:dev
   ```
## Como rodar os testes 

1. Crie as variáveis de ambiente no .env.test
   ```
      DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb-test?schema=public"
   ```
2. Crie um banco de dados para teste
   ```
   npm run test:prisma
   ```
3. Rode os testes
   ```
   npm run test:e2e
   ```
