// codagem/js.js

// Dados das viagens disponíveis
const viagens = [
    { nome: "Rio de Janeiro", categoria: "nacional", imagem: "https://cdn.vaidepromo.com.br/blog/2024/09/Cristo-Redentor-Rio-de-Janeiro-min-1024x682.jpg" },
    { nome: "São Paulo", categoria: "nacional", imagem: "https://media.staticontent.com/media/pictures/09f6c604-fa70-401a-9257-89fcf38e07fb" },
    { nome: "Florianópolis", categoria: "nacional", imagem: "https://cdn.jacadatravel.com/wp-content/uploads/2019/05/Florianopolis-AdobeStock_603394379-scaled.jpg" },
    { nome: "Salvador", categoria: "nacional", imagem: "https://www.farejaviagens.com.br/wp-content/uploads/2024/10/Salvador-Submarino-Viagens.jpg" },
    { nome: "Roma", categoria: "internacional", imagem: "https://oficinadeinverno.com.br/cdn/shop/articles/oficina-de-inverno-pontos-turisticos-da-italia-coliseu-capa.jpg?v=1660067718" },
    { nome: "Paris", categoria: "internacional", imagem: "https://media.tacdn.com/media/attractions-splice-spp-674x446/11/7b/03/80.jpg" },
    { nome: "Itália", categoria: "internacional", imagem: "https://uploads.dicasdaitalia.com.br/sites/11/2019/11/torre-de-pisa-1.jpg" },
    { nome: "Portugal", categoria: "internacional", imagem: "https://www.portocidadaniaportuguesa.com.br/assets/userfiles/archives/60c0c3ee13c39.jpg" }
];

// Inicialização quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltroViagens();
});

// Função para inicializar o sistema de filtro
function inicializarFiltroViagens() {
    // Adicionar o HTML do filtro antes da seção de destinos
    const destinosSection = document.querySelector('.destinos-destaque');
    if (destinosSection) {
        const filtroHTML = criarFiltroHTML();
        destinosSection.insertAdjacentHTML('afterbegin', filtroHTML);
        
        // Configurar event listeners
        configurarFiltroEventListeners();
        
        // Carregar destinos iniciais
        filtrarViagens('todos');
    }
}

// Criar HTML do filtro
function criarFiltroHTML() {
    return `
        <div class="filtro-viagens">
            <div class="filtro-container">
                <h3>Filtrar Destinos</h3>
                <div class="filtro-botoes">
                    <button class="filtro-btn active" data-categoria="todos">Todos os Destinos</button>
                    <button class="filtro-btn" data-categoria="nacional">Destinos Nacionais</button>
                    <button class="filtro-btn" data-categoria="internacional">Destinos Internacionais</button>
                </div>
                <div class="filtro-pesquisa">
                    <input type="text" id="pesquisaDestinos" placeholder="Pesquisar destinos...">
                    <button class="btn-pesquisa">🔍</button>
                </div>
            </div>
        </div>
    `;
}

// Configurar event listeners do filtro
function configurarFiltroEventListeners() {
    // Botões de categoria
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            
            // Atualizar botão ativo
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            filtrarViagens(categoria);
        });
    });

    // Pesquisa em tempo real
    const pesquisaInput = document.getElementById('pesquisaDestinos');
    if (pesquisaInput) {
        pesquisaInput.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            filtrarPorPesquisa(termo);
        });
    }

    // Botão de pesquisa
    const btnPesquisa = document.querySelector('.btn-pesquisa');
    if (btnPesquisa) {
        btnPesquisa.addEventListener('click', function() {
            const termo = document.getElementById('pesquisaDestinos').value.toLowerCase();
            filtrarPorPesquisa(termo);
        });
    }
}

// Filtrar viagens por categoria
function filtrarViagens(categoria) {
    let viagensFiltradas;
    
    if (categoria === 'todos') {
        viagensFiltradas = viagens;
    } else {
        viagensFiltradas = viagens.filter(viagem => viagem.categoria === categoria);
    }
    
    atualizarGridDestinos(viagensFiltradas);
}

// Filtrar por pesquisa
function filtrarPorPesquisa(termo) {
    if (termo === '') {
        // Se não há termo, mostrar categoria atual
        const categoriaAtiva = document.querySelector('.filtro-btn.active').getAttribute('data-categoria');
        filtrarViagens(categoriaAtiva);
        return;
    }
    
    const viagensFiltradas = viagens.filter(viagem => 
        viagem.nome.toLowerCase().includes(termo)
    );
    
    atualizarGridDestinos(viagensFiltradas);
}

// Atualizar grid de destinos
function atualizarGridDestinos(viagensFiltradas) {
    const destinosGrid = document.querySelector('.destinos-grid');
    
    if (!destinosGrid) return;
    
    if (viagensFiltradas.length === 0) {
        destinosGrid.innerHTML = `
            <div class="nenhum-resultado">
                <p>Nenhum destino encontrado</p>
                <small>Tente alterar o filtro ou termo de pesquisa</small>
            </div>
        `;
        return;
    }
    
    destinosGrid.innerHTML = viagensFiltradas.map(viagem => `
        <div class="destino-card" data-categoria="${viagem.categoria}">
            <img src="${viagem.imagem}" alt="${viagem.nome}" loading="lazy">
            <h3>${viagem.nome}</h3>
            <p>${Math.floor(Math.random() * 20) + 5} viajantes disponíveis</p>
            <div class="categoria-tag ${viagem.categoria}">
                ${viagem.categoria === 'nacional' ? '🇧🇷 Nacional' : '🌍 Internacional'}
            </div>
        </div>
    `).join('');
    
    // Adicionar animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.destino-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }, 50);
}

// CSS adicional necessário (adicionar ao seu arquivo CSS)
const cssFiltro = `
/* ===== FILTRO DE VIAGENS ===== */
.filtro-viagens {
    background: var(--text-light);
    margin: 2rem auto;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    max-width: 1000px;
}

.filtro-container h3 {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    background: transparent;
}

.filtro-botoes {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.filtro-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    border-radius: 25px;
    cursor: pointer;
    transition: var(--transition);
    font-weight: 600;
}

.filtro-btn:hover {
    background: var(--primary-color);
    color: var(--text-light);
    transform: translateY(-2px);
}

.filtro-btn.active {
    background: var(--primary-color);
    color: var(--text-light);
    box-shadow: 0 4px 15px rgba(26, 94, 52, 0.3);
}

.filtro-pesquisa {
    display: flex;
    max-width: 400px;
    margin: 0 auto;
    background: var(--bg-light);
    border-radius: 25px;
    overflow: hidden;
    box-shadow: var(--shadow);
}

.filtro-pesquisa input {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    outline: none;
    font-size: 1rem;
    background: transparent;
    color: var(--text-dark);
}

.btn-pesquisa {
    padding: 0.75rem 1.5rem;
    border: none;
    background: var(--accent-color);
    color: var(--text-light);
    cursor: pointer;
    transition: var(--transition);
}

.btn-pesquisa:hover {
    background: var(--secondary-color);
}

/* Tags de categoria */
.categoria-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    background: var(--text-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.categoria-tag.nacional {
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}

.categoria-tag.internacional {
    color: #d4af37;
    border: 1px solid #d4af37;
}

/* Estado quando não há resultados */
.nenhum-resultado {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--text-dark);
    background: transparent;
}

.nenhum-resultado p {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    background: transparent;
}

.nenhum-resultado small {
    opacity: 0.7;
    background: transparent;
}

/* Animações */
.destino-card {
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
}

.destino-card.fade-in {
    opacity: 1;
    transform: translateY(0);
}

/* Responsividade do filtro */
@media (max-width: 768px) {
    .filtro-botoes {
        flex-direction: column;
        align-items: center;
    }
    
    .filtro-btn {
        width: 200px;
    }
    
    .filtro-pesquisa {
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .filtro-viagens {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .filtro-container h3 {
        font-size: 1.25rem;
    }
}
`;

// Adicionar CSS dinamicamente
function adicionarCSSFiltro() {
    const style = document.createElement('style');
    style.textContent = cssFiltro;
    document.head.appendChild(style);
}

// Inicializar CSS quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    adicionarCSSFiltro();
});