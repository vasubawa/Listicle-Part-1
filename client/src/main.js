const app = document.getElementById('app');
let bosses = [];

function handleRoute() {
    const path = window.location.pathname;

    if (path === '/' || path === '') {
        renderBossList();
    } else if (path.startsWith('/bosses/')) {
        const bossId = path.replace('/bosses/', '');
        showBossDetail(bossId);
    } else {
        show404();
    }
}

function navigateTo(path) {
    window.history.pushState(null, '', path);
    handleRoute();
}

async function fetchBosses() {
    try {
        const response = await fetch('http://localhost:3000/data/bosses');
        if (!response.ok) throw new Error('Failed to fetch bosses');
        bosses = await response.json();
        handleRoute();
    } catch (error) {
        console.error('Error fetching bosses:', error);
        app.innerHTML = '<div class="error">Error loading bosses. Please check if the server is running on port 3000.</div>';
    }
}

function renderBossList() {
    app.innerHTML = `
        <div class="container">
            <section class="challenge-section">
                <h2 class="secondary">Choose Your Challenge</h2>
                <p class="text-muted">Click any boss to learn their movesets, weaknesses, and battle strategies</p>
                <div class="boss-grid" id="bossGrid">
                    ${bosses.map(boss => createBossCard(boss)).join('')}
                </div>
            </section>
        </div>
    `;

    document.querySelectorAll('.boss-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const bossId = e.currentTarget.dataset.bossId;
            navigateTo(`/bosses/${bossId}`);
        });
    });
}

function createBossCard(boss) {
    const difficultyClass = boss.difficulty.toLowerCase();
    return `
        <article class="boss-card" data-boss-id="${boss.id}">
            <div class="boss-card-image no-image" id="image-${boss.id.toLowerCase().replace(/\s+/g, '-')}">
                ${boss.image ? `<img src="${boss.image}" alt="${boss.name}" onload="this.parentElement.classList.remove('no-image')" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';" />` : ''}
                <div class="difficulty-badge difficulty-${difficultyClass} card-difficulty">${boss.difficulty}</div>
            </div>
            <div class="boss-card-content">
                <h3>${boss.name}</h3>
                <div class="boss-location">${boss.shortLocation || boss.location}</div>
                <div class="view-details">View Details →</div>
            </div>
        </article>
    `;
}

function showBossDetail(bossId) {
    const boss = bosses.find(b => b.id === bossId);
    if (!boss) {
        show404();
        return;
    }

    window.history.replaceState(null, '', `/bosses/${bossId}`);

    app.innerHTML = `
        <div class="container">
            <div class="boss-detail-card">
                <header class="detail-header">
                    <button class="back-button" onclick="navigateTo('/')">← Back to Bosses</button>
                    <h1>${boss.name}</h1>
                    <div class="difficulty-badge difficulty-${boss.difficulty.toLowerCase()} detail-difficulty">${boss.difficulty}</div>
                </header>
                <div class="detail-content">
                    <div class="detail-image">
                        <img src="${boss.image}" alt="${boss.name}" />
                    </div>
                    <div class="detail-info">
                        <div class="info-section">
                            <h3>Location</h3>
                            <p>${boss.location}</p>
                        </div>

                        <div class="info-section">
                            <h3>Description</h3>
                            <p>${boss.description}</p>
                        </div>

                        <div class="info-section">
                            <h3>Moveset</h3>
                            <ul>
                                ${boss.moveset.map(move => `<li>${move}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="info-section">
                            <h3>Tips</h3>
                            <ul>
                                ${boss.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function show404() {
    app.innerHTML = `
        <div class="container">
            <h1>404</h1>
            <p>Boss not found!</p>
            <button onclick="goHome()">← Back to Boss List</button>
        </div>
    `;
}

function goHome() {
    renderBossList();
}

window.navigateTo = navigateTo;
window.goHome = goHome;

fetchBosses();

window.addEventListener('popstate', handleRoute);
