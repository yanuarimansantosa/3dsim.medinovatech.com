// data.js — all player-visible content, bilingual (ID / EN).
// Switching language is a pure data swap; zero text literals live in app.js.
// Clinical content grounded in: EAACI Global Atlas of Allergic Rhinitis & CRS (2015),
// Sections A (mechanisms), C (clinical features), D (diagnosis), E (treatment).

export const UI = {
  title:        { id: "3D SIMULATOR", en: "3D SIMULATOR" },
  subtitle:     { id: "Medinovatech · Simulator Alergi-Imunologi THT", en: "Medinovatech · ENT Allergy-Immunology Simulator" },
  start:        { id: "Mulai Bertugas", en: "Start Duty" },
  langName:     { id: "Bahasa Indonesia", en: "English" },
  next:         { id: "Lanjut ▸", en: "Next ▸" },
  forceAnswer:  { id: "Pilih jawabanmu — pasien menunggu.", en: "Make your call — the patient is waiting." },
  correct:      { id: "TEPAT", en: "CORRECT" },
  wrong:        { id: "KELIRU", en: "NOT QUITE" },
  toLibrary:    { id: "Masuk Perpustakaan ▸", en: "Enter the Library ▸" },
  retry:        { id: "Ulangi Kasus ▸", en: "Retry the Case ▸" },
  nextCase:     { id: "Kasus Berikutnya ▸", en: "Next Case ▸" },
  flashcard:    { id: "KARTU KILAT", en: "FLASHCARD" },
  libraryTag:   { id: "PERPUSTAKAAN — Bacaan Lengkap", en: "LIBRARY — Full Reading" },
  hospital:     { id: "RS Medinovatech — Poli THT", en: "Medinovatech Hospital — ENT Clinic" },
  academy:      { id: "Perpustakaan Medinovatech", en: "Medinovatech Library" },
  score:        { id: "Skor", en: "Score" },
  streak:       { id: "Beruntun", en: "Streak" },
  endTitle:     { id: "Rotasi Selesai!", en: "Rotation Complete!" },
  endBody:      { id: "Kamu menuntaskan Episode 0 & 1. Cast imun bangga padamu.", en: "You cleared Episodes 0 & 1. The immune cast is proud of you." },
  restart:      { id: "Main Lagi", en: "Play Again" },
  affinity:     { id: "Kedekatan", en: "Affinity" },
  epLabel:      { id: "EPISODE", en: "EPISODE" },
  anatomyBtn:   { id: "🧠 Ruang Anatomi 3D", en: "🧠 3D Anatomy Room" },
  anaTitle:     { id: "Anatomi & United Airway", en: "Anatomy & United Airway" },
  anaNormal:    { id: "🌿 Normal", en: "🌿 Normal" },
  anaAllergic:  { id: "🤧 Mode Alergi", en: "🤧 Allergic Mode" },
  anaExit:      { id: "◂ Menu", en: "◂ Menu" },
  anaHint:      { id: "Putar & cubit untuk zoom · ketuk model untuk info", en: "Drag & pinch to zoom · tap the model for info" },
  anaClose:     { id: "Tutup", en: "Close" }
};

// Character roster. portrait = asset filename under ./assets/
export const CAST = {
  mentor:  { name: { id: "Prof. Entero", en: "Prof. Entero" }, portrait: "mentor.png" },
  iggy:    { name: { id: "Iggy (IgE)", en: "Iggy (IgE)" }, portrait: "iggy.png" },
  masto:   { name: { id: "Masto (Sel Mast)", en: "Masto (Mast Cell)" }, portrait: "masto.png" },
  eos:     { name: { id: "Eos (Eosinofil)", en: "Eos (Eosinophil)" }, portrait: "eos.png" },
  reggie:  { name: { id: "Reggie (Treg)", en: "Reggie (Treg)" }, portrait: "reggie.png" },
  patient: { name: { id: "Rina, 23 th", en: "Rina, 23 y.o." }, portrait: "patient.png" },
  you:     { name: { id: "Kamu (Dokter Jaga)", en: "You (Doctor on Duty)" }, portrait: null }
};

// A scene is one of:
//  { type:"say", who, bg, text }                              -> dialogue, advances on Next
//  { type:"ask", who, bg, stem, options:[{text, correct, affinity?}],
//      shortCard:{title,body}, fullCard:{title,body} }        -> the core loop
export const EPISODES = [
  // ============================ EPISODE 0 ============================
  {
    id: 0,
    title: { id: "Hari Pertama di Medinovatech", en: "First Day at Medinovatech" },
    scenes: [
      { type: "say", who: "mentor", bg: "library",
        text: { id: "Selamat datang di Medinovatech Academy, Dokter. Di sini kita belajar United Airway — hidung dan paru itu satu jalan napas.",
                en: "Welcome to Medinovatech Academy, Doctor. Here we teach the United Airway — the nose and lungs are one airway." } },
      { type: "say", who: "iggy", bg: "library",
        text: { id: "Hai! Aku Iggy, si antibodi IgE. Aku yang menempel di sel mast dan... yah, suka bereaksi berlebihan.",
                en: "Hi! I'm Iggy, the IgE antibody. I latch onto mast cells and... well, I tend to overreact." } },
      { type: "say", who: "masto", bg: "library",
        text: { id: "Aku Masto. Granul histaminku gampang meledak kalau Iggy disilangkan oleh alergen!",
                en: "I'm Masto. My histamine granules burst easily when allergen cross-links Iggy!" } },
      { type: "ask", who: "mentor", bg: "library",
        stem: { id: "Sebelum ke bangsal — apa definisi inti rinitis alergi?",
                en: "Before the ward — what is the core definition of allergic rhinitis?" },
        options: [
          { text: { id: "Radang mukosa hidung yang dimediasi IgE terhadap alergen", en: "IgE-mediated inflammation of the nasal mucosa against allergens" }, correct: true, affinity: "iggy" },
          { text: { id: "Infeksi bakteri pada sinus paranasal", en: "A bacterial infection of the paranasal sinuses" }, correct: false },
          { text: { id: "Kelainan struktur septum nasi", en: "A structural deformity of the nasal septum" }, correct: false }
        ],
        shortCard: { title: { id: "Rinitis Alergi", en: "Allergic Rhinitis" },
          body: { id: "Radang mukosa hidung dimediasi IgE. Alergen menyilangkan IgE di sel mast → degranulasi → gejala.",
                  en: "IgE-mediated nasal mucosal inflammation. Allergen cross-links IgE on mast cells → degranulation → symptoms." } },
        fullCard: { title: { id: "Apa itu Rinitis Alergi (RA)", en: "What is Allergic Rhinitis (AR)" },
          body: { id: "RA adalah peradangan mukosa hidung yang dipicu paparan alergen pada individu tersensitisasi, dimediasi IgE. Alergen menyilangkan IgE spesifik pada reseptor FcεRI sel mast → degranulasi → pelepasan histamin, leukotrien, prostaglandin. RA adalah faktor risiko utama asma (konsep United Airway). [EAACI Atlas, Sec A]",
                  en: "AR is allergen-triggered inflammation of the nasal mucosa in a sensitized individual, mediated by IgE. Allergen cross-links specific IgE on mast-cell FcεRI receptors → degranulation → release of histamine, leukotrienes, prostaglandins. AR is a major risk factor for asthma (United Airway concept). [EAACI Atlas, Sec A]" } } },
      { type: "say", who: "mentor", bg: "library",
        text: { id: "Tepat. Sekarang ikut aku ke RS Medinovatech — ada pasien menunggu.",
                en: "Exactly. Now follow me to Medinovatech Hospital — a patient is waiting." } }
    ]
  },

  // ============================ EPISODE 1 ============================
  {
    id: 1,
    title: { id: "Kasus Rina — Bersin Musiman", en: "Rina's Case — Seasonal Sneezing" },
    scenes: [
      { type: "say", who: "patient", bg: "hospital",
        text: { id: "Dok, tiap musim kemarau hidung saya gatal, bersin-bersin, meler bening, mata berair. Sudah 3 tahun begini.",
                en: "Doctor, every dry season my nose itches, I sneeze a lot, clear runny nose, watery eyes. It's been 3 years." } },
      { type: "ask", who: "you", bg: "hospital",
        stem: { id: "Kelompok gejala mana yang paling mengarah ke RA dibanding rinitis non-alergi?",
                en: "Which symptom cluster points most to AR rather than non-allergic rhinitis?" },
        options: [
          { text: { id: "Gatal hidung + bersin paroksismal + mata gatal berair", en: "Itchy nose + paroxysmal sneezing + itchy watery eyes" }, correct: true, affinity: "iggy" },
          { text: { id: "Sekret purulen kental + nyeri wajah + demam", en: "Thick purulent discharge + facial pain + fever" }, correct: false },
          { text: { id: "Sumbatan satu sisi + ingus berdarah", en: "Unilateral blockage + bloody discharge" }, correct: false },
          { text: { id: "Anosmia + polip nasi bilateral", en: "Anosmia + bilateral nasal polyps" }, correct: false }
        ],
        shortCard: { title: { id: "Petunjuk Anamnesis RA", en: "AR History Clues" },
          body: { id: "Gatal & bersin + gejala mata yang menyertai sangat khas RA. Pola musiman menguatkan.",
                  en: "Itching & sneezing + accompanying eye symptoms are highly typical of AR. A seasonal pattern strengthens it." } },
        fullCard: { title: { id: "Anamnesis: Membedakan RA", en: "History: Distinguishing AR" },
          body: { id: "RA lebih mungkin bila ada gatal hidung & bersin, gejala mata menyertai (gatal, berair), onset dini (<20 th), dan riwayat atopi (dermatitis atopik, asma, alergi makanan). Alergen musiman: rumput, pohon, gulma, jamur. Perenial: tungau debu, bulu hewan. Sekret purulen + nyeri wajah mengarah rinosinusitis; sumbatan/ingus berdarah satu sisi adalah tanda bahaya. [EAACI Atlas, Sec C & D]",
                  en: "AR is more likely with nasal itching & sneezing, accompanying eye symptoms (itchy, watery), early onset (<20 y), and atopy history (atopic dermatitis, asthma, food allergy). Seasonal allergens: grasses, trees, weeds, molds. Perennial: dust mites, animal dander. Purulent discharge + facial pain suggests rhinosinusitis; unilateral blockage/bloody discharge is a red flag. [EAACI Atlas, Sec C & D]" } } },
      { type: "say", who: "patient", bg: "hospital",
        text: { id: "Saya juga sering mengusap hidung ke atas pakai telapak tangan, Dok.",
                en: "I also keep rubbing my nose upward with my palm, Doctor." } },
      { type: "ask", who: "you", bg: "hospital",
        stem: { id: "Pada rinoskopi anterior, temuan klasik RA yang kamu harapkan?",
                en: "On anterior rhinoscopy, which classic AR finding do you expect?" },
        options: [
          { text: { id: "Konka pucat-kebiruan, edema/boggy, sekret bening", en: "Pale-bluish, boggy/edematous turbinates, clear secretions" }, correct: true, affinity: "masto" },
          { text: { id: "Mukosa merah menyala dengan nanah", en: "Beefy-red mucosa with pus" }, correct: false },
          { text: { id: "Massa rapuh mudah berdarah satu sisi", en: "A friable, easily-bleeding unilateral mass" }, correct: false }
        ],
        shortCard: { title: { id: "Temuan Rinoskopi RA", en: "AR Rhinoscopy Findings" },
          body: { id: "Konka membengkak pucat/kebiruan + sekret bening. Bisa ada cobblestoning & allergic salute crease.",
                  en: "Swollen pale/bluish turbinates + clear secretions. May see cobblestoning & allergic-salute crease." } },
        fullCard: { title: { id: "Pemeriksaan Fisik RA", en: "AR Physical Examination" },
          body: { id: "Tak ada tanda yang 100% pasti, tapi khas: konka membengkak, mukosa pucat/kebiruan & edema, sekret bening, cobblestoning dinding faring posterior. Tanda penyerta: allergic shiners (lingkar mata gelap), garis Dennie–Morgan, allergic crease (lipatan horizontal di ujung hidung dari 'allergic salute'). Rinoskopi melihat 1/3 anterior; endoskopi melihat seluruh kavum & membedakan patologi mukosa vs struktural. [EAACI Atlas, Sec C & D]",
                  en: "No sign is 100% definitive, but typical: swollen turbinates, pale/bluish edematous mucosa, clear secretions, cobblestoning of the posterior pharynx. Associated signs: allergic shiners (dark periorbital rings), Dennie–Morgan lines, allergic crease (horizontal wrinkle at the nasal tip from the 'allergic salute'). Rhinoscopy sees the anterior third; endoscopy sees the whole cavity and separates mucosal vs structural pathology. [EAACI Atlas, Sec C & D]" } } },
      { type: "ask", who: "you", bg: "hospital",
        stem: { id: "Untuk memastikan, pemeriksaan mana yang paling tepat — dan harus dikorelasikan dengan riwayat?",
                en: "To confirm, which test is most appropriate — and must correlate with the history?" },
        options: [
          { text: { id: "Skin prick test / IgE spesifik serum", en: "Skin prick test / serum specific IgE" }, correct: true, affinity: "iggy" },
          { text: { id: "CT scan sinus paranasal segera", en: "Immediate paranasal sinus CT scan" }, correct: false },
          { text: { id: "Kultur bakteri swab hidung", en: "Bacterial culture of a nasal swab" }, correct: false }
        ],
        shortCard: { title: { id: "Konfirmasi RA", en: "Confirming AR" },
          body: { id: "SPT atau IgE spesifik membuktikan sensitisasi — tapi WAJIB dikorelasikan dengan riwayat klinis.",
                  en: "SPT or specific IgE proves sensitization — but MUST correlate with the clinical history." } },
        fullCard: { title: { id: "Diagnostik RA", en: "AR Diagnostic Work-up" },
          body: { id: "Riwayat yang terinci penting, tapi uji alergi diperlukan untuk diagnosis andal (terutama bila gejala perenial). Pilihan: skin prick test (SPT) dengan alergen, dan/atau IgE spesifik serum. Apusan hidung untuk eosinofil (>10%) bisa membantu (tak rutin). PENTING: bukti sensitisasi saja TIDAK cukup — harus dikorelasikan dengan riwayat klinis. CT/kultur bukan lini pertama untuk RA tanpa tanda komplikasi. [EAACI Atlas, Sec D]",
                  en: "A detailed history matters, but allergy testing is needed for a reliable diagnosis (especially with perennial symptoms). Options: skin prick test (SPT) with allergen, and/or serum specific IgE. Nasal smear for eosinophils (>10%) can help (not routine). IMPORTANT: demonstrating sensitization alone is NOT sufficient — it must correlate with the clinical history. CT/culture are not first-line for uncomplicated AR. [EAACI Atlas, Sec D]" } } },
      { type: "say", who: "masto", bg: "hospital",
        text: { id: "Begitu Iggy disilangkan alergen, AKU meledak! Histamin keluar duluan di fase awal.",
                en: "The moment allergen cross-links Iggy, I burst! Histamine comes out first in the early phase." } },
      { type: "ask", who: "you", bg: "hospital",
        stem: { id: "Mediator utama fase-awal yang memicu bersin & gatal Rina?",
                en: "Which main early-phase mediator drives Rina's sneezing & itching?" },
        options: [
          { text: { id: "Histamin dari granul sel mast", en: "Histamine from mast-cell granules" }, correct: true, affinity: "masto" },
          { text: { id: "Surfaktan dari pneumosit", en: "Surfactant from pneumocytes" }, correct: false },
          { text: { id: "Insulin dari sel beta pankreas", en: "Insulin from pancreatic beta cells" }, correct: false }
        ],
        shortCard: { title: { id: "Fase Awal", en: "Early Phase" },
          body: { id: "Histamin merangsang ujung saraf trigeminus → bersin & gatal; juga sekresi mukus & kongesti.",
                  en: "Histamine stimulates trigeminal nerve endings → sneezing & itching; also mucus secretion & congestion." } },
        fullCard: { title: { id: "Fase Awal vs Fase Lambat", en: "Early vs Late Phase" },
          body: { id: "Fase awal (detik–menit): degranulasi sel mast melepas histamin, leukotrien, prostaglandin. Histamin merangsang ujung saraf trigeminus → bersin & pruritus, memicu sekresi mukus; histamin+leukotrien+prostaglandin → kongesti. Fase lambat (4–6 jam kemudian, 18–24 jam): influks eosinofil, basofil, limfosit T → kongesti yang menetap. [EAACI Atlas, Sec A]",
                  en: "Early phase (seconds–minutes): mast-cell degranulation releases histamine, leukotrienes, prostaglandins. Histamine stimulates trigeminal nerve endings → sneezing & pruritus, triggers mucus secretion; histamine+leukotrienes+prostaglandins → congestion. Late phase (4–6 h later, lasting 18–24 h): influx of eosinophils, basophils, T lymphocytes → sustained congestion. [EAACI Atlas, Sec A]" } } },
      { type: "ask", who: "you", bg: "hospital",
        stem: { id: "Rina RA persisten sedang-berat dengan kongesti menonjol. Terapi lini pertama paling efektif?",
                en: "Rina has moderate-severe persistent AR with prominent congestion. Most effective first-line therapy?" },
        options: [
          { text: { id: "Kortikosteroid intranasal", en: "Intranasal corticosteroid" }, correct: true, affinity: "reggie" },
          { text: { id: "Dekongestan oral jangka panjang", en: "Long-term oral decongestant" }, correct: false },
          { text: { id: "Antibiotik spektrum luas", en: "Broad-spectrum antibiotics" }, correct: false }
        ],
        shortCard: { title: { id: "Lini Pertama Kongesti", en: "First-line for Congestion" },
          body: { id: "Kortikosteroid intranasal = paling efektif untuk RA persisten sedang-berat, terutama kongesti.",
                  en: "Intranasal corticosteroid = most effective for moderate-severe persistent AR, especially congestion." } },
        fullCard: { title: { id: "Tangga Terapi RA", en: "AR Treatment Ladder" },
          body: { id: "Tujuan: kurangi inflamasi & perbaiki kualitas hidup. Hindari alergen. Antihistamin (gatal, bersin, rinore). Kortikosteroid intranasal = terapi tunggal paling efektif, unggul untuk kongesti. Antileukotrien sebagai tambahan. Imunoterapi alergen (AIT) menginduksi toleransi via sel T regulator penghasil IL-10/TGF-β — satu-satunya yang mengubah perjalanan penyakit. Hindari dekongestan oral jangka panjang; antibiotik tak berperan pada RA tanpa infeksi. [EAACI Atlas, Sec E]",
                  en: "Goals: reduce inflammation & improve quality of life. Avoid allergens. Antihistamines (itch, sneeze, rhinorrhea). Intranasal corticosteroid = the single most effective agent, best for congestion. Antileukotrienes as add-on. Allergen immunotherapy (AIT) induces tolerance via IL-10/TGF-β regulatory T cells — the only disease-modifying option. Avoid long-term oral decongestants; antibiotics have no role in uncomplicated AR. [EAACI Atlas, Sec E]" } } },
      { type: "say", who: "reggie", bg: "hospital",
        text: { id: "Kalau kamu mau menyembuhkan akar masalah, dekati AKU. Imunoterapi menumbuhkan toleransi lewat sel T regulator.",
                en: "If you want to heal the root cause, get close to ME. Immunotherapy grows tolerance through regulatory T cells." } },
      { type: "say", who: "patient", bg: "hospital",
        text: { id: "Oh ya Dok, kalau lari pagi saya kadang mengi dan sesak. Itu berhubungan?",
                en: "Oh Doctor, when I jog I sometimes wheeze and feel short of breath. Is that related?" } },
      { type: "ask", who: "you", bg: "hospital",
        stem: { id: "Rina juga mengi saat aktivitas. Prinsip penatalaksanaan yang benar?",
                en: "Rina also wheezes on exertion. What is the correct management principle?" },
        options: [
          { text: { id: "RA & asma adalah satu United Airway — nilai & tangani keduanya", en: "AR & asthma are one United Airway — assess & treat both" }, correct: true, affinity: "reggie" },
          { text: { id: "Abaikan paru, obati hidung saja", en: "Ignore the lungs, treat only the nose" }, correct: false },
          { text: { id: "Rujuk ke ortopedi", en: "Refer to orthopedics" }, correct: false }
        ],
        shortCard: { title: { id: "United Airway", en: "United Airway" },
          body: { id: "RA adalah faktor risiko utama asma. Satu jalan napas — skrining & tangani keduanya bersama.",
                  en: "AR is a major risk factor for asthma. One airway — screen & treat both together." } },
        fullCard: { title: { id: "Konsep United Airway", en: "United Airway Concept" },
          body: { id: "Saluran napas atas & bawah adalah satu kesatuan. RA memicu inflamasi sistemik yang memperkuat radang di saluran atas maupun bawah — menjelaskan kaitan dengan asma. RA adalah faktor risiko utama asma; mengobati RA dapat memperbaiki kontrol asma. Selalu skrining gejala saluran bawah pada pasien RA, dan sebaliknya. [EAACI Atlas, Sec A & C]",
                  en: "The upper & lower airways are one continuum. AR triggers systemic inflammation that augments inflammation in both upper and lower airways — explaining the asthma link. AR is a major risk factor for asthma; treating AR can improve asthma control. Always screen for lower-airway symptoms in AR patients, and vice versa. [EAACI Atlas, Sec A & C]" } } },
      { type: "say", who: "mentor", bg: "hospital",
        text: { id: "Kerja bagus, Dokter. Kamu menegakkan RA, memastikannya, dan melihat seluruh jalan napas. Itulah cara Medinovatech.",
                en: "Well done, Doctor. You diagnosed AR, confirmed it, and saw the whole airway. That is the Medinovatech way." } }
    ]
  }
];
