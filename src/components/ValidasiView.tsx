import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { ValidasiItem } from '../types/dapodik';

export const ValidasiView: React.FC = () => {
  const { 
    validationResults, 
    invalidCount, 
    warningCount, 
    runValidation, 
    setActiveTab, 
    triggerSampleInvalidData, 
    fixAllInvalidData 
  } = useDapodik();

  const [activeModul, setActiveModul] = useState<string>('all');
  const [activeKategori, setActiveKategori] = useState<'all' | 'Invalid' | 'Warning'>('all');

  const filteredResults = validationResults.filter(item => {
    const matchesModul = activeModul === 'all' || item.modul === activeModul;
    const matchesKategori = activeKategori === 'all' || item.kategori === activeKategori;
    return matchesModul && matchesKategori;
  });

  const getModulCounts = (modulName: string) => {
    const items = validationResults.filter(r => r.modul === modulName);
    const invalids = items.filter(r => r.kategori === 'Invalid').length;
    const warnings = items.filter(r => r.kategori === 'Warning').length;
    return { invalids, warnings };
  };

  const handleFixRedirect = (item: ValidasiItem) => {
    if (item.modul === 'Peserta Didik') setActiveTab('peserta-didik');
    else if (item.modul === 'Sarpras') setActiveTab('sarpras');
    else if (item.modul === 'GTK') setActiveTab('gtk');
    else if (item.modul === 'Rombel') setActiveTab('rombel');
    else if (item.modul === 'Sekolah') setActiveTab('dashboard');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>Validasi Data Lokal Dapodik</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan integritas basis data lokal sebelum transmisi paket data ke Server Pusat Pusdatin Kemendikbudristek.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Test button to demonstrate Dapodik blocking behavior */}
          <button
            onClick={triggerSampleInvalidData}
            title="Suntikkan data contoh cacat untuk menguji blokir validasi"
            className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulasi Data Cacat</span>
          </button>

          {invalidCount > 0 && (
            <button
              onClick={fixAllInvalidData}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Perbaiki Otomatis</span>
            </button>
          )}

          <button
            onClick={runValidation}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Hitung Ulang Validasi</span>
          </button>
        </div>
      </div>

      {/* Primary Banner Status */}
      <div className={`p-5 rounded-2xl border transition-all ${
        invalidCount === 0 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-emerald-300 text-emerald-950'
          : 'bg-gradient-to-r from-rose-50 via-amber-50 to-rose-100 border-rose-300 text-rose-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              invalidCount === 0 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {invalidCount === 0 ? <ShieldCheck className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg">
                  {invalidCount === 0 
                    ? 'Status Validasi: SIAP SINKRONISASI (0 Invalid)' 
                    : `Status Validasi: DITANGGUHKAN (${invalidCount} Data Invalid)`}
                </h3>
              </div>
              <p className="text-xs mt-1 max-w-2xl leading-relaxed text-slate-700">
                {invalidCount === 0 
                  ? 'Selamat! Basis data satuan pendidikan Anda telah memenuhi seluruh aturan konsistensi Kemendikbudristek. Anda dapat melanjutkan ke proses sinkronisasi real-time.' 
                  : 'Server Pusat mensyaratkan 0 data invalid sebelum pengiriman paket. Silakan selesaikan seluruh item invalid di bawah ini.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Invalid</span>
              <span className={`text-xl font-bold font-mono ${invalidCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {invalidCount}
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Warning</span>
              <span className="text-xl font-bold font-mono text-amber-600">
                {warningCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Sekolah', 'Sarpras', 'Peserta Didik', 'GTK', 'Rombel'].map(modul => {
            const isActive = activeModul === modul;
            const counts = modul !== 'all' ? getModulCounts(modul) : { invalids: invalidCount, warnings: warningCount };

            return (
              <button
                key={modul}
                onClick={() => setActiveModul(modul)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{modul === 'all' ? 'Semua Modul' : modul}</span>
                {counts.invalids > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-rose-400 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {counts.invalids}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Severity Filter */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveKategori('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeKategori === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveKategori('Invalid')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeKategori === 'Invalid' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700'
            }`}
          >
            Invalid ({invalidCount})
          </button>
          <button
            onClick={() => setActiveKategori('Warning')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeKategori === 'Warning' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700'
            }`}
          >
            Warning ({warningCount})
          </button>
        </div>
      </div>

      {/* Validation Items List */}
      <div className="space-y-3">
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-800">
              Tidak Ada Masalah Validasi
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tidak ditemukan data invalid maupun warning pada kategori ini. Seluruh entitas telah valid sesuai standar Kemendikbudristek.
            </p>
          </div>
        ) : (
          filteredResults.map(item => {
            const isInvalid = item.kategori === 'Invalid';
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isInvalid ? 'border-rose-200 hover:border-rose-300' : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isInvalid ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isInvalid ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isInvalid ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {item.kategori}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        Modul: {item.modul}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">
                        {item.judul}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600">
                      {item.keterangan}
                    </p>

                    <div className="text-[11px] text-blue-700 font-medium flex items-center gap-1.5 pt-1">
                      <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Saran Perbaikan: {item.tindakanPerbaikan}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => handleFixRedirect(item)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ready Action Banner if 0 Invalid */}
      {invalidCount === 0 && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Syarat sinkronisasi terpenuhi. Lanjutkan transmisi data ke server Kemendikbudristek sekarang.</span>
          </div>
          <button
            onClick={() => setActiveTab('sinkronisasi')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap transition-colors"
          >
            Lanjutkan ke Sinkronisasi &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
