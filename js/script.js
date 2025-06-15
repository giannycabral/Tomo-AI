const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat");

// Configuração fixa da API - não requer chave no frontend
const apiService = "gemini"; // Utilizamos apenas Gemini
const apiModel = "gemini-pro"; // Modelo padrão fixo

// Coleção de piadas de capivara para o Tomo contar
const capivaraJokes = [
    "Por que a capivara é boa em matemática? Porque ela sempre 'roedor' os problemas! 🧮",
    "O que uma capivara disse para outra durante o almoço? 'Essa grama está com um sabor grama-tical!' 🌱",
    "Qual o filme favorito das capivaras? 'Roedores Perdidos' hihihi~ 🎬",
    "Por que a capivara foi ao médico? Porque estava se sentindo um pouco roída por dentro! 🩺",
    "Como uma capivara se despede? 'Até mais tarde, roedor!' ��",
    "O que a capivara faz quando está animada? Ela fica 'ca-pivarada'! ✨",
    "Qual é o doce favorito da capivara? Roelicias! 🍬",
    "Qual é o jogo favorito da capivara na internet? Roed Blocks! 🎮",
    "Como uma capivara entra na faculdade? Com boas 'roedenciais'! 🎓",
    "Qual é o app de transporte favorito das capivaras? 'Roeberr'! 🚗"
];

// Função para obter uma piada aleatória
function getRandomJoke() {
    return capivaraJokes[Math.floor(Math.random() * capivaraJokes.length)];
}

// Comentário removido - apiModel já está definido acima

// Configuração do GIF da capivara
const mascotGif = document.getElementById("capivara-gif");
// Define o caminho para o GIF da capivara, compatível com acesso direto ou via servidor
const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '/' 
    : './';
mascotGif.src = `${baseUrl}images/capivara1.gif`;

// Verifica se a imagem carregou corretamente
mascotGif.onerror = function() {
    console.error("Erro ao carregar a imagem da capivara");
    // Tenta com um caminho alternativo
    this.src = "./images/capivara1.gif";
    
    // Se ainda falhar, tenta outro caminho
    this.onerror = function() {
        this.src = "/images/capivara1.gif";
        
        // Última tentativa com caminho completo
        this.onerror = function() {
            console.error("Todas as tentativas de carregamento da imagem falharam");
            // Mostra um placeholder ou mensagem
            this.style.display = "none";
            const mascotContainer = document.querySelector(".mascot-container");
            if (mascotContainer) {
                const placeholderText = document.createElement("div");
                placeholderText.textContent = "🦫";
                placeholderText.style.fontSize = "100px";
                placeholderText.style.textAlign = "center";
                mascotContainer.appendChild(placeholderText);
            }
        };
    };
};

// Código de configurações removido

// Código de verificação de backend removido

// Código de verificação de chave API removido

// Código de toggle de API removido

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = userInput.value;
    if (userText.trim() === "") return; // Não envia mensagens vazias
    
    addMessage(userText, "user-message");
    userInput.value = "";

    // Mostra o indicador de "digitando"
    const typingMsg = showTypingIndicator();
      
    try {
        const response = await generateResponse(userText);
        addMessage(response, "bot-message");
    } catch (error) {
        console.error("Erro ao contatar a API:", error);
        addMessage("Ah, desculpe! Parece que meus pensamentos se embolaram. 🧠 Tente novamente, por favor.", "bot-message");
    } finally {
        // Remove o indicador de "digitando"
        chatBox.removeChild(typingMsg);
    }
});

function addMessage(text, className) {
    const messageContainer = document.createElement("div");
    messageContainer.className = className;
    messageContainer.textContent = text;
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Efeito de digitação para as mensagens do bot
    if (className === "bot-message") {
        messageContainer.style.animationDelay = "0.2s";
    }
}

// Função para criar bolhas kawaii quando a capivara é clicada
function createBubbles() {
    const container = document.querySelector(".chatbot-container");
    const bubbleCount = 8;
    
    for (let i = 0; i < bubbleCount; i++) {
        const size = Math.random() * 20 + 10;
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Posição inicial perto da capivara
        bubble.style.left = `calc(50% + ${(Math.random() * 60) - 30}px)`;
        bubble.style.top = `80px`;
        
        // Movimento aleatório
        bubble.style.setProperty('--move-x', `${(Math.random() * 200) - 100}px`);
        bubble.style.setProperty('--move-y', `${-Math.random() * 200 - 50}px`);
        
        // Atraso de animação
        bubble.style.animationDuration = `${Math.random() * 4 + 3}s`;
        bubble.style.opacity = Math.random() * 0.4 + 0.3;
        
        // Adicionar à página e remover depois
        document.body.appendChild(bubble);
        
        // Remove a bolha após a animação
        setTimeout(() => {
            document.body.removeChild(bubble);
        }, 7000);
    }
}

function showTypingIndicator() {
    const typingMsg = document.createElement("div");
    typingMsg.className = "bot-message typing-indicator";
    typingMsg.textContent = "Tomo está relaxando e pensando...";
    chatBox.appendChild(typingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingMsg;
}

// Função de validação de chave API removida

// URL do backend
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? `http://${window.location.hostname}:3000` 
    : ''; // Em produção, use URL relativa

// Função para gerar resposta usando o backend
async function generateResponse(input) {
    // Verifica se o usuário está pedindo uma piada
    const isJokeRequest = input.toLowerCase().includes("piada") || 
                          input.toLowerCase().includes("engraçad") ||
                          input.toLowerCase().includes("humor");
                           
    if (isJokeRequest) {
        return getRandomJoke();
    }
    
    try {
        // Enviar requisição para o backend
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: input,
                model: apiModel
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Erro na API:", error);
            
        // Verifica se o erro está relacionado com o backend
        const errorMsg = error.message.toLowerCase();
        
        if (errorMsg.includes("failed to fetch") || errorMsg.includes("network") || errorMsg.includes("connection")) {
            return `Nyaa~ Não consegui me conectar ao servidor backend! Verifique se o servidor está rodando em http://localhost:3000 e tente novamente. 🌐`;
        } else if (errorMsg.includes("rate") || errorMsg.includes("limit") || errorMsg.includes("429")) {
            return `Nyaa~ Estou um pouco cansada! O serviço de API está limitando as requisições. Tente novamente em alguns minutos, por favor? 😴`;
        } else if (errorMsg.includes("timeout")) {
            return `Hmm, o servidor demorou muito para responder! Talvez esteja ocupado, pode tentar de novo? ⏱️`;
        } else {
            return `Ops! Tive um problema ao pensar: ${error.message}. Tente novamente mais tarde? 🌱`;
        }
    }
}

// Função de teste de conexão com o backend removida

// Eventos para a capivara
mascotGif.addEventListener("click", () => {
    createBubbles();
    
    // Pequena chance de dar uma piada quando clicada
    if (Math.random() < 0.3) {
        addMessage(getRandomJoke(), "bot-message");
    } else {
        const messages = [
            "Nyaa~ Você me fez cócegas! 🌿",
            "Hehe~ Olá amigo! Como posso te ajudar hoje? ✨",
            "Aww, adoro quando conversamos! 💫",
            "Que bom te ver novamente! O que vamos aprender hoje? ��",
            "Pyon! Está precisando de ajuda? ��"
        ];
        addMessage(messages[Math.floor(Math.random() * messages.length)], "bot-message");
    }
});

// Mensagem de boas-vindas simples
if (chatBox.children.length <= 1) {
    // Adiciona um pequeno atraso para uma experiência mais natural
    setTimeout(() => {
        addMessage("Bem-vindo(a)! Sou Tomo, sua amiga capivara. Vamos conversar? 🌿", "bot-message");
    }, 500);
}
