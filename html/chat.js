// Sistema de Gerenciamento de Chat
class ChatSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('caroneiro_currentUser')) || null;
        this.conversas = JSON.parse(localStorage.getItem('caroneiro_conversas')) || this.criarConversasExemplo();
        this.conversaAtual = null;
        this.init();
    }

    criarConversasExemplo() {
        return [
            {
                id: '1',
                nome: 'Maria Silva',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
                mensagens: [
                    {
                        id: '1',
                        texto: 'Olá! Tudo bem?',
                        tipo: 'recebida',
                        data: new Date(Date.now() - 3600000).toISOString()
                    },
                    {
                        id: '2',
                        texto: 'Oi Maria! Tudo ótimo, e com você?',
                        tipo: 'enviada',
                        data: new Date(Date.now() - 3500000).toISOString()
                    },
                    {
                        id: '3',
                        texto: 'Estou bem também! Vamos combinar os detalhes da nossa viagem?',
                        tipo: 'recebida',
                        data: new Date(Date.now() - 3400000).toISOString()
                    }
                ],
                ultimaMensagem: {
                    texto: 'Vamos combinar os detalhes da nossa viagem?',
                    data: new Date(Date.now() - 3400000).toISOString()
                }
            },
            {
                id: '2',
                nome: 'João Santos',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
                mensagens: [
                    {
                        id: '1',
                        texto: 'Encontrei uma promoção incrível para Fernando de Noronha!',
                        tipo: 'recebida',
                        data: new Date(Date.now() - 86400000).toISOString()
                    }
                ],
                ultimaMensagem: {
                    texto: 'Encontrei uma promoção incrível para Fernando de Noronha!',
                    data: new Date(Date.now() - 86400000).toISOString()
                }
            },
            {
                id: '3',
                nome: 'Ana Oliveira',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
                mensagens: [
                    {
                        id: '1',
                        texto: 'Confirmado! Nos vemos no aeroporto às 06:00',
                        tipo: 'recebida',
                        data: new Date(Date.now() - 172800000).toISOString()
                    }
                ],
                ultimaMensagem: {
                    texto: 'Confirmado! Nos vemos no aeroporto às 06:00',
                    data: new Date(Date.now() - 172800000).toISOString()
                }
            }
        ];
    }

    init() {
        if (!this.verificarLogin()) return;
        
        this.updateHeader();
        this.carregarChat();
        this.configurarEventos();
        this.garantirScrollFuncional();
    }

    verificarLogin() {
        if (!this.currentUser) {
            this.mostrarChatVazio();
            return false;
        }
        return true;
    }

    mostrarChatVazio() {
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.innerHTML = `
            <div class="chat-vazio">
                <div class="vazio-content">
                    <div class="vazio-icon">🔒</div>
                    <h2>Chat Não Disponível</h2>
                    <p>Você precisa fazer login para acessar o chat</p>
                    <div class="vazio-actions">
                        <a href="login.html" class="btn btn-primary">Fazer Login</a>
                        <a href="cadastro.html" class="btn btn-secondary">Cadastrar</a>
                    </div>
                </div>
            </div>
        `;
    }

    updateHeader() {
        const headerUser = document.getElementById('headerUser');
        if (!headerUser) return;

        if (this.currentUser) {
            headerUser.innerHTML = `
                <div class="user-menu">
                    <div class="user-info">
                        <span class="user-name">Olá, ${this.currentUser.nome.split(' ')[0]}</span>
                        <span class="user-email">${this.currentUser.email}</span>
                    </div>
                    <div class="user-actions">
                        <a href="perfil.html" class="btn-profile">👤 Perfil</a>
                        <button class="btn-logout" onclick="chatSystem.logout()">🚪 Sair</button>
                    </div>
                </div>
            `;
        } else {
            headerUser.innerHTML = `
                <div class="header-buttons">
                    <a href="login.html" class="btn-login">Login</a>
                    <a href="cadastro.html" class="btn-cadastro">Cadastrar</a>
                </div>
            `;
        }
    }

    carregarChat() {
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.innerHTML = this.getChatHTML();
        this.carregarConversas();
    }

    getChatHTML() {
        return `
            <aside class="conversas-sidebar">
                <div class="sidebar-header">
                    <h2>Conversas</h2>
                    <button class="btn-nova-conversa" id="btnNovaConversa">+ Nova</button>
                </div>
                <div class="conversas-list" id="conversasList">
                    <!-- Conversas carregadas via JavaScript -->
                </div>
            </aside>

            <section class="chat-area">
                <div class="chat-header">
                    <div class="chat-user-info">
                        <div class="user-avatar">
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" alt="Usuário">
                        </div>
                        <div class="user-details">
                            <h3>Selecione uma conversa</h3>
                            <span class="user-status">Clique em uma conversa para começar</span>
                        </div>
                    </div>
                    <div class="chat-actions">
                        <button class="btn-action" title="Informações" id="btnInfo">ℹ️</button>
                    </div>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <div class="mensagem-inicial">
                        <p>Selecione uma conversa para começar a trocar mensagens</p>
                    </div>
                </div>

                <div class="chat-input-area">
                    <div class="input-actions">
                        <button class="btn-attach" title="Anexar arquivo" id="btnAttach">📎</button>
                        <button class="btn-emoji" title="Emojis" id="btnEmoji">😊</button>
                        <button class="btn-location" title="Compartilhar localização" id="btnLocation">📍</button>
                    </div>
                    <input type="text" class="chat-input" id="chatInput" placeholder="Digite sua mensagem..." disabled>
                    <button class="btn-send" id="btnSend" disabled>➤</button>
                </div>
            </section>
        `;
    }

    configurarEventos() {
        // Nova conversa
        document.getElementById('btnNovaConversa').addEventListener('click', () => {
            this.novaConversa();
        });

        // Enviar mensagem
        document.getElementById('btnSend').addEventListener('click', () => {
            this.enviarMensagem();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.enviarMensagem();
            }
        });

        // Ações dos botões
        document.getElementById('btnAttach').addEventListener('click', () => {
            this.mostrarMensagem('Funcionalidade de anexar arquivo em desenvolvimento');
        });

        document.getElementById('btnEmoji').addEventListener('click', () => {
            this.mostrarMensagem('Selecionador de emojis em desenvolvimento');
        });

        document.getElementById('btnLocation').addEventListener('click', () => {
            this.mostrarMensagem('Compartilhamento de localização em desenvolvimento');
        });

        document.getElementById('btnInfo').addEventListener('click', () => {
            this.mostrarInfoConversa();
        });
    }

    // Garantir que o scroll funcione corretamente
    garantirScrollFuncional() {
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatMessages) return;
        
        // Forçar cálculo do scroll height
        setTimeout(() => {
            chatMessages.style.overflowY = 'auto';
            chatMessages.style.height = 'auto';
            
            // Adicionar mensagens de exemplo se necessário para demonstrar scroll
            if (this.conversaAtual && this.conversaAtual.mensagens && this.conversaAtual.mensagens.length < 5) {
                this.adicionarMensagensDeExemplo();
            }
        }, 100);
    }

    // Adicionar mensagens de exemplo para preencher o chat (apenas para demonstração)
    adicionarMensagensDeExemplo() {
        if (!this.conversaAtual) return;

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
            }
        ];

        // Adicionar apenas se não houver muitas mensagens
        if (this.conversaAtual.mensagens.length < 5) {
            mensagensExemplo.forEach(msg => {
                const novaMensagem = {
                    id: Date.now().toString() + Math.random(),
                    texto: msg.conteudo,
                    tipo: msg.tipo,
                    data: new Date().toISOString()
                };
                
                this.conversaAtual.mensagens.push(novaMensagem);
                this.adicionarMensagemUI(novaMensagem, false); // false = não faz scroll automático
            });
            
            this.salvarConversas();
            
            // NÃO faz scroll automático - usuário controla manualmente
            console.log('Mensagens de exemplo adicionadas. O usuário controla o scroll manualmente.');
        }
    }

    carregarConversas() {
        const conversasList = document.getElementById('conversasList');
        
        if (this.conversas.length === 0) {
            conversasList.innerHTML = `
                <div class="conversa-vazia">
                    <p>Nenhuma conversa iniciada</p>
                    <small>Clique em "Nova" para começar uma conversa</small>
                </div>
            `;
            return;
        }

        conversasList.innerHTML = this.conversas.map(conversa => `
            <div class="conversa-item" data-id="${conversa.id}">
                <div class="conversa-avatar">
                    <img src="${conversa.avatar}" alt="${conversa.nome}">
                </div>
                <div class="conversa-info">
                    <div class="conversa-header">
                        <h3>${conversa.nome}</h3>
                        <span class="conversa-time">${this.formatarTempo(conversa.ultimaMensagem?.data)}</span>
                    </div>
                    <p class="conversa-preview">${conversa.ultimaMensagem?.texto || 'Nenhuma mensagem'}</p>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners para as conversas
        document.querySelectorAll('.conversa-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selecionarConversa(item.dataset.id);
            });
        });

        // Selecionar primeira conversa por padrão
        if (this.conversas.length > 0 && !this.conversaAtual) {
            this.selecionarConversa(this.conversas[0].id);
        }
    }

    selecionarConversa(conversaId) {
        this.conversaAtual = this.conversas.find(c => c.id === conversaId);
        
        if (!this.conversaAtual) return;

        // Atualizar UI - Remover active de todas e adicionar à selecionada
        document.querySelectorAll('.conversa-item').forEach(item => {
            item.classList.remove('active');
        });
        const conversaSelecionada = document.querySelector(`[data-id="${conversaId}"]`);
        if (conversaSelecionada) {
            conversaSelecionada.classList.add('active');
        }

        // Atualizar header do chat
        const userDetails = document.querySelector('.user-details');
        const userAvatar = document.querySelector('.user-avatar img');
        
        userDetails.innerHTML = `
            <h3>${this.conversaAtual.nome}</h3>
            <span class="user-status">Online</span>
        `;
        userAvatar.src = this.conversaAtual.avatar;
        userAvatar.alt = this.conversaAtual.nome;

        // Habilitar input
        const chatInput = document.getElementById('chatInput');
        const btnSend = document.getElementById('btnSend');
        
        chatInput.disabled = false;
        btnSend.disabled = false;
        chatInput.placeholder = "Digite sua mensagem...";
        chatInput.focus();

        // Carregar mensagens
        this.carregarMensagens();

        // Configurar scroll manual
        this.configurarScrollManual();
    }

    carregarMensagens() {
        const chatMessages = document.getElementById('chatMessages');
        
        if (!this.conversaAtual.mensagens || this.conversaAtual.mensagens.length === 0) {
            chatMessages.innerHTML = `
                <div class="mensagem-inicial">
                    <p>Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!</p>
                </div>
            `;
            return;
        }

        // Ordenar mensagens por data (mais antigas primeiro)
        const mensagensOrdenadas = [...this.conversaAtual.mensagens].sort((a, b) => 
            new Date(a.data) - new Date(b.data)
        );

        chatMessages.innerHTML = mensagensOrdenadas.map(mensagem => `
            <div class="mensagem ${mensagem.tipo}">
                <div class="mensagem-conteudo">${this.escapeHTML(mensagem.texto)}</div>
                <div class="mensagem-hora">${this.formatarHora(mensagem.data)}</div>
            </div>
        `).join('');

        // NÃO faz scroll automático - usuário controla manualmente
        console.log('Mensagens carregadas. Scroll controlado manualmente pelo usuário.');
    }

    configurarScrollManual() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Garantir que o scroll está habilitado
        chatMessages.style.overflowY = 'auto';
        chatMessages.style.height = 'auto';

        // Adicionar classe se for uma conversa longa
        if (this.conversaAtual.mensagens.length > 10) {
            chatMessages.classList.add('long-conversation');
        } else {
            chatMessages.classList.remove('long-conversation');
        }
    }

    enviarMensagem() {
        const input = document.getElementById('chatInput');
        const texto = input.value.trim();

        if (!texto || !this.conversaAtual) return;

        const mensagem = {
            id: Date.now().toString(),
            texto: texto,
            tipo: 'enviada',
            data: new Date().toISOString()
        };

        // Adicionar mensagem à conversa
        this.conversaAtual.mensagens.push(mensagem);
        this.conversaAtual.ultimaMensagem = mensagem;

        // Salvar no localStorage
        this.salvarConversas();

        // Atualizar UI
        this.adicionarMensagemUI(mensagem);
        this.atualizarListaConversas();

        // Limpar input
        input.value = '';
        input.focus();

        // Simular resposta após 1-3 segundos
        setTimeout(() => {
            this.simularResposta();
        }, 1000 + Math.random() * 2000);
    }

    adicionarMensagemUI(mensagem, scrollAutomatico = false) {
        const chatMessages = document.getElementById('chatMessages');
        
        // Se for a primeira mensagem, remover o estado inicial
        if (chatMessages.querySelector('.mensagem-inicial')) {
            chatMessages.innerHTML = '';
        }

        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${mensagem.tipo}`;
        mensagemDiv.innerHTML = `
            <div class="mensagem-conteudo">${this.escapeHTML(mensagem.texto)}</div>
            <div class="mensagem-hora">${this.formatarHora(mensagem.data)}</div>
        `;

        chatMessages.appendChild(mensagemDiv);
        
        // Só faz scroll se explicitamente solicitado
        if (scrollAutomatico) {
            this.scrollParaBaixo();
        }
    }

    atualizarListaConversas() {
        if (!this.conversaAtual.ultimaMensagem) return;

        const conversaItem = document.querySelector(`[data-id="${this.conversaAtual.id}"]`);
        if (conversaItem) {
            const preview = conversaItem.querySelector('.conversa-preview');
            const time = conversaItem.querySelector('.conversa-time');
            
            if (preview) {
                preview.textContent = this.conversaAtual.ultimaMensagem.texto.length > 30 
                    ? this.conversaAtual.ultimaMensagem.texto.substring(0, 30) + '...' 
                    : this.conversaAtual.ultimaMensagem.texto;
            }
            if (time) {
                time.textContent = this.formatarTempo(this.conversaAtual.ultimaMensagem.data);
            }

            // Mover conversa para o topo
            const conversasList = document.getElementById('conversasList');
            const firstItem = conversasList.firstElementChild;
            if (firstItem && firstItem !== conversaItem) {
                conversasList.insertBefore(conversaItem, firstItem);
            }
        }
    }

    simularResposta() {
        if (!this.conversaAtual) return;

        const respostas = [
            "Olá! Como você está?",
            "Interessante! Conte-me mais sobre isso.",
            "Gostei da sua mensagem!",
            "Vamos combinar os detalhes da viagem?",
            "Perfeito! Estou animado para essa aventura.",
            "Que ótimo! Quando podemos nos encontrar?",
            "Excelente ideia! Vamos planejar isso.",
            "Maravilha! Estou ansioso para essa viagem.",
            "Combinado! Qualquer coisa me avise.",
            "Vou verificar minha agenda e te confirmo."
        ];

        const resposta = respostas[Math.floor(Math.random() * respostas.length)];

        const mensagem = {
            id: Date.now().toString(),
            texto: resposta,
            tipo: 'recebida',
            data: new Date().toISOString()
        };

        this.conversaAtual.mensagens.push(mensagem);
        this.conversaAtual.ultimaMensagem = mensagem;

        this.salvarConversas();
        this.adicionarMensagemUI(mensagem, false); // false = não faz scroll automático
        this.atualizarListaConversas();
    }

    novaConversa() {
        const nome = prompt('Com quem você quer conversar?');
        if (nome && nome.trim()) {
            const novaConversa = {
                id: Date.now().toString(),
                nome: nome.trim(),
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
                mensagens: [],
                ultimaMensagem: null
            };

            this.conversas.unshift(novaConversa); // Adicionar no início
            this.salvarConversas();
            this.carregarConversas();
            this.selecionarConversa(novaConversa.id);
        }
    }

    salvarConversas() {
        localStorage.setItem('caroneiro_conversas', JSON.stringify(this.conversas));
    }

    // Função de scroll disponível mas não usada automaticamente
    scrollParaBaixo() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    formatarTempo(dataString) {
        if (!dataString) return '';
        
        const data = new Date(dataString);
        const agora = new Date();
        const diffMs = agora - data;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return data.toLocaleDateString('pt-BR');
    }

    formatarHora(dataString) {
        const data = new Date(dataString);
        return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    mostrarMensagem(mensagem) {
        alert(mensagem);
    }

    mostrarInfoConversa() {
        if (!this.conversaAtual) {
            this.mostrarMensagem('Selecione uma conversa para ver informações');
            return;
        }

        const info = `
Conversa com: ${this.conversaAtual.nome}
Total de mensagens: ${this.conversaAtual.mensagens.length}
Última mensagem: ${this.conversaAtual.ultimaMensagem ? this.formatarHora(this.conversaAtual.ultimaMensagem.data) : 'Nenhuma'}
        `.trim();

        this.mostrarMensagem(info);
    }

    logout() {
        localStorage.removeItem('caroneiro_currentUser');
        window.location.href = 'login.html';
    }
}

// Inicializar sistema do chat quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.chatSystem = new ChatSystem();
});

// Adicionar suporte para recarregar a página mantendo o estado
window.addEventListener('beforeunload', function() {
    // Salvar estado atual se necessário
    if (window.chatSystem && window.chatSystem.conversaAtual) {
        localStorage.setItem('caroneiro_ultimaConversa', window.chatSystem.conversaAtual.id);
    }
});