const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat");

// Elementos do modal de API
const apiKeyModal = document.getElementById("api-key-modal");
const apiKeyInput = document.getElementById("api-key-input");
const showApiKeyModal = document.getElementById("show-api-key-modal");
const closeModal = document.querySelector(".close-modal");
const saveApiKeyBtn = document.getElementById("save-api-key");
const clearApiKeyBtn = document.getElementById("clear-api-key");
const toggleApiKeyVisibility = document.getElementById("toggle-api-key-visibility");
const apiStatus = document.getElementById("api-status");
const modelSelect = document.getElementById("model-select");

// Chave de armazenamento para sessionStorage
const API_KEY_STORAGE = "tomo_gemini_api_key";
const API_MODEL_STORAGE = "tomo_gemini_model";

// Configuração fixa da API - não requer chave no frontend
const apiService = "gemini"; // Utilizamos apenas Gemini

// Modelos disponíveis (conforme documentação oficial do Google - junho/2025)
const API_MODELS = {
  DEFAULT: "gemini-1.5-pro",   // Modelo padrão com boa qualidade/preço
  FAST: "gemini-2.0-flash",    // Modelo mais novo e rápido
  LEGACY: "gemini-pro",        // Modelo da geração anterior (fallback)
  VISION: "gemini-1.5-pro-vision" // Modelo com capacidades de visão (se implementarmos no futuro)
};

// Modelo atual - use API_MODELS.FAST se preferir o modelo mais rápido
const apiModel = API_MODELS.DEFAULT;

// Funções para gerenciar modelo selecionado
function getStoredModel() {
    return sessionStorage.getItem(API_MODEL_STORAGE) || API_MODELS.DEFAULT;
}

function saveSelectedModel(model) {
    sessionStorage.setItem(API_MODEL_STORAGE, model);
}

// Verifica se existe uma chave API salva na sessão
function getStoredApiKey() {
    return sessionStorage.getItem(API_KEY_STORAGE);
}

// Salva a chave API na sessão
function saveApiKey(key) {
    if (key && key.trim() !== "") {
        sessionStorage.setItem(API_KEY_STORAGE, key.trim());
        return true;
    }
    return false;
}

// Remove a chave API da sessão
function clearApiKey() {
    sessionStorage.removeItem(API_KEY_STORAGE);
}

// Verifica se a chave API é válida
async function validateApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === "") {
        updateApiStatus("Chave API não fornecida", false);
        return false;
    }

    try {
        updateApiStatus("Verificando...", "pending");
        
        // URL do backend
        const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? `http://${window.location.hostname}:3000` 
            : '';
            
        const response = await fetch(`${BACKEND_URL}/api/status?apiKey=${encodeURIComponent(apiKey)}`);
        const data = await response.json();
        
        if (data.status === "online") {
            updateApiStatus("Conectado ✓", true);
            return true;
        } else {
            updateApiStatus("Chave inválida ou erro de conexão ✗", false);
            return false;
        }
    } catch (error) {
        console.error("Erro ao validar chave API:", error);
        updateApiStatus("Erro de conexão ✗", false);
        return false;
    }
}

// Atualiza o indicador de status da API
function updateApiStatus(message, status) {
    const statusIndicator = apiStatus.querySelector(".status-indicator");
    const statusText = apiStatus.querySelector("span");
    
    if (status === "pending") {
        statusIndicator.className = "status-indicator pending";
    } else {
        statusIndicator.className = "status-indicator " + (status ? "connected" : "disconnected");
    }
    
    statusText.textContent = message;
    apiStatus.style.display = "flex";
}

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

// Configuração do GIF da capivara
const mascotGif = document.getElementById("capivara-gif");
// Defines o caminho para o GIF da capivara, compatível com acesso direto ou via servidor
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

// Event listeners para o modal de API
showApiKeyModal.addEventListener("click", () => {
    // Preenche o input com a chave salva (se houver)
    const savedKey = getStoredApiKey();
    if (savedKey) {
        apiKeyInput.value = savedKey;
        validateApiKey(savedKey);
    } else {
        updateApiStatus("Nenhuma chave configurada", false);
    }
    
    // Seleciona o modelo anteriormente salvo (se houver)
    const savedModel = getStoredModel();
    modelSelect.value = savedModel;
    
    // Mostra o modal com animação
    apiKeyModal.style.display = "flex";
    
    // Inicializa interações com elementos decorativos do modal
    initModalDecorations();
});

closeModal.addEventListener("click", () => {
    apiKeyModal.style.display = "none";
});

// Fecha o modal quando clicar fora dele
window.addEventListener("click", (e) => {
    if (e.target === apiKeyModal) {
        apiKeyModal.style.display = "none";
    }
});

// Toggle para mostrar/esconder a chave API
toggleApiKeyVisibility.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
        apiKeyInput.type = "text";
        toggleApiKeyVisibility.textContent = "🔒";
    } else {
        apiKeyInput.type = "password";
        toggleApiKeyVisibility.textContent = "👁️";
    }
});

// Salvar a chave API quando clicar no botão
saveApiKeyBtn.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey === "") {
        updateApiStatus("Por favor, insira uma chave API", false);
        return;
    }
    
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
        // Salva a chave API e o modelo selecionado
        saveApiKey(apiKey);
        saveSelectedModel(modelSelect.value);
        
        // Mostra mensagem de confirmação
        const modelName = modelSelect.options[modelSelect.selectedIndex].text.split(' ')[0] + ' ' + 
                          modelSelect.options[modelSelect.selectedIndex].text.split(' ')[1];
        addMessage(`Nyaa~ Chave API configurada com sucesso! Usando modelo ${modelName}! Agora posso conversar melhor! ✨`, "bot-message");
        
        setTimeout(() => {
            apiKeyModal.style.display = "none";
        }, 1500);
    }
});

// Limpar a chave API
clearApiKeyBtn.addEventListener("click", () => {
    apiKeyInput.value = "";
    clearApiKey();
    updateApiStatus("Chave API removida", false);
});

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = userInput.value;
    if (userText.trim() === "") return; // Não envia mensagens vazias
    
    // Verifica se a chave API está configurada antes de enviar
    const apiKey = getStoredApiKey();
    if (!apiKey) {
        // Destaca o botão de configurações com animação de pulso
        const settingsButton = document.getElementById("show-api-key-modal");
        settingsButton.classList.add("needs-config");
        
        // Animação para chamar a atenção
        settingsButton.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 99, 71, 0.7)' },
            { transform: 'scale(1.2)', boxShadow: '0 0 0 15px rgba(255, 99, 71, 0)' },
            { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 99, 71, 0)' }
        ], {
            duration: 1500,
            iterations: 3
        });
        
        // Adiciona a mensagem do usuário
        addMessage(userText, "user-message");
        userInput.value = "";
        
        // Mostra o modal de configuração da API após um pequeno delay
        setTimeout(() => {
            showApiKeyModal.click();
        }, 800);
        
        // Adiciona uma mensagem informativa mais destacada
        addMessage("🔑 Ops! Precisamos configurar sua chave API do Google Gemini antes de eu poder responder. Por favor, insira sua chave API no formulário que apareceu. Sem ela, eu não consigo pensar direito! 🌸", "bot-message");
        return; // Interrompe o envio da mensagem
    }
    
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

// Adiciona interatividade a todos os elementos decorativos
function initDecorationInteractions() {
    const decorations = document.querySelectorAll('.decoration');
    
    decorations.forEach(decoration => {
        decoration.addEventListener('click', function() {
            // Adiciona a classe animada ao SVG
            const svgElement = this.querySelector('.svg-decoration');
            svgElement.classList.add('animated');
            
            // Pequena chance de mostrar uma mensagem fofa
            if (Math.random() < 0.2) {
                const messages = [
                    "Nyaa~ Que fofinho, você gosta de flores! 🌸",
                    "Hehe~ As plantas ficam felizes quando você interage com elas! 🌿",
                    "Aww, natureza é tão relaxante, não é? 🍃",
                    "Você encontrou uma de minhas plantas favoritas! 🌱",
                    "Essa florzinha está sorrindo para você! ✿◠‿◠",
                ];
                addMessage(messages[Math.floor(Math.random() * messages.length)], "bot-message");
            }
            
            // Remove a classe após a animação
            setTimeout(() => {
                svgElement.classList.remove('animated');
            }, 1000);
            
            // Cria mini bolhas
            createMiniBubbles(this);
        });
    });
}

// Inicializa as decorações do modal
function initModalDecorations() {
    const modalDecorations = document.querySelectorAll('.modal-content .decoration');
    modalDecorations.forEach(decoration => {
        // Remove handlers anteriores
        decoration.replaceWith(decoration.cloneNode(true));
    });
    
    // Reinicializa os event listeners para as decorações do modal
    document.querySelectorAll('.modal-content .decoration').forEach(decoration => {
        decoration.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que o clique feche o modal
            
            // Adiciona a classe animada ao SVG
            const svgElement = this.querySelector('.svg-decoration');
            svgElement.classList.add('animated');
            
            // Pequena chance de mostrar uma mensagem sobre configurações
            if (Math.random() < 0.3) {
                const messages = [
                    "Lembre-se de salvar sua configuração! 💾",
                    "Obrigada por configurar minha API! 🌸",
                    "Com uma chave API, posso te ajudar melhor! ✨",
                    "O modelo mais rápido é o Gemini 2.0 Flash! ⚡",
                    "Sua chave só fica salva no navegador atual! 🔒"
                ];
                // Mostra uma mensagem flutuante no modal
                showModalTooltip(messages[Math.floor(Math.random() * messages.length)], decoration);
            }
            
            // Remove a classe após a animação
            setTimeout(() => {
                svgElement.classList.remove('animated');
            }, 1000);
            
            // Cria mini bolhas
            createMiniBubbles(this, true);
        });
    });
}

// Função para mostrar tooltip flutuante no modal
function showModalTooltip(message, element) {
    const tooltip = document.createElement("div");
    tooltip.className = "modal-tooltip";
    tooltip.textContent = message;
    
    // Posiciona o tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    
    // Adiciona à página
    document.body.appendChild(tooltip);
    
    // Remove após alguns segundos
    setTimeout(() => {
        tooltip.style.opacity = "0";
        setTimeout(() => document.body.removeChild(tooltip), 500);
    }, 3000);
}

// Cria mini bolhas ao redor de elementos decorativos quando clicados
function createMiniBubbles(element, isModal = false) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const count = isModal ? 3 : 5; // Menos bolhas no modal para evitar poluição visual
    const maxSize = isModal ? 8 : 10; // Bolhas menores no modal
    
    for (let i = 0; i < count; i++) {
        const size = Math.random() * maxSize + 5;
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Posição inicial no elemento
        bubble.style.left = `${centerX}px`;
        bubble.style.top = `${centerY}px`;
        
        // Movimento aleatório
        bubble.style.setProperty('--move-x', `${(Math.random() * 60) - 30}px`);
        bubble.style.setProperty('--move-y', `${-Math.random() * 60 - 20}px`);
        
        // Atraso de animação
        bubble.style.animationDuration = `${Math.random() * 3 + 2}s`;
        bubble.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Adicionar à página e remover depois
        document.body.appendChild(bubble);
        
        // Remove a bolha após a animação
        setTimeout(() => {
            if (document.body.contains(bubble)) {
                document.body.removeChild(bubble);
            }
        }, 3000);
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
        // Obtém a chave API e modelo armazenados
        const apiKey = getStoredApiKey();
        const selectedModel = getStoredModel();
        
        // Enviar requisição para o backend
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: input,
                model: selectedModel,
                apiKey: apiKey // Envia a chave API para o backend
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Verificar se precisa de chave API
            if (data.needsApiKey) {
                // Mostra o modal para inserir a chave API
                showApiKeyModal.click();
                return "Nyaa~ Precisamos de uma chave API do Google Gemini para conversar. Por favor, clique em ⚙️ e configure sua chave! 🌱";
            }
            throw new Error(data.error || `Erro na API: ${response.status}`);
        }
        
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
            "Que bom te ver novamente! O que vamos aprender hoje? 🌱",
            "Pyon! Está precisando de ajuda? 🌸",
            "Nossa, você gosta mesmo de capivaras, né? 💕",
            "Estou cercada de plantas tão bonitas! 🌼",
            "Olha só quanta decoração fofa! Obrigada por deixar meu espaço tão bonito! 🍃"
        ];
        addMessage(messages[Math.floor(Math.random() * messages.length)], "bot-message");
    }
    
    // Chama a atenção para um elemento decorativo aleatório
    highlightRandomDecoration();
});

// Destaca um elemento decorativo aleatório
function highlightRandomDecoration() {
    const decorations = document.querySelectorAll('.decoration');
    if (decorations.length > 0) {
        // Remove destaque anterior
        document.querySelectorAll('.decoration--highlight').forEach(el => {
            el.classList.remove('decoration--highlight');
        });
        
        // Adiciona destaque a um elemento aleatório
        const randomIndex = Math.floor(Math.random() * decorations.length);
        const randomDecoration = decorations[randomIndex];
        randomDecoration.classList.add('decoration--highlight');
        
        // Adiciona pulsar suave
        const svgElement = randomDecoration.querySelector('.svg-decoration');
        svgElement.classList.add('animated');
        
        // Remove após alguns segundos
        setTimeout(() => {
            randomDecoration.classList.remove('decoration--highlight');
            svgElement.classList.remove('animated');
        }, 3000);
    }
}

// Inicializa as interações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a imagem da capivara carregou
    const mascotGif = document.getElementById('capivara-gif');
    console.log('Status de carregamento da imagem:', {
        complete: mascotGif.complete,
        naturalHeight: mascotGif.naturalHeight,
        naturalWidth: mascotGif.naturalWidth,
        src: mascotGif.src
    });
    
    // Inicializa interações com elementos decorativos
    initDecorationInteractions();
    
    // Verificar caminhos absolutos
    const baseUrl = window.location.origin;
    console.log('Base URL:', baseUrl);
    console.log('Caminhos testados:');
    console.log('- ' + baseUrl + '/images/capivara1.gif');
    console.log('- ' + window.location.href.split('/').slice(0, -1).join('/') + '/images/capivara1.gif');
    
    // Tentar verificar diretamente o arquivo via API
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        fetch(baseUrl + '/check-image')
          .then(res => {
            console.log('Verificação do arquivo via API:', res.status === 200 ? 'Disponível' : 'Indisponível');
          })
          .catch(err => {
            console.error('Erro ao verificar arquivo via API:', err);
          });
          
        fetch(baseUrl + '/api/file-check')
          .then(res => res.json())
          .then(data => {
            console.log('Diagnóstico de arquivos estáticos:', data);
          })
          .catch(err => {
            console.error('Erro ao verificar arquivos estáticos:', err);
          });
    }
});

// Verifica se é necessário exibir mensagem sobre API e destacar o botão de configurações
setTimeout(() => {
    const apiKey = getStoredApiKey();
    const settingsButton = document.getElementById("show-api-key-modal");
    const settingsTooltip = settingsButton.querySelector(".settings-tooltip");
    
    if (!apiKey) {
        // Destaca o botão de configurações
        settingsButton.classList.add("needs-config");
        
        // Atualiza o texto do tooltip
        if (settingsTooltip) {
            settingsTooltip.textContent = "⚠️ Clique aqui para configurar sua chave API";
        }
        
        // Adiciona mensagem sobre a necessidade de configurar
        addMessage("Nyaa~ Para começarmos nossa conversa, você precisa configurar sua chave API do Google Gemini! Clique no botão piscando ⚙️ no canto superior direito! 🌱", "bot-message");
        
        // Destaca visualmente o botão de configuração com uma animação de pulso
        settingsButton.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 99, 71, 0.7)' },
            { transform: 'scale(1.1)', boxShadow: '0 0 0 10px rgba(255, 99, 71, 0)' },
            { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 99, 71, 0)' }
        ], {
            duration: 2000,
            iterations: 3
        });
    } else {
        settingsButton.classList.remove("needs-config");
        
        // Texto normal para o tooltip
        if (settingsTooltip) {
            settingsTooltip.textContent = "Configurações da API";
        }
    }
}, 1500);

// Inicializa as interações com os elementos decorativos
initDecorationInteractions();
