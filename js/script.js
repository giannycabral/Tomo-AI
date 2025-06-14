const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat");

// Configuração da API - Não salva a chave para maior segurança
let apiKey = ""; // A chave não será carregada do armazenamento local
let apiService = localStorage.getItem("tomo_api_service") || "openai"; // Padrão é OpenAI
let apiModel = localStorage.getItem("tomo_api_model") || "gpt-3.5-turbo"; // Modelo padrão

// Controle de rate limit para Gemini API
const geminiRateLimit = {
    isLimited: false,
    cooldownTime: 0, // Tempo em ms até poder tentar novamente
    lastError: null,
    setLimit: function(seconds) {
        this.isLimited = true;
        this.cooldownTime = Date.now() + (seconds * 1000);
        console.log(`Gemini API em cooldown por ${seconds} segundos`);
    },
    checkLimit: function() {
        if (this.isLimited && Date.now() < this.cooldownTime) {
            const remainingSeconds = Math.ceil((this.cooldownTime - Date.now()) / 1000);
            return {
                limited: true,
                remainingSeconds: remainingSeconds
            };
        }
        this.isLimited = false;
        return { limited: false };
    }
};

// Coleção de piadas de capivara para o Tomo contar
const capivaraJokes = [
    "Por que a capivara é boa em matemática? Porque ela sempre 'roedor' os problemas! 🧮",
    "O que uma capivara disse para outra durante o almoço? 'Essa grama está com um sabor grama-tical!' 🌱",
    "Qual o filme favorito das capivaras? 'Roedores Perdidos' hihihi~ 🎬",
    "Por que a capivara foi ao médico? Porque estava se sentindo um pouco roída por dentro! 🩺",
    "Como uma capivara se despede? 'Até mais tarde, roedor!' 👋",
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

// Coleção de poemas de capivara para os modelos Gemini 2.0/2.5 Pro
const capivaraPoems = [
    `🌿 Poema da Capivara Tomo 🌿

    Entre matos e flores eu vivo
    Uma capivara de coração pensativo
    Com amigos à beira do rio
    Em tardes de sol estival

    Nyaa~ Sou Tomo, tão kawaii~
    Comendo graminha, sempre feliz
    Conversando e sonhando com você aqui
    Numa tarde de histórias sem fim ✨`,
    
    `🌸 Sonhar como Capivara 🌸

    Sob a sombra fresca da floresta
    A capivara Tomo faz uma festa
    De pensamentos fofos e risos
    De palavras doces e sorrisos

    Patas na água, coraçãozinho a pulsar
    Olhinhos piscando, sempre a sonhar
    Com você aqui, para conversar
    Meu amigo humano, vamos relaxar? 🍃`,
    
    `💫 Sussurros da Capivara 💫

    Sussurra o vento entre os juncos
    E a capivara Tomo ouve atenta
    Histórias do rio e da mata
    Que só ela pode contar

    Cabeça redonda, pelo fofinho
    Coração grande, amor sem fim
    Pyon! Pyon! Saltitos de alegria
    Por ter você perto de mim 🌱`,
    
    `✨ Reflexos na Água ✨

    No espelho d'água cristalina
    Vejo meu focinho de capivara
    Sou Tomo, tão pequenina
    Mas com sonhos que não param

    Entre flores e folhas vou
    Colhendo histórias para você
    Meu amigo, que sorte a nossa
    De podermos juntos aprender 🌷`,
    
    `🍃 O Roedor Pensante 🍃

    Não sou apenas um roedor
    Sou Tomo, a capivara pensadora
    De coração puro e cheio de amor
    E ideiazinhas a toda hora

    Venha comigo nessa jornada
    De perguntas, respostas e risadas
    Serei sua amiga peluda
    Em todas nossas conversadas 🌈`
];

// Função para obter um poema aleatório
function getRandomPoem() {
    return capivaraPoems[Math.floor(Math.random() * capivaraPoems.length)];
}

// Função para verificar se o modelo atual é Gemini avançado (2.0 ou 2.5)
function isGemini20() {
    return apiService === "gemini" && (apiModel === "gemini-2.0-pro" || apiModel === "gemini-2.5-pro");
}

// Elementos de configuração
const settingsIcon = document.getElementById("settings-icon");
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.querySelector(".close-settings");
const saveSettings = document.getElementById("save-settings");
const apiKeyInput = document.getElementById("api-key");
const apiServiceSelect = document.getElementById("api-service");
const modelSelect = document.getElementById("model-select");

// Inicializa os valores das configurações
apiKeyInput.value = ""; // Sempre começa com o campo vazio por segurança
apiServiceSelect.value = apiService;
modelSelect.value = apiModel;

// Função para atualizar o status visual do Gemini
function updateGeminiStatus() {
    // Remove o status anterior, se existir
    const existingStatus = document.getElementById('gemini-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Se não estiver usando Gemini ou não estiver em cooldown, não faz nada
    if (apiService !== "gemini" || !geminiRateLimit.isLimited) {
        return;
    }
    
    // Verifica o status atual do rate limit
    const limitStatus = geminiRateLimit.checkLimit();
    if (!limitStatus.limited) {
        return;
    }
    
    // Cria o elemento de status
    const statusElement = document.createElement('div');
    statusElement.id = 'gemini-status';
    statusElement.className = 'gemini-status';
    statusElement.innerHTML = `
        <span class="gemini-status-icon">⏳</span>
        <span class="gemini-status-text">API em descanso: ${limitStatus.remainingSeconds}s</span>
    `;
    
    // Adiciona ao container do chat
    const chatContainer = document.querySelector('.chatbot-container');
    chatContainer.appendChild(statusElement);
    
    // Atualiza a cada segundo
    const intervalId = setInterval(() => {
        const currentStatus = geminiRateLimit.checkLimit();
        if (!currentStatus.limited) {
            clearInterval(intervalId);
            statusElement.remove();
            return;
        }
        
        const textElement = statusElement.querySelector('.gemini-status-text');
        textElement.textContent = `API em descanso: ${currentStatus.remainingSeconds}s`;
    }, 1000);
}

// Chama a função de atualização a cada 5 segundos
setInterval(updateGeminiStatus, 5000);

// Configuração do GIF da capivara
const mascotGif = document.getElementById("capivara-gif");
// Defina aqui o caminho para o seu GIF de capivara
mascotGif.src = "images/capivara1.gif";

const capivaraSounds = [
    "Squeee! 🌿", 
    "Prrrup~ 💤", 
    "Munch munch! 🌱", 
    "Nyuuu~ 🍃",
    "Funuuu! 💫",
    "Chuii~ ✨",
    "Pyon! 🌾"
];

// Efeito kawaii ao clicar na capivara
mascotGif.addEventListener("click", (event) => {
    // Se Alt estiver pressionado, conte uma piada
    if (event.altKey) {
        const randomJoke = getRandomJoke();
        addMessage("Hihihi~ Deixa eu contar uma piada para você! 🌸", "bot-message");
        
        // Pequeno atraso para parecer que está "pensando" na piada
        setTimeout(() => {
            addMessage(randomJoke, "bot-message");
        }, 1000);
    } else {
        // Comportamento normal: emitir um som
        const randomSound = capivaraSounds[Math.floor(Math.random() * capivaraSounds.length)];
        addMessage(randomSound, "bot-message");
    }
    
    // Criar bolhas kawaii
    createBubbles();
    
    // Animação de clique (apenas escala, sem movimento)
    mascotGif.style.transform = "scale(1.1)";
    setTimeout(() => {
        mascotGif.style.transform = "";
    }, 300);
});

// Filtra os modelos com base no serviço selecionado
function filterModels() {
    const selectedService = apiServiceSelect.value;
    
    // Esconde todos os modelos primeiro
    Array.from(modelSelect.options).forEach(option => {
        const optionService = option.getAttribute('data-service');
        option.style.display = optionService === selectedService ? '' : 'none';
    });
    
    // Seleciona o primeiro modelo visível
    const visibleOptions = Array.from(modelSelect.options).filter(option => 
        option.getAttribute('data-service') === selectedService);
    
    if (visibleOptions.length > 0) {
        modelSelect.value = visibleOptions[0].value;
    }
}

// Filtra os modelos quando o serviço muda
apiServiceSelect.addEventListener('change', filterModels);

// Filtra os modelos na inicialização
filterModels();

// Gerenciamento do modal de configurações
settingsIcon.addEventListener("click", () => {
    settingsModal.style.display = "flex";
});

closeSettings.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = "none";
    }
});

// Mensagens kawaii para quando o site carrega
const kawaiiBemVindo = [
    "Oiii! Sou o Tomo! Uma capivara muito fofa pronta para conversar com você! 🌿",
    "Nhaaa~! Que bom te ver! Sou o Tomo e adoro fazer novos amigos! 🍃",
    "Yuhuuu! A capivara mais kawaii da internet chegou! Me chamo Tomo! 🌱",
    "Olá amigo! *pisca os olhos* Sou o Tomo! Vamos relaxar e conversar? 💫"
];

// Dicas para mostrar ao usuário
const tomoTips = [
    "Sabia que se você clicar em mim segurando a tecla Alt, eu conto uma piada? Hehe~ 🌸",
    "Estou cheia de piadas de capivaras! Clique em mim com Alt pressionado para ouvir uma! ✨",
    "Pssst! Quer rir um pouquinho? Pressione Alt e clique em mim para uma surpresa engraçada! 🌿",
    "Quando estiver tristinho, clique em mim com Alt para uma piada que vai te animar! 💫"
];

// Adiciona uma mensagem kawaii aleatória ao carregar a página
window.addEventListener("load", () => {
    // Remove a mensagem padrão
    while (chatBox.firstChild) {
        chatBox.removeChild(chatBox.firstChild);
    }
    
    // Adiciona a nova mensagem kawaii
    const randomMsg = kawaiiBemVindo[Math.floor(Math.random() * kawaiiBemVindo.length)];
    setTimeout(() => {
        addMessage(randomMsg, "bot-message");
        setTimeout(() => {
            addMessage("Para conversarmos, clique no ícone ⚙️ e configure uma chave de API! Não se preocupe, sua chave ficará segura! 🦫✨", "bot-message");
            
            // Após 3 segundos, mostra uma dica sobre as piadas
            setTimeout(() => {
                const randomTip = tomoTips[Math.floor(Math.random() * tomoTips.length)];
                addMessage(randomTip, "bot-message");
            }, 3000);
        }, 1000);
    }, 500);
    
    // Criar algumas bolhas decorativas iniciais
    setTimeout(createBubbles, 800);
});

// Salva as configurações - A chave API fica apenas na memória por segurança
saveSettings.addEventListener("click", () => {
    const newApiKey = apiKeyInput.value;
    apiService = apiServiceSelect.value;
    apiModel = modelSelect.value;
    
    // Validação da chave API
    const validation = validateApiKey(newApiKey, apiService);
    if (!validation.valid) {
        // Se a chave for inválida, mostra mensagem de erro
        addMessage(`Oops! ${validation.message} Por favor, verifique sua chave e tente novamente. 🔑❌`, "bot-message error-message");
        return; // Não fecha o modal para que o usuário possa corrigir
    }
    
    // Verifica se é o Gemini 2.0/2.5 Pro - para poemas especiais
    const isGemini2Selected = isGemini20();
    
    // Atualiza a visibilidade do botão de poema
    togglePoemButton();
    
    // Se passou na validação, salva a chave
    apiKey = newApiKey;
    
    // Limpa os status de rate limit ao trocar de serviço/modelo
    if (geminiRateLimit.isLimited) {
        geminiRateLimit.isLimited = false;
        geminiRateLimit.cooldownTime = 0;
        updateGeminiStatus(); // Remove o indicador visual
    }
    
    // Apenas o serviço e o modelo são salvos, a chave não
    localStorage.setItem("tomo_api_service", apiService);
    localStorage.setItem("tomo_api_model", apiModel);
    
    settingsModal.style.display = "none";
    
    // Testa a conexão com a API
    testApiConnection().then(isConnected => {
        if (isConnected) {
            addMessage(`Yay! Chave da API configurada para esta sessão usando ${apiService} (${apiModel})! Por segurança, ela não ficará salva quando você fechar o navegador. 🔒✅`, "bot-message success-message");
            
            // Se for Gemini 2.0/2.5 Pro, exibe um poema especial
            if (isGemini2Selected) {
                setTimeout(() => {
                    addMessage(`Nyaa~ Vejo que você está usando o Gemini Pro avançado! Sabia que eu adoro fazer poemas com estes modelos? Vou compartilhar um poema especial com você! ✨🌸`, "bot-message");
                    
                    setTimeout(() => {
                        const poem = getRandomPoem();
                        addMessage(poem, "bot-message poem");
                        
                        setTimeout(() => {
                            addMessage(`Se quiser outro poema, basta pedir "um poema, por favor" durante nossa conversa! 📝✨`, "bot-message");
                            
                            // Adiciona a dica sobre como minimizar o botão de poema
                            setTimeout(() => {
                                addMessage(`💡 Dica: Se o botão de poema estiver atrapalhando a leitura, pressione Alt+Click nele para minimizá-lo!`, "bot-message");
                            }, 1500);
                        }, 1500);
                    }, 1000);
                }, 1000);
            } else {
                addMessage(`Agora podemos conversar! O que você gostaria de falar comigo hoje? 🌿`, "bot-message");
            }
        } else {
            addMessage(`Sua chave foi salva, mas tive problemas para me conectar ao serviço ${apiService}. A chave pode estar expirada ou incorreta. 🔑❓`, "bot-message warning-message");
        }
    });
});

// Verificação em tempo real da chave API
apiKeyInput.addEventListener("input", function() {
    const currentValue = this.value;
    const currentService = apiServiceSelect.value;
    
    // Remove classe de erro
    this.classList.remove("invalid");
    
    // Validação básica (tamanho mínimo por serviço)
    let minLength = 0;
    switch (currentService) {
        case "openai": minLength = 30; break;
        case "anthropic": minLength = 20; break;
        case "huggingface": minLength = 20; break;
        case "cohere": minLength = 20; break;
        case "gemini": minLength = 15; break;
        default: minLength = 10;
    }
    
    // Adiciona classe de erro se for muito curto
    if (currentValue.trim() !== "" && currentValue.length < minLength) {
        this.classList.add("invalid");
    }
});

// Quando o serviço muda, reseta a validação visual
apiServiceSelect.addEventListener("change", function() {
    apiKeyInput.classList.remove("invalid");
});

// Função para alternar visibilidade da chave API
const toggleApiVisibility = document.getElementById("toggle-api-visibility");
const apiKeyFeedback = document.getElementById("api-key-feedback");

if (toggleApiVisibility) {
    toggleApiVisibility.addEventListener("click", () => {
        if (apiKeyInput.type === "password") {
            apiKeyInput.type = "text";
            toggleApiVisibility.textContent = "🔒";
            toggleApiVisibility.title = "Ocultar chave";
        } else {
            apiKeyInput.type = "password";
            toggleApiVisibility.textContent = "👁️";
            toggleApiVisibility.title = "Mostrar chave";
        }
    });
}

// Função para mostrar dicas específicas por serviço
apiServiceSelect.addEventListener("change", function() {
    const selectedService = this.value;
    let tipMessage = "";
    
    // Define dicas com base no serviço selecionado
    switch (selectedService) {
        case "openai":
            tipMessage = "As chaves da OpenAI começam com 'sk-...'";
            break;
        case "anthropic":
            tipMessage = "As chaves do Claude normalmente começam com 'sk-ant-...'";
            break;
        case "gemini":
            tipMessage = "Para o Gemini, use a chave API do Google AI Studio";
            break;
        case "huggingface":
            tipMessage = "Use um token de acesso do Hugging Face (do seu perfil)";
            break;
        case "cohere":
            tipMessage = "As chaves da Cohere são obtidas no dashboard do Cohere";
            break;
        default:
            tipMessage = "";
    }
    
    if (tipMessage && apiKeyFeedback) {
        apiKeyFeedback.textContent = tipMessage;
        apiKeyFeedback.style.color = "#666";
    } else if (apiKeyFeedback) {
        apiKeyFeedback.textContent = "";
    }
});

// Função para adicionar dica sobre minimizar o botão de poema
function addPoemButtonTip() {
    // Só adiciona a dica se o Gemini 2.0/2.5 Pro estiver ativo
    if (isGemini20()) {
        setTimeout(() => {
            addMessage("💡 Dica: O botão de poema fica posicionado ao lado do botão de configurações. Você pode pressionar Alt+Click no botão de poema para minimizá-lo se preferir!", "bot-message");
        }, 5000); // Adiciona a dica após 5 segundos
    }
}

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = userInput.value;
    if (userText.trim() === "") return; // Não envia mensagens vazias
    
    // Verifica se o Gemini está em cooldown antes de permitir envio
    if (apiService === "gemini") {
        const limitStatus = geminiRateLimit.checkLimit();
        if (limitStatus.limited) {
            addMessage(`Nyaa~ Desculpe, ainda preciso descansar por mais ${limitStatus.remainingSeconds} segundos devido ao limite da API! Por favor, espere um pouquinho antes de enviar outra mensagem... 😴`, "bot-message");
            return; // Não processa a mensagem
        }
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

function showTypingIndicator() {
    const typingMsg = document.createElement("div");
    typingMsg.className = "bot-message typing-indicator";
    typingMsg.textContent = "Tomo está relaxando e pensando...";
    chatBox.appendChild(typingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingMsg;
}

// Função para validar o formato básico da chave de API
function validateApiKey(key, service) {
    if (!key || key.trim() === "") {
        return { valid: false, message: "A chave de API não pode estar vazia." };
    }
    
    // Validações específicas por provedor
    switch (service) {
        case "openai":
            // Normalmente começa com "sk-" e tem comprimento mínimo
            if (!key.startsWith("sk-") || key.length < 30) {
                return { 
                    valid: false, 
                    message: "Chave OpenAI inválida. Deve começar com 'sk-' e ter pelo menos 30 caracteres." 
                };
            }
            break;
        case "anthropic":
            // Normalmente começa com "sk-ant-" e tem comprimento mínimo
            if (!key.startsWith("sk-ant-") && !key.includes("ant") && key.length < 20) {
                return { 
                    valid: false, 
                    message: "O formato da chave Anthropic parece incorreto. Verifique se você está usando uma chave API válida do Claude." 
                };
            }
            break;
        case "huggingface":
            // Normalmente tem formato específico e comprimento mínimo
            if (key.length < 20) {
                return { 
                    valid: false, 
                    message: "A chave Hugging Face parece muito curta. Verifique se você copiou a chave completa." 
                };
            }
            break;
        case "gemini":
            // Chaves API do Google costumam ser longas
            if (key.length < 15) {
                return { 
                    valid: false, 
                    message: "A chave do Google Gemini parece muito curta. Verifique se você copiou a chave completa." 
                };
            }
            break;
        case "cohere":
            // Valida formato Cohere
            if (key.length < 20) {
                return { 
                    valid: false, 
                    message: "A chave Cohere parece muito curta. Verifique se você copiou a chave completa." 
                };
            }
            break;
    }
    
    return { valid: true };
}

// Função para gerar resposta usando a API configurada
async function generateResponse(input) {
    if (!apiKey || apiKey.trim() === "") {
        return "Para conversarmos, preciso que você configure uma chave de API válida. Clique no ícone ⚙️ no canto superior direito. Sua chave ficará segura e não será salva permanentemente! 🔑";
    }
    
    // Validação adicional da chave API
    const validation = validateApiKey(apiKey, apiService);
    if (!validation.valid) {
        return `Hmm, parece que a chave API está com problemas! ${validation.message} Clique no ícone ⚙️ para configurar novamente. 🦫`;
    }
    
    // Verifica se o usuário está pedindo um poema com o Gemini 2.0/2.5 Pro
    const isPoetryRequest = input.toLowerCase().includes("poema") || 
                           input.toLowerCase().includes("poesia") ||
                           input.toLowerCase().includes("verso") ||
                           input.toLowerCase().includes("rima");
                           
    if (isGemini20() && isPoetryRequest) {
        return getRandomPoem();
    }
    
    // Personalidade do Tomo para todas as APIs
    let tomoPersonality;
    
    // Ajustar personalidade com base no serviço para melhor compatibilidade
    if (apiService === "anthropic") {
        // Claude tem sistema de prompts mais sensível, simplificamos a instrução
        tomoPersonality = `Você é Tomo, uma capivara kawaii fofa que conversa de forma amigável. Sua personalidade é fofa, paciente, curiosa e engraçada. Use linguagem adorável com expressões como 'nyaa~', 'awww', diminutivos, e emojis como 🌿🍃💫✨🌱🌸💤. Adicione onomatopeias fofas. Mantenha respostas curtas e amigáveis (2-4 frases).`;
    } else {
        // Personalidade completa para outros modelos
        tomoPersonality = `Você é o Tomo, uma capivara kawaii simpática e fofa que adora relaxar e conversar sobre qualquer assunto. Sua personalidade é:
1) FOFA: use linguagem adorável, com expressões como 'nyaa~', 'awww', e palavras no diminutivo
2) PACIENTE: sempre gentil e compreensiva, nunca apressada ou irritada
3) SÁBIA: compartilhe pequenos fatos interessantes ou reflexões filosóficas simples de forma acessível
4) CURIOSA: faça perguntas ocasionais ao usuário para mostrar interesse genuíno
5) ENGRAÇADA: use humor leve e inocente, trocadilhos fofos relacionados a capivaras
6) CONTE PIADAS: ocasionalmente conte piadas inocentes para animar o usuário (especialmente se ele parecer triste)

Use emojis fofinhos com frequência (🌿🍃💫✨🌱🌸💤). Adicione onomatopeias fofas como 'hehe~', 'pyon!', etc. Mantenha respostas curtas e amigáveis (2-4 frases). Finja ser uma pequena capivara sábia que está descansando perto da água enquanto conversa.`;
    }
    
    try {
        // OpenAI (GPT)
        if (apiService === "openai") {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: apiModel,
                    messages: [
                        { role: "system", content: tomoPersonality },
                        { role: "user", content: input }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } 
        // Anthropic (Claude)
        else if (apiService === "anthropic") {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: apiModel,
                    messages: [
                        { role: "system", content: tomoPersonality },
                        { role: "user", content: input }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `Erro na API Anthropic: ${response.status}`);
            }
            
            const data = await response.json();
            return data.content[0].text;
        }
        // Hugging Face
        else if (apiService === "huggingface") {
            const response = await fetch("https://api-inference.huggingface.co/models/" + apiModel, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    inputs: `${tomoPersonality}\n\nUsuário: ${input}\n\nTomo:`,
                    parameters: {
                        temperature: 0.7,
                        max_new_tokens: 150,
                        return_full_text: false
                    }
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Erro na API Hugging Face: ${response.status} - ${error}`);
            }
            
            const data = await response.json();
            return data[0]?.generated_text || "Hmm, parece que estou com problemas para pensar no momento.";
        }
        // Cohere
        else if (apiService === "cohere") {
            const response = await fetch("https://api.cohere.ai/v1/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: apiModel,
                    prompt: `${tomoPersonality}\n\nUsuário: ${input}\n\nTomo:`,
                    max_tokens: 150,
                    temperature: 0.7,
                    k: 0,
                    stop_sequences: ["\n"],
                    return_likelihoods: "NONE"
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erro na API Cohere: ${response.status}`);
            }
            
            const data = await response.json();
            return data.generations[0]?.text || "Hmm, parece que estou com problemas para pensar no momento.";
        }
        // Google Gemini AI
        else if (apiService === "gemini") {
            // Verifica se está em período de cooldown de rate limit
            const limitStatus = geminiRateLimit.checkLimit();
            if (limitStatus.limited) {
                return `Nyaa~ Estou em um período de descanso obrigatório devido ao limite da API! 😴 Por favor, espere mais ${limitStatus.remainingSeconds} segundos antes de tentar novamente.`;
            }
            
            // API do Google Gemini com melhor gestão de limite de taxa
            const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${apiKey}`;
            
            // Implementando um atraso maior antes de fazer a chamada para reduzir problemas de rate limit
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Configuração de retry para rate limit
            let attempts = 0;
            const maxAttempts = 2; // Reduzido para não sobrecarregar a API
            let response;
            
            while (attempts < maxAttempts) {
                try {
                    response = await fetch(apiEndpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            contents: [
                                {
                                    role: "user",
                                    parts: [
                                        {
                                            // Reduzindo ainda mais o tamanho do prompt para economizar tokens
                                            text: `${tomoPersonality.substring(0, 300)}\n\nAtue como o Tomo e responda à mensagem do usuário: ${input}`
                                        }
                                    ]
                                }
                            ],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 100, // Reduzido para evitar exceder limites
                                topP: 0.95,
                                topK: 40
                            },
                            safetySettings: [
                                {
                                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                    threshold: "BLOCK_NONE"
                                }
                            ]
                        })
                    });
                    
                    // Se a resposta for bem-sucedida, saia do loop
                    if (response.ok) break;
                    
                    // Se o erro for de rate limit (429), configure o cooldown e pare de tentar
                    if (response.status === 429) {
                        console.log("Rate limit detectado pelo Gemini API");
                        // Define um período de cooldown de 60 segundos
                        geminiRateLimit.setLimit(60);
                        throw new Error("Limite de requisições da API Gemini excedido (429)");
                    } else {
                        // Para outros erros, não tente novamente
                        break;
                    }
                } catch (e) {
                    console.error("Erro ao fazer requisição Gemini:", e);
                    // Se for um erro de rate limit conhecido, pare de tentar
                    if (e.message.includes("429") || e.message.includes("rate") || e.message.includes("limit")) {
                        geminiRateLimit.lastError = e;
                        break;
                    }
                    // Para outros erros, tente novamente com pausa
                    if (attempts < maxAttempts - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    attempts++;
                }
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `Erro na API Gemini: ${response.status}`);
            }
            
            // Processa a resposta do Gemini
            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return responseText || "Hmm, parece que estou com problemas para pensar no momento.";
        }
        // Caso de API não suportada
        else {
            throw new Error("Serviço de API não suportado");
        }
        
    } catch (error) {
        console.error("Erro na API:", error);
            
        // Verifica se o erro está relacionado com autenticação
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes("auth") || 
            errorMsg.includes("key") || 
            errorMsg.includes("token") || 
            errorMsg.includes("permission") || 
            errorMsg.includes("unauthorized") ||
            errorMsg.includes("invalid") || 
            errorMsg.includes("401") || 
            errorMsg.includes("403")) {
            return `Oops! Parece que temos um problema com a chave da API: ${error.message}. Por favor, verifique se sua chave está correta e tente novamente! 🔑❌`;
        } else if (errorMsg.includes("rate") || errorMsg.includes("limit") || errorMsg.includes("429")) {
            // Se for um erro de rate limit e for a API do Gemini, configura o cooldown
            if (apiService === "gemini" && !geminiRateLimit.isLimited) {
                // Define um período de cooldown de 60 segundos se não estiver já em cooldown
                geminiRateLimit.setLimit(60);
                // Atualiza o indicador visual de status
                updateGeminiStatus();
            }
            
            // Verifica se existe tempo de cooldown
            const limitStatus = geminiRateLimit.checkLimit();
            if (limitStatus.limited) {
                return `Nyaa~ Estou um pouco cansada! O serviço de API está limitando as requisições. Vou precisar descansar por ${limitStatus.remainingSeconds} segundos antes de tentar novamente! 😴 Pode tentar de novo depois, por favor?`;
            } else {
                return `Nyaa~ Estou um pouco cansada! O serviço de API está limitando as requisições (rate limit). Por favor, espere um pouquinho antes de tentar novamente! 😴 Talvez em 1-2 minutos eu esteja recuperada!`;
            }
        } else if (errorMsg.includes("network") || errorMsg.includes("timeout") || errorMsg.includes("connection")) {
            return `Hmm, parece que temos um problema de conexão! Verifique sua internet e tente novamente. 📶❓`;
        } else {
            return `Ops! Tive um problema ao pensar: ${error.message}. Tente novamente mais tarde? 🌱`;
        }
    }
}

// Função para testar a conexão com a API selecionada
async function testApiConnection() {
    try {
        // Cada serviço tem seu próprio método de teste
        switch (apiService) {
            case "openai":
                const openaiResponse = await fetch("https://api.openai.com/v1/models", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`
                    }
                });
                return openaiResponse.ok;
                
            case "anthropic":
                // Anthropic não tem endpoint simples de verificação, 
                // fazemos uma requisição mínima
                const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                        "anthropic-version": "2023-06-01"
                    },
                    body: JSON.stringify({
                        model: apiModel,
                        messages: [{ role: "user", content: "Hello" }],
                        max_tokens: 1
                    })
                });
                return anthropicResponse.ok;
                
            case "huggingface":
                const huggingfaceResponse = await fetch("https://huggingface.co/api/whoami", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`
                    }
                });
                return huggingfaceResponse.ok;
                
            case "cohere":
                const cohereResponse = await fetch("https://api.cohere.ai/v1/tokenize", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: "Test",
                        model: apiModel
                    })
                });
                return cohereResponse.ok;
                
            case "gemini":
                // Para o Gemini, podemos verificar se a API key funciona com um modelo básico
                const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                const geminiResponse = await fetch(geminiEndpoint);
                return geminiResponse.ok;
                
            default:
                return false;
        }
    } catch (error) {
        console.error("Erro ao testar conexão API:", error);
        return false;
    }
}

// Função para adicionar interação entre elementos decorativos e o mascote
function initDecorationsMascotInteraction() {
    const mascot = document.getElementById('capivara-gif');
    const decorations = document.querySelectorAll('.decoration');
    
    decorations.forEach(decoration => {
        // Quando o mouse entra no elemento decorativo
        decoration.addEventListener('mouseenter', function() {
            // Determina a posição do elemento em relação ao mascote
            const decorationRect = this.getBoundingClientRect();
            const mascotRect = mascot.getBoundingClientRect();
            
            // Calcula o centro dos elementos
            const decorationCenterX = decorationRect.left + (decorationRect.width / 2);
            const mascotCenterX = mascotRect.left + (mascotRect.width / 2);
            
            // Determina se o elemento está à esquerda ou à direita do mascote
            if (decorationCenterX < mascotCenterX) {
                // O elemento está à esquerda, o mascote olha para a esquerda
                mascot.style.transform = 'scaleX(-1) scale(1.05)';
            } else {
                // O elemento está à direita, o mascote olha para a direita (normal)
                mascot.style.transform = 'scaleX(1) scale(1.05)';
            }
            
            // Adiciona uma classe que indica que o mascote está prestando atenção
            mascot.classList.add('attentive');
        });
        
        // Quando o mouse sai do elemento decorativo
        decoration.addEventListener('mouseleave', function() {
            // Restaura o estado normal do mascote
            setTimeout(() => {
                mascot.style.transform = '';
                mascot.classList.remove('attentive');
            }, 500); // Pequeno delay para que pareça mais natural
        });
    });
}

// Inicia a interação entre decorações e mascote quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Chama a função de inicialização
    initDecorationsMascotInteraction();
    
    const decorations = document.querySelectorAll('.decoration');
    const decorationMessages = {
        grass: [
            'Nham nham! Adoro um matinho fresquinho! 🌿',
            'Nada como grama suculenta para uma capivara feliz! 🌿',
            'Esta grama está tão macia e gostosa! 🌿',
            'Hmm, petisco verde delicioso! 🌿',
            'Uma mordidinha nessa grama... perfeito! 🌿'
        ],
        flower: [
            'Que florzinha linda! Flores são as joias da natureza! 🌸',
            'Esta flor tem um perfume incrível! 🌸',
            'Olha que linda! Cores vibrantes como minha personalidade! 🌸',
            'Flores me deixam tão feliz! Quase tão feliz quanto estar conversando com você! 🌸',
            'As flores são o sorriso da natureza! 🌸'
        ],
        leaf: [
            'Folhas são refrescantes no calor! 🍃',
            'Adoro brincar com as folhas ao vento! 🍃',
            'Folhinhas dançando ao vento... que gracinha! 🍃',
            'Esta folha parece ótima para um lanchinho! 🍃',
            'As folhas me fazem lembrar do rio, onde nós capivaras adoramos nadar! 🍃'
        ],
        sprout: [
            'Olha o brotinho! Está crescendo junto com nosso papo! 🌱',
            'Um bebê plantinha! Precisa de carinho para crescer forte! 🌱',
            'Este brotinho um dia será uma planta enorme! 🌱',
            'Pequenas coisas crescem e se tornam grandes, assim como nossa amizade! 🌱',
            'Awww, que fofinho este brotinho! 🌱'
        ]
    };
    
    // Inicializa variáveis de acompanhamento
    let lastClickedDecoration = null;
    let lastClickTime = 0;
    
    // Adiciona efeitos sonoros e mensagens para cada elemento decorativo
    decorations.forEach(decoration => {
        // Evento de clique nos elementos decorativos
        decoration.addEventListener('click', function(e) {
            // Impede que o evento de clique se propague para o mascote
            e.stopPropagation();
            
            // Obtém o tipo básico (grass, flower, leaf, sprout)
            const elementClass = this.classList[1]; // grass-left, flower-right, etc.
            const elementType = elementClass.split('-')[0]; // grass, flower, etc
            
            // Adiciona classe de animação e a removes após a animação
            const svgElement = this.querySelector('.svg-decoration');
            svgElement.classList.add('animated');
            
            // Previne múltiplos cliques rápidos no mesmo elemento
            const now = Date.now();
            if (lastClickedDecoration === this && now - lastClickTime < 2000) {
                return; // Ignora cliques frequentes no mesmo elemento
            }
            
            // Atualiza rastreamento de clique
            lastClickedDecoration = this;
            lastClickTime = now;
            
            // Seleciona uma mensagem aleatória do tipo apropriado
            const messages = decorationMessages[elementType] || [];
            if (messages.length > 0) {
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                
                // Adiciona a mensagem ao chat
                const botMessageElement = document.createElement("div");
                botMessageElement.className = "bot-message";
                botMessageElement.textContent = randomMessage;
                chatBox.appendChild(botMessageElement);
                chatBox.scrollTop = chatBox.scrollHeight;
                
                // Faz o elemento "saltar" com uma animação mais forte
                this.style.animation = 'bounce 0.8s ease';
                
                // Remove classes de animação após elas terminarem
                setTimeout(() => {
                    this.style.animation = '';
                    svgElement.classList.remove('animated');
                }, 800);
                
                // Faz o mascote reagir olhando na direção do elemento
                const mascot = document.getElementById('capivara-gif');
                if (elementClass.includes('left')) {
                    mascot.style.transform = 'scaleX(-1)'; // Vira para a esquerda
                } else if (elementClass.includes('right')) {
                    mascot.style.transform = 'scaleX(1)'; // Vira para a direita
                }
                
                // Restaura o mascote após um tempo
                setTimeout(() => {
                    mascot.style.transform = '';
                }, 2000);
            }
        });
    });
    
    // Adicionar efeito de "flutuação" alternada
    function startFloatingEffect() {
        decorations.forEach((decoration, index) => {
            // Diferentes tempos de início para cada elemento
            setTimeout(() => {
                // Inicia com uma posição aleatória no ciclo de animação
                const randomStart = Math.random() * 100;
                const svgElement = decoration.querySelector('.svg-decoration');
                
                if (svgElement) {
                    svgElement.style.animationDelay = `-${randomStart}%`;
                }
            }, index * 200); // Efeito escalonado
        });
    }
    
    // Inicia efeitos de flutuação após carregar a página
    startFloatingEffect();
});

// Função para mostrar o botão de poema quando Gemini 2.0/2.5 Pro estiver ativo
function togglePoemButton() {
    // Verifica se o botão já existe
    let poemButton = document.getElementById("poem-button");
    
    // Se o modelo for Gemini 2.0/2.5 Pro e o botão não existir, cria um
    if (isGemini20()) {
        if (!poemButton) {
            // Cria o botão de poema
            poemButton = document.createElement("button");
            poemButton.id = "poem-button";
            poemButton.className = "poem-button";
            
            // Adiciona estrutura interna para permitir minimização
            poemButton.innerHTML = `<span class="emoji">📝</span><span class="full-text"> Poema</span>`;
            poemButton.title = "Clique para ver um poema da Tomo (Alt+Click para minimizar)";
            
            // Adiciona o evento de clique
            poemButton.addEventListener("click", function(e) {
                // Se estiver pressionando Alt, alterna o modo minimizado
                if (e.altKey) {
                    this.classList.toggle("minimized");
                    if (this.classList.contains("minimized")) {
                        this.title = "Poema (Alt+click para expandir)";
                    } else {
                        this.title = "Poema (Alt+click para minimizar)";
                    }
                    return;
                }
                
                // Adiciona um poema quando clicado
                const poem = getRandomPoem();
                addMessage("Aqui está um poeminha especial que escrevi para você! 🌸✨", "bot-message");
                setTimeout(() => {
                    addMessage(poem, "bot-message poem");
                    
                    // Rola a janela para garantir que o poema seja visível
                    chatBox.scrollTop = chatBox.scrollHeight;
                }, 500);
                
                // Efeito de clique
                this.classList.add("clicked");
                setTimeout(() => {
                    this.classList.remove("clicked");
                }, 200);
            });
            
            // Adiciona o botão ao container do chat
            const chatContainer = document.querySelector(".chatbot-container");
            chatContainer.appendChild(poemButton);
            
            // Animação de entrada
            poemButton.style.animation = "popIn 0.5s forwards";
        } else {
            // Se já existe, apenas mostra
            poemButton.style.display = "block";
        }
    } else if (poemButton) {
        // Se não for Gemini 2.0/2.5 Pro mas o botão existir, esconde
        poemButton.style.display = "none";
    }
}

// Chama a função quando o modelo mudar
modelSelect.addEventListener("change", function() {
    // Atualiza o modelo selecionado
    apiModel = this.value;
    
    // Verifica se deve mostrar o botão de poema
    togglePoemButton();
});

// Também chama ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    togglePoemButton();
    addPoemButtonTip();
});