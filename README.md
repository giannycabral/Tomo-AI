# 🦫 Tomo-AI: Chatbot Capivara com Google Gemini

<div align="center">
  
  ![Tomo-AI Banner](https://github.com/user-attachments/assets/c5161afb-7718-4c88-b258-757ff2dcd3ec)
  
  *Um chatbot kawaii com tema de capivara usando a API Google Gemini para conversas fofas e inteligentes*
  
  [![Status do Projeto](https://img.shields.io/badge/Status-Ativo-brightgreen.svg)](https://github.com/seu-usuario/tomo-ai)
  [![Licença](https://img.shields.io/badge/Licença-MIT-blue.svg)](LICENSE)
  [![Gemini API](https://img.shields.io/badge/API-Google%20Gemini-orange.svg)](https://ai.google.dev/)
  
</div>

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Configuração Avançada](#-configuração-avançada)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Design Visual](#-design-visual)
- [Licença](#-licença)

## 🌱 Visão Geral

Tomo-AI é um chatbot interativo com tema de capivara kawaii que utiliza a API do Google Gemini para oferecer conversas inteligentes e fofas. O projeto foi desenvolvido como uma demonstração de integração com a API Gemini através de um backend Node.js seguro e um frontend interativo estilizado.

## 🌸 Recursos

O Tomo é uma capivara fofa e amigável que oferece:

- **Conversas Interativas**: Personalidade kawaii e fofa com respostas contextuais inteligentes
- **Coleção de Piadas**: Piadas exclusivas sobre capivaras para momentos divertidos
- **Interface Adorável**: Design floral e kawaii com elementos animados
- **Decorações Interativas**: Elementos florais e naturais que respondem ao clique e interação
- **Personalidade Única**: Conversação no estilo de uma capivara relaxada e amigável

## 💻 Tecnologias

<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5" />
      <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3" />
      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Backend</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
      <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express" />
      <img src="https://img.shields.io/badge/dotenv-ECD53F?style=flat&logo=dotenv&logoColor=black" alt="dotenv" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>API</strong></td>
    <td>
      <strong>Google Gemini</strong> com suporte a múltiplos modelos:
      <ul>
        <li><strong>Gemini 1.5 Pro</strong> - Modelo padrão balanceado</li>
        <li><strong>Gemini 2.0 Flash</strong> - Versão mais rápida e eficiente</li>
        <li><strong>Gemini Pro</strong> - Modelo legado para compatibilidade</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Recursos</strong></td>
    <td>
      <ul>
        <li><strong>Fetch API</strong> para comunicação entre frontend e backend</li>
        <li><strong>Session Storage</strong> para armazenamento seguro temporário de chaves API</li>
        <li><strong>Animações CSS</strong> para efeitos kawaii e interativos</li>
        <li><strong>Rate Limiting</strong> inteligente com retry e backoff exponencial</li>
        <li><strong>Design responsivo</strong> com tema natural floral</li>
      </ul>
    </td>
  </tr>
</table>

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Uma [chave API do Google Gemini](https://ai.google.dev/) para acessar os serviços de IA

### Configuração

<details>
<summary>💻 Configurar o Backend</summary>

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/tomo-ai.git
   cd tomo-ai
   ```

2. **Instale as dependências do servidor**
   ```bash
   cd backend
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` criado:
   ```
   GEMINI_API_KEY=sua_chave_api_aqui
   PORT=3000
   ```
   > 💡 **Dica**: Este passo é opcional - você também pode configurar a chave API diretamente pela interface.

4. **Inicie o servidor**
   ```bash
   npm start
   ```
   
   O servidor estará rodando em [http://localhost:3000](http://localhost:3000)
</details>

## 🎮 Uso

<div align="center">
  <img src="https://github.com/user-attachments/assets/c5161afb-7718-4c88-b258-757ff2dcd3ec" width="500" alt="Tomo-AI Interface">
</div>

### 🌟 Começando

1. **Acesse o aplicativo**
   - Abra [http://localhost:3000](http://localhost:3000) no navegador, ou
   - Abra o arquivo `index.html` diretamente se preferir

2. **Configure sua chave API**
   - Clique no ícone ⚙️ no canto superior direito
   - Insira sua chave API do Google Gemini
   - Selecione o modelo Gemini de sua preferência
   - Clique em "Salvar" para validar a configuração

3. **Comece a conversar!**
   - Digite sua mensagem na caixa de texto
   - Pressione "Enviar" ou a tecla Enter
   - Espere o Tomo responder com sua personalidade de capivara kawaii

### 🎨 Recursos Interativos

- **Mascote Interativo**: Clique na capivara para ver animações de bolhas e receber mensagens aleatórias
- **Decorações Vivas**: Todos os elementos florais e plantas respondem ao clique com animações e efeitos especiais
- **Elementos Flutuantes**: Observe as decorações que flutuam suavemente pelo fundo da página
- **Surpresas Visuais**: Descubra pequenas interações ocultas durante sua conversa com o Tomo

### 🔑 Gerenciamento de Chave API

- Sua chave API é armazenada apenas na memória temporária do navegador (sessionStorage)
- A chave nunca é salva em arquivos permanentes nem enviada para servidores externos
- Se você fechar o navegador ou guia, precisará inserir sua chave novamente
- Como alternativa, você pode configurar a chave no arquivo `.env` do backend

## ⚙️ Configuração Avançada

### 🤖 Modelos de IA Compatíveis

<table>
  <tr>
    <th>Modelo</th>
    <th>Descrição</th>
    <th>Caso de Uso</th>
  </tr>
  <tr>
    <td><b>gemini-1.5-pro</b><br><i>(padrão)</i></td>
    <td>Modelo mais recente da API Gemini com equilíbrio entre qualidade e velocidade</td>
    <td>Uso geral, respostas detalhadas</td>
  </tr>
  <tr>
    <td><b>gemini-2.0-flash</b></td>
    <td>Modelo mais rápido e eficiente, ideal para respostas curtas</td>
    <td>Interações rápidas, baixa latência</td>
  </tr>
  <tr>
    <td><b>gemini-pro</b></td>
    <td>Modelo legado para compatibilidade com chaves API mais antigas</td>
    <td>Fallback quando outros modelos não estiverem disponíveis</td>
  </tr>
</table>

> 💡 **Dica**: Se o modelo padrão não estiver disponível para sua chave API, o sistema exibirá uma mensagem detalhada sugerindo alternativas.

### 🛡️ Sistema de Rate Limiting Inteligente

O Tomo-AI implementa um sistema sofisticado de gestão de limites de taxa para garantir uma experiência fluida mesmo com as restrições da API Gemini:

<details>
<summary><b>Recursos de Proteção Implementados</b> (Clique para expandir)</summary>

#### 🕒 Throttling Automático
- Garante um intervalo mínimo de 1 segundo entre requisições consecutivas
- Evita erros 429 (Too Many Requests) por excesso de frequência

#### 🔄 Retry com Backoff Exponencial
Quando uma requisição falha devido aos limites de taxa, o sistema:
1. Aguarda progressivamente mais tempo entre tentativas:
   - 1ª tentativa: espera 2 segundos
   - 2ª tentativa: espera 4 segundos
   - 3ª tentativa: espera 8 segundos
2. Realiza até 3 tentativas antes de reportar erro ao usuário
3. Mostra mensagens amigáveis explicando o que está acontecendo

#### 📊 Tratamento Inteligente de Erros
- Mensagens de erro contextualizadas para diferentes cenários
- Sugestões de resolução baseadas no tipo específico de erro
- Transformação de erros técnicos em mensagens amigáveis para o usuário
</details>

Este sistema proporciona uma experiência significativamente mais robusta, evitando que problemas temporários com a API interrompam a interação do usuário.

## 📁 Estrutura do Projeto

```
tomo-ai/
├── index.html              # Interface de usuário principal
├── css/                    # Estilos do aplicativo
│   ├── style.css           # Estilos principais
│   ├── animations.css      # Animações e efeitos
│   ├── decorations.css     # Estilos dos elementos decorativos
│   └── modal.css           # Estilos do modal de configurações
├── js/                     # JavaScript frontend
│   ├── script.js           # Lógica principal do aplicativo
│   └── image-helper.js     # Utilitários para gerenciamento de imagens
├── images/                 # Recursos visuais
│   ├── capivara1.gif       # GIF animado do mascote Tomo
│   └── svg/                # Elementos decorativos vetoriais
│       ├── flower.svg
│       ├── leaf.svg
│       ├── grass.svg
│       └── sprout.svg
└── backend/                # Servidor Node.js
    ├── server.js           # API e lógica do servidor
    ├── package.json        # Dependências do backend
    └── .env                # Configurações e chave API (opcional)
```

### 🦫 Personalização da Capivara

A personalidade e comportamento do Tomo podem ser personalizados:

- **Personalidade**: Edite a constante `tomoPersonality` no arquivo `backend/server.js`
- **Piadas**: Adicione novas piadas de capivara no array `capivaraJokes` em `js/script.js`
- **Comportamento**: Ajuste as configurações de temperatura e outras opções de geração no objeto `generationConfig` em `backend/server.js`

## 🎨 Design Visual

<div align="center">
  <img src="https://github.com/user-attachments/assets/c5161afb-7718-4c88-b258-757ff2dcd3ec" width="300" alt="Tomo-AI Interface">
</div>

O Tomo-AI apresenta um design visual kawaii e floral cuidadosamente elaborado:

| Elemento | Descrição |
|----------|-----------|
| **🌿 Tema Natural** | Elementos florais e naturais distribuídos estrategicamente |
| **💫 Interatividade** | Todos os elementos decorativos respondem a cliques com animações |
| **✨ Animações** | Movimentos suaves e orgânicos para uma experiência relaxante |
| **🫧 Bolhas** | Efeitos de bolhas em interações com a capivara e elementos decorativos |
| **💬 Mensagens** | Bolhas de chat estilizadas com elementos kawaii e cores temáticas |
| **🏵️ Decorações** | Elementos flutuantes que adicionam vida e movimento à página |
| **🎨 Paleta** | Cores inspiradas na natureza com tons suaves e harmoniosos |

A interface foi projetada para ser visualmente agradável e também funcional, com cada elemento visual contribuindo para a experiência geral da interação com o Tomo.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE) - veja o arquivo LICENSE para detalhes.
