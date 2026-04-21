/**
 * IL SENTIERO DEL DHARMA - LOGICA APPLICATIVA
 */

// --- NAVIGAZIONE ---
function showSection(sectionId) {
    // Nascondi tutte le sezioni
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Mostra la sezione target
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');
    
    // Aggiorna i bottoni della navbar
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.sec === sectionId);
    });
    
    // Cambia attributo nel body per CSS dinamico
    document.body.dataset.section = sectionId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- GESTIONE PROGRESSI ---
let completedModules = JSON.parse(localStorage.getItem('dharmaProgress')) || [];

function toggleModule(modId) {
    if (completedModules.includes(modId)) {
        completedModules = completedModules.filter(id => id !== modId);
    } else {
        completedModules.push(modId);
    }
    saveProgress();
    updateUI();
}

function saveProgress() {
    localStorage.setItem('dharmaProgress', JSON.stringify(completedModules));
}

function updateUI() {
    // Calcola percentuale (basata sui 2 moduli attuali)
    const totalModules = 2; 
    const percent = Math.round((completedModules.length / totalModules) * 100) || 0;
    
    // Aggiorna barre e testi progresso
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    if (progressText) progressText.innerText = percent + '%';
    if (progressFill) progressFill.style.width = percent + '%';
    
    // Aggiorna lo stato visivo delle card
    document.querySelectorAll('.module-card').forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) {
            // Estrae l'ID dal richiamo onchange (es. '1.1')
            const match = checkbox.getAttribute('onchange').match(/'([^']+)'/);
            if (match) {
                const modId = match[1];
                checkbox.checked = completedModules.includes(modId);
                card.classList.toggle('completed', checkbox.checked);
            }
        }
    });
}

// --- TIMER DI MEDITAZIONE ---
let timerInterval = null;
let timeLeft = 15 * 60; // 15 min default

function setDuration(minutes) {
    timerReset();
    timeLeft = minutes * 60;
    updateTimerDisplay();
    
    // Attiva lo stato visivo sul bottone
    document.querySelectorAll('.dur-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.innerText) === minutes);
    });
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const display = document.getElementById('timerTime');
    if (display) display.innerText = `${min}:${sec.toString().padStart(2, '0')}`;
}

function timerToggle() {
    const btn = document.getElementById('timerStartBtn');
    
    if (timerInterval) {
        // Pausa
        clearInterval(timerInterval);
        timerInterval = null;
        if (btn) btn.innerText = "▶ Inizia";
    } else {
        // Avvio
        if (btn) btn.innerText = "⏸ Pausa";
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                if (btn) btn.innerText = "▶ Inizia";
                alert("Sessione conclusa. Dedica i meriti di questa pratica a tutti gli esseri senzienti.");
                timeLeft = 15 * 60; // Reset a default
                updateTimerDisplay();
            }
        }, 1000);
    }
}

function timerReset() {
    clearInterval(timerInterval);
    timerInterval = null;
    const btn = document.getElementById('timerStartBtn');
    if (btn) btn.innerText = "▶ Inizia";
    timeLeft = 15 * 60;
    updateTimerDisplay();
}

// --- GESTIONE TAB MUSICA ---
function showMusicTab(type) {
    document.getElementById('spotifyContent').style.display = type === 'spotify' ? 'block' : 'none';
    document.getElementById('youtubeContent').style.display = type === 'youtube' ? 'block' : 'none';
    
    document.querySelectorAll('.music-tab').forEach(tab => {
        tab.classList.toggle('active', tab.innerText.toLowerCase().includes(type));
    });
}

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    updateTimerDisplay();
    console.log("🕉️ Sentiero del Dharma pronto.");
});
