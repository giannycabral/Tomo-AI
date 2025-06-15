#!/bin/bash

echo "=== Iniciando o Tomo-AI Backend ==="

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "Error: Node.js não encontrado! Por favor, instale o Node.js primeiro."
    exit 1
fi

# Navega para a pasta backend
cd backend

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

# Verifica se existe arquivo .env
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    echo "Por favor, edite o arquivo backend/.env e adicione sua chave API Gemini real."
fi

# Inicia o servidor
echo "Iniciando o servidor Tomo-AI..."
npm start
