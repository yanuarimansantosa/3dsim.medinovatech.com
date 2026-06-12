# Medinovatech 3D Simulator — Allergy-Immunology

> `3dsim.medinovatech.com` — by **Medinovatech**

Simulator belajar **alergi-imunologi THT** dwibahasa (Indonesia / English) untuk
dokter THT, residen/koas, dan dokter umum.

## Fitur
- **Visual novel klinis** — hadapi pasien, jawab, belajar.
  Loop: kasus → pertanyaan → **benar** = kartu kilat → kasus berikutnya /
  **salah** = Perpustakaan (bacaan lengkap) → ulang.
- **Ruang Anatomi 3D** — model 3D kavum nasi & sinus paranasal yang bisa
  diputar/zoom, **toggle Normal ⇄ Alergi** (mukosa membengkak & memerah),
  ketuk model untuk info.

Konten klinis berbasis **EAACI Global Atlas of Allergic Rhinitis & Chronic Rhinosinusitis**.

## Teknologi
Statis murni — HTML + CSS + vanilla JS (ES modules) + Three.js (WebGL).
Tidak butuh Node/build di server; cukup disajikan sebagai file statis (nginx).

## Struktur
- `index.html` — entry
- `game.js` — engine visual novel
- `anatomy.js` — Ruang Anatomi 3D
- `data.js` — konten & teks dwibahasa
- `styles.css`
- `assets/` — gambar + model 3D (`nasal.glb`)
- `vendor/` — Three.js (three.module.js, OrbitControls, GLTFLoader)

## Deploy (VPS, nginx)
```bash
cd /www/wwwroot
git clone https://github.com/yanuarimansantosa/3dsim.medinovatech.com.git
# arahkan root site nginx ke folder hasil clone, start site, aktifkan SSL
```
Update berikutnya: `git pull` di folder tersebut.

## Lisensi & atribusi
Lihat [`CREDITS.md`](CREDITS.md). Model 3D dari sumber pihak ketiga —
verifikasi lisensinya sebelum penggunaan publik/komersial.

> ⚠️ Prototipe edukasi — bukan untuk keputusan klinis nyata.
