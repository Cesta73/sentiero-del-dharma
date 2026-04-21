/**
 * IL SENTIERO DEL DHARMA - LOGICA FUNZIONALE
 */

// --- NAVIGAZIONE ---
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.sec === id);
    });
    
    document.body.dataset.section = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- GESTIONE PROGRESSI ---
let completedModules = JSON.parse(localStorage.getItem('dharmaProgress')) || [];

function toggleModule(id) {
    if (completedModules.includes(id)) {
        completedModules = completedModules.filter(m => m !== id);
    } else {
        completedModules.push(id);
    }
    localStorage.setItem('dharmaProgress', JSON.stringify(completedModules));
    updateUI();
}

function updateUI() {
    const modules = document.querySelectorAll('.module-card');
    const total = modules.length || 1;
    const percent = Math.round((completedModules.length / total) * 100) || 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.innerText = percent + '% Completato';
    
    modules.forEach(card => {
        const modId = card.dataset.module;
        const isDone = completedModules.includes(modId);
        card.classList.toggle('completed', isDone);
        const cb = card.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = isDone;
    });
}

// --- TIMER MEDITAZIONE ---
let timerInterval = null;
let initialTime = 900; // 15 min default
let timeLeft = 900;

function setDuration(m) {
    timerReset();
    initialTime = m * 60;
    timeLeft = initialTime;
    updateTimerDisplay();
    
    document.querySelectorAll('.dur-btn').forEach(b => {
        b.classList.toggle('active', b.innerText.includes(m));
    });
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const display = document.getElementById('timerTime');
    if (display) display.innerText = `${min}:${sec.toString().padStart(2, '0')}`;
    
    // SVG Progress: Circumference is 565 (2 * PI * 90)
    const circle = document.getElementById('timerProgress');
    if (circle) {
        const progress = timeLeft / initialTime;
        const offset = 565 * (1 - progress);
        circle.style.strokeDashoffset = offset;
    }
}

function timerToggle() {
    const btn = document.getElementById('timerStartBtn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (btn) btn.innerText = "Riprendi";
    } else {
        if (btn) btn.innerText = "Pausa";
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Sessione conclusa. Dedica i meriti.");
                timerReset();
            }
        }, 1000);
    }
}

function timerReset() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = initialTime;
    const btn = document.getElementById('timerStartBtn');
    if (btn) btn.innerText = "Inizia";
    updateTimerDisplay();
}

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI update
    updateUI();
    
    // Setup SVG circumference
    const circle = document.getElementById('timerProgress');
    if (circle) {
        circle.style.strokeDasharray = 565;
        circle.style.strokeDashoffset = 0;
    }
    updateTimerDisplay();
});
