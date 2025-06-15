/* 
 * Script auxiliar para diagnosticar e corrigir problemas de carregamento de imagens
 * Adicione este script antes do script.js no HTML
 */

// Função para verificar se a imagem carregou e aplicar correções
function verificarImagemCapivara() {
  const mascotGif = document.getElementById('capivara-gif');
  const capivaraFallback = document.getElementById('capivara-fallback');
  
  // Se a imagem não carregou corretamente
  if (!mascotGif.complete || mascotGif.naturalHeight === 0) {
    console.warn('Imagem da capivara não carregou. Tentando caminhos alternativos...');
    
    // Tenta diferentes caminhos possíveis
    const caminhos = [
      '/images/capivara1.gif',            // Caminho absoluto
      './images/capivara1.gif',           // Caminho relativo
      '../images/capivara1.gif',          // Subir um nível
      window.location.origin + '/images/capivara1.gif', // URL completa
      window.location.href.split('/').slice(0, -1).join('/') + '/images/capivara1.gif', // Baseado no URL atual
      'http://localhost:3000/images/capivara1.gif', // Direto do servidor
      '/api/capivara-image'               // Endpoint específico de API
    ];
    
    // Tenta cada caminho até encontrar um que funcione
    tryNextPath(mascotGif, caminhos, 0, capivaraFallback);
  } else {
    console.log('Imagem da capivara carregada com sucesso:', mascotGif.src);
  }
}

// Função recursiva para tentar diferentes caminhos
function tryNextPath(imgElement, paths, index, fallbackElement) {
  if (index >= paths.length) {
    console.error('Todos os caminhos falharam. Mostrando fallback.');
    imgElement.style.display = 'none';
    fallbackElement.style.display = 'block';
    return;
  }
  
  console.log(`Tentando caminho: ${paths[index]}`);
  imgElement.src = paths[index];
  
  imgElement.onload = function() {
    console.log('Imagem carregada com sucesso usando:', paths[index]);
  };
  
  imgElement.onerror = function() {
    console.warn(`Falha ao carregar usando: ${paths[index]}`);
    tryNextPath(imgElement, paths, index + 1, fallbackElement);
  };
}

// Executa a verificação quando a página termina de carregar
document.addEventListener('DOMContentLoaded', function() {
  // Aguarda um pouco para garantir que a página tenha carregado completamente
  setTimeout(verificarImagemCapivara, 500);
  
  // Para diagnóstico
  const baseUrl = window.location.origin;
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    fetch(`${baseUrl}/api/file-check`)
      .then(res => res.json())
      .then(data => {
        console.log('Diagnóstico de arquivos:', data);
      })
      .catch(err => console.error('Erro no diagnóstico:', err));
  }
});
