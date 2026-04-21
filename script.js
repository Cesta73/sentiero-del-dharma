// NAVIGATION
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.sec === sectionId);
    });
    
    document.body.dataset.section = sectionId;
    window.scrollTo(0, 0);
}

// PROGRESS TRACKING
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
    const totalModules = document.querySelectorAll('.module-card').length;
    const percent = Math.round((completedModules.length / totalModules) * 100) || 0;
    
    document.getElementById('totalProgress').innerText = percent + '%';
    document.getElementById('progressText').innerText = percent + '%';
    document.getElementById('progressFill').style.width = percent + '%';
    
    document.querySelectorAll('.module-card').forEach(card => {
        const modId = card.dataset.module;
        const isDone = completedModules.includes(modId);
        card.style.opacity = isDone ? '0.7' : '1';
        card.querySelector('input').checked = isDone;
    });
}

// TIMER
let timerInterval;
let timeLeft = 1200; // 20 min default

function setTimer(minutes) {
    clearInterval(timerInterval);
    timeLeft = minutes * 60;
    updateTimerDisplay();
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
}

function setCustomTimer() {
    const min = prompt("Inserisci i minuti:", "20");
    if (min) setTimer(parseInt(min));
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById('timerDisplay').innerText = 
        `${min}:${sec.toString().padStart(2, '0')}`;
}

function startTimer() {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Sessione conclusa. Dedica i meriti!");
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
}

function resetTimer() {
    pauseTimer();
    setTimer(20);
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    updateTimerDisplay();
});
