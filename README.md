# Tomo-AI: Chatbot Capivara com Google Gemini

Tomo-AI é um chatbot com tema de capivara kawaii que usa a API do Google Gemini para respostas inteligentes e fofas. Este projeto foi projetado como uma demonstração simples de integração com a API Gemini através de um backend seguro.

![Image](https://github.com/user-attachments/assets/c5161afb-7718-4c88-b258-757ff2dcd3ec)

## Sobre o Projeto

Tomo é uma capivara fofa e amigável que oferece:
- Conversas com uma personalidade kawaii e fofa
- Piadas sobre capivaras
- Interface amigável e adorável

## Tecnologias Utilizadas

- **Frontend:** HTML, CSS e JavaScript puro
- **Backend:** Node.js, Express
- **API:** Google Gemini
- **Comunicação:** Fetch API
- **Armazenamento Seguro:** Variáveis de ambiente
- **Estilo:** Animações CSS para efeitos kawaii

## Como Executar o Projeto

### 1. Configurar o Backend

O projeto inclui um servidor backend Node.js para gerenciar com segurança as chamadas à API do Gemini.

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure sua chave API:
   - Renomeie o arquivo `.env.example` para `.env`
   - Adicione sua chave API Gemini no arquivo:
     ```
     GEMINI_API_KEY=sua_chave_api_aqui
     PORT=3000
     ```

4. Inicie o servidor:
   ```bash
   npm start
   ```
   
   Você verá uma mensagem: `Servidor Tomo-AI rodando na porta 3000`

### 2. Acessar o Frontend

Uma vez que o backend esteja rodando, simplesmente:

- Abra o arquivo `index.html` no seu navegador
- Ou acesse `http://localhost:3000` se estiver usando o servidor Express para servir os arquivos estáticos

### 3. Use o Tomo-AI!

- Clique no ícone ⚙️ para abrir as configurações
- Verifique se o status do backend está "Conectado"
- Selecione seu modelo Gemini preferido
- Comece a conversar com a capivara Tomo!

## Estrutura do Projeto

```
tomo-ai/
├── index.html            # Interface de usuário principal
├── css/                  # Estilos do aplicativo
│   ├── style.css
│   └── ...
├── js/                   # JavaScript frontend
│   └── script.js
├── images/               # Imagens e GIFs
│   └── capivara1.gif
└── backend/              # Servidor Node.js
    ├── server.js         # Código principal do servidor
    ├── package.json      # Dependências do backend
    └── .env              # Configurações e chave API (não incluída no git)
```

### Personalidade do Tomo

A personalidade da capivara pode ser ajustada editando a constante `tomoPersonality` no arquivo `backend/server.js`.
