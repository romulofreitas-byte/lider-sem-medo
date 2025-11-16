// ============================================
// REDESIGN FUTURISTA - INTERATIVIDADE MÁXIMA
// Partículas, magnetic buttons, parallax, animações
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // EVENTO: Data/Hora (fonte única)
    // Atualize aqui quando necessário
    // ============================================
    window.EVENT_DATE = window.EVENT_DATE || '02 Dez 2025';
    window.EVENT_TIME = window.EVENT_TIME || '12:15';
    const syncEventDateTime = () => {
        const headerDate = document.querySelector('.header-date');
        const headerTime = document.querySelector('.header-time');
        const formBadgeDate = document.getElementById('badgeDate');
        const formBadgeTime = document.getElementById('badgeTime');
        const tyBadgeDate = document.getElementById('tyBadgeDate');
        const tyBadgeTime = document.getElementById('tyBadgeTime');
        if (headerDate) headerDate.textContent = window.EVENT_DATE;
        if (headerTime) headerTime.textContent = window.EVENT_TIME;
        if (formBadgeDate) formBadgeDate.textContent = window.EVENT_DATE;
        if (formBadgeTime) formBadgeTime.textContent = window.EVENT_TIME;
        if (tyBadgeDate) tyBadgeDate.textContent = window.EVENT_DATE;
        if (tyBadgeTime) tyBadgeTime.textContent = window.EVENT_TIME;
        // Suporte a elementos genéricos
        document.querySelectorAll('[data-event="date"]').forEach(el => el.textContent = window.EVENT_DATE);
        document.querySelectorAll('[data-event="time"]').forEach(el => el.textContent = window.EVENT_TIME);
    };
    syncEventDateTime();
    
    // Verificar se não é mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // ============================================
    // HEADER TECH INTERACTIVITY
    // ============================================
    const topHeader = document.querySelector('.top-header');
    
    if (topHeader && !isMobile) {
        // Parallax effect on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const scrollDiff = currentScroll - lastScroll;
            
            if (currentScroll < 100) {
                const opacity = Math.max(0.75, 1 - (currentScroll / 100) * 0.25);
                topHeader.style.opacity = opacity;
                
                const translateY = Math.min(10, currentScroll * 0.1);
                topHeader.style.transform = `translateY(${translateY}px)`;
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
        
        // Hover effect on header
        topHeader.addEventListener('mouseenter', () => {
            const scanLine = topHeader.querySelector('.header-scan-line');
            const borderGlow = topHeader.querySelector('.header-border-glow');
            
            if (scanLine) {
                scanLine.style.animationDuration = '1.5s';
            }
            if (borderGlow) {
                borderGlow.style.animationDuration = '1s';
            }
        });
        
        topHeader.addEventListener('mouseleave', () => {
            const scanLine = topHeader.querySelector('.header-scan-line');
            const borderGlow = topHeader.querySelector('.header-border-glow');
            
            if (scanLine) {
                scanLine.style.animationDuration = '3s';
            }
            if (borderGlow) {
                borderGlow.style.animationDuration = '2s';
            }
        });
    }
    
    // ============================================
    // INICIALIZAÇÃO IMEDIATA DA FAIXA DE LOOPING
    // DEVE SER A PRIMEIRA COISA A EXECUTAR
    // ============================================
    const rollingBanner = document.getElementById('rollingBanner');
    if (rollingBanner) {
        // FORÇAR VISIBILIDADE IMEDIATA
        rollingBanner.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
            max-height: none !important;
            height: auto !important;
            min-height: auto !important;
            position: relative !important;
            z-index: 5 !important;
        `;
        rollingBanner.classList.add('always-visible');
        
        // FORÇAR ANIMAÇÃO IMEDIATAMENTE
        const rollingContent = rollingBanner.querySelector('.rolling-banner-content');
        if (rollingContent) {
            rollingContent.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                animation: rollBanner 30s linear infinite !important;
            `;
        }
    }
    
    // ============================================
    // 1. SISTEMA DE PARTÍCULAS INTERATIVO
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    let mouseX = 0, mouseY = 0;
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = 'block';
        
        // Atualizar posição do mouse (desktop) ou touch (mobile)
        const updateMousePos = (e) => {
            if (e.touches) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        };
        
        document.addEventListener('mousemove', updateMousePos);
        document.addEventListener('touchmove', updateMousePos);
        
        // Paleta Marrom/Caramelo
        const colors = [
            'rgba(129, 84, 51, 0.40)',  // Marrom médio forte
            'rgba(129, 84, 51, 0.28)',  // Marrom médio
            'rgba(190, 165, 135, 0.26)',// Caramelo suave
            'rgba(226, 216, 204, 0.22)' // Bege sutil
        ];
        
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update(mouseX, mouseY) {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Interação com mouse
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.x -= (dx / distance) * force * 2;
                    this.y -= (dy / distance) * force * 2;
                }
                
                // Reset se sair da tela
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }
        
        const particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 120;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        let animationId;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update(mouseX, mouseY);
                particle.draw();
            });
            
            // Conectar partículas próximas - Premium High Ticket
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        const alpha = 0.18 * (1 - distance / 150);
                        ctx.strokeStyle = `rgba(129, 84, 51, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // ============================================
    // 3. MAGNETIC BUTTONS
    // ============================================
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            if (isMobile) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.3;
            const moveY = y * 0.3;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
    
    // ============================================
    // 4. PARALLAX MULTI-CAMADA
    // ============================================
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Removido parallax do hero para evitar sobreposição com rolling banner
        
        // Orbs parallax (apenas background, não interfere no layout)
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            const parallaxValue = scrolled * speed;
            orb.style.transform = `translateY(${parallaxValue}px)`;
        });
        
        // Mesh gradient parallax (apenas background, não interfere no layout)
        const meshGradient = document.querySelector('.mesh-gradient');
        if (meshGradient) {
            const parallaxValue = scrolled * 0.15;
            meshGradient.style.transform = `translateY(${parallaxValue}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // ============================================
    // 5. SCROLL SUAVE PARA FORMULÁRIO
    // ============================================
    const ctaHero = document.getElementById('ctaHero');
    const ctaAula = document.getElementById('ctaAula');
    const formulario = document.getElementById('formulario');
    
    if (ctaHero && formulario) {
        ctaHero.addEventListener('click', function(e) {
            e.preventDefault();
            formulario.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    if (ctaAula && formulario) {
        ctaAula.addEventListener('click', function(e) {
            e.preventDefault();
            formulario.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // ============================================
    // 6. ANIMAÇÕES SEQUENCIAIS NO HERO
    // ============================================
    const animateOnLoad = () => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach((el, index) => {
            const delay = parseInt(el.getAttribute('data-delay') || 0);
            
            setTimeout(() => {
                el.classList.add('animated');
            }, delay);
        });
    };
    
    animateOnLoad();
    
    // ============================================
    // TY PAGE - COUNTDOWN (isolado à página de obrigado)
    // ============================================
    (function initThankYouCountdown(){
        const cdRoot = document.querySelector('.ty-hero .ty-countdown');
        if (!cdRoot) return;
        const dateEl = document.getElementById('tyBadgeDate');
        const timeEl = document.getElementById('tyBadgeTime');
        if (!dateEl || !timeEl) return;
        const targetStr = `${(dateEl.textContent || '').trim()} ${(timeEl.textContent || '').trim()}`;
        const target = parsePtBrDate(targetStr);
        if (!target) return;
        const $ = (id) => document.getElementById(id);
        const fmt = (n) => String(n).padStart(2,'0');
        function setVals(d,h,m,s){
            const dEl = $('cdDays'), hEl = $('cdHours'), mEl = $('cdMinutes'), sEl = $('cdSeconds');
            if (dEl) dEl.textContent = fmt(d);
            if (hEl) hEl.textContent = fmt(h);
            if (mEl) mEl.textContent = fmt(m);
            if (sEl) sEl.textContent = fmt(s);
        }
        function tick(){
            const now = new Date();
            let diff = target - now;
            if (diff <= 0){ setVals(0,0,0,0); return; }
            const d = Math.floor(diff/86400000); diff%=86400000;
            const h = Math.floor(diff/3600000); diff%=3600000;
            const m = Math.floor(diff/60000); diff%=60000;
            const s = Math.floor(diff/1000);
            setVals(d,h,m,s);
        }
        function parsePtBrDate(s){
            try{
                // Ex.: "02 Dez 2025 12:15"
                const parts = s.split(/\s+/);
                if (parts.length < 4) return null;
                const [dd, mon, yyyy, hm] = parts;
                const [HH, MM] = (hm || '').split(':');
                const months = {Jan:0, Fev:1, Mar:2, Abr:3, Mai:4, Jun:5, Jul:6, Ago:7, Set:8, Out:9, Nov:10, Dez:11};
                const m = months[mon];
                if (m == null) return null;
                return new Date(Number(yyyy), m, Number(dd), Number(HH), Number(MM), 0);
            } catch(e){ return null; }
        }
        tick();
        setInterval(tick, 1000);
    })();
    
    // ============================================
    // 6b. SINCRONIZAR BADGES DO FORMULÁRIO (data/hora)
    // ============================================
    (function syncFormBadges(){
        const badgeDate = document.getElementById('badgeDate');
        const badgeTime = document.getElementById('badgeTime');
        const headerDate = document.querySelector('.header-date');
        const headerTime = document.querySelector('.header-time');
        if (badgeDate && headerDate) badgeDate.textContent = headerDate.textContent;
        if (badgeTime && headerTime) badgeTime.textContent = headerTime.textContent;
    })();
    
    // Garantir entrada imediata (sem delays extras) nas seções Evidências e Mentores
    const immediateSections = document.querySelectorAll('.evidencias-section [data-animate], .mentores-section [data-animate]');
    immediateSections.forEach((el) => {
        el.style.animationDelay = '0s';
        el.classList.add('animated');
    });
    
    // ============================================
    // 7. INTERSECTION OBSERVER APRIMORADO
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação ao scroll
    const animatedScrollElements = document.querySelectorAll('.sintoma-card, .sobre-aula-card, .comunidade-card, .formulario-card, .author-card');
    animatedScrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
    
    // ============================================
    // 8. EFEITO 3D TILT APRIMORADO
    // ============================================
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (isMobile) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            const isReverse = element.hasAttribute('data-tilt-reverse');
            
            element.style.transform = `perspective(1000px) rotateX(${isReverse ? -rotateX : rotateX}deg) rotateY(${isReverse ? -rotateY : rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // ============================================
    // 9. VALIDAÇÃO VISUAL DO FORMULÁRIO
    // ============================================
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const cargoSelect = document.getElementById('cargo');
    const nomeError = document.getElementById('nome-error');
    const emailError = document.getElementById('email-error');
    const cargoError = document.getElementById('cargo-error');
    
    // Foco a partir do card de garantia interativo
    const garantiaFocusBtn = document.getElementById('garantiaFocus');
    if (garantiaFocusBtn && nomeInput) {
        garantiaFocusBtn.addEventListener('click', () => {
            nomeInput.focus();
            nomeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    // Validação em tempo real - Nome
    if (nomeInput) {
        nomeInput.addEventListener('blur', function() {
            if (this.value.trim().length < 3) {
                showError(nomeError, 'Nome deve ter pelo menos 3 caracteres');
                this.style.borderColor = '#ff4444';
                this.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1), 0 0 20px rgba(255, 68, 68, 0.2)';
            } else {
                hideError(nomeError);
                this.style.borderColor = 'rgba(129, 84, 51, 0.5)';
                this.style.boxShadow = '0 0 0 3px rgba(129, 84, 51, 0.15)';
            }
        });
        
        nomeInput.addEventListener('input', function() {
            if (this.value.trim().length >= 3) {
                hideError(nomeError);
                this.style.borderColor = 'rgba(129, 84, 51, 0.5)';
                this.style.boxShadow = '0 0 0 3px rgba(129, 84, 51, 0.15)';
            }
        });
    }
    
    // Validação em tempo real - Email
    if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        emailInput.addEventListener('blur', function() {
            if (!emailRegex.test(this.value)) {
                showError(emailError, 'Por favor, insira um e-mail válido');
                this.style.borderColor = '#ff4444';
                this.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1), 0 0 20px rgba(255, 68, 68, 0.2)';
            } else {
                hideError(emailError);
                this.style.borderColor = 'rgba(129, 84, 51, 0.5)';
                this.style.boxShadow = '0 0 0 3px rgba(129, 84, 51, 0.15)';
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (emailRegex.test(this.value)) {
                hideError(emailError);
                this.style.borderColor = 'rgba(129, 84, 51, 0.5)';
                this.style.boxShadow = '0 0 0 3px rgba(129, 84, 51, 0.15)';
            }
        });
    }
    
    // Validação em tempo real - Cargo
    if (cargoSelect) {
        cargoSelect.addEventListener('change', function() {
            if (this.value) {
                hideError(cargoError);
                this.style.borderColor = 'rgba(129, 84, 51, 0.5)';
                this.style.boxShadow = '0 0 0 3px rgba(129, 84, 51, 0.15)';
            }
        });
    }
    
    // Funções auxiliares de erro
    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function hideError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    // ============================================
    // 10. ENVIO DO FORMULÁRIO COM LOADING
    // ============================================
    const cadastroForm = document.getElementById('cadastroForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coletar dados
            const nome = nomeInput?.value.trim();
            const email = emailInput?.value.trim();
            const cargo = cargoSelect?.value;
            
            // Validação final
            let hasError = false;
            
            if (!nome || nome.length < 3) {
                showError(nomeError, 'Nome deve ter pelo menos 3 caracteres');
                nomeInput.style.borderColor = '#ff4444';
                nomeInput.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1), 0 0 20px rgba(255, 68, 68, 0.2)';
                hasError = true;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showError(emailError, 'Por favor, insira um e-mail válido');
                emailInput.style.borderColor = '#ff4444';
                emailInput.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1), 0 0 20px rgba(255, 68, 68, 0.2)';
                hasError = true;
            }
            
            if (!cargo) {
                showError(cargoError, 'Por favor, selecione seu cargo');
                cargoSelect.style.borderColor = '#ff4444';
                cargoSelect.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1), 0 0 20px rgba(255, 68, 68, 0.2)';
                hasError = true;
            }
            
            if (hasError) {
                showToast('Por favor, corrija os erros no formulário', 'error');
                return;
            }
            
            // Mostrar loading
            if (submitBtn && btnText && btnLoader) {
                submitBtn.classList.add('loading');
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-flex';
            }
            
            // Integração com Supabase
            try {
                // Verificar se Supabase está carregado
                if (typeof window.supabase === 'undefined') {
                    throw new Error('Biblioteca Supabase não carregada. Verifique a conexão com a internet.');
                }
                
                // Configuração do Supabase
                const supabaseUrl = 'https://riqslkibmvyalnwrapnj.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcXNsa2libXZ5YWxud3JhcG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTk4ODEsImV4cCI6MjA3ODg3NTg4MX0.9Yts0slRMI-FH8dthInuqKDTfEggJNsSyM_ol179rkI';
                
                // Criar cliente Supabase
                const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
                
                // Preparar dados para inserção
                const dados = {
                    nome: nome,
                    email: email,
                    cargo: cargo
                };
                
                // Inserir dados no Supabase
                const { data, error } = await supabase
                    .from('cadastros')
                    .insert([dados])
                    .select();
                
                if (error) {
                    // Tratar erros específicos
                    if (error.code === '23505') { // Violação de constraint única (email duplicado)
                        showError(emailError, 'Este e-mail já está cadastrado');
                        emailInput.style.borderColor = '#ff4444';
                        emailInput.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1), 0 0 20px rgba(255, 68, 68, 0.2)';
                        showToast('Este e-mail já está cadastrado. Use outro e-mail.', 'error');
                    } else {
                        console.error('Erro ao enviar formulário:', error);
                        showToast('Erro ao enviar formulário. Tente novamente.', 'error');
                    }
                    
                    // Esconder loading
                    if (submitBtn && btnText && btnLoader) {
                        submitBtn.classList.remove('loading');
                        btnText.style.display = 'inline';
                        btnLoader.style.display = 'none';
                    }
                    return;
                }
                
                // Sucesso - dados salvos
                console.log('✅ Cadastro realizado com sucesso:', data);
                showToast('Sua vaga na aula foi registrada! Redirecionando...', 'success');
                
                // Redirecionar após 1 segundo
                setTimeout(() => {
                    window.location.href = 'thankyou.html';
                }, 1000);
                
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                showToast('Erro ao enviar formulário. Verifique sua conexão e tente novamente.', 'error');
                
                // Esconder loading
                if (submitBtn && btnText && btnLoader) {
                    submitBtn.classList.remove('loading');
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                }
            }
        });
    }
    
    // ============================================
    // 11. TOAST NOTIFICATIONS
    // ============================================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    // ============================================
    // 12. ANIMAÇÃO DE PREENCHIMENTO DA BARRA DE PROGRESSO
    // E SINCRONIZAÇÃO DE LARGURA COM O BOTÃO
    // ============================================
    const progressBar = document.getElementById('progressBar');
    const progressUnfilled = document.querySelector('.progress-bar-unfilled');
    const progressWrapper = document.querySelector('.progress-wrapper');
    const progressContainer = document.querySelector('.progress-bar-container');
    const ctaButton = document.getElementById('ctaHero');
    
    // Função para sincronizar largura da barra com o botão (acessível globalmente neste escopo)
    let syncProgressBarWidth = null;
    
    if (progressBar && ctaButton && progressWrapper && progressContainer) {
        // Função para sincronizar largura da barra com o botão
        syncProgressBarWidth = () => {
            if (!ctaButton || !progressWrapper || !progressContainer) return;
            
            // Obter largura real do botão (incluindo padding)
            const buttonRect = ctaButton.getBoundingClientRect();
            const buttonWidth = buttonRect.width;
            
            // Aplicar exatamente a mesma largura à barra de progresso
            progressWrapper.style.width = `${buttonWidth}px`;
            progressWrapper.style.maxWidth = `${buttonWidth}px`;
            progressContainer.style.width = `${buttonWidth}px`;
            progressContainer.style.maxWidth = `${buttonWidth}px`;
        };
        // Garantir que a barra seja visível
        progressBar.style.display = 'block';
        progressBar.style.visibility = 'visible';
        progressBar.style.opacity = '1';
        
        // Sincronizar largura no carregamento (após renderização)
        setTimeout(() => {
            syncProgressBarWidth();
        }, 100);
        
        // Sincronizar largura no resize da janela
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                syncProgressBarWidth();
            }, 150);
        }, { passive: true });
        
        // Re-sincronizar após qualquer mudança que possa afetar o layout
        const observer = new MutationObserver(() => {
            syncProgressBarWidth();
        });
        
        if (ctaButton) {
            observer.observe(ctaButton, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                childList: false,
                subtree: false
            });
        }
        
        // Animação inicial de preenchimento - mais rápida
        setTimeout(() => {
            progressBar.style.width = '38%';
            // Parte transparente começa onde o preenchimento marrom termina (38%)
            if (progressUnfilled) {
                progressUnfilled.style.clipPath = 'polygon(38% 0, 100% 0, 100% 100%, 38% 100%)';
            }
        }, 200);
        
        // Efeito de preenchimento constante (muito menos frequente para melhor performance)
        let progressValue = 38;
        setInterval(() => {
            const variation = Math.sin(Date.now() / 6000) * 0.2; // variação menor e menos agressiva
            const currentWidth = 38 + variation;
            progressBar.style.width = `${currentWidth}%`;
            // Garantir que a largura do container não mude
            syncProgressBarWidth();
        }, 3000);
    }
    
    // ============================================
    // 18. GARANTIR VISIBILIDADE DA FAIXA DE LOOPING
    // NUNCA MODIFICAR - DEVE SEMPRE APARECER
    // Monitoramento contínuo para garantir visibilidade
    // ============================================
    if (rollingBanner) {
        // Garantir visibilidade mesmo após scroll ou outras interações
        const observerRollingBanner = new MutationObserver(() => {
            if (rollingBanner) {
                if (rollingBanner.style.display === 'none' || 
                    rollingBanner.style.visibility === 'hidden' || 
                    rollingBanner.style.opacity === '0') {
                    rollingBanner.style.cssText = `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                        max-height: none !important;
                    `;
                }
                
                const rollingContent = rollingBanner.querySelector('.rolling-banner-content');
                if (rollingContent && !rollingContent.style.animation) {
                    rollingContent.style.animation = 'rollBanner 30s linear infinite';
                }
            }
        });
        
        observerRollingBanner.observe(rollingBanner, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Verificar periodicamente se ainda está visível
        setInterval(() => {
            if (rollingBanner) {
                const computedStyle = window.getComputedStyle(rollingBanner);
                if (computedStyle.display === 'none' || 
                    computedStyle.visibility === 'hidden' || 
                    computedStyle.opacity === '0') {
                    rollingBanner.style.cssText = `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    `;
                }
            }
        }, 5000);
    }
    
    // ============================================
    // 19. INTERATIVIDADE PREMIUM NOS BULLET POINTS
    // ============================================
    const bulletItems = document.querySelectorAll('.hero-bullets-list li');
    
    bulletItems.forEach(item => {
        // Efeito magnetic
        // Aguardar animação de entrada terminar antes de aplicar magnetic
        setTimeout(() => {
            item.addEventListener('mousemove', (e) => {
                if (isMobile) return;
                
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.15;
                const moveY = y * 0.15;
                
                item.style.transform = `translateY(-6px) translate(${moveX}px, ${moveY}px) scale(1.02)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(-6px) translate(0, 0) scale(1.02)';
            });
        }, 800); // Aguardar animações de entrada terminarem
        
        // Efeito parallax ao scroll (após animação de entrada)
        setTimeout(() => {
            const observerBullet = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !item.matches(':hover')) {
                        const scrollProgress = entry.intersectionRatio;
                        const parallaxValue = (1 - scrollProgress) * 10;
                        item.style.transform = `translateY(${parallaxValue * 0.1}px) scale(1)`;
                    }
                });
            }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
            
            observerBullet.observe(item);
        }, 800);
    });
    
    // ============================================
    // 13. PERFORMANCE - Reduzir animações em mobile
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches || isMobile) {
        // Desabilitar animações complexas
        tiltElements.forEach(el => {
            el.removeAttribute('data-tilt');
        });
        
        // Reduzir partículas
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
    
    // ============================================
    // 14. LAZY LOADING DE IMAGENS
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // 15. PRELOAD DE RECURSOS CRÍTICOS
    // ============================================
    const preloadImages = () => {
        const criticalImages = [
            'public/brendha.jpg',
            'public/Logo Líder Sem Medo Branco.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    };
    
    preloadImages();
    
    // ============================================
    // 16. CONTADOR ONLINE ANIMADO
    // ============================================
    const updateOnlineCounter = () => {
        const counters = document.querySelectorAll('#onlineCount, #onlineCountForm');
        const baseCount = 128;
        const variation = Math.floor(Math.random() * 20) - 10; // -10 a +10
        const newCount = Math.max(100, baseCount + variation);
        
        counters.forEach(counter => {
            if (counter) {
                const currentCount = parseInt(counter.textContent) || baseCount;
                const targetCount = newCount;
                const duration = 1000;
                const startTime = Date.now();
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(currentCount + (targetCount - currentCount) * easeOut);
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
            }
        });
        
        // Garantir que a mudança do contador não afete a largura da barra
        // A barra de progresso mantém sua largura fixa baseada no botão
        // A função syncProgressBarWidth está definida no escopo do DOMContentLoaded
        // Se estiver disponível, re-sincroniza após mudança do contador
        setTimeout(() => {
            const progressWrapperCheck = document.querySelector('.progress-wrapper');
            const progressContainerCheck = document.querySelector('.progress-bar-container');
            const ctaButtonCheck = document.getElementById('ctaHero');
            if (progressWrapperCheck && progressContainerCheck && ctaButtonCheck) {
                const buttonRect = ctaButtonCheck.getBoundingClientRect();
                const buttonWidth = buttonRect.width;
                progressWrapperCheck.style.width = `${buttonWidth}px`;
                progressWrapperCheck.style.maxWidth = `${buttonWidth}px`;
                progressContainerCheck.style.width = `${buttonWidth}px`;
                progressContainerCheck.style.maxWidth = `${buttonWidth}px`;
            }
        }, 50);
    };
    
    // Atualizar contador a cada 5-8 segundos
    setInterval(updateOnlineCounter, 5000 + Math.random() * 3000);
    
    // ============================================
    // 17. FAQ INTERATIVO
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Fechar todos os outros
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle do item atual
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // ============================================
    // 18. CARDS DE MENTORES - INTERATIVIDADE PREMIUM
    // Magnetic Effect e Parallax 3D
    // ============================================
    const mentorCards = document.querySelectorAll('.mentor-card');
    const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
    
    if (!isMobileDevice && mentorCards.length > 0) {
        mentorCards.forEach((card, index) => {
            const cardInner = card.querySelector('.mentor-card-inner');
            if (!cardInner) return;
            
            // Magnetic Effect
            let magneticActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const animateMagnetic = () => {
                if (!magneticActive) {
                    targetX = 0;
                    targetY = 0;
                }
                
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
                
                // Aplicar transform 3D com magnetic effect
                const baseY = -8;
                const baseRotateX = 2;
                cardInner.style.transform = `translateY(${baseY + currentY}px) rotateX(${baseRotateX + currentY * 0.02}deg) rotateY(${currentX * 0.02}deg) translateZ(20px)`;
                
                if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || magneticActive) {
                    requestAnimationFrame(animateMagnetic);
                }
            };
            
            card.addEventListener('mouseenter', () => {
                magneticActive = true;
                card.classList.add('magnetic-active');
                animateMagnetic();
            });
            
            card.addEventListener('mouseleave', () => {
                magneticActive = false;
                card.classList.remove('magnetic-active');
                targetX = 0;
                targetY = 0;
                // Resetar transform para o estado do hover CSS
                setTimeout(() => {
                    if (!magneticActive) {
                        cardInner.style.transform = '';
                    }
                }, 500);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!magneticActive) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.max(rect.width, rect.height) / 2;
                
                if (distance < maxDistance * 1.5) {
                    const strength = (1 - distance / (maxDistance * 1.5)) * 15;
                    targetX = (mouseX / maxDistance) * strength;
                    targetY = (mouseY / maxDistance) * strength;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            });
            
            // Parallax 3D na foto
            const photoFrame = card.querySelector('.mentor-photo-frame');
            if (photoFrame) {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const mouseX = (e.clientX - centerX) / rect.width;
                    const mouseY = (e.clientY - centerY) / rect.height;
                    
                    const rotateX = mouseY * -10;
                    const rotateY = mouseX * 10;
                    
                    photoFrame.style.transform = `translateZ(30px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    photoFrame.style.transform = 'translateZ(20px) scale(1) rotateX(0deg) rotateY(0deg)';
                });
            }
            
            // Delay para iniciar após animação de entrada
            card.style.willChange = 'transform';
            
            // Inicializar animação
            animateMagnetic();
        });
    }

    // ============================================
    // 20. SEÇÃO DE VÍDEO PREMIUM - INTERATIVIDADE AVANÇADA
    // Efeitos 3D, Magnetic, Parallax e Glow Interativo
    // ============================================
    
    // Interatividade Avançada do Card de Vídeo
    const videoContainer = document.querySelector('.video-container-premium');
    if (videoContainer && !isMobile) {
        let isHovering = false;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let mouseX = 0;
        let mouseY = 0;
        
        const overlayGradient = videoContainer.querySelector('.video-overlay-gradient');
        
        const animate3D = () => {
            if (!isHovering) {
                targetX = 0;
                targetY = 0;
            }
            
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            
            // Efeito 3D Tilt
            const rotateX = currentY * 0.5;
            const rotateY = currentX * 0.5;
            
            videoContainer.style.transform = `
                perspective(1200px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(0)
            `;
            
            // Atualizar posição do glow no overlay
            if (overlayGradient) {
                const rect = videoContainer.getBoundingClientRect();
                const x = ((mouseX - rect.left) / rect.width) * 100;
                const y = ((mouseY - rect.top) / rect.height) * 100;
                overlayGradient.style.setProperty('--mouse-x', `${x}%`);
                overlayGradient.style.setProperty('--mouse-y', `${y}%`);
            }
            
            if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || isHovering) {
                requestAnimationFrame(animate3D);
            }
        };
        
        videoContainer.addEventListener('mouseenter', () => {
            isHovering = true;
            animate3D();
        });
        
        videoContainer.addEventListener('mouseleave', () => {
            isHovering = false;
            targetX = 0;
            targetY = 0;
            setTimeout(() => {
                if (!isHovering) {
                    videoContainer.style.transform = '';
                }
            }, 500);
        });
        
        videoContainer.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = videoContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.max(rect.width, rect.height) / 2;
            
            if (distance < maxDistance * 2) {
                const strength = (1 - distance / (maxDistance * 2)) * 20;
                targetX = (x / maxDistance) * strength;
                targetY = (y / maxDistance) * strength;
            } else {
                targetX = 0;
                targetY = 0;
            }
        });
        
        // Inicializar animação
        animate3D();
    }
    
    // ============================================
    // 20b. SEÇÃO DE VÍDEO PREMIUM - INTERATIVIDADE
    // Efeitos Magnéticos e Contadores Animados
    // ============================================
    
    // Magnetic Effect para Cards de Dor
    const painCards = document.querySelectorAll('.pain-card-magnetic');
    if (!isMobile && painCards.length > 0) {
        painCards.forEach((card, index) => {
            let magneticActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const animateMagnetic = () => {
                if (!magneticActive) {
                    targetX = 0;
                    targetY = 0;
                }
                
                currentX += (targetX - currentX) * 0.15;
                currentY += (targetY - currentY) * 0.15;
                
                card.style.transform = `translateY(-6px) translate(${currentX}px, ${currentY}px) scale(1.02)`;
                
                if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || magneticActive) {
                    requestAnimationFrame(animateMagnetic);
                }
            };
            
            card.addEventListener('mouseenter', () => {
                magneticActive = true;
                animateMagnetic();
            });
            
            card.addEventListener('mouseleave', () => {
                magneticActive = false;
                targetX = 0;
                targetY = 0;
                setTimeout(() => {
                    if (!magneticActive) {
                        card.style.transform = '';
                    }
                }, 300);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!magneticActive) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.max(rect.width, rect.height) / 2;
                
                if (distance < maxDistance * 1.5) {
                    const strength = (1 - distance / (maxDistance * 1.5)) * 12;
                    targetX = (mouseX / maxDistance) * strength;
                    targetY = (mouseY / maxDistance) * strength;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            });
            
            setTimeout(() => animateMagnetic(), 500 + (index * 50));
        });
    }

    // Magnetic Effect para Cards de Transformação
    const transformationCards = document.querySelectorAll('.transformation-card-magnetic');
    if (!isMobile && transformationCards.length > 0) {
        transformationCards.forEach((card, index) => {
            let magneticActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const animateMagnetic = () => {
                if (!magneticActive) {
                    targetX = 0;
                    targetY = 0;
                }
                
                currentX += (targetX - currentX) * 0.15;
                currentY += (targetY - currentY) * 0.15;
                
                card.style.transform = `translateY(-8px) translate(${currentX}px, ${currentY}px) scale(1.03)`;
                
                if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || magneticActive) {
                    requestAnimationFrame(animateMagnetic);
                }
            };
            
            card.addEventListener('mouseenter', () => {
                magneticActive = true;
                animateMagnetic();
            });
            
            card.addEventListener('mouseleave', () => {
                magneticActive = false;
                targetX = 0;
                targetY = 0;
                setTimeout(() => {
                    if (!magneticActive) {
                        card.style.transform = '';
                    }
                }, 300);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!magneticActive) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.max(rect.width, rect.height) / 2;
                
                if (distance < maxDistance * 1.5) {
                    const strength = (1 - distance / (maxDistance * 1.5)) * 15;
                    targetX = (mouseX / maxDistance) * strength;
                    targetY = (mouseY / maxDistance) * strength;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            });
            
            setTimeout(() => animateMagnetic(), 600 + (index * 50));
        });
    }

    // Contador Animado para Métricas de Transformação
    const transformationMetrics = document.querySelectorAll('.transformation-metric[data-count]');
    if (transformationMetrics.length > 0) {
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-count')) || 0;
            const duration = 2000;
            const startTime = Date.now();
            const startValue = 0;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(startValue + (target - startValue) * easeOut);
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target;
                }
            };
            
            animate();
        };
        
        const transformationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    transformationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        transformationMetrics.forEach(metric => {
            transformationObserver.observe(metric);
        });
    }

    // Contador Animado para Estatísticas de Autoridade
    const authorityStats = document.querySelectorAll('.authority-stat-number[data-count]');
    if (authorityStats.length > 0) {
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-count')) || 0;
            const duration = 2500;
            const startTime = Date.now();
            const startValue = 0;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(startValue + (target - startValue) * easeOut);
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target;
                }
            };
            
            animate();
        };
        
        const authorityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    authorityObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        authorityStats.forEach(stat => {
            authorityObserver.observe(stat);
        });
    }

    // Magnetic Effect para Estatísticas de Autoridade
    const authorityStatCards = document.querySelectorAll('.authority-stat-magnetic');
    if (!isMobile && authorityStatCards.length > 0) {
        authorityStatCards.forEach((card, index) => {
            let magneticActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const animateMagnetic = () => {
                if (!magneticActive) {
                    targetX = 0;
                    targetY = 0;
                }
                
                currentX += (targetX - currentX) * 0.12;
                currentY += (targetY - currentY) * 0.12;
                
                card.style.transform = `translateY(-8px) translate(${currentX}px, ${currentY}px) scale(1.05)`;
                
                if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || magneticActive) {
                    requestAnimationFrame(animateMagnetic);
                }
            };
            
            card.addEventListener('mouseenter', () => {
                magneticActive = true;
                animateMagnetic();
            });
            
            card.addEventListener('mouseleave', () => {
                magneticActive = false;
                targetX = 0;
                targetY = 0;
                setTimeout(() => {
                    if (!magneticActive) {
                        card.style.transform = '';
                    }
                }, 400);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!magneticActive) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.max(rect.width, rect.height) / 2;
                
                if (distance < maxDistance * 1.5) {
                    const strength = (1 - distance / (maxDistance * 1.5)) * 10;
                    targetX = (mouseX / maxDistance) * strength;
                    targetY = (mouseY / maxDistance) * strength;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            });
            
            setTimeout(() => animateMagnetic(), 700 + (index * 50));
        });
    }

    // Magnetic Effect para Cards de Credenciais
    const credentialCards = document.querySelectorAll('.credential-card-magnetic');
    if (!isMobile && credentialCards.length > 0) {
        credentialCards.forEach((card, index) => {
            let magneticActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const animateMagnetic = () => {
                if (!magneticActive) {
                    targetX = 0;
                    targetY = 0;
                }
                
                currentX += (targetX - currentX) * 0.12;
                currentY += (targetY - currentY) * 0.12;
                
                card.style.transform = `translateY(-6px) translate(${currentX}px, ${currentY}px) rotateX(2deg)`;
                
                if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || magneticActive) {
                    requestAnimationFrame(animateMagnetic);
                }
            };
            
            card.addEventListener('mouseenter', () => {
                magneticActive = true;
                animateMagnetic();
            });
            
            card.addEventListener('mouseleave', () => {
                magneticActive = false;
                targetX = 0;
                targetY = 0;
                setTimeout(() => {
                    if (!magneticActive) {
                        card.style.transform = '';
                    }
                }, 400);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!magneticActive) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.max(rect.width, rect.height) / 2;
                
                if (distance < maxDistance * 1.5) {
                    const strength = (1 - distance / (maxDistance * 1.5)) * 12;
                    targetX = (mouseX / maxDistance) * strength;
                    targetY = (mouseY / maxDistance) * strength;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            });
            
            setTimeout(() => animateMagnetic(), 800 + (index * 100));
        });
    }

    // Magnetic Effect para Quote Cards
    const quoteCards = document.querySelectorAll('.quote-card-magnetic');
    if (!isMobile && quoteCards.length > 0) {
        quoteCards.forEach((card, index) => {
            let magneticActive = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const animateMagnetic = () => {
                if (!magneticActive) {
                    targetX = 0;
                    targetY = 0;
                }
                
                currentX += (targetX - currentX) * 0.15;
                currentY += (targetY - currentY) * 0.15;
                
                card.style.transform = `translateY(-6px) translate(${currentX}px, ${currentY}px) scale(1.02)`;
                
                if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01 || magneticActive) {
                    requestAnimationFrame(animateMagnetic);
                }
            };
            
            card.addEventListener('mouseenter', () => {
                magneticActive = true;
                animateMagnetic();
            });
            
            card.addEventListener('mouseleave', () => {
                magneticActive = false;
                targetX = 0;
                targetY = 0;
                setTimeout(() => {
                    if (!magneticActive) {
                        card.style.transform = '';
                    }
                }, 300);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!magneticActive) return;
                
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                const maxDistance = Math.max(rect.width, rect.height) / 2;
                
                if (distance < maxDistance * 1.5) {
                    const strength = (1 - distance / (maxDistance * 1.5)) * 10;
                    targetX = (mouseX / maxDistance) * strength;
                    targetY = (mouseY / maxDistance) * strength;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            });
            
            setTimeout(() => animateMagnetic(), 900 + (index * 100));
        });
    }
    
    // ============================================
    // 21. CARROSSEL DE DEPOIMENTOS
    // ============================================
    const depoCarousel = document.querySelector('.depoimentos-carousel');
    if (depoCarousel) {
        const track = depoCarousel.querySelector('.dep-track');
        const items = Array.from(track.querySelectorAll('.dep-item'));
        const btnPrev = depoCarousel.querySelector('.dep-prev');
        const btnNext = depoCarousel.querySelector('.dep-next');
        const dotsContainer = depoCarousel.querySelector('.dep-dots');
        const autoplay = depoCarousel.getAttribute('data-autoplay') === 'true';
        
        let index = 0;
        let itemsPerView = 1;
        let autoTimer = null;
        
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width >= 1024) itemsPerView = 3;
            else if (width >= 768) itemsPerView = 2;
            else itemsPerView = 1;
        };
        
        const updateDots = () => {
            dotsContainer.innerHTML = '';
            const pages = Math.ceil(items.length / itemsPerView);
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button');
                dot.className = 'dep-dot' + (i === index ? ' active' : '');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Ir para página ${i + 1}`);
                dot.addEventListener('click', () => {
                    index = i;
                    moveToIndex();
                });
                dotsContainer.appendChild(dot);
            }
        };
        
        const moveToIndex = () => {
            const percentage = -(index * 100);
            track.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
            track.style.transform = `translateX(${percentage}%)`;
            updateDots();
        };
        
        const goNext = () => {
            const pages = Math.ceil(items.length / itemsPerView);
            index = (index + 1) % pages;
            moveToIndex();
        };
        
        const goPrev = () => {
            const pages = Math.ceil(items.length / itemsPerView);
            index = (index - 1 + pages) % pages;
            moveToIndex();
        };
        
        const startAutoplay = () => {
            if (!autoplay) return;
            stopAutoplay();
            autoTimer = setInterval(goNext, 4000);
        };
        
        const stopAutoplay = () => {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = null;
        };
        
        // Controles
        if (btnNext) btnNext.addEventListener('click', goNext);
        if (btnPrev) btnPrev.addEventListener('click', goPrev);
        
        // Pause no hover
        depoCarousel.addEventListener('mouseenter', stopAutoplay);
        depoCarousel.addEventListener('mouseleave', startAutoplay);
        
        // Swipe mobile
        let startX = 0;
        let deltaX = 0;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            deltaX = 0;
            track.style.transition = 'none';
        }, { passive: true });
        track.addEventListener('touchmove', (e) => {
            deltaX = e.touches[0].clientX - startX;
        }, { passive: true });
        track.addEventListener('touchend', () => {
            track.style.transition = '';
            if (Math.abs(deltaX) > 40) {
                if (deltaX < 0) goNext();
                else goPrev();
            } else {
                moveToIndex();
            }
        }, { passive: true });
        
        // Resize
        window.addEventListener('resize', () => {
            const currentPageStart = index * itemsPerView;
            updateItemsPerView();
            index = Math.floor(currentPageStart / itemsPerView);
            updateDots();
            moveToIndex();
        });
        
        // Init
        updateItemsPerView();
        updateDots();
        moveToIndex();
        startAutoplay();
    }
    
    // ============================================
    // 21b. CARROSSEL DEPOIMENTOS (NOVO LAYOUT GLASS)
    // ============================================
    (function initEnhancedTestimonials(){
        const root = document.querySelector('.depoimentos-grid[data-enhanced-carousel="true"]');
        if (!root) return;
        const viewport = root.querySelector('.dep-viewport');
        const track = root.querySelector('.dep-track');
        const items = Array.from(track.querySelectorAll('.dep-item'));
        const btnPrev = root.querySelector('.dep-prev');
        const btnNext = root.querySelector('.dep-next');
        const dotsContainer = root.querySelector('.dep-dots');
        const autoplay = root.getAttribute('data-autoplay') === 'true';
        
        let index = 0;
        let itemsPerView = 1;
        let autoTimer = null;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTransform = 0;
        
        const getPages = () => Math.max(1, Math.ceil(items.length / itemsPerView));
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width >= 1024) itemsPerView = 3;
            else if (width >= 768) itemsPerView = 2;
            else itemsPerView = 1;
        };
        const updateDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const pages = getPages();
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button');
                dot.className = 'dep-dot' + (i === index ? ' active' : '');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Ir para página ${i + 1}`);
                dot.addEventListener('click', () => {
                    index = i;
                    moveToIndex();
                    startAutoplay();
                });
                dotsContainer.appendChild(dot);
            }
        };
        const moveToIndex = () => {
            const percentage = -(index * 100);
            track.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
            track.style.transform = `translateX(${percentage}%)`;
            updateDots();
        };
        const goNext = () => { index = (index + 1) % getPages(); moveToIndex(); };
        const goPrev = () => { index = (index - 1 + getPages()) % getPages(); moveToIndex(); };
        
        const startAutoplay = () => {
            stopAutoplay();
            if (!autoplay) return;
            autoTimer = setInterval(goNext, 4000);
        };
        const stopAutoplay = () => { if (autoTimer) clearInterval(autoTimer); autoTimer = null; };
        
        // Controls
        btnNext?.addEventListener('click', goNext);
        btnPrev?.addEventListener('click', goPrev);
        viewport?.addEventListener('mouseenter', stopAutoplay);
        viewport?.addEventListener('mouseleave', startAutoplay);
        
        // Keyboard
        viewport?.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
            if (e.key === 'Home') { e.preventDefault(); index = 0; moveToIndex(); }
            if (e.key === 'End') { e.preventDefault(); index = getPages() - 1; moveToIndex(); }
        });
        
        // Drag / Swipe
        const onDragStart = (clientX) => {
            isDragging = true;
            startX = clientX;
            currentX = clientX;
            startTransform = -index * 100;
            track.style.transition = 'none';
        };
        const onDragMove = (clientX) => {
            if (!isDragging) return;
            currentX = clientX;
            const delta = ((currentX - startX) / (viewport.clientWidth || 1)) * 100;
            track.style.transform = `translateX(${startTransform + delta}%)`;
        };
        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            const delta = ((currentX - startX) / (viewport.clientWidth || 1)) * 100;
            const threshold = 15; // %
            if (delta < -threshold) goNext();
            else if (delta > threshold) goPrev();
            else moveToIndex();
        };
        viewport?.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
        viewport?.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
        viewport?.addEventListener('touchend', onDragEnd, { passive: true });
        viewport?.addEventListener('mousedown', (e) => onDragStart(e.clientX));
        window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
        window.addEventListener('mouseup', onDragEnd);
        
        // Resize
        window.addEventListener('resize', () => {
            const currentStart = index * itemsPerView;
            updateItemsPerView();
            index = Math.floor(currentStart / itemsPerView);
            updateDots();
            moveToIndex();
        });
        
        // Init
        updateItemsPerView();
        updateDots();
        moveToIndex();
        startAutoplay();
    })();
    
    // ============================================
    // 21c. Depoimentos - Expansão de texto e micro-reações
    // ============================================
    (function initDepoimentosInteractions(){
        const cards = document.querySelectorAll('.dep-item');
        if (!cards.length) return;
        
        // Toggle expand
        document.querySelectorAll('.depoimento-expand').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');
                const text = targetId ? document.getElementById(targetId) : null;
                if (!text) return;
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', String(!expanded));
                btn.textContent = expanded ? 'ver mais' : 'ver menos';
                text.style.maxHeight = expanded ? '72px' : '400px';
            });
        });
        
        // Reactions
        const emojis = ['✨','🔥','👏','💡','🚀'];
        const spawnEmoji = (container, x, y) => {
            const el = document.createElement('span');
            el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
            el.style.position = 'absolute';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.transition = 'transform 700ms ease, opacity 700ms ease';
            el.style.transform = 'translate(-50%, -50%) scale(0.8)';
            el.style.opacity = '1';
            container.appendChild(el);
            requestAnimationFrame(() => {
                el.style.transform = `translate(-50%, -120%) scale(1.2)`;
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 700);
            });
        };
        
        cards.forEach(card => {
            const layer = card.querySelector('.dep-emoji-reactions');
            if (!layer) return;
            card.addEventListener('click', (e) => {
                const rect = card.getBoundingClientRect();
                spawnEmoji(layer, e.clientX - rect.left, e.clientY - rect.top);
            });
        });
    })();
    
    // ============================================
    // 21d. Mentores - Tabs e Parallax Foto
    // ============================================
    (function initMentorTabs(){
        const groups = document.querySelectorAll('.mentor-card');
        if (!groups.length) return;
        groups.forEach((card) => {
            // Tabs
            const tabs = Array.from(card.querySelectorAll('.mentor-tab'));
            const panels = Array.from(card.querySelectorAll('.mentor-panel'));
            if (tabs.length && panels.length){
                tabs.forEach((tab) => {
                    tab.addEventListener('click', () => {
                        const targetId = tab.getAttribute('aria-controls');
                        tabs.forEach(t => t.classList.remove('active'));
                        panels.forEach(p => p.classList.remove('active'));
                        tab.classList.add('active');
                        const target = targetId ? card.querySelector(`#${targetId}`) : null;
                        if (target) target.classList.add('active');
                    });
                });
            }
        });
    })();
    
    // ============================================
    // 22. CONTEÚDO DA AULA - ACORDEÕES INTERATIVOS
    // ============================================
    (function initConteudoAulaAccordions() {
        const accordionRoot = document.querySelector('.conteudo-accordion');
        if (!accordionRoot) return;

        const items = Array.from(accordionRoot.querySelectorAll('.accordion-item'));

        const collapse = (panel) => {
            panel.style.height = `${panel.scrollHeight}px`; // set current height to enable transition
            // force reflow to ensure transition starts from current height
            // eslint-disable-next-line no-unused-expressions
            panel.offsetHeight;
            panel.style.height = '0px';
            panel.setAttribute('aria-hidden', 'true');
        };

        const expand = (panel) => {
            const target = panel.scrollHeight;
            panel.style.height = `${target}px`;
            panel.setAttribute('aria-hidden', 'false');
            const onEnd = () => {
                panel.style.height = 'auto';
                panel.removeEventListener('transitionend', onEnd);
            };
            panel.addEventListener('transitionend', onEnd);
        };

        const toggleItem = (item) => {
            const button = item.querySelector('.accordion-button');
            const panel = item.querySelector('.accordion-panel');
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            // close all others
            items.forEach((other) => {
                if (other === item) return;
                const btn = other.querySelector('.accordion-button');
                const pnl = other.querySelector('.accordion-panel');
                if (btn.getAttribute('aria-expanded') === 'true') {
                    btn.setAttribute('aria-expanded', 'false');
                    collapse(pnl);
                }
            });

            if (isOpen) {
                button.setAttribute('aria-expanded', 'false');
                collapse(panel);
            } else {
                button.setAttribute('aria-expanded', 'true');
                // ensure height starts from 0 when expanding from collapsed
                if (panel.style.height === '' || panel.style.height === '0px') {
                    panel.style.height = '0px';
                    // force reflow
                    // eslint-disable-next-line no-unused-expressions
                    panel.offsetHeight;
                }
                expand(panel);
            }
        };

        items.forEach((item) => {
            const button = item.querySelector('.accordion-button');
            const panel = item.querySelector('.accordion-panel');
            if (!button || !panel) return;

            // start collapsed
            button.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
            panel.style.height = '0px';

            button.addEventListener('click', () => toggleItem(item));
            // Allow toggling with Enter/Space is already default for buttons, but keep explicit key support just in case
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleItem(item);
                }
            });
        });
    })();
    
});

// ============================================
// PERFORMANCE - RequestAnimationFrame para scroll
// ============================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll handlers já estão otimizados acima
    });
}, { passive: true });

// ============================================
// CONSENTIMENTO (Google Analytics) + Banner
// ============================================
(function initConsent(){
    const GA_ID = 'G-XXXXXXX'; // substitua pelo ID real
    const banner = document.getElementById('consent-banner');
    const btnAccept = document.getElementById('consent-accept');
    const btnDecline = document.getElementById('consent-decline');

    const CONSENT_KEY = 'lsm_consent_choice';
    const choice = localStorage.getItem(CONSENT_KEY);

    function enableAnalytics(){
        if (!GA_ID || GA_ID === 'G-XXXXXXX') return; // evita erro sem ID
        gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });
        const s = document.createElement('script');
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        s.async = true;
        document.head.appendChild(s);
        const inl = document.createElement('script');
        inl.text = `gtag('js', new Date()); gtag('config', '${GA_ID}');`;
        document.head.appendChild(inl);
    }

    if (!choice) {
        if (banner) banner.hidden = false;
    } else if (choice === 'accepted') {
        enableAnalytics();
    }

    btnAccept?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        enableAnalytics();
        if (banner) banner.hidden = true;
    });

    btnDecline?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
        if (banner) banner.hidden = true;
    });
})();
