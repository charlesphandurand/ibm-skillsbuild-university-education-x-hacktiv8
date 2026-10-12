# IBM Skillsbuild University Education X Hacktiv8
# 🎨 PatternCraft Studio

> **PatternCraft Studio** adalah generator & katalisator SVG Pattern interaktif berbasis web statis yang memungkinkan desainer dan developer untuk menjelajahi, mengkustomisasi, serta mengekspor **50+ pattern SVG prosedural** secara *real-time*.

---

## 🔗 Website URL:
👉 **[Launch PatternCraft Studio App](https://ibm-skillsbuild-university-education-x-hacktiv8.charles-phandurand.workers.dev/)**

---

## 📌 Deskripsi Program

Proyek ini dibangun sebagai bagian dari program **IBM SkillsBuild University Education x Hacktiv8 Capstone Project**.

PatternCraft Studio memecahkan masalah kompleksitas pembuatan pattern latar belakang (*background pattern*) untuk kebutuhan pengembangan web. Tanpa perlu menginstal library berat atau bergantung pada koneksi internet penuh, platform ini menyediakan ruang kerja (*studio editor*) ringan dengan performa tinggi yang bekerja secara **zero-dependency**.

---

## ✨ Fitur Utama

- 🎨 **50+ Pattern SVG Prosedural:** Tersedia dalam 6 kategori utama (*Geometric*, *Lines*, *Abstract*, *Organic*, *Minimal*, *Tech*).
- 🎛️ **Interactive Editor Modal (Pattern Monster Style):**
  - **Scale & Zoom:** Mengatur perulangan pattern.
  - **Stroke & Weight:** Mengatur ketebalan garis/elemen SVG.
  - **Position X/Y Offset:** Menggeser penempatan pattern.
  - **Spacing & Angle:** Mengatur jarak antar elemen serta rotasi.
  - **3-Color Picker System:** Bebas mengustomisasi warna *Background*, *Pattern*, dan *Accent*.
- 📤 **Panel Ekspor Multi-Format:**
  - **Copy CSS:** Menghasilkan kode CSS `background-image` yang ter-encode Data-URI siap pakai.
  - **Copy / Download SVG:** Mengambil file SVG mentah atau mengunduhnya langsung.
  - **Download PNG:** Mengunduh hasil render pattern dalam format gambar bitmap.
- 🔍 **Real-Time Filter & Search Engine:** Fitur pencarian instan dan tab kategori dengan performa responsif (dibantu teknik *debounce*).
- 🌙 **Premium Dark Space UI:** Antarmuka modern bergaya *glassmorphism* dengan kenyamanan visual optimal.

---

## 🛠️ Skenario & Arsitektur Teknologi

Aplikasi ini mengusung pendekatan **Vanilla Web Stack** (*Pure HTML5, CSS3, ES6+ JavaScript*) tanpa *build step*, *framework*, maupun pustaka pihak ketiga.

```text
PatternCraft Studio/
├── index.html        # Struktur markup semantic & kontainer modal editor
├── styles.css        # Custom CSS variables, Grid, Flexbox & Glassmorphism UI
└── script.js         # State management, 50+ SVG generators, & export logic
