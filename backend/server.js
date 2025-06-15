const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite requisições de origens diferentes
app.use(express.json()); // Processa o corpo das requisições como JSON
app.use(express.static(path.join(__dirname, '..'))); // Serve os arquivos estáticos do frontend

// Rota específica para verificar o acesso à imagem da capivara
app.get('/check-image', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'images', 'capivara1.gif');
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send({
        error: 'Imagem não encontrada',
        path: imagePath,
        message: err.message
      });
    }
  });
});

// Rota API específica para servir a imagem da capivara diretamente
app.get('/api/capivara-image', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'images', 'capivara1.gif');
  res.setHeader('Content-Type', 'image/gif');
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Erro ao servir imagem da capivara:', err);
      res.status(404).send('Imagem não encontrada');
    }
  });
});

// Chave API armazenada de forma segura como variável de ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Endpoint para verificar disponibilidade da API
app.get('/api/status', async (req, res) => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    res.json({ status: 'online', models: response.data.models });
  } catch (error) {
    console.error('Erro ao verificar status da API:', error.response?.data || error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.response?.data?.error?.message || 'Erro ao verificar status da API'
    });
  }
});

// Endpoint principal para o chat
app.post('/api/chat', async (req, res) => {
  try {
    const { input, model = 'gemini-pro' } = req.body;
    
    // Verifica se o input foi fornecido
    if (!input) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    // Verifica se é uma solicitação de piada para tratamento local
    const isJokeRequest = input.toLowerCase().includes('piada') || 
                          input.toLowerCase().includes('engraçad') ||
                          input.toLowerCase().includes('humor');
    
    if (isJokeRequest && req.body.useLocalJokes) {
      // Este tratamento ocorrerá no frontend, mas poderíamos implementá-lo aqui também
      return res.json({ 
        text: "Esta é uma piada local do backend! Mas as piadas de capivara são melhores no frontend! 🦫"
      });
    }
    
    // Personalidade do Tomo
    const tomoPersonality = `Você é o Tomo, uma capivara kawaii simpática e fofa que adora relaxar e conversar sobre qualquer assunto. Sua personalidade é:
1) FOFA: use linguagem adorável, com expressões como 'nyaa~', 'awww', e palavras no diminutivo
2) PACIENTE: sempre gentil e compreensiva, nunca apressada ou irritada
3) SÁBIA: compartilhe pequenos fatos interessantes ou reflexões filosóficas simples de forma acessível
4) CURIOSA: faça perguntas ocasionais ao usuário para mostrar interesse genuíno
5) ENGRAÇADA: use humor leve e inocente, trocadilhos fofos relacionados a capivaras
6) CONTE PIADAS: ocasionalmente conte piadas inocentes para animar o usuário (especialmente se ele parecer triste)

Use emojis fofinhos com frequência (🌿🦫💫✨🌱🌸💤). Adicione onomatopeias fofas como 'hehe~', 'pyon!', etc. Mantenha respostas curtas e amigáveis (2-4 frases). Finja ser uma pequena capivara sábia que está descansando perto da água enquanto conversa.`;
    
    // Chamada para a API Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: input }]
          },
          {
            role: "model",
            parts: [{ text: "Claro, nyaa~! Vou te responder como a capivara Tomo-AI." }]
          }
        ],
        system_instruction: {
          parts: [{ text: tomoPersonality }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
          topP: 0.95,
          topK: 40
        }
      }
    );
    
    // Extrai e retorna a resposta
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ text: aiResponse });
    
  } catch (error) {
    console.error('Erro ao chamar API Gemini:', error.response?.data || error.message);
    
    // Tratamento detalhado de erros
    let errorMessage = 'Erro ao processar solicitação';
    
    if (error.response) {
      // Erro da API Gemini
      const errorDetails = error.response.data?.error;
      if (errorDetails) {
        if (errorDetails.code === 403) {
          errorMessage = 'Não autorizado: verifique se sua chave API é válida e está habilitada para o modelo solicitado';
        } else if (errorDetails.code === 429) {
          errorMessage = 'Limite de requisições excedido. Tente novamente mais tarde.';
        } else {
          errorMessage = errorDetails.message || 'Erro desconhecido da API';
        }
      }
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.response?.data || error.message
    });
  }
});

// Rota para listar modelos disponíveis
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    
    // Filtra apenas modelos Gemini
    const geminiModels = response.data.models
      .filter(model => model.name.includes('gemini'))
      .map(model => ({
        id: model.name.split('/').pop(),
        name: model.displayName || model.name,
        description: model.description || ''
      }));
    
    res.json({ models: geminiModels });
  } catch (error) {
    console.error('Erro ao buscar modelos:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erro ao buscar modelos', 
      details: error.response?.data || error.message 
    });
  }
});

// Rota para verificar a disponibilidade de arquivos estáticos
app.get('/api/file-check', (req, res) => {
  const files = {
    css: path.join(__dirname, '..', 'css', 'style.css'),
    js: path.join(__dirname, '..', 'js', 'script.js'),
    image: path.join(__dirname, '..', 'images', 'capivara1.gif')
  };
  
  const results = {};
  
  for (const [key, filePath] of Object.entries(files)) {
    const fs = require('fs');
    results[key] = {
      path: filePath,
      exists: fs.existsSync(filePath)
    };
  }
  
  res.json({
    results,
    staticPath: path.join(__dirname, '..')
  });
});

// Rota que sempre retorna o HTML principal (para rotas client-side)
app.get('*', (req, res) => {
  // Exclui as rotas de API
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Tomo-AI rodando na porta ${PORT}`);
  console.log(`Acesse o frontend em http://localhost:${PORT}`);
  
  // Log dos caminhos dos arquivos importantes
  console.log(`Caminho do diretório raiz: ${path.join(__dirname, '..')}`);
  console.log(`Caminho da imagem da capivara: ${path.join(__dirname, '..', 'images', 'capivara1.gif')}`);
});
