/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle } from "lucide-react";

// --- Data Pertanyaan Lengkap (Akan di-filter dinamis berdasarkan API) ---

const demografi = [
  { id: "age", label: "Usia", type: "number", min: 13, max: 18, defaultValue: 13 },
  { id: "gender", label: "Jenis Kelamin", type: "select", options: [{val: 1, label: "Laki-laki"}, {val: 2, label: "Perempuan"}] },
  { id: "education", label: "Tingkat Pendidikan", type: "select", options: [{val: 1, label: "Di Bawah SMA"}, {val: 2, label: "SMA/Sederajat"}, {val: 3, label: "Sarjana (S1)"}, {val: 4, label: "Pascasarjana (S2/S3)"}] },
  { id: "urban", label: "Wilayah Tempat Tinggal", type: "select", options: [{val: 1, label: "Pedesaan"}, {val: 2, label: "Pinggiran Kota"}, {val: 3, label: "Perkotaan"}] },
  { id: "religion", label: "Agama", type: "select", options: [{val: 0, label: "Agnostik"}, {val: 1, label: "Ateis"}, {val: 2, label: "Buddha"}, {val: 3, label: "Kristen"}, {val: 4, label: "Hindu"}, {val: 5, label: "Yahudi"}, {val: 6, label: "Islam"}] },
  { id: "race", label: "Ras/Etnis", type: "select", options: [{val: 0, label: "Kulit Putih"}, {val: 1, label: "Kulit Hitam"}, {val: 2, label: "Asia"}, {val: 3, label: "Campuran"}, {val: 4, label: "Lainnya"}, {val: 5, label: "Latin"}] },
  { id: "voted", label: "Suara Politik", type: "select", options: [{val: 0, label: "Tidak"}, {val: 1, label: "Ya"}, {val: 2, label: "Abstain"}, {val: 3, label: "Tidak Berlaku"}] },
  { id: "married", label: "Status Pernikahan", type: "select", options: [{val: 0, label: "Belum Menikah"}, {val: 1, label: "Menikah"}, {val: 2, label: "Cerai"}, {val: 3, label: "Janda/Duda"}, {val: 4, label: "Pisah"}] },
  { id: "familysize", label: "Jumlah Anggota Keluarga", type: "number", min: 0, max: 10, defaultValue: 3 },
];

const tipi = [
  {
    id: "TIPI1",
    text: "Saya adalah orang yang riang dan ekstrovert",
    desc: "(Sebaliknya: Pendiam, tertutup, dan kurang antusias)"
  },
  {
    id: "TIPI2",
    text: "Saya adalah orang yang kritis dan suka berdebat",
    desc: "(Sebaliknya: Pemaaf, ramah, dan mudah bekerja sama)"
  },
  {
    id: "TIPI3",
    text: "Saya adalah orang yang dapat diandalkan dan disiplin",
    desc: "(Sebaliknya: Tidak konsisten, kurang disiplin, dan ceroboh)"
  },
  {
    id: "TIPI4",
    text: "Saya mudah cemas dan mudah terganggu secara emosional",
    desc: "(Sebaliknya: Tenang dan stabil secara emosional)"
  },
  {
    id: "TIPI5",
    text: "Saya terbuka terhadap pengalaman baru dan kreatif",
    desc: "(Sebaliknya: Konvensional dan kurang terbuka terhadap ide baru)"
  },
  {
    id: "TIPI6",
    text: "Saya adalah orang yang pendiam dan tertutup",
    desc: "(Sebaliknya: Ekstrovert, sosial, dan terbuka)"
  },
  {
    id: "TIPI7",
    text: "Saya adalah orang yang simpatik dan hangat",
    desc: "(Sebaliknya: Dingin, kurang simpatik, dan kritis)"
  },
  {
    id: "TIPI8",
    text: "Saya adalah orang yang tidak terorganisir dan ceroboh",
    desc: "(Sebaliknya: Teratur, rapi, dan terorganisir)"
  },
  {
    id: "TIPI9",
    text: "Saya adalah orang yang tenang dan stabil secara emosional",
    desc: "(Sebaliknya: Mudah cemas dan mudah tertekan)"
  },
  {
    id: "TIPI10",
    text: "Saya adalah orang yang konvensional dan kurang kreatif",
    desc: "(Sebaliknya: Kreatif, inovatif, dan terbuka terhadap ide baru)"
  }
];

const tipiOptions = [
  { val: 1, label: "Sangat Tidak Setuju" },
  { val: 2, label: "Tidak Setuju" },
  { val: 3, label: "Agak Tidak Setuju" },
  { val: 4, label: "Netral" },
  { val: 5, label: "Agak Setuju" },
  { val: 6, label: "Setuju" },
  { val: 7, label: "Sangat Setuju" }
];

const getPredictionDescription = (prediction: number) =>
  prediction === 1
    ? "Keluaran model untuk label target ini bernilai 1 menurut ambang klasifikasi eksperimen. Ini bukan diagnosis atau penilaian kondisi seseorang."
    : "Keluaran model untuk label target ini bernilai 0 menurut ambang klasifikasi eksperimen. Ini tidak menyatakan kondisi kesehatan seseorang.";

export default function TesPage() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = Loading Config
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Dynamic Questions based on MFO selection from Backend
  const [activeDemografi, setActiveDemografi] = useState<any[]>([]);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    // 1. Fetch konfigurasi fitur yang terpilih dari backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/config`)
      .then(res => {
        if (!res.ok) throw new Error("API backend tidak berjalan");
        return res.json();
      })
      .then(data => {
        const selected = data.selected_features;
        
        // 2. Filter pertanyaan agar hanya menampilkan yang terpilih oleh model
        const filteredDemo = [
          ...demografi.filter(q => selected.includes(q.id))
        ];
        const filteredTipi = tipi.filter(q => selected.includes(q.id));
        
        setActiveDemografi(filteredDemo);
        
        // 3. Buat urutan halaman (steps) secara dinamis
        const generatedSteps = [
          { id: 'demografi', type: 'demografi' },
          ...filteredTipi.map((q, i) => ({ id: q.id, type: 'tipi', question: q, index: i + 1, total: filteredTipi.length }))
        ];
        
        setStepsData(generatedSteps);
        
        // 4. Inisialisasi state form dinamis
        setFormData({
          ...Object.fromEntries(filteredDemo.map(q => [q.id, q.defaultValue ?? q.options?.[0].val ?? 0])),
          ...Object.fromEntries(filteredTipi.map(q => [q.id, null]))
        });
        
        // Mulai tes
        setCurrentStep(0);
      })
      .catch(err => {
        console.error(err);
        alert("Gagal memuat konfigurasi demo dari server. Pastikan koneksi internet Anda stabil atau muat ulang halaman.");
      });
  }, []);

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowInsights(false);
    setCurrentStep(stepsData.length); // Pindah ke loading / result view
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error("Gagal menghubungi server API");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses jawaban Anda. Silakan coba kirim ulang.");
      setCurrentStep(0); // kembali ke awal jika gagal
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Variables for current view
  const isLoadingConfig = currentStep === -1;
  const isResultView = currentStep >= stepsData.length && !isLoadingConfig;
  const stepInfo = (!isResultView && !isLoadingConfig) ? stepsData[currentStep] : null;
  const progressPercentage = isLoadingConfig ? 0 : (isResultView ? 100 : ((currentStep) / stepsData.length) * 100);

  // Validation: User must select an option before proceeding on TIPI questions
  let isNextDisabled = false;
  if (stepInfo?.type === 'tipi') {
    if (formData[stepInfo.id] === null) {
      isNextDisabled = true;
    }
  }

  // Menunggu backend memberikan konfigurasi
  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-teal-700 rounded-full animate-spin mb-4"></div>
        <p className="text-stone-500 font-medium animate-pulse">Menghubungkan ke API demonstrasi model...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-32">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Kembali</span>
          </Link>
          <div className="font-semibold text-lg text-stone-800 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 text-white" />
            </div>
            <span>NeuralMind<span className="text-teal-700">.id</span></span>
          </div>
          <div className="w-16 sm:w-20 text-right text-sm font-medium text-stone-500">
            {!isResultView && `${Math.round(progressPercentage)}%`}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div 
            className="bg-teal-700 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-10">
        
        {/* VIEW: DEMOGRAFI */}
        {stepInfo?.type === 'demografi' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-8">
              <span className="text-teal-700">Bagian 1: Fitur demografi</span>
              <h1 className="text-3xl font-bold text-stone-900 mb-3">Informasi Demografis</h1>
              <p className="text-stone-600">Isi variabel demografi yang digunakan dalam eksperimen. Jawaban dikirim ke server API untuk menghasilkan keluaran model; jangan masukkan informasi identitas tambahan.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {activeDemografi.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">{field.label}</label>
                    {field.type === "select" ? (
                      <select 
                        className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-teal-700/50 focus:border-teal-700 outline-none transition-all"
                        value={formData[field.id]}
                        onChange={(e) => handleInputChange(field.id, Number(e.target.value))}
                      >
                        {field.options?.map((opt: any) => (
                          <option key={opt.val} value={opt.val}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === "text" ? (
                      <input 
                        type="text" 
                        placeholder="Ketik nama Anda..."
                        className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-teal-700/50 focus:border-teal-700 outline-none transition-all"
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    ) : (
                      <input 
                        type="number" 
                        min={field.min} 
                        max={field.max}
                        className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-teal-700/50 focus:border-teal-700 outline-none transition-all"
                        value={formData[field.id]}
                        onChange={(e) => handleInputChange(field.id, Number(e.target.value))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TIPI (Per Pertanyaan) */}
        {stepInfo?.type === 'tipi' && (
          <div key={stepInfo.id} className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-8 text-center max-w-xl mx-auto">
              <span className="text-teal-700">
                Bagian 2: Sifat Kepribadian ({stepInfo.index} dari {stepInfo.total})
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">{stepInfo.question.text}</h2>
              <p className="text-stone-500 inline-block bg-teal-50 px-4 py-1.5 rounded-full text-sm font-medium border border-teal-100">{stepInfo.question.desc}</p>
            </div>

            <div className="max-w-xl mx-auto space-y-3">
              {tipiOptions.map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleInputChange(stepInfo.id, opt.val)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${
                    formData[stepInfo.id] === opt.val 
                      ? "border-teal-700 bg-teal-700/5 text-teal-700 shadow-sm shadow-teal-100" 
                      : "border-stone-200 bg-white text-stone-700 hover:border-teal-300 hover:bg-stone-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}



        {/* Loading State during Submission */}
        {isResultView && isSubmitting && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-teal-700 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Menjalankan demonstrasi model...</h2>
            <p className="text-stone-500">Model memproses fitur yang dimasukkan untuk menghasilkan prediksi label.</p>
          </div>
        )}

        {/* VIEW: RESULT MOCKUP */}
        {isResultView && !isSubmitting && result && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
                <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Demo Model Selesai</h1>
              <p className="text-stone-600 max-w-lg mx-auto">
                Berikut keluaran model untuk fitur yang dimasukkan. Label target penelitian dibentuk dari ambang skor DASS-42, sedangkan demo ini menggunakan item TIPI dan variabel demografi.
              </p>
              <p className="text-sm text-stone-500 max-w-2xl mx-auto mt-3">
                Keluaran ini adalah demonstrasi eksperimen, bukan hasil pengukuran DASS-42 terhadap Anda, diagnosis, atau penilaian klinis. Nilai label 1 memakai ambang prediksi model 0,5; label target penelitian berasal dari skor DASS-42 depresi ≥14, kecemasan ≥10, dan stres ≥19.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Depresi */}
              <div className="p-6 rounded-3xl border border-stone-200 bg-stone-50 flex flex-col">
                <h3 className="font-bold text-stone-900 mb-1">Label target depresi</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-2xl font-bold text-stone-800">Prediksi label: {result.depression.prediction}</span>
                </div>
                <p className="text-sm text-stone-600">{getPredictionDescription(result.depression.prediction)}</p>
              </div>

              {/* Kecemasan */}
              <div className="p-6 rounded-3xl border border-stone-200 bg-stone-50 flex flex-col">
                <h3 className="font-bold text-stone-900 mb-1">Label target kecemasan</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-2xl font-bold text-stone-800">Prediksi label: {result.anxiety.prediction}</span>
                </div>
                <p className="text-sm text-stone-600">{getPredictionDescription(result.anxiety.prediction)}</p>
              </div>

              {/* Stres */}
              <div className="p-6 rounded-3xl border border-stone-200 bg-stone-50 flex flex-col">
                <h3 className="font-bold text-stone-900 mb-1">Label target stres</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-2xl font-bold text-stone-800">Prediksi label: {result.stress.prediction}</span>
                </div>
                <p className="text-sm text-stone-600">{getPredictionDescription(result.stress.prediction)}</p>
              </div>
            </div>

            {/* CTA Insights */}
            {!showInsights ? (
              <div className="bg-teal-50 border border-teal-100 p-8 rounded-3xl text-center mb-10 animate-in fade-in duration-700">
                <BrainCircuit className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-900 mb-2">Ingin melihat kontribusi fitur pada keluaran model?</h3>
                <p className="text-stone-600 mb-6 max-w-md mx-auto">
                  SHAP merangkum kontribusi fitur terhadap keluaran model untuk contoh ini. Nilai tersebut tidak menunjukkan penyebab kondisi psikologis.
                </p>
                <button
                  onClick={() => setShowInsights(true)}
                  className="bg-white border-2 border-teal-700 text-teal-800 px-6 py-3 rounded-xl font-bold hover:bg-teal-700 hover:text-white transition-all shadow-sm"
                >
                  Lihat Kontribusi Fitur (SHAP)
                </button>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="text-center mb-8">
                  <span className="text-teal-700 font-bold uppercase tracking-wider text-sm mb-2 block">Penjelasan Model</span>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">Kontribusi Fitur (SHAP)</h3>
                  <p className="text-stone-500">Nilai SHAP menunjukkan kontribusi fitur pada skor model untuk contoh ini, bukan penyebab atau faktor pemicu. Pada Classifier Chain, prediksi label sebelumnya juga dapat menjadi fitur.</p>
                </div>
                
                <div className="space-y-8">
                  {['depression', 'anxiety', 'stress'].map((condition) => {
                    const labelMap = { depression: 'Depresi', anxiety: 'Kecemasan', stress: 'Stres' };
                    const shaps = result[condition as keyof typeof result].shap_explanation;
                    const maxAbsShap = Math.max(0, ...(shaps ?? []).map((shap: any) => Math.abs(Number(shap.impact_value) || 0)));
                    return (
                      <div key={condition} className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                        <h4 className="font-bold text-lg text-stone-800 mb-4 border-b border-stone-200 pb-2">
                          Prediksi label target: {labelMap[condition as keyof typeof labelMap]}
                        </h4>
                        <div className="space-y-5">
                          {shaps && shaps.map((shap: any, idx: number) => (
                            <div key={idx} className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-end gap-3">
                                <span className="font-semibold text-sm text-stone-700">{idx + 1}. {shap.feature}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs tabular-nums text-stone-500">{Number(shap.impact_value).toFixed(3)}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${shap.type === 'menaikkan_skor_model' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                                    {shap.type === 'menaikkan_skor_model' ? 'Skor model naik' : 'Skor model turun'}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-stone-200 rounded-full h-2.5 flex overflow-hidden shadow-inner" role="img" aria-label={`Besar relatif nilai SHAP ${shap.feature}: ${Number(shap.impact_value).toFixed(3)}`}>
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${shap.type === 'menaikkan_skor_model' ? 'bg-amber-500' : 'bg-sky-500'}`} 
                                  style={{ width: `${maxAbsShap > 0 ? (Math.abs(Number(shap.impact_value) || 0) / maxAbsShap) * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setShowInsights(false);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="text-stone-500 hover:text-stone-800 font-semibold underline underline-offset-4"
                  >
                    Tutup Penjelasan Model
                  </button>
                </div>
              </div>
            )}

            <div className="bg-rose-50 border-2 border-rose-200 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row gap-6 items-start text-rose-900">
              <div className="w-12 h-12 bg-rose-200 rounded-2xl flex items-center justify-center flex-shrink-0 text-rose-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2">Batas penggunaan</h4>
                <p className="text-sm text-rose-800/90 leading-relaxed mb-4">
                  Situs ini merupakan demonstrasi model penelitian, bukan alat diagnosis, skrining klinis, atau penilaian kondisi kesehatan pengunjung. Label target dibentuk dari skor DASS-42 pada dataset; demo ini tidak mengukur skor DASS-42 Anda.
                </p>
                <p className="text-sm text-rose-800/90 leading-relaxed font-semibold">
                  Jika Anda membutuhkan dukungan terkait kesehatan mental, hubungi orang tepercaya atau tenaga profesional di wilayah Anda.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/"
                className="w-full sm:w-auto bg-white border border-stone-200 text-stone-700 px-8 py-3 rounded-xl font-semibold hover:bg-stone-50 transition-colors text-center"
              >
                Kembali ke Beranda
              </Link>
              <button 
                onClick={() => {
                  setCurrentStep(0);
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors shadow-lg shadow-teal-700/20"
              >
                Ulangi Demo
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Bottom Navigation */}
      {!isResultView && !isLoadingConfig && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 p-4 z-20">
          <div className="max-w-3xl mx-auto flex justify-between items-center px-2">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            
            <button 
              onClick={nextStep}
              disabled={isNextDisabled}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow-sm ${
                isNextDisabled 
                  ? 'bg-stone-300 cursor-not-allowed' 
                  : 'bg-teal-700 hover:bg-teal-600 shadow-teal-700/30'
              }`}
            >
              {currentStep === stepsData.length - 1 ? "Lihat Keluaran Model" : "Selanjutnya"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
