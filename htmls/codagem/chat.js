// Dados de exemplo para as conversas
const conversas = {
    1: {
        usuario: "Maria Silva",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80",
        status: "Online",
        mensagens: [
            {
                tipo: "recebida",
                conteudo: "Olá! Tudo bem?",
                hora: "10:25"
            },
            {
                tipo: "enviada",
                conteudo: "Oi Maria! Tudo ótimo, e com você?",
                hora: "10:26"
            },
            {
                tipo: "recebida",
                conteudo: "Estou bem também! Vamos combinar os detalhes da nossa viagem para Chapada Diamantina?",
                hora: "10:28"
            },
            {
                tipo: "enviada",
                conteudo: "Claro! Já reservei as passagens. Partimos dia 15 às 08:00.",
                hora: "10:30"
            }
        ]
    },
    2: {
        usuario: "João Santos",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80",
        status: "Offline",
        mensagens: [
            {
                tipo: "recebida",
                conteudo: "Encontrei uma promoção incrível para Fernando de Noronha!",
                hora: "Ontem 14:20"
            }
        ]
    },
    3: {
        usuario: "Ana Oliveira",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80",
        status: "Online",
        mensagens: [
            {
                tipo: "enviada",
                conteudo: "Confirmado! Nos vemos no aeroporto às 06:00",
                hora: "Seg 09:15"
            }
        ]
    }
};

// Estado atual do chat
let conversaAtual = 1;
let mensagens = [...conversas[1].mensagens];

// Elementos DOM
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const btnSend = document.getElementById('btnSend');
const conversaItems = document.querySelectorAll('.conversa-item');
const novaConversaBtn = document.getElementById('novaConversa');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarConversa(conversaAtual);
    configurarEventListeners();
    garantirScrollFuncional();
});

// Garantir que o scroll funcione corretamente
function garantirScrollFuncional() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Forçar cálculo do scroll height
    setTimeout(() => {
        chatMessages.style.overflowY = 'auto';
        chatMessages.style.height = 'auto';
        
        // Adicionar mensagens de exemplo para demonstrar o scroll
        adicionarMensagensDeExemplo();
    }, 100);
}

// Adicionar mensagens de exemplo para preencher o chat
function adicionarMensagensDeExemplo() {
    const mensagensExemplo = [
        {
            tipo: "recebida",
            conteudo: "Olá! Como você está?",
            hora: "10:00"
        },
        {
            tipo: "enviada", 
            conteudo: "Estou bem, obrigado! E você?",
            hora: "10:01"
        },
        {
            tipo: "recebida",
            conteudo: "Também estou bem! Estou animado para nossa viagem",
            hora: "10:02"
        },
        {
            tipo: "enviada",
            conteudo: "Eu também! Já separou as coisas?",
            hora: "10:03"
        },
        {
            tipo: "recebida",
            conteudo: "Sim, já estou com quase tudo pronto. Só falta comprar alguns snacks para a viagem",
            hora: "10:04"
        },
        {
            tipo: "enviada",
            conteudo: "Ótimo! Eu vou levar água e algumas frutas também",
            hora: "10:05"
        },
        {
            tipo: "recebida",
            conteudo: "Perfeito! Lembra de levar protetor solar, vai fazer bastante sol",
            hora: "10:06"
        },
        {
            tipo: "enviada",
            conteudo: "Boa lembrança! Vou colocar na mochila agora mesmo",
            hora: "10:07"
        },
        {
            tipo: "recebida",
            conteudo: "E sobre o ponto de encontro, confirmamos no aeroporto às 6h?",
            hora: "10:08"
        },
        {
            tipo: "enviada",
            conteudo: "Sim, combina perfeito! Chegarei às 5:45 para não correr risco",
            hora: "10:09"
        },
        {
            tipo: "recebida",
            conteudo: "Excelente! Eu também vou chegar cedo. Melhor prevenir",
            hora: "10:10"
        },
        {
            tipo: "enviada",
            conteudo: "Combinado então! Nos vemos no saguão principal",
            hora: "10:11"
        },
        {
            tipo: "recebida",
            conteudo: "Perfeito! Estou ansioso para essa aventura",
            hora: "10:12"
        },
        {
            tipo: "enviada",
            conteudo: "Eu também! Vai ser incrível explorar novos lugares juntos",
            hora: "10:13"
        },
        {
            tipo: "recebida",
            conteudo: "Com certeza! Tenho várias dicas de lugares para visitar",
            hora: "10:14"
        },
        {
            tipo: "enviada",
            conteudo: "Que bom! Pode me enviar depois que chegar em casa",
            hora: "10:15"
        },
        {
            tipo: "recebida",
            conteudo: "Claro! Vou preparar uma listinha com os melhores pontos turísticos",
            hora: "10:16"
        },
        {
            tipo: "enviada",
            conteudo: "Maravilha! Já estou imaginando as fotos que vamos tirar",
            hora: "10:17"
        },
        {
            tipo: "recebida",
            conteudo: "Sim! Vai ser memorável. Leve sua câmera também",
            hora: "10:18"
        },
        {
            tipo: "enviada",
            conteudo: "Já está na lista! Não esqueci da câmera e do tripé",
            hora: "10:19"
        },
        {
            tipo: "recebida",
            conteudo: "Perfeito! Acho que estamos com tudo organizado então",
            hora: "10:20"
        },
        {
            tipo: "enviada",
            conteudo: "Sim! Só aguardar o grande dia agora. Obrigado por tudo!",
            hora: "10:21"
        },
        {
            tipo: "recebida",
            conteudo: "Eu que agradeço! Vai ser uma viagem fantástica",
            hora: "10:22"
        },
        {
            tipo: "enviada",
            conteudo: "Combinado! Qualquer coisa me avise. Estarei online",
            hora: "10:23"
        },
        {
            tipo: "recebida",
            conteudo: "Ótimo! Também estarei disponível. Boa semana!",
            hora: "10:24"
        }
    ];

    // Adicionar apenas se não houver muitas mensagens
    if (mensagens.length < 10) {
        mensagensExemplo.forEach(msg => {
            mensagens.push(msg);
            adicionarMensagem(msg.conteudo, msg.tipo, msg.hora);
        });
    }
}

// Atualizar função carregarConversa para garantir scroll
function carregarConversa(conversaId) {
    const conversa = conversas[conversaId];
    
    // Atualizar header do chat
    document.querySelector('.chat-user-info h3').textContent = conversa.usuario;
    document.querySelector('.user-avatar img').src = conversa.avatar;
    document.querySelector('.user-status').textContent = conversa.status;

    // Limpar mensagens atuais
    chatMessages.innerHTML = '';

    // Carregar mensagens
    mensagens.forEach(mensagem => {
        adicionarMensagem(mensagem.conteudo, mensagem.tipo, mensagem.hora);
    });

    // Forçar atualização do scroll
    setTimeout(() => {
        scrollParaBaixo();
        
        // Adicionar classe se for uma conversa longa
        if (mensagens.length > 15) {
            chatMessages.classList.add('long-conversation');
        } else {
            chatMessages.classList.remove('long-conversation');
        }
    }, 100);
}

// Função scroll para baixo atualizada
function scrollParaBaixo() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Configurar event listeners
function configurarEventListeners() {
    // Enviar mensagem ao clicar no botão
    btnSend.addEventListener('click', enviarMensagem);
    
    // Enviar mensagem ao pressionar Enter
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });

    // Alternar conversas
    conversaItems.forEach(item => {
        item.addEventListener('click', function() {
            const conversaId = parseInt(this.getAttribute('data-conversa'));
            alternarConversa(conversaId);
        });
    });

    // Nova conversa
    novaConversaBtn.addEventListener('click', function() {
        alert('Funcionalidade de nova conversa será implementada em breve!');
    });

    // Botões de ação
    document.querySelector('.btn-attach').addEventListener('click', function() {
        alert('Anexar arquivo - funcionalidade em desenvolvimento');
    });

    document.querySelector('.btn-emoji').addEventListener('click', function() {
        alert('Selecionar emoji - funcionalidade em desenvolvimento');
    });

    document.querySelector('.btn-location').addEventListener('click', function() {
        compartilharLocalizacao();
    });
}

// Alternar entre conversas
function alternarConversa(conversaId) {
    // Remover classe active de todas as conversas
    conversaItems.forEach(item => {
        item.classList.remove('active');
    });

    // Adicionar classe active à conversa selecionada
    document.querySelector(`[data-conversa="${conversaId}"]`).classList.add('active');

    // Atualizar conversa atual e carregar mensagens
    conversaAtual = conversaId;
    mensagens = [...conversas[conversaId].mensagens];
    carregarConversa(conversaId);
}

// Carregar conversa no chat
function carregarConversa(conversaId) {
    const conversa = conversas[conversaId];
    
    // Atualizar header do chat
    document.querySelector('.chat-user-info h3').textContent = conversa.usuario;
    document.querySelector('.user-avatar img').src = conversa.avatar;
    document.querySelector('.user-status').textContent = conversa.status;

    // Limpar mensagens atuais
    chatMessages.innerHTML = '';

    // Carregar mensagens
    mensagens.forEach(mensagem => {
        adicionarMensagem(mensagem.conteudo, mensagem.tipo, mensagem.hora);
    });

    // Rolagem para a última mensagem
    scrollParaBaixo();
}

// Adicionar mensagem ao chat
function adicionarMensagem(conteudo, tipo, hora = null) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem ${tipo}`;
    
    const horaAtual = hora || obterHoraAtual();
    
    mensagemDiv.innerHTML = `
        <div class="mensagem-conteudo">${conteudo}</div>
        <div class="mensagem-hora">${horaAtual}</div>
    `;

    chatMessages.appendChild(mensagemDiv);
    scrollParaBaixo();
}

// Enviar mensagem
function enviarMensagem() {
    const texto = chatInput.value.trim();
    
    if (texto === '') return;

    // Adicionar mensagem enviada
    adicionarMensagem(texto, 'enviada');
    
    // Simular resposta automática após 1-3 segundos
    setTimeout(() => {
        const respostas = [
            "Interessante! Vamos combinar os detalhes.",
            "Ótimo! Estou animado para essa viagem.",
            "Perfeito! Já anotei aqui.",
            "Vamos verificar as opções disponíveis."
        ];
        const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
        adicionarMensagem(respostaAleatoria, 'recebida');
    }, 1000 + Math.random() * 2000);

    // Limpar input
    chatInput.value = '';
}

// Compartilhar localização
function compartilharLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const mensagem = `📍 Minha localização: https://maps.google.com/?q=${lat},${lng}`;
                adicionarMensagem(mensagem, 'enviada');
            },
            function(error) {
                alert('Não foi possível obter a localização: ' + error.message);
            }
        );
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
    }
}

// Obter hora atual formatada
function obterHoraAtual() {
    const agora = new Date();
    return agora.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Scroll automático para a última mensagem
function scrollParaBaixo() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simular mensagens em tempo real (para demonstração)
setInterval(() => {
    if (Math.random() < 0.1) { // 10% de chance a cada intervalo
        const mensagensAleatorias = [
            "Acabei de confirmar minha viagem!",
            "Encontrei uma promoção ótima!",
            "Você já fez as malas?",
            "Vamos combinar o ponto de encontro?",
            "Tem novidades sobre o clima?"
        ];
        const mensagemAleatoria = mensagensAleatorias[Math.floor(Math.random() * mensagensAleatorias.length)];
        adicionarMensagem(mensagemAleatoria, 'recebida');
    }
}, 10000); // Verificar a cada 10 segundos
