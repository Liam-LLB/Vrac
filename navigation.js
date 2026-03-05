/**
 * Navigation system
 * Shortcut: ArrowLeft → ArrowUp → ArrowRight (in sequence) opens the page selector.
 * Clicking a page navigates to it and closes the overlay.
 * Pressing Escape or clicking the overlay background also closes it.
 */
(function () {
    // ── Page registry ──
    // Each entry: { id, label }
    // Add pages here as screenshots get recreated.
    const pages = [
        { id: 'accueil', label: 'Accueil' },
    ];

    // ── DOM refs ──
    const overlay = document.getElementById('nav-overlay');
    const navList = document.getElementById('nav-list');
    let currentPageId = 'accueil';

    // ── Combo detection ──
    const COMBO = ['ArrowLeft', 'ArrowUp', 'ArrowRight'];
    let comboIndex = 0;
    let comboTimer = null;

    function resetCombo() {
        comboIndex = 0;
        clearTimeout(comboTimer);
    }

    document.addEventListener('keydown', (e) => {
        // Close overlay on Escape
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            closeNav();
            return;
        }

        // Combo detection
        if (e.key === COMBO[comboIndex]) {
            comboIndex++;
            clearTimeout(comboTimer);

            if (comboIndex === COMBO.length) {
                // Full combo entered
                resetCombo();
                toggleNav();
            } else {
                // Must press next key within 800ms
                comboTimer = setTimeout(resetCombo, 800);
            }
        } else {
            resetCombo();
        }
    });

    // ── Navigation UI ──
    function buildNavList() {
        navList.innerHTML = '';
        pages.forEach((page) => {
            const li = document.createElement('li');
            li.textContent = page.label;
            if (page.id === currentPageId) {
                li.classList.add('current');
            }
            li.addEventListener('click', () => {
                navigateTo(page.id);
                closeNav();
            });
            navList.appendChild(li);
        });
    }

    function openNav() {
        buildNavList();
        overlay.classList.remove('hidden');
    }

    function closeNav() {
        overlay.classList.add('hidden');
    }

    function toggleNav() {
        if (overlay.classList.contains('hidden')) {
            openNav();
        } else {
            closeNav();
        }
    }

    // Close when clicking overlay background (not the dropdown itself)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeNav();
        }
    });

    // ── Page switching ──
    function navigateTo(pageId) {
        document.querySelectorAll('.page').forEach((section) => {
            section.classList.remove('active');
        });
        const target = document.querySelector(`.page[data-page="${pageId}"]`);
        if (target) {
            target.classList.add('active');
            currentPageId = pageId;
        }
    }

    // Expose helper for adding pages dynamically (used when recreating screenshots)
    window.__NAV__ = { pages, navigateTo, buildNavList };
})();
