# 🕉️ Il Sentiero del Dharma

Web app interattiva per il corso completo di Buddismo Tibetano nella tradizione di Lama Michel Rinpoche.

## ✨ Funzionalità

- 📚 **Corso Strutturato**: 4 livelli (Principiante → Avanzato) con 20+ moduli
- 🧘 **Meditazione Guidata**: Timer, sessioni di 15/20/30 min, istruzioni postura da Lama Michel
- 🎵 **Musica Integrata**: Playlist Spotify e YouTube per meditazione
- 🔮 **Mantra Sacri**: 6 mantra con pronuncia, significato e pratica
- 💾 **Progressi Salvati**: LocalStorage automatico
- 🎨 **Temi Dinamici**: Colori cambiano per sezione (minimalismo zen + colori tibetani)

## 🚀 Deploy su GitHub Pages

### Passo 1: Abilita GitHub Pages

1. Vai su **Settings** → **Pages** (menu laterale)
2. Sotto "Source" seleziona `main` branch
3. Clicca **Save**
4. Attendi 1-2 minuti
5. La tua app sarà live su: `https://cesta73.github.io/sentiero-del-dharma/`

### Passo 2: Aggiungi Contenuti Mancanti

Al momento `data.js` e `app.js` sono file placeholder. Per completare l'app:

#### Opzione A: Crea `data.js` Manualmente

Aggiungi questo contenuto con i dati del corso dal documento Google:

```javascript
const courseData = {
  levels: [
    {
      id: 1,
      title: "Livello 1: Principiante",
      modules: [
        { 
          id: "1.1",
          title: "Chi era il Buddha?", 
          desc: "Storia di Siddharta Gautama...",
          video: "https://www.youtube.com/watch?v=..."
        }
      ]
    },
    // Aggiungi tutti i livelli e moduli...
  ]
};

const mantraData = [
  {
    title: "Om Mani Padme Hum",
    sanskrit: "ॐ मणि पद्मे हूँ",
    meaning: "Il Gioiello nel Loto",
    benefits: "Compassione, purificazione...",
    practice: "Ripeti 108 volte..."
  },
  // Aggiungi altri mantra...
];
```

#### Opzione B: Usa file completo (Consigliato)

1. Apri il documento "Corso Completo di Buddismo Tibetano"
2. Copia tutto il contenuto nei moduli
3. Struttura il file JS seguendo l'esempio sopra

### Passo 3: Crea `app.js`

Aggiungi la logica app:

```javascript
// Gestione sezioni
function showSection(sec) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sec).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-sec="${sec}"]`).classList.add('active');
  document.body.dataset.section = sec;
}

// LocalStorage
function saveProgress(moduleId) {
  let completed = JSON.parse(localStorage.getItem('completedModules') || '[]');
  if (!completed.includes(moduleId)) {
    completed.push(moduleId);
    localStorage.setItem('completedModules', JSON.stringify(completed));
  }
  updateProgress();
}

// Timer meditazione
let timerInterval = null;
let timeLeft = 15 * 60;
function timerToggle() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    timerInterval = setInterval(() => {
      timeLeft--;
      // Aggiorna UI
      if (timeLeft <= 0) { /* suona campana */ }
    }, 1000);
  }
}

// Inizializza tutto
document.addEventListener('DOMContentLoaded', () => {
  renderCourse();
  renderMantra();
  renderPostures();
  updateProgress();
});
```

## 📝 Struttura Progetto

```
sentiero-del-dharma/
├── index.html        # Struttura completa app
├── styles.css        # Temi + stili (412 righe)
├── app.js            # Logica app
├── data.js           # Dati corso + mantra
└── README.md         # Questo file
```

## 🔧 Tecnologie

- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **Zero dipendenze** - funziona offline dopo primo caricamento
- **LocalStorage API** per progressi
- **Spotify/YouTube Embed** per musica
- **GitHub Pages** per hosting

## 🎯 Come Usare l'App

1. **Home**: Panoramica generale
2. **Corso**: Seleziona livello → studia modulo → marca come completato
3. **Meditazione**: 
   - Leggi le 8 posture di Vairocana
   - Imposta timer (15/20/30 min)
   - Scegli musica Spotify/YouTube
   - Medita!
4. **Mantra**: Studia mantra, pratica recitazione

## 📚 Fonti

- Insegnamenti di **Lama Michel Rinpoche** (NgalSo Ganden Nyengyu)
- Video YouTube: [NgalSo Channel](https://www.youtube.com/@NgalSoVideos)
- Libri: Kunpen Lama Gangchen, Lam Rim, testi Gelug

## 🔑 Licenza

Questo progetto è per **uso personale ed educativo**. I contenuti sono ispirati agli insegnamenti del Buddismo Tibetano.

---

**🔥 Buona pratica sul Sentiero del Dharma! 🕉️**
