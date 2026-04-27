// ===== FRASI DEL GIORNO =====
const frasi = [
  "La pace non si trova altrove. È qui, in questo respiro.",
  "Ogni momento è un nuovo inizio. Siediti, respira, sii.",
  "Non sei i tuoi pensieri. Sei il silenzio che li osserva.",
  "Il cammino verso il nirvana inizia con un solo passo consapevole.",
  "Lascia andare ciò che non puoi controllare. Abbraccia ciò che è.",
  "Il tuo respiro è il tuo ancoraggio al momento presente.",
  "Nella quiete si trova la saggezza che le parole non sanno dire.",
  "Medita non per fuggire dalla vita, ma per tornarci più sveglio.",
]

// ===== MANTRA =====
const mantra = [
  {
    id: 'om',
    nome: 'OM (AUM)',
    sanscrito: 'ॐ',
    fonetica: 'Si pronuncia: A - U - M (la M vibra a lungo)',
    significato: 'Il suono primordiale dell\'universo. La vibrazione da cui tutto ha origine e a cui tutto ritorna. Recitarlo calma la mente e connette con il tutto.',
    uso: 'Ripeti lentamente ad ogni espirazione. Senti la vibrazione nel petto e nella testa.',
    colore: '#C9A84C'
  },
  {
    id: 'om-mani',
    nome: 'Om Mani Padme Hum',
    sanscrito: 'ॐ मणि पद्मे हूँ',
    fonetica: 'Si pronuncia: OM - MA-NI - PAD-ME - HUM',
    significato: 'Il mantra della compassione universale. Significa "il gioiello nel loto". Ogni sillaba purifica un aspetto della mente e apre il cuore.',
    uso: 'Ripeti con ritmo lento e costante. Visualizza una luce dorata al centro del petto.',
    colore: '#E07B39'
  },
  {
    id: 'so-hum',
    nome: 'So Hum',
    sanscrito: 'सो ऽहम्',
    fonetica: 'Si pronuncia: SO (inspirando) - HUM (espirando)',
    significato: 'Significa "Io sono Quello" — l\'unione del sé individuale con la coscienza universale. Il respiro stesso diventa mantra.',
    uso: 'Inspira pensando SO, espira pensando HUM. Lascia che il respiro guidi il ritmo.',
    colore: '#8B7355'
  },
  {
    id: 'om-shanti',
    nome: 'Om Shanti Shanti Shanti',
    sanscrito: 'ॐ शान्तिः शान्तिः शान्तिः',
    fonetica: 'Si pronuncia: OM - SHAN-TI - SHAN-TI - SHAN-TI',
    significato: 'Una preghiera di pace: pace nel corpo, nella mente e nello spirito. Le tre ripetizioni di Shanti dissolvono le tre fonti di sofferenza.',
    uso: 'Ripeti lentamente tre volte all\'inizio e alla fine della meditazione come invocazione e chiusura.',
    colore: '#5B8A6E'
  },
  {
    id: 'gate',
    nome: 'Gate Gate Pāragate',
    sanscrito: 'गते गते पारगते पारसंगते बोधि स्वाहा',
    fonetica: 'Si pronuncia: GA-TE GA-TE - PA-RA-GA-TE - PA-RA-SAN-GA-TE - BO-DHI - SVA-HA',
    significato: 'Dal Sutra del Cuore buddhista. Significa "Andato, andato, andato oltre, andato completamente oltre — risveglio!". Simboleggia il viaggio verso l\'illuminazione.',
    uso: 'Ripeti come un mantra lento e solenne. Visualizza ogni ripetizione come un passo oltre il velo dell\'illusione.',
    colore: '#7B5EA7'
  }
]

// ===== SUONI YOUTUBE =====
const suoni = [
  {
    titolo: "Campana Tibetana",
    descrizione: "Vibrazione pura per entrare in meditazione",
    emoji: "🔔",
    url: "https://youtu.be/EMzmq9iglJs?si=jSDHT1g_Y25djU4V"
  },
  {
    titolo: "Suoni della Natura",
    descrizione: "Acqua, vento e foresta per calmare la mente",
    emoji: "🌿",
    url: "https://youtu.be/mUp9Wbw5aQ4?si=Rz4bpjy_2hwptNW3"
  },
  {
    titolo: "432 Hz - Frequenza Naturale",
    descrizione: "Armonia con la vibrazione dell'universo",
    emoji: "🎵",
    url: "https://youtu.be/JwKApreKItc?si=d8py8f_d47arwqIZ"
  },
  {
    titolo: "Frequenza di Dio - 963 Hz",
    descrizione: "Connessione con la coscienza universale",
    emoji: "✨",
    url: "https://youtu.be/6xVj6mfSRR0?si=pI3AnKp3vHo_llmX"
  }
];

// ===== TIMER =====
let timerInterval = null
let secondiRimasti = 0
let secondiTotali = 0
let meditazioneAttiva = false
let mantraSelezionato = null

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Frase del giorno
  const idx = new Date().getDay() % frasi.length
  document.getElementById('frase-motivazionale').textContent = '"' + frasi[idx] + '"'

  // Genera lista mantra
  generaListaMantra()

  // Genera lista suoni
  generaListaSuoni()

  // Durata default
  document.getElementById('durata-slider').addEventListener('input', aggiornaDurata)
  aggiornaDurata()
})

// ===== NAVIGAZIONE =====
function mostraSchermata(id) {
  document.querySelectorAll('.schermata').forEach(s => s.classList.remove('attiva'))
  document.getElementById(id).classList.add('attiva')
  window.scrollTo(0, 0)

  if (id === 'schermata-sessioni') {
    caricaEMostraSessioni()
  }
}

// ===== DURATA SLIDER =====
function aggiornaDurata() {
  const val = parseInt(document.getElementById('durata-slider').value)
  document.getElementById('durata-display').textContent = val + ' minuti'
}

// ===== SELEZIONA MANTRA PER MEDITAZIONE =====
function selezionaMantraTimer(id) {
  mantraSelezionato = mantra.find(m => m.id === id)
  document.querySelectorAll('.mantra-timer-btn').forEach(b => b.classList.remove('selezionato'))
  document.getElementById('btn-mantra-' + id).classList.add('selezionato')
}

// ===== AVVIA MEDITAZIONE =====
function avviaMeditazione() {
  if (meditazioneAttiva) return

  const durata = parseInt(document.getElementById('durata-slider').value)
  secondiTotali = durata * 60
  secondiRimasti = secondiTotali
  meditazioneAttiva = true

  // Nascondi setup, mostra timer
  document.getElementById('setup-meditazione').classList.add('nascosta')
  document.getElementById('timer-attivo').classList.remove('nascosta')

  // Suona campana inizio
  suonaCampana()

  // Avvia conto alla rovescia
  aggiornaDisplay()
  timerInterval = setInterval(() => {
    secondiRimasti--
    aggiornaDisplay()
    if (secondiRimasti <= 0) {
      fineSessione()
    }
  }, 1000)
}

// ===== AGGIORNA DISPLAY TIMER =====
function aggiornaDisplay() {
  const min = Math.floor(secondiRimasti / 60)
  const sec = secondiRimasti % 60
  document.getElementById('timer-display').textContent =
    String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0')

  const perc = ((secondiTotali - secondiRimasti) / secondiTotali) * 100
  document.getElementById('progress-bar').style.width = perc + '%'

  if (mantraSelezionato) {
    document.getElementById('mantra-in-corso').textContent = mantraSelezionato.nome
  }
}

// ===== FINE SESSIONE =====
async function fineSessione() {
  clearInterval(timerInterval)
  meditazioneAttiva = false

  suonaCampana()

  const durata = Math.round(secondiTotali / 60)
  const nomeMantra = mantraSelezionato ? mantraSelezionato.nome : 'Nessuno'

  // Mostra form note
  document.getElementById('timer-attivo').classList.add('nascosta')
  document.getElementById('fine-sessione').classList.remove('nascosta')
  document.getElementById('riepilogo-durata').textContent = durata + ' minuti'
  document.getElementById('riepilogo-mantra').textContent = nomeMantra
}

// ===== SALVA E CHIUDI =====
async function salvaEchiudi() {
  const durata = Math.round(secondiTotali / 60)
  const nomeMantra = mantraSelezionato ? mantraSelezionato.nome : 'Nessuno'
  const note = document.getElementById('note-sessione').value

  const ok = await salvaSessione(durata, nomeMantra, note)
  if (ok) {
    mostraMessaggio('Sessione salvata 🙏')
  }

  resetMeditazione()
  mostraSchermata('schermata-home')
}

function saltaSalvataggio() {
  resetMeditazione()
  mostraSchermata('schermata-home')
}

// ===== PAUSA / RIPRENDI =====
function pausaRiprendi() {
  if (!meditazioneAttiva) return
  const btn = document.getElementById('btn-pausa')
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
    btn.textContent = '▶ Riprendi'
  } else {
    timerInterval = setInterval(() => {
      secondiRimasti--
      aggiornaDisplay()
      if (secondiRimasti <= 0) fineSessione()
    }, 1000)
    btn.textContent = '⏸ Pausa'
  }
}

// ===== STOP ANTICIPATO =====
function stopMeditazione() {
  if (!confirm('Vuoi interrompere la meditazione?')) return
  clearInterval(timerInterval)
  timerInterval = null
  meditazioneAttiva = false

  const durata = Math.round((secondiTotali - secondiRimasti) / 60)
  if (durata >= 1) {
    const nomeMantra = mantraSelezionato ? mantraSelezionato.nome : 'Nessuno'
    salvaSessione(durata, nomeMantra, 'Sessione interrotta')
  }

  resetMeditazione()
}

// ===== RESET =====
function resetMeditazione() {
  clearInterval(timerInterval)
  timerInterval = null
  meditazioneAttiva = false
  secondiRimasti = 0
  secondiTotali = 0

  document.getElementById('setup-meditazione').classList.remove('nascosta')
  document.getElementById('timer-attivo').classList.add('nascosta')
  document.getElementById('fine-sessione').classList.add('nascosta')
  document.getElementById('note-sessione').value = ''
  document.getElementById('btn-pausa').textContent = '⏸ Pausa'
}

// ===== CAMPANA =====
function suonaCampana() {
  try {
    const audio = document.getElementById('campana')
    audio.currentTime = 0
    audio.play()
  } catch(e) {
    console.log('Audio non disponibile')
  }
}

// ===== LISTA MANTRA =====
function generaListaMantra() {
  // Bottoni selezione nel timer
  const containerTimer = document.getElementById('mantra-timer-lista')
  if (containerTimer) {
    mantra.forEach(m => {
      const btn = document.createElement('button')
      btn.className = 'mantra-timer-btn'
      btn.id = 'btn-mantra-' + m.id
      btn.innerHTML = '<span class="mantra-btn-nome">' + m.nome + '</span>'
      btn.onclick = () => selezionaMantraTimer(m.id)
      containerTimer.appendChild(btn)
    })
  }

  // Schermata mantra completa
  const lista = document.getElementById('lista-mantra')
  if (lista) {
    mantra.forEach(m => {
      const card = document.createElement('div')
      card.className = 'mantra-card'
      card.innerHTML = `
        <div class="mantra-header" onclick="toggleMantra('dettaglio-${m.id}')">
          <div>
            <div class="mantra-sanscrito">${m.sanscrito}</div>
            <div class="mantra-nome">${m.nome}</div>
          </div>
          <span class="mantra-freccia">▼</span>
        </div>
        <div class="mantra-dettaglio nascosta" id="dettaglio-${m.id}">
          <span class="sezione-label">Come si pronuncia</span>
          <p>${m.fonetica}</p>
          <span class="sezione-label">Significato</span>
          <p>${m.significato}</p>
          <span class="sezione-label">Come usarlo</span>
          <p>${m.uso}</p>
        </div>
      `
      lista.appendChild(card)
    })
  }
}

function toggleMantra(id) {
  const el = document.getElementById(id)
  el.classList.toggle('nascosta')
}

// ===== LISTA SUONI =====
function generaListaSuoni() {
  const lista = document.getElementById('lista-suoni')
  if (!lista) return
  suoni.forEach(s => {
    const card = document.createElement('div')
    card.className = 'suono-card'
    card.innerHTML = `
      <div class="suono-info">
    <h4>${s.titolo}</h4>
    <p>${s.descrizione}</p>
  </div>
  <span class="suono-icona">${s.emoji}</span>
    `
    card.onclick = () => apriPlayer(s.url)
    lista.appendChild(card)
  })
}

function apriPlayer(url) {
  document.getElementById('yt-frame').src = url
  document.getElementById('player-youtube').classList.remove('nascosta')
  document.getElementById('player-youtube').scrollIntoView({ behavior: 'smooth' })
}

function chiudiPlayer() {
  document.getElementById('yt-frame').src = ''
  document.getElementById('player-youtube').classList.add('nascosta')
}

// ===== SESSIONI =====
async function caricaEMostraSessioni() {
  const sessioni = await caricaSessioni()
  const lista = document.getElementById('lista-sessioni')
  lista.innerHTML = ''

  if (!sessioni || sessioni.length === 0) {
    lista.innerHTML = '<p class="testo-vuoto">Nessuna sessione ancora. Inizia a meditare! 🙏</p>'
    return
  }

  // Statistiche
  const totMin = sessioni.reduce((acc, s) => acc + (s.durata_minuti || 0), 0)
  document.getElementById('tot-sessioni').textContent = sessioni.length
  document.getElementById('tot-minuti').textContent = totMin

  // Streak
  const streak = calcolaStreak(sessioni)
  document.getElementById('streak-giorni').textContent = streak

  // Lista
  sessioni.forEach(s => {
    const data = new Date(s.data_sessione).toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    const item = document.createElement('div')
    item.className = 'sessione-item'
    item.innerHTML = `
      <div class="data-sess">${data}</div>
      <div class="durata-sess">⏱ ${s.durata_minuti} minuti</div>
      <div class="mantra-sess">📿 ${s.mantra_scelto || 'Nessuno'}</div>
      ${s.note ? '<div class="note-sess">' + s.note + '</div>' : ''}
    `
    lista.appendChild(item)
  })
}

function calcolaStreak(sessioni) {
  if (!sessioni.length) return 0
  const oggi = new Date()
  oggi.setHours(0,0,0,0)
  let streak = 0
  let giorno = new Date(oggi)

  const giorni = new Set(sessioni.map(s => {
    const d = new Date(s.data_sessione)
    d.setHours(0,0,0,0)
    return d.getTime()
  }))

  while (giorni.has(giorno.getTime())) {
    streak++
    giorno.setDate(giorno.getDate() - 1)
  }
  return streak
}

// ===== MESSAGGIO TOAST =====
function mostraMessaggio(testo) {
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: #C9A84C; color: #1E0F05; padding: 12px 24px;
    border-radius: 30px; font-size: 14px; z-index: 9999;
    font-family: 'Cinzel', serif; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  `
  toast.textContent = testo
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
