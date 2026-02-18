// Floating Particles Animation — with mouse interactivity
(function() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const mouse = {
        x: null,
        y: null,
        radius: 150       // influence radius around cursor
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Optional: click burst — repels particles outward on click
    window.addEventListener('click', (e) => {
        const burst = { x: e.clientX, y: e.clientY };
        particles.forEach(p => {
            const dx = p.x - burst.x;
            const dy = p.y - burst.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200;
                p.vx += (dx / dist) * force * 4;
                p.vy += (dy / dist) * force * 4;
            }
        });
    });
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 3 + 1;
            this.baseSize = this.size;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            // velocity (used by click burst & mouse pull)
            this.vx = 0;
            this.vy = 0;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.baseOpacity = this.opacity;
        }
        
        update() {
            // Drift movement
            this.x += this.speedX + this.vx;
            this.y += this.speedY + this.vy;

            // Gradually damp extra velocity
            this.vx *= 0.92;
            this.vy *= 0.92;

            // Wrap around edges
            if (this.x > canvas.width)  this.x = 0;
            if (this.x < 0)             this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0)             this.y = canvas.height;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius; // 0→1 as dist→0

                    // Gentle attraction toward cursor
                    this.vx += (dx / dist) * force * 0.6;
                    this.vy += (dy / dist) * force * 0.6;

                    // Brighten & grow when near cursor
                    this.opacity  = Math.min(1, this.baseOpacity  + force * 0.5);
                    this.size     = this.baseSize + force * 2;
                } else {
                    // Ease back to normal
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                    this.size    += (this.baseSize    - this.size)    * 0.05;
                }
            } else {
                this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                this.size    += (this.baseSize    - this.size)    * 0.05;
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }
    
    function connectParticles() {
        // Expand connection radius around mouse
        const mouseBoost = mouse.x !== null ? 60 : 0;
        const baseRadius = 120;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Check if either particle is near the mouse
                let radius = baseRadius;
                if (mouse.x !== null) {
                    const mi = Math.sqrt((particles[i].x - mouse.x) ** 2 + (particles[i].y - mouse.y) ** 2);
                    const mj = Math.sqrt((particles[j].x - mouse.x) ** 2 + (particles[j].y - mouse.y) ** 2);
                    if (mi < mouse.radius || mj < mouse.radius) {
                        radius = baseRadius + mouseBoost;
                    }
                }

                if (distance < radius) {
                    const opacity = (1 - distance / radius) * 0.25;
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    resizeCanvas();
    init();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });
})();
