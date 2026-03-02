# HeroForce

Projeto de avaliação técnica para Desenvolvedor(a) Web Fullstack - Innova Connect.

Um portal web fullstack que simula um sistema de gestão e vendas de projetos heroicos, permitindo que heróis se cadastrem, e administradores gerenciem projetos focados em agilidade, encantamento, eficiência, excelência, transparência e ambição.

## Tecnologias Utilizadas

**Backend:**
- NestJS
- TypeORM
- PostgreSQL
- JWT Autenticação

**Frontend:**
- ReactJS
- TypeScript
- Vite
- Tailwind CSS

## Estrutura do Projeto

- `/backend`: API RESTful construída com NestJS.
- `/frontend`: Interface de usuário construída com React e Vite.

## Pré-requisitos

- Node.js v18.19.0
- npm 10.2.3
- PostgreSQL 15.17.1

## Como executar o projeto localmente

### 1. Banco de Dados
Certifique-se de ter o PostgreSQL rodando. Crie um banco de dados conforme configurado nas suas variáveis de ambiente ou utilize as configurações padrão do projeto.

### 2. Backend
1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Verifique o arquivo `.env` para garantir as credenciais do banco de dados.
    1. Gere um hash para o JWT Secret
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

### 3. Frontend
1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação de desenvolvimento:
   ```bash
   npm run dev
   ```

## Valores da Aplicação
O projeto reflete os seguintes valores e critérios:
- **Agilidade**
- **Encantamento**
- **Eficiência**
- **Excelência**
- **Transparência**
- **Ambição**
