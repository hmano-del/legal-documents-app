// Animations and Interactive Effects

// ─── Stat Counter ───────────────────────────────────────────────────────────
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ─── Stacked Card Pile ───────────────────────────────────────────────────────
function initStackedCards() {
    const grid = document.querySelector('.documents-grid');
    if (!grid) return;

    // Collect original cards
    const cards = [...grid.querySelectorAll('.doc-card')];
    if (!cards.length) return;

    // Wrap cards in a centred pile div
    const pile = document.createElement('div');
    pile.className = 'stack-pile';
    cards.forEach(c => pile.appendChild(c));

    // Hint label
    const hint = document.createElement('div');
    hint.className = 'stack-hint';
    hint.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/></svg> tap to cycle`;
    pile.appendChild(hint);

    grid.appendChild(pile);

    // State
    let order = cards.map((_, i) => i); // order[0] = index of top card
    let animating = false;

    // Set CSS --depth on each card from the current order
    function applyDepths() {
        order.forEach((cardIdx, depth) => {
            cards[cardIdx].style.setProperty('--depth', depth);
        });
    }

    // Initial paint — cards start invisible below, then rise into the stack
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(80px) scale(0.85)';
        card.style.transition = 'none';
    });

    applyDepths();

    // Stagger the initial appearance
    requestAnimationFrame(() => {
        // Reverse order so the top card appears last (on top)
        [...order].reverse().forEach((cardIdx, i) => {
            setTimeout(() => {
                const card = cards[cardIdx];
                card.style.transition =
                    'transform 0.65s cubic-bezier(0.34,1.42,0.64,1), opacity 0.5s ease';
                card.style.opacity = '';
                card.style.transform = '';
            }, 120 + i * 110);
        });
    });

    // Cycle: send the top card flying left, promote the next card to top
    function cycleCard() {
        if (animating) return;
        animating = true;

        const topIdx = order[0];
        const topCard = cards[topIdx];

        // 1. Fly out
        topCard.classList.add('flying-out');

        setTimeout(() => {
            // 2. Move top card to the bottom of the order
            order.push(order.shift());

            // 3. Snap the recycled card to "back of pile" position off-screen
            topCard.classList.remove('flying-out');
            topCard.classList.add('flying-in');
            topCard.style.transition = 'none';

            // Force reflow so the transition-none takes hold
            void topCard.offsetWidth;

            // 4. Update depths for the new order
            applyDepths();

            // 5. Animate everything to new positions
            requestAnimationFrame(() => {
                topCard.classList.remove('flying-in');
                topCard.style.transition = '';   // let CSS take over
                topCard.style.opacity = '';
                topCard.style.transform = '';

                animating = false;
            });
        }, 480); // matches flying-out transition duration
    }

    // Click the pile (or top card) to cycle
    pile.addEventListener('click', (e) => {
        // Don't cycle if they clicked the CTA button itself
        if (e.target.closest('.doc-cta')) return;
        cycleCard();
    });

    // Keyboard: arrow keys also cycle
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') cycleCard();
    });
}

// ─── Scroll observer ────────────────────────────────────────────────────────
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stat-number')) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Stat counters
    document.querySelectorAll('.stat-number').forEach(stat => observer.observe(stat));

    // Stacked card pile
    initStackedCards();

    // Smooth scroll + active nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });
});
