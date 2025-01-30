# Ambiente de Testes - LTII

## Arquitetura Proposta

### Frontend (Vercel - Tier Gratuito)
- Deploy automático do React
- SSL gratuito
- CDN global
- Integração com GitHub
- Domínio customizado (opcional)
- Limites generosos: 100GB/mês

### Backend (Render.com - Tier Gratuito)
- Node.js web service
- SSL gratuito
- 512MB RAM
- Integração com GitHub
- CI/CD automático
- Limitação: Spin down após 15min de inatividade

### Banco de Dados (Supabase - Tier Gratuito)
- PostgreSQL gerenciado
- 500MB de storage
- Autenticação embutida
- Row Level Security
- API REST/GraphQL automática
- Backups diários

### Email (Resend.com - Tier Gratuito)
- 100 emails/dia
- API moderna
- Rastreamento de entrega
- Templates HTML
- Domínio customizado

## Configuração do Projeto

1. **Preparar para Deploy**
   ```bash
   # Criar arquivo .env para variáveis de ambiente
   touch .env
   ```

2. **Configurar Variáveis de Ambiente**
   ```env
   # Frontend (.env)
   VITE_API_URL=https://ltii-api.onrender.com
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_supabase

   # Backend (.env)
   PORT=3000
   DATABASE_URL=sua_url_postgres
   RESEND_API_KEY=sua_chave_resend
   CORS_ORIGIN=https://ltii.vercel.app
   ```

## Passos para Deploy

### 1. Frontend (Vercel)
1. Push do código para GitHub
2. Conectar repositório no Vercel
3. Configurar variáveis de ambiente
4. Deploy automático

### 2. Backend (Render)
1. Criar Web Service
2. Conectar repositório
3. Configurar:
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Variáveis de ambiente

### 3. Banco de Dados (Supabase)
1. Criar projeto
2. Executar migrations
3. Configurar políticas de segurança
4. Habilitar autenticação

### 4. Email (Resend)
1. Criar conta
2. Gerar API key
3. Configurar domínio (opcional)
4. Atualizar templates

## Estimativa de Custos Mensais
- Vercel: $0 (Tier Hobby)
- Render: $0 (Tier Free)
- Supabase: $0 (Tier Free)
- Resend: $0 (até 100 emails/dia)
- **Total: $0/mês**

## Limitações do Tier Gratuito
1. Backend dorme após 15min de inatividade
2. Banco limitado a 500MB
3. 100 emails/dia
4. Sem SLA garantido

## Escalabilidade
Para escalar além do tier gratuito:
1. Render Pro: $7/mês (sem spin down)
2. Supabase Pro: $25/mês (mais storage/conexões)
3. Resend Pro: $20/mês (10k emails)

## Monitoramento
- Vercel Analytics (básico gratuito)
- Render Logs
- Supabase Dashboard
- Resend Email Logs

## Backup e Segurança
- Supabase: backup diário
- GitHub: código fonte
- Vercel: deploys com rollback
- SSL em todos os endpoints
