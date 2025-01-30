# LTII - Sistema de Aprendizado

## Configuração do Ambiente

### Backend (API e Servidor de Email)
1. Instale as dependências do backend:
```bash
cd server
npm install
```

2. Inicie o servidor backend:
```bash
npm run dev
```
O servidor rodará na porta 3001.

### Frontend
1. Em outro terminal, instale as dependências do frontend:
```bash
# Na raiz do projeto
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O frontend rodará na porta 5173.

## Testando o Sistema

1. Acesse http://localhost:5173 no navegador
2. Faça login como administrador
3. No painel administrativo, você pode:
   - Visualizar usuários e perfis
   - Adicionar novos perfis
   - Gerenciar assinaturas

## Portas Utilizadas
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Observações
- O servidor backend precisa estar rodando para o envio de emails funcionar
- As credenciais SMTP estão configuradas no arquivo `server/index.js`
- Para desenvolvimento, mantenha ambos os servidores (frontend e backend) rodando
