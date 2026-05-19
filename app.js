// NgalSo v0.3 - Pratica Tibetana
// Per Lama Michel NgalSo lineage - Con trasmissione ricevuta

(() => {
  // ========== STORAGE ==========
  const storage = {
    get(key, fallback = null) {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }
  };

  // ========== COSTANTI ==========
  const MANTRA_REPETITIONS = { short: 7, full: 21 };
  
  const PRACTICE_STEPS_MORNING = [
    { title: "Rifugio", text: "NAMO GURU BYE / NAMO BUDDHAYA / NAMO DHARMAYA / NAMO SANGHAYA (×3)", mantra: "NAMO GURU BYE", reps: 3 },
    { title: "Bodhicitta", text: "Per il beneficio di tutti gli esseri, raggiungerò l'illuminazione.", mantra: "OM BODHICITTA HUNG", reps: 3 },
    { title: "Mantra cuore", text: "Ammorbidisci il petto, respira con compassione.", mantra: "OM MANI PEME HUNG", reps: 21 },
    { title: "Dedica", text: "Possa questo merito portare pace a tutti gli esseri.", mantra: "", reps: 0 }
  ];
  
  const PRACTICE_STEPS_EVENING = [
    { title: "Scarico", text: "Espira le tensioni del giorno. Inspira calma.", mantra: "OM AH HUNG", reps: 7 },
    { title: "Purificazione elementi", text: "EH YAM RAM LAM BAM / HO SHUDDHE SHUDDHE SOHA", mantra: "EH YAM RAM LAM BAM HO SHUDDHE SHUDDHE SOHA", reps: 5 },
    { title: "Mantra cuore", text: "Lascia andare ciò che non serve più.", mantra: "OM MANI PEME HUNG", reps: 21 },
    { title: "Dedica e auspicio", text: "Che tutti gli esseri siano liberi dalla sofferenza.", mantra: "", reps: 0 }
  ];
  
  const PRECEPTS_LIST = [
    "Non uccidere nessun essere vivente",
    "Non rubare",
    "Non avere attività sessuale",
    "Non mentire",
    "Non assumere intossicanti",
    "Non mangiare dopo mezzogiorno",
    "Non sedersi su letti alti o lussuosi",
    "Non usare ornamenti, profumi o musica"
  ];
  
  const MOON_PHASES = {
    new: { name: "🌑 Luna nuova", favorable: true, practice: "8 precetti", icon: "🌑" },
    waxing: { name: "🌒 Luna crescente", favorable: false, practice: "pratica NgalSo", icon: "🌒" },
    first: { name: "🌓 Primo quarto", favorable: true, practice: "disciplina e stabilità", icon: "🌓" },
    gibbousWax: { name: "🌔 Gibbosa crescente", favorable: false, practice: "mantra e respiro", icon: "🌔" },
    full: { name: "🌕 Luna piena", favorable: true, practice: "8 precetti", icon: "🌕" },
    gibbousWane: { name: "🌖 Gibbosa calante", favorable: false, practice: "purificazione", icon: "🌖" },
    last: { name: "🌗 Ultimo quarto", favorable: true, practice: "lasciare andare", icon: "🌗" },
    waning: { name: "🌘 Luna calante", favorable: false, practice: "riposo e riflessione", icon: "🌘" }
  };

  // ========== STATO ==========
  let currentTab = "practice";
  let currentPractice = { type: "morning", duration: 5, steps: PRACTICE_STEPS_MORNING };
  let currentStep = 0;
  let timerRunning = false;
  let timerInterval = null;
  let timerRemaining = 300; // 5 minuti in secondi
  let timerTotal = 300;
  let currentReps = 0;
  let targetReps = 0;
  
  // ========== FUNZIONI AUDIO ==========
  function playBell(kind = "start") {
    const audio = new Audio();
    const fileName = kind === "start" ? "audio/bell-start.mp3" : "audio/bell-interval.mp3";
    audio.src = fileName;
    audio.volume = 0.5;
    audio.play().catch(e => {
      console.warn("Audio fallback:", e);
      playWebAudioBell(kind);
    });
  }
  
  function playWebAudioBell(kind) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "start" ? 3 : 1.5));
      
      const freqs = kind === "start" ? [196, 392, 587] : [440, 880];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + (kind === "start" ? 2.5 : 1));
      });
      setTimeout(() => ctx.close(), 3000);
    } catch(e) {}
  }
  
  // ========== STREAK ==========
  function getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }
  
  function updateStreak(sessionCompleted = false) {
    const today = getTodayKey();
    const sessions = storage.get("ngalso_sessions", {});
    if (sessionCompleted && !sessions[today]) {
      sessions[today] = { date: today, completed: true };
      storage.set("ngalso_sessions", sessions);
    }
    
    let streak = 0;
    let current = new Date();
    while (true) {
      const key = current.toISOString().split('T')[0];
      if (sessions[key]?.completed) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    
    document.getElementById("streakCount").innerText = streak;
    return streak;
  }
  
  // ========== FASI LUNARI ==========
  function getMoonAge() {
    const synodicMonth = 29.530588853;
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
    const days = (Date.now() - knownNewMoon) / 86400000;
    return ((days % synodicMonth) + synodicMonth) % synodicMonth;
  }
  
  function getMoonPhase(age) {
    if (age < 1.2 || age >= 28.33) return "new";
    if (age < 5.54) return "waxing";
    if (age >= 6.8 && age < 8.2) return "first";
    if (age < 9.23) return "waxing";
    if (age < 12.92) return "gibbousWax";
    if (age >= 13.6 && age < 16) return "full";
    if (age < 20.30) return "gibbousWane";
    if (age >= 21 && age < 23) return "last";
    return "waning";
  }
  
  function renderMoonPanel() {
    const age = getMoonAge();
    const phaseKey = getMoonPhase(age);
    const phase = MOON_PHASES[phaseKey];
    
    document.getElementById("moonIcon").innerHTML = phase.icon;
    document.getElementById("moonPhaseName").innerHTML = phase.name;
    document.getElementById("moonAdvice").innerHTML = phase.favorable ? 
      `✨ Giorno favorevole per ${phase.practice}` : 
      `📿 Pratica consigliata: ${phase.practice}`;
    
    const preceptsCard = document.getElementById("preceptsCard");
    if (phaseKey === "new" || phaseKey === "full") {
      preceptsCard.style.display = "block";
      const list = document.getElementById("preceptsList");
      list.innerHTML = PRECEPTS_LIST.map(p => `<div class="precept-item">${p}</div>`).join("");
    } else {
      preceptsCard.style.display = "none";
    }
    
    // Prossimi giorni
    const milestones = [];
    const nextNew = 28.33 - age;
    if (nextNew > 0) milestones.push({ name: "Luna nuova", days: Math.round(nextNew), icon: "🌑" });
    const nextFull = 14.76 - age;
    if (nextFull > 0) milestones.push({ name: "Luna piena", days: Math.round(nextFull), icon: "🌕" });
    
    const container = document.getElementById("moonMilestones");
    container.innerHTML = milestones.slice(0, 3).map(m => `
      <div class="moon-milestone">
        <span>${m.icon} ${m.name}</span>
        <span>tra ${m.days} giorni</span>
      </div>
    `).join("");
  }
  
  // ========== TIMER ==========
  function updateTimerDisplay() {
    const mins = Math.floor(timerRemaining / 60);
    const secs = timerRemaining % 60;
    document.getElementById("timerDisplay").innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    const progress = 1 - (timerRemaining / timerTotal);
    const circumference = 653.45;
    const offset = circumference * (1 - progress);
    document.getElementById("timerRingProgress").style.strokeDashoffset = offset;
  }
  
  function updateLiveGuide() {
    const step = currentPractice.steps[currentStep];
    if (!step) return;
    
    document.getElementById("stepCounter").innerText = `Passo ${currentStep + 1}/${currentPractice.steps.length}`;
    document.getElementById("stepTitle").innerText = step.title;
    document.getElementById("stepText").innerHTML = step.text;
    
    const counterDiv = document.getElementById("mantraCounter");
    if (step.reps > 0 && step.mantra) {
      counterDiv.style.display = "block";
      document.getElementById("mantraName").innerText = step.mantra;
      targetReps = step.reps;
      currentReps = 0;
      renderCounterBeads();
    } else {
      counterDiv.style.display = "none";
    }
    
    if (currentStep + 1 < currentPractice.steps.length) {
      const next = currentPractice.steps[currentStep + 1];
      document.getElementById("nextPreview").innerHTML = `⏭️ Prossimo: ${next.title}`;
    } else {
      document.getElementById("nextPreview").innerHTML = "🎉 Ultimo passo! Concludi con dedica.";
    }
  }
  
  function renderCounterBeads() {
    const container = document.getElementById("counterBeads");
    container.innerHTML = "";
    for (let i = 0; i < targetReps; i++) {
      const bead = document.createElement("div");
      bead.className = `bead ${i < currentReps ? "counted" : ""}`;
      container.appendChild(bead);
    }
    document.getElementById("counterReps").innerText = `${currentReps}/${targetReps}`;
    
    if (currentReps >= targetReps && targetReps > 0) {
      setTimeout(() => nextStep(), 500);
    }
  }
  
  function incReps() {
    if (currentReps < targetReps) {
      currentReps++;
      renderCounterBeads();
    }
  }
  
  function decReps() {
    if (currentReps > 0) {
      currentReps--;
      renderCounterBeads();
    }
  }
  
  function resetReps() {
    currentReps = 0;
    renderCounterBeads();
  }
  
  function nextStep() {
    if (currentStep + 1 < currentPractice.steps.length) {
      currentStep++;
      updateLiveGuide();
    } else {
      completePractice();
    }
  }
  
  function completePractice() {
    pauseTimer();
    playBell("start");
    
    // Salva sessione
    const sessions = storage.get("ngalso_sessions", {});
    sessions[getTodayKey()] = { date: getTodayKey(), completed: true, type: currentPractice.type, duration: currentPractice.duration };
    storage.set("ngalso_sessions", sessions);
    updateStreak(true);
    
    document.getElementById("toast").innerText = "✨ Pratica completata! ✨";
    document.getElementById("toast").classList.add("show");
    setTimeout(() => document.getElementById("toast").classList.remove("show"), 3000);
    
    // Reset timer
    timerRemaining = currentPractice.duration * 60;
    timerTotal = timerRemaining;
    updateTimerDisplay();
    currentStep = 0;
    updateLiveGuide();
  }
  
  function timerTick() {
    if (timerRemaining <= 0) {
      completePractice();
      return;
    }
    timerRemaining--;
    updateTimerDisplay();
    
    // Cambio step basato sul tempo (semplificato - in versione completa si usa mapping)
    const stepDuration = (timerTotal / currentPractice.steps.length);
    const newStep = Math.floor((timerTotal - timerRemaining) / stepDuration);
    if (newStep !== currentStep && newStep < currentPractice.steps.length) {
      currentStep = newStep;
      updateLiveGuide();
      if (document.getElementById("bellSelect").value === "interval") playBell("interval");
    }
  }
  
  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    if (document.getElementById("bellSelect").value !== "silent") playBell("start");
    timerInterval = setInterval(timerTick, 1000);
    updateTimerDisplay();
  }
  
  function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
  }
  
  function resetTimer() {
    pauseTimer();
    timerRemaining = currentPractice.duration * 60;
    timerTotal = timerRemaining;
    currentStep = 0;
    updateTimerDisplay();
    updateLiveGuide();
  }
  
  // ========== PRESET ==========
  function setPractice(type, duration) {
    currentPractice = {
      type: type,
      duration: duration,
      steps: type === "morning" ? PRACTICE_STEPS_MORNING : PRACTICE_STEPS_EVENING,
      name: type === "morning" ? "Mattina" : "Sera"
    };
    timerRemaining = duration * 60;
    timerTotal = timerRemaining;
    currentStep = 0;
    updateTimerDisplay();
    updateLiveGuide();
    pauseTimer();
    
    document.getElementById("timerPhaseLabel").innerText = `${type === "morning" ? "🌅" : "🌙"} ${duration} min`;
    storage.set("ngalso_last_practice", { type, duration });
  }
  
  // ========== PROMEMORIA ==========
  function scheduleReminders() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      // Nota: le notifiche programmate richiedono service worker avanzato
      // Per ora mostriamo solo all'avvio se è ora
      const hour = new Date().getHours();
      if (hour === 7 || hour === 21) {
        new Notification("🧘 Pratica NgalSo", {
          body: "È il momento della tua pratica quotidiana. 5-10 minuti.",
          icon: "/icon.svg"
        });
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }
  
  // ========== DIARIO ==========
  function saveJournal() {
    const moodBefore = document.getElementById("moodBefore").value;
    const moodAfter = document.getElementById("moodAfter").value;
    const note = document.getElementById("journalNote").value;
    
    const entries = storage.get("ngalso_journal", []);
    entries.unshift({
      date: new Date().toISOString(),
      moodBefore,
      moodAfter,
      note,
      practice: `${currentPractice.type} ${currentPractice.duration}min`
    });
    storage.set("ngalso_journal", entries.slice(0, 100));
    
    renderJournalHistory();
    document.getElementById("journalNote").value = "";
    document.getElementById("toast").innerText = "📝 Diario salvato";
    document.getElementById("toast").classList.add("show");
    setTimeout(() => document.getElementById("toast").classList.remove("show"), 2000);
  }
  
  function renderJournalHistory() {
    const entries = storage.get("ngalso_journal", []);
    const container = document.getElementById("sessionHistory");
    if (entries.length === 0) {
      container.innerHTML = "<div class='session-item'>Nessuna pratica salvata ancora</div>";
      return;
    }
    container.innerHTML = entries.slice(0, 20).map(e => `
      <div class="session-item">
        <span>${new Date(e.date).toLocaleDateString('it-IT')}</span>
        <span>${e.practice || "pratica"}</span>
        <span>${e.moodBefore} → ${e.moodAfter}</span>
      </div>
    `).join("");
  }
  
  function exportData() {
    const data = {
      sessions: storage.get("ngalso_sessions", {}),
      journal: storage.get("ngalso_journal", []),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ngalso_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // ========== UI NAVIGAZIONE ==========
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
    document.getElementById(`tab-${tab}`).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add("active");
  }
  
  // ========== MOOD BUTTONS ==========
  function initMoodButtons() {
    document.querySelectorAll("[data-mood]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-mood]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("moodBefore").value = btn.dataset.mood;
      });
    });
    document.querySelectorAll("[data-mood-after]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-mood-after]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("moodAfter").value = btn.dataset.moodAfter;
      });
    });
    // Default
    document.querySelector("[data-mood='calmo']")?.classList.add("active");
    document.querySelector("[data-mood-after='leggero']")?.classList.add("active");
  }
  
  // ========== INIT ==========
  function init() {
    // Carica ultima pratica
    const last = storage.get("ngalso_last_practice", { type: "morning", duration: 5 });
    setPractice(last.type, last.duration);
    
    // Eventi
    document.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const [type, duration] = btn.dataset.preset.split("-");
        setPractice(type, parseInt(duration));
      });
    });
    
    document.getElementById("startTimerBtn").addEventListener("click", startTimer);
    document.getElementById("pauseTimerBtn").addEventListener("click", pauseTimer);
    document.getElementById("resetTimerBtn").addEventListener("click", resetTimer);
    document.getElementById("testBellBtn").addEventListener("click", () => playBell("start"));
    document.getElementById("saveJournalBtn").addEventListener("click", saveJournal);
    document.getElementById("exportDataBtn").addEventListener("click", exportData);
    document.getElementById("startPreceptsBtn")?.addEventListener("click", () => {
      setPractice("morning", 10);
      switchTab("practice");
    });
    
    document.getElementById("counterInc").addEventListener("click", incReps);
    document.getElementById("counterDec").addEventListener("click", decReps);
    document.getElementById("counterReset").addEventListener("click", resetReps);
    
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
    
    initMoodButtons();
    renderMoonPanel();
    renderJournalHistory();
    updateStreak();
    scheduleReminders();
    
    // Aggiorna luna ogni ora
    setInterval(renderMoonPanel, 3600000);
  }
  
  init();
})();