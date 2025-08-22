document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Menu de Navegação e Rolagem Suave ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const header = document.querySelector('.header-content');

    // Alternar menu para mobile
    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        });
    });

    // Adiciona sombra ao cabeçalho ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Animação de rolagem suave para as âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Lógica do Carrossel de Imagens ---
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const carouselContainer = document.querySelector('.carousel-container'); // Necessário para eventos de mouse

    let counter = 0;
    let slideWidth = carouselImages[0].clientWidth; // Largura de uma imagem, inicializada
    
    // Cria os dots dinamicamente (se não houver no HTML, ou só para garantir)
    // Isso garante que os dots corresponderão ao número de imagens
    if (dotsContainer) { // Verifica se o container de dots existe
        dotsContainer.innerHTML = '';
        carouselImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                counter = index;
                slideCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }
    const dots = document.querySelectorAll('.carousel-dots .dot');

    // Função para mover o carrossel
    function slideCarousel() {
        if (counter < 0) {
            counter = carouselImages.length - 1; // Volta para a última imagem
        }
        if (counter >= carouselImages.length) {
            counter = 0; // Volta para a primeira imagem
        }
        carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;

        // Atualiza os dots
        if (dots.length > 0) { // Verifica se existem dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[counter].classList.add('active');
        }
    }

    // Botão Anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            counter--;
            slideCarousel();
        });
    }

    // Botão Próximo
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            counter++;
            slideCarousel();
        });
    }

    // Auto-slide (opcional)
    let autoSlideInterval;

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            counter++;
            slideCarousel();
        }, 5000); // Muda a cada 5 segundos
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    if (carouselContainer) { // Inicia o auto-slide apenas se o carrossel existir
        startAutoSlide();
        
        // Pausa o auto-slide ao passar o mouse
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);

        // Retoma o auto-slide ao tirar o mouse
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Garante que o carrossel se ajusta ao redimensionar a janela
    window.addEventListener('resize', () => {
        // Recalcula a largura de uma imagem para o carrossel
        if (carouselImages.length > 0) {
            slideWidth = carouselImages[0].clientWidth; 
            slideCarousel(); // Reposiciona o slide
        }
    });

    // Inicia o carrossel na posição 0 após o carregamento e recalculo
    slideCarousel();


    // --- Lógica do Modal Dinâmico (para Doação Pontual e Membro Mensal) ---
    const dynamicModal = document.getElementById('dynamicModal');
    const closeButton = document.querySelector('.modal .close-button'); // Mais específico para evitar conflitos
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalActions = document.getElementById('modalActions');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');

    // Conteúdo para cada tipo de modal
    const modalContentData = {
        'doacao-pontual': {
            title: 'Doação Pontual',
            body: `
                <p>A sua doação pontual é vital para mantermos nossas atividades e projetos em andamento.</p>
                <p>Você pode doar via PIX (CNPJ) ou Cartão de Crédito.</p>
                <div class="form-group">
                    <label for="valorDoacao">Valor da Doação (R$):</label>
                    <input type="number" id="valorDoacao" name="valorDoacao" min="10" placeholder="Ex: 50.00" required>
                </div>
                <p style="font-weight: bold;">Chave PIX: **60.190.420/0001-00** (CNPJ do ICV)</p>
                <p style="font-weight: bold;">Ou utilize o QR Code abaixo:</p>
                <img src="imagens/QR-code-modelo.png" alt="QR Code PIX" style="max-width: 200px; display: block; margin: 20px auto;">
                <p>Após a doação, se desejar um recibo, envie o comprovante para nosso email de contato.</p>
            `,
            actions: `
                <a href="#" class="btn-primary" onclick="alert('Funcionalidade de Doação com Cartão ainda não implementada.'); return false;">Doar com Cartão</a>
                <a href="#doacoes" class="btn-secondary" onclick="closeModal()">Fechar</a>
            `
        },
        'membro-mensal': {
            title: 'Seja um Membro Mensal',
            body: `
                <p>Ao se tornar um membro mensal, você garante um fluxo contínuo de apoio que nos permite planejar projetos de longo prazo e causar um impacto ainda maior.</p>
                <p>Escolha o seu plano de contribuição mensal e faça a diferença todos os meses:</p>
                <div class="form-group">
                    <label for="planoMembro">Escolha seu Plano:</label>
                    <select id="planoMembro" name="planoMembro">
                        <option value="bronze">Plano Bronze - R$ 25/mês</option>
                        <option value="prata">Plano Prata - R$ 50/mês</option>
                        <option value="ouro">Plano Ouro - R$ 100/mês</option>
                        <option value="personalizado">Outro valor (mín. R$10)</option>
                    </select>
                </div>
                <div class="form-group" id="valorPersonalizado" style="display:none;">
                    <label for="valorMembro">Valor Personalizado (R$):</label>
                    <input type="number" id="valorMembro" name="valorMembro" min="10" placeholder="Ex: 75.00">
                </div>
                <p>Você será redirecionado para uma plataforma segura de pagamentos recorrentes.</p>
            `,
            actions: `
                <a href="#" class="btn-primary" onclick="alert('Funcionalidade de Assinatura Mensal ainda não implementada.'); return false;">Assinar Agora</a>
                <a href="#doacoes" class="btn-secondary" onclick="closeModal()">Fechar</a>
            `
        }
        // O tipo 'voluntariado' foi removido daqui, pois agora o botão "Seja Voluntário" usa diretamente o mailto:
    };

    // Função para abrir o modal
    function openModal(type) {
        const data = modalContentData[type];
        if (data) {
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.body;
            modalActions.innerHTML = data.actions;

            dynamicModal.classList.add('active'); // Adiciona a classe para exibir o modal

            // Lógica específica para o formulário de Membro Mensal
            if (type === 'membro-mensal') {
                // Re-seleciona os elementos, pois eles são injetados via innerHTML
                const planoMembro = document.getElementById('planoMembro');
                const valorPersonalizadoDiv = document.getElementById('valorPersonalizado');
                const valorMembroInput = document.getElementById('valorMembro');

                if (planoMembro) {
                    planoMembro.addEventListener('change', () => {
                        if (planoMembro.value === 'personalizado') {
                            valorPersonalizadoDiv.style.display = 'block';
                            valorMembroInput.setAttribute('required', 'required');
                        } else {
                            valorPersonalizadoDiv.style.display = 'none';
                            valorMembroInput.removeAttribute('required');
                        }
                    });
                }
            }
        }
    }

    // Função para fechar o modal
    // Tornada global para que possa ser chamada diretamente de onclick no HTML
    window.closeModal = function() {
        dynamicModal.classList.remove('active'); // Remove a classe para ocultar o modal
    }

    // Ouvintes de Eventos para abrir o modal
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Impede que o link padrão seja seguido
            const modalType = button.getAttribute('data-modal-type');
            openModal(modalType);
        });
    });

    // Ouvinte de Eventos para fechar o modal clicando no 'X'
    if (closeButton) { // Garante que o botão existe
        closeButton.addEventListener('click', closeModal);
    }

    // Ouvinte de Eventos para fechar o modal clicando fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target == dynamicModal) {
            closeModal();
        }
    });

    // Lógica para o formulário de contato (agora usando mailto)
    const contactForm = document.querySelector('#contato form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário
            
            // Pega os valores dos campos
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const mensagem = document.getElementById('mensagem').value;

            // Define o destinatário do e-mail
            const destinatario = 'spalenc2@gmail.com'; // Mude para o e-mail desejado
            
            // Constrói o corpo do e-mail com as informações do formulário
            const assunto = `Mensagem do site enviada por: ${nome}`;
            const corpo = `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`;

            // Codifica o assunto e o corpo para URL
            const mailtoAssunto = encodeURIComponent(assunto);
            const mailtoCorpo = encodeURIComponent(corpo);
            
            // Constrói o link mailto completo
            const mailtoLink = `mailto:${destinatario}?subject=${mailtoAssunto}&body=${mailtoCorpo}`;

            // Redireciona o navegador para o link mailto, abrindo o cliente de e-mail
            window.location.href = mailtoLink;
            
            // Opcional: Limpa o formulário após a tentativa de envio
            contactForm.reset(); 
        });
    }
});
