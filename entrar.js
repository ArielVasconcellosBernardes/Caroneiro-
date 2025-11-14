// Sistema de Autenticação e Armazenamento
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('caroneiro_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('caroneiro_currentUser')) || null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
        this.updateHeader();
    }

    setupEventListeners() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Cadastro Form
        const cadastroForm = document.getElementById('cadastroForm');
        if (cadastroForm) {
            cadastroForm.addEventListener('submit', (e) => this.handleCadastro(e));
        }

        // Social Login Buttons
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
    }

    // Verificar autenticação em páginas protegidas
    checkAuthentication() {
        const protectedPages = ['perfil.html', 'chat.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
            this.showAlert('Você precisa fazer login para acessar esta página!', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        return true;
    }

    // Atualizar header com informações do usuário
    updateHeader() {
        const headerUser = document.getElementById('headerUser');
        if (!headerUser) return;

        if (this.isLoggedIn()) {
            headerUser.innerHTML = `
                <div class="user-menu">
                    <div class="user-info">
                        <span class="user-name">Olá, ${this.currentUser.nome.split(' ')[0]}</span>
                        <span class="user-email">${this.currentUser.email}</span>
                    </div>
                    <div class="user-actions">
                        <a href="perfil.html" class="btn-profile">👤 Perfil</a>
                        <button class="btn-logout" onclick="authSystem.logout()">🚪 Sair</button>
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

    // Manipular Login
    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        const user = this.authenticateUser(email, password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('caroneiro_currentUser', JSON.stringify(user));
            
            if (rememberMe) {
                localStorage.setItem('caroneiro_rememberMe', 'true');
            }

            this.showAlert('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            this.showAlert('E-mail ou senha incorretos!', 'error');
        }
    }

    // Manipular Cadastro - CORRIGIDO
    handleCadastro(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const elementosForm = e.target.elements;
        
        // CORREÇÃO: Verificar o checkbox dos termos diretamente do DOM
        const termosCheckbox = document.getElementById('termos');
        if (!termosCheckbox || !termosCheckbox.checked) {
            this.showAlert('Você deve aceitar os termos de serviço!', 'error');
            return;
        }

        const userData = {
            id: Date.now().toString(),
            nome: formData.get('nome'),
            email: formData.get('email'),
            password: formData.get('password'),
            telefone: formData.get('telefone'),
            cidade: formData.get('cidade'),
            interesses: Array.from(formData.getAll('interesses')),
            dataCadastro: new Date().toISOString(),
            newsletter: elementosForm.newsletter?.checked || false,
            viagens: [],
            amigos: [],
            foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        };

        // Validações
        if (this.userExists(userData.email)) {
            this.showAlert('Este e-mail já está cadastrado!', 'error');
            return;
        }

        if (formData.get('password') !== formData.get('confirmPassword')) {
            this.showAlert('As senhas não coincidem!', 'error');
            return;
        }

        // Salvar usuário
        this.users.push(userData);
        localStorage.setItem('caroneiro_users', JSON.stringify(this.users));

        // Fazer login automaticamente
        this.currentUser = userData;
        localStorage.setItem('caroneiro_currentUser', JSON.stringify(userData));

        this.showAlert('Cadastro realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.href = 'perfil.html';
        }, 2000);
    }

    // Autenticar usuário
    authenticateUser(email, password) {
        return this.users.find(user => 
            user.email === email && user.password === password
        );
    }

    // Verificar se usuário existe
    userExists(email) {
        return this.users.some(user => user.email === email);
    }

    // Login Social (simulado)
    handleSocialLogin(e) {
        e.preventDefault();
        const provider = e.target.classList.contains('google') ? 'Google' : 'Facebook';
        
        this.showAlert(`Login com ${provider} será implementado em breve!`, 'success');
    }

    // Mostrar alertas
    showAlert(message, type) {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;

        const form = document.querySelector('.auth-form') || document.querySelector('main');
        if (form) {
            form.insertBefore(alert, form.firstChild);
        }

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('caroneiro_currentUser');
        this.showAlert('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Verificar se está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Atualizar perfil do usuário
    updateUserProfile(userId, updates) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            localStorage.setItem('caroneiro_users', JSON.stringify(this.users));
            
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = this.users[userIndex];
                localStorage.setItem('caroneiro_currentUser', JSON.stringify(this.currentUser));
            }
            
            return true;
        }
        return false;
    }

    // Adicionar viagem ao perfil
    addViagem(userId, viagem) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            if (!user.viagens) user.viagens = [];
            user.viagens.push({
                id: Date.now().toString(),
                ...viagem,
                data: new Date().toISOString()
            });
            this.updateUserProfile(userId, { viagens: user.viagens });
            return true;
        }
        return false;
    }

    // Adicionar amigo
    addAmigo(userId, amigoId) {
        const user = this.users.find(u => u.id === userId);
        const amigo = this.users.find(u => u.id === amigoId);
        
        if (user && amigo) {
            if (!user.amigos) user.amigos = [];
            if (!user.amigos.includes(amigoId)) {
                user.amigos.push(amigoId);
                this.updateUserProfile(userId, { amigos: user.amigos });
                return true;
            }
        }
        return false;
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
    
    // Adicionar funcionalidade de mostrar/ocultar senha
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.className = 'password-toggle';
        toggleBtn.style.background = 'none';
        toggleBtn.style.border = 'none';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '10px';
        toggleBtn.style.top = '50%';
        toggleBtn.style.transform = 'translateY(-50%)';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '1.2rem';
        
        input.parentElement.style.position = 'relative';
        input.style.paddingRight = '40px';
        input.parentElement.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggleBtn.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });
});