// ===== CONNESSIONE SUPABASE =====

const SUPABASE_URL = 'https://kgovktbdougwdibteydd.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3ZrdGJkb3Vnd2RpYnRleWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDM1NjEsImV4cCI6MjA5MjgxOTU2MX0.JdICmmTcNbGiloI1rqUMOicUTK4ywDsRNVYtCU2OcnE'

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON)

// ===== SALVA SESSIONE =====
async function salvaSessione(durata, mantra, note) {
  const { data, error } = await db
    .from('sessioni')
    .insert([{
      durata_minuti: durata,
      mantra_scelto: mantra,
      note: note,
      completata: true
    }])

  if (error) {
    console.error('Errore salvataggio:', error)
    return false
  }
  return true
}

// ===== CARICA SESSIONI =====
async function caricaSessioni() {
  const { data, error } = await db
    .from('sessioni')
    .select('*')
    .order('data_sessione', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Errore caricamento:', error)
    return []
  }
  return data
}
