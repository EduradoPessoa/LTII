const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurações de ambiente
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configuração CORS
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Configuração do email baseada no ambiente
let transporter = null;

async function setupEmailTransport() {
  if (isProduction) {
    // Em produção, usar Resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      transporter = {
        sendMail: async ({ to, subject, html }) => {
          const { data, error } = await resend.emails.send({
            from: 'LTII <onboarding@resend.dev>',
            to,
            subject,
            html
          });
          
          if (error) throw error;
          return data;
        }
      };
      
      console.log('Configurado transporte de email com Resend');
    } else {
      console.warn('RESEND_API_KEY não configurada, emails não serão enviados');
    }
  } else {
    // Em desenvolvimento, usar Ethereal
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Configurado transporte de email com Ethereal');
    } catch (error) {
      console.error('Erro ao configurar email de teste:', error);
    }
  }
}

// Endpoint para enviar email de boas-vindas
app.post('/api/email/welcome', async (req, res) => {
  try {
    // Garantir que o transporter está configurado
    if (!transporter) {
      await setupEmailTransport();
    }

    const { to, name, password } = req.body;

    if (!to || !name || !password) {
      return res.status(400).json({ 
        error: 'Dados incompletos. Necessário: email, nome e senha' 
      });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #553C9A;">Bem-vindo ao LTII!</h2>
        
        <p>Olá ${name},</p>
        
        <p>Uma conta foi criada para você no sistema LTII. Aqui estão suas credenciais de acesso:</p>
        
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${to}</p>
          <p style="margin: 5px 0;"><strong>Senha:</strong> ${password}</p>
        </div>
        
        <p>Por favor, acesse o sistema através do link abaixo e altere sua senha no primeiro acesso:</p>
        
        <p>
          <a href="${isProduction ? 'https://ltii.vercel.app' : 'http://localhost:5173'}/login" 
             style="background-color: #553C9A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Acessar o Sistema
          </a>
        </p>
        
        <p>Se você tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
        
        <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
        
        <p style="color: #6B7280; font-size: 0.9em;">
          Esta é uma mensagem automática. Por favor, não responda este email.
        </p>
      </div>
    `;

    console.log('Tentando enviar email para:', to);
    
    const info = await transporter.sendMail({
      from: isProduction ? 'LTII <onboarding@resend.dev>' : 'LTII <test@ethereal.email>',
      to,
      subject: 'Bem-vindo ao LTII - Acesse sua nova conta',
      html
    });

    const response = {
      message: 'Email enviado com sucesso'
    };

    // Adicionar URL de preview apenas em desenvolvimento
    if (!isProduction && nodemailer.getTestMessageUrl) {
      response.previewUrl = nodemailer.getTestMessageUrl(info);
    }

    console.log('Email enviado com sucesso!');
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ 
      error: 'Falha ao enviar email',
      details: error.message
    });
  }
});

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Ambiente:', process.env.NODE_ENV || 'development');
  console.log('CORS origem:', CORS_ORIGIN);
  
  // Configurar email no início
  await setupEmailTransport();
});
