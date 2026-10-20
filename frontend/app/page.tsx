import Link from "next/link";
import { ArrowRight, Brain, HeartPulse, BookOpen, BrainCircuit, Users, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-teal-600/20">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="font-semibold text-lg text-stone-800 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 text-white" />
            </div>
            <span>NeuralMind<span className="text-teal-700">.id</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
            <a href="#tentang" className="hover:text-stone-800 transition-colors">Tentang</a>
            <a href="#cara-kerja" className="hover:text-stone-800 transition-colors">Cara Kerja</a>
            <a href="#faq" className="hover:text-stone-800 transition-colors">FAQ</a>
          </nav>
          <Link 
            href="/tes" 
            className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Coba Demo
          </Link>
        </div>
      </header>

      {/* Hero Section — asymmetric, spacious, calm */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left — Text content */}
            <div className="lg:col-span-7">
              <p className="text-teal-700 font-medium text-sm tracking-wide mb-6">
                Demonstrasi Model Penelitian
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-stone-900 tracking-tight leading-[1.15] mb-6">
                Menjelajahi
                <br />
                keluaran model
                <br />
                <span className="text-teal-700">penelitian multi-label.</span>
              </h1>
              <p className="text-stone-500 text-lg leading-relaxed max-w-xl mb-10">
                Demo model machine learning yang memperkirakan label target depresi, kecemasan, dan stres dari 10 respons item TIPI serta 5 variabel demografis. Label penelitian dibentuk dari skor DASS-42; hasil demo ini bukan diagnosis atau penilaian klinis.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link 
                  href="/tes" 
                  className="inline-flex items-center gap-2.5 bg-teal-700 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-teal-800 transition-colors"
                >
                  Jalankan Demo Model
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
                <a 
                  href="#tentang" 
                  className="inline-flex items-center gap-2 text-stone-500 px-4 py-3.5 font-medium text-base hover:text-stone-700 transition-colors"
                >
                  Pelajari lebih lanjut
                  <ChevronDown className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right — Calm visual card */}
            <div className="lg:col-span-5">
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-7 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
                <span className="text-sm font-medium text-stone-400 tracking-wide">Tiga label target dari DASS-42</span>
                </div>
                
                {[
                  { label: "Depresi", desc: "Ambang label penelitian: skor DASS-42 ≥14", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                  { label: "Kecemasan", desc: "Ambang label penelitian: skor DASS-42 ≥10", color: "bg-amber-50 text-amber-700 border-amber-100" },
                  { label: "Stres", desc: "Ambang label penelitian: skor DASS-42 ≥19", color: "bg-rose-50 text-rose-700 border-rose-100" },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl border ${item.color}`}>
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">{item.label}</div>
                      <div className="text-stone-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar — minimal, quiet */}
      <div className="border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-stone-400 font-medium">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-teal-600" /> Demonstrasi penelitian</span>
            <span className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-teal-600" /> Dataset survei</span>
            <span className="flex items-center gap-2"><Brain className="w-4 h-4 text-teal-600" /> Machine learning</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-teal-600" /> Rentang dataset: 13–18 tahun</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="tentang" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-teal-700 font-medium text-sm tracking-wide mb-4">Tentang Sistem</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-6">
                Prediksi label berbasis
                <br />fitur psikososial.
              </h2>
              <p className="text-stone-500 leading-relaxed">
                Situs ini menampilkan prototipe model dari penelitian pada dataset survei lintas negara. Model belum divalidasi untuk penggunaan klinis atau untuk mewakili populasi remaja Indonesia secara khusus.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {[
                { 
                  icon: Brain, 
                  title: "Item TIPI", 
                  desc: "Sepuluh jawaban item TIPI digunakan sebagai fitur masukan dalam eksperimen; demo ini tidak menghitung skor klinis atau profil kepribadian lengkap." 
                },
                { 
                  icon: Users, 
                  title: "Faktor Demografis", 
                  desc: "Mempertimbangkan konteks sosial seperti usia, pendidikan, wilayah tempat tinggal, dan ukuran keluarga sebagai prediktor tambahan." 
                },
                { 
                  icon: BookOpen, 
                  title: "Prediksi Multi-label", 
                  desc: "Menghasilkan prediksi untuk tiga label target. Classifier Chain menggunakan prediksi label sebelumnya sebagai masukan bagi model berikutnya; urutan komputasi ini tidak menunjukkan hubungan sebab-akibat." 
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1.5">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — clean steps */}
      <section id="cara-kerja" className="py-24 lg:py-32 bg-stone-50 border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-teal-700 font-medium text-sm tracking-wide mb-4">Cara Kerja</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-5">
              Cara kerja demonstrasi penelitian.
            </h2>
            <p className="text-stone-500 leading-relaxed">
              Demo menerima fitur yang digunakan dalam eksperimen dan menampilkan keluaran model. Evaluasi penelitian dilakukan pada dataset yang digunakan dalam studi; demo ini bukan asesmen klinis.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                step: "01", 
                title: "Isi Variabel Demografi",
                desc: "Masukkan variabel demografi yang menjadi fitur eksperimen: usia, pendidikan, wilayah, jenis kelamin, dan ukuran keluarga."
              },
              { 
                step: "02", 
                title: "Jawab Pertanyaan",
                desc: "Jawab 10 item TIPI yang digunakan sebagai fitur model dalam penelitian."
              },
              { 
                step: "03", 
                title: "Lihat Keluaran Model",
                desc: "Lihat prediksi label target dan kontribusi fitur terhadap keluaran model, beserta batas interpretasinya."
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-4xl font-bold text-stone-200 mb-4">{item.step}</div>
                <h3 className="font-semibold text-stone-800 text-lg mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ML Transparency section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-teal-700 font-medium text-sm tracking-wide mb-4">Transparansi Model</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-5">
              Bagaimana model penelitian membuat prediksi?
            </h2>
            <p className="text-stone-500 leading-relaxed">
              Berikut ringkasan data, fitur, dan evaluasi model sebagaimana dilakukan dalam eksperimen penelitian.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6">
              <h3 className="font-semibold text-stone-800 mb-3">Algoritma</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                XGBoost dengan Classifier Chain menghasilkan tiga prediksi label target. Prediksi label sebelumnya menjadi fitur bagi tahap berikutnya.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">XGBoost</span>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Classifier Chain</span>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Multi-label</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6">
              <h3 className="font-semibold text-stone-800 mb-3">Fitur Model</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                Eksperimen menggunakan 10 jawaban item TIPI dan 5 variabel demografi. Item dan skor DASS digunakan untuk membentuk target, lalu dikeluarkan dari fitur model.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">TIPI-10</span>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">15 Fitur</span>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Demografis</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6">
              <h3 className="font-semibold text-stone-800 mb-3">Data Training</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                Dataset awal berisi 39.775 respons dan menjadi 10.315 setelah pembersihan. Pada data latih, eksperimen menerapkan oversampling khusus untuk kombinasi label 000; metode ini tidak menjamin prediksi lebih adil.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Usia aktual 13–18</span>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Oversampling data latih</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6">
              <h3 className="font-semibold text-stone-800 mb-3">Validasi</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                Eksperimen menggunakan 5-fold multilabel cross-validation pada data latih dan evaluasi akhir pada test set. Optimasi parameter menggunakan Macro F1; beberapa metrik lain dipakai untuk membandingkan hasil.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Cross-Validation</span>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-md text-xs font-medium text-stone-600">Test set terpisah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 lg:py-32 bg-stone-50 border-y border-stone-100">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-teal-700 font-medium text-sm tracking-wide mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              Pertanyaan yang sering diajukan.
            </h2>
          </div>
          
          <div className="space-y-3">
            {[
              {
                q: "Apakah hasil demo ini menunjukkan kondisi kesehatan mental saya?",
                a: "Tidak. Demo menampilkan prediksi model terhadap label target penelitian yang dibentuk dari ambang skor DASS-42 pada dataset. Pengunjung mengisi item TIPI dan variabel demografi, bukan DASS-42. Keluaran ini bukan diagnosis atau penilaian klinis."
              },
              {
                q: "Bagaimana jawaban saya diproses?",
                a: "Jawaban formulir dikirim ke server API untuk menghasilkan keluaran model. Jangan masukkan nama asli atau informasi sensitif. Penyimpanan dan retensi data bergantung pada konfigurasi server dan layanan hosting yang digunakan."
              },
              {
                q: "Berapa lama waktu yang dibutuhkan?",
                a: "Waktu pengisian bergantung pada kecepatan menjawab. Formulir meminta variabel demografi dan 10 item TIPI yang digunakan dalam eksperimen."
              },
              {
                q: "Untuk apa demo ini digunakan?",
                a: "Ini adalah demonstrasi model penelitian, bukan layanan untuk menilai kondisi individu. Data setelah pembersihan mencakup responden usia 13–18 tahun dan berasal dari survei lintas negara; model belum divalidasi khusus untuk populasi Indonesia."
              },
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl border border-stone-200/80 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-stone-800 text-sm">
                  {item.q}
                  <ChevronDown className="w-4 h-4 text-stone-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-stone-500 text-sm leading-relaxed -mt-1">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — quiet, respectful */}
      <section className="py-24 lg:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-5">
            Jelajahi demonstrasi
            <br />model penelitian.
          </h2>
          <p className="text-stone-500 leading-relaxed mb-10 max-w-lg mx-auto">
            Lihat bagaimana model penelitian menghasilkan prediksi label dari fitur yang digunakan dalam eksperimen. Jangan masukkan informasi identitas pribadi.
          </p>
          <Link 
            href="/tes" 
            className="inline-flex items-center gap-2.5 bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-teal-800 transition-colors"
          >
            Coba Demo Model
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* Footer — clean, minimal */}
      <footer className="border-t border-stone-200 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="font-semibold text-lg text-stone-800 tracking-tight flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-4.5 h-4.5 text-white" />
                </div>
                <span>NeuralMind<span className="text-teal-700">.id</span></span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Prototipe demonstrasi model klasifikasi multi-label dari penelitian berbasis machine learning.
              </p>
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                <p className="text-rose-700 text-xs leading-relaxed">
                  <strong className="block mb-1 text-rose-800 text-xs">Batas penggunaan</strong>
                  Situs ini bukan alat diagnosis atau skrining klinis dan tidak menilai kondisi kesehatan pengunjung.
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-stone-800 text-sm mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-stone-400 hover:text-teal-700 transition-colors">Beranda</a></li>
                <li><Link href="/tes" className="text-stone-400 hover:text-teal-700 transition-colors">Coba Demo Model</Link></li>
                <li><a href="#tentang" className="text-stone-400 hover:text-teal-700 transition-colors">Tentang Sistem</a></li>
                <li><a href="#cara-kerja" className="text-stone-400 hover:text-teal-700 transition-colors">Cara Kerja</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-800 text-sm mb-4">Informasi</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#faq" className="text-stone-400 hover:text-teal-700 transition-colors">FAQ</a></li>
                <li><span className="text-stone-400">Kebijakan Privasi</span></li>
                <li><span className="text-stone-400">Syarat & Ketentuan</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-stone-100 text-xs text-stone-400 font-medium flex flex-col md:flex-row justify-between items-center gap-3">
            <div>&copy; {new Date().getFullYear()} NeuralMind.id — Proyek penelitian berbasis data mining.</div>
            <div className="text-stone-300">Dibangun dengan Next.js, XGBoost, dan SHAP.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
