// Sistema de Gerenciamento de Perfil
class PerfilSystem {
    constructor() {
        this.authSystem = this.getAuthSystem();
        this.init();
    }

    getAuthSystem() {
        // Tenta acessar o authSystem global ou cria um simples local
        if (window.authSystem) {
            return window.authSystem;
        }
        
        // Fallback local
        return {
            isLoggedIn: () => {
                const user = localStorage.getItem('caroneiro_currentUser');
                return user !== null;
            },
            getCurrentUser: () => {
                const user = localStorage.getItem('caroneiro_currentUser');
                return user ? JSON.parse(user) : null;
            },
            logout: () => {
                localStorage.removeItem('caroneiro_currentUser');
                window.location.href = 'login.html';
            }
        };
    }

    init() {
        this.updateHeader();
        this.carregarPerfil();
    }

    updateHeader() {
        const headerUser = document.getElementById('headerUser');
        if (!headerUser) return;

        if (this.authSystem.isLoggedIn()) {
            const user = this.authSystem.getCurrentUser();
            headerUser.innerHTML = `
                <div class="user-menu">
                    <div class="user-info">
                        <span class="user-name">Olá, ${user.nome.split(' ')[0]}</span>
                        <span class="user-email">${user.email}</span>
                    </div>
                    <div class="user-actions">
                        <a href="perfil.html" class="btn-profile">👤 Perfil</a>
                        <button class="btn-logout" onclick="perfilSystem.logout()">🚪 Sair</button>
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

    carregarPerfil() {
        const perfilContent = document.getElementById('perfilContent');
        
        if (!this.authSystem.isLoggedIn()) {
            perfilContent.innerHTML = this.getPerfilVazio();
            return;
        }

        const user = this.authSystem.getCurrentUser();
        perfilContent.innerHTML = this.getPerfilCompleto(user);
    }

    getPerfilVazio() {
        return `
            <div class="perfil-vazio">
                <div class="vazio-content">
                    <div class="vazio-icon">🔒</div>
                    <h2>Perfil Não Disponível</h2>
                    <p>Você precisa fazer login para visualizar seu perfil</p>
                    <div class="vazio-actions">
                        <a href="login.html" class="btn btn-primary">Fazer Login</a>
                        <a href="cadastro.html" class="btn btn-secondary">Cadastrar</a>
                    </div>
                </div>
            </div>
        `;
    }

    getPerfilCompleto(user) {
        return `
            <section class="perfil-header">
                <div class="perfil-foto">
                    <img src="${user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'}" alt="${user.nome}">
                    <button class="btn-editar-foto" onclick="perfilSystem.editarFoto()">✏️</button>
                </div>
                <div class="perfil-info">
                    <h1>${user.nome}</h1>
                    <p class="perfil-localizacao">📍 ${user.cidade || 'Cidade não informada'}</p>
                    <div class="perfil-stats">
                        <div class="stat">
                            <span class="stat-number">${user.viagens ? user.viagens.length : 0}</span>
                            <span class="stat-label">Viagens</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${user.amigos ? user.amigos.length : 0}</span>
                            <span class="stat-label">Amigos</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">4.9</span>
                            <span class="stat-label">Avaliação</span>
                        </div>
                    </div>
                    <div class="perfil-actions">
                        <button class="btn btn-primary" onclick="perfilSystem.editarPerfil()">
                            <span>✏️</span>
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </section>

            <section class="perfil-bio">
                <h2>Sobre Mim</h2>
                <div class="bio-content">
                    <p>${user.bio || 'Olá! Sou um viajante apaixonado por explorar novos lugares e fazer novas amizades.'}</p>
                    
                    <div class="preferencias">
                        <h3>Interesses de Viagem</h3>
                        <div class="tags">
                            ${this.renderInteresses(user.interesses)}
                        </div>
                    </div>
                </div>
            </section>

            <section class="perfil-contato">
                <h2>Informações de Contato</h2>
                <div class="contato-info">
                    <div class="contato-item">
                        <span class="contato-label">📧 E-mail:</span>
                        <span class="contato-value">${user.email}</span>
                    </div>
                    <div class="contato-item">
                        <span class="contato-label">📞 Telefone:</span>
                        <span class="contato-value">${user.telefone || 'Não informado'}</span>
                    </div>
                    <div class="contato-item">
                        <span class="contato-label">📅 Membro desde:</span>
                        <span class="contato-value">${new Date(user.dataCadastro).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
            </section>

            <section class="viagens-section">
                <div class="section-header">
                    <h2>Minhas Viagens</h2>
                    <button class="btn btn-outline" onclick="perfilSystem.adicionarViagem()">
                        <span>➕</span>
                        Adicionar Viagem
                    </button>
                </div>
                <div class="viagens-grid">
                    ${this.renderViagens(user.viagens)}
                </div>
            </section>
        `;
    }

    renderInteresses(interesses) {
        if (!interesses || interesses.length === 0) {
            return '<span class="tag">Nenhum interesse definido</span>';
        }

        const interessesMap = {
            'natureza': '🏞️ Natureza',
            'praia': '🏖️ Praia', 
            'cidade': '🏙️ Cidade',
            'aventura': '🧗 Aventura',
            'cultural': '🏛️ Cultural',
            'gastronomia': '🍳 Gastronomia'
        };

        return interesses.map(interesse => 
            `<span class="tag">${interessesMap[interesse] || interesse}</span>`
        ).join('');
    }

    renderViagens(viagens) {
        if (!viagens || viagens.length === 0) {
            return `
                <div class="viagem-vazia">
                    <p>Nenhuma viagem registrada ainda</p>
                    <small>Adicione suas viagens para compartilhar suas experiências</small>
                </div>
            `;
        }

        return viagens.map(viagem => `
            <div class="viagem-card">
                <img src="${viagem.foto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'}" alt="${viagem.destino}">
                <div class="viagem-info">
                    <h3>${viagem.destino}</h3>
                    <p class="viagem-data">${new Date(viagem.data).toLocaleDateString('pt-BR')}</p>
                    <p class="viagem-desc">${viagem.descricao || 'Viagem incrível!'}</p>
                </div>
            </div>
        `).join('');
    }

    editarFoto() {
        alert('Funcionalidade de edição de foto será implementada em breve!');
    }

    editarPerfil() {
        alert('Funcionalidade de edição de perfil será implementada em breve!');
    }

    adicionarViagem() {
        const destino = prompt('Para onde você viajou?');
        if (destino) {
            const user = this.authSystem.getCurrentUser();
            const viagem = {
                destino: destino,
                descricao: 'Viagem maravilhosa!',
                data: new Date().toISOString(),
                foto: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
            };
            
            // Atualizar localmente
            if (!user.viagens) user.viagens = [];
            user.viagens.push(viagem);
            
            // Salvar no localStorage
            localStorage.setItem('caroneiro_currentUser', JSON.stringify(user));
            
            // Recarregar perfil
            this.carregarPerfil();
            alert('Viagem adicionada com sucesso!');
        }
    }

    logout() {
        this.authSystem.logout();
    }
}

// Inicializar sistema do perfil
document.addEventListener('DOMContentLoaded', function() {
    window.perfilSystem = new PerfilSystem();
});