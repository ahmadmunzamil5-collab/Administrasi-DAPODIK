import React, { useRef } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const ExportImportModal: React.FC = () => {
  const { 
    isBackupModalOpen, 
    setIsBackupModalOpen, 
    sekolah, 
    tanahList, 
    bangunanList, 
    ruangList, 
    saranaAlatList, 
    pesertaDidikList, 
    gtkList, 
    rombelList, 
    syncLogs, 
    resetToInitialData,
    logActivity 
  } = useDapodik();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBackupModalOpen) return null;

  const handleExportJson = () => {
    const backupData = {
      version: '2026.a',
      exportDate: new Date().toISOString(),
      sekolah,
      tanahList,
      bangunanList,
      ruangList,
      saranaAlatList,
      pesertaDidikList,
      gtkList,
      rombelList,
      syncLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DAPODIK_BACKUP_${sekolah.npsn}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logActivity(
      'EXPORT',
      'Sistem',
      'Pencadangan Basis Data (JSON)',
      `Mengekspor seluruh arsip basis data Dapodik sekolah (${sekolah.npsn}) ke berkas JSON.`
    );
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.sekolah && parsed.pesertaDidikList) {
          localStorage.setItem('DAPODIK_STORAGE_V1', JSON.stringify(parsed));
          logActivity(
            'IMPORT',
            'Sistem',
            'Pemulihan Arsip Basis Data',
            `Memulihkan basis data Dapodik dari berkas cadangan JSON ${file.name}.`
          );
          alert('Arsip data Dapodik berhasil dipulihkan! Halaman akan memuat ulang.');
          window.location.reload();
        } else {
          alert('Format file JSON tidak sesuai dengan skema data Dapodik.');
        }
      } catch {
        alert('Gagal membaca file JSON cadangan.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data ke data percontohan standar? Data yang baru diinput akan dikembalikan.')) {
      resetToInitialData();
      logActivity(
        'UPDATE',
        'Sistem',
        'Pengaturan Ulang Data',
        'Mengatur ulang seluruh data Dapodik ke konfigurasi percontohan awal.'
      );
      setIsBackupModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">Cadangan & Ekspor Data Dapodik</h3>
          </div>
          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="text-white/80 hover:text-white p-1 font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Anda dapat mencadangkan seluruh data satuan pendidikan (Profil, Sarpras, Peserta Didik, GTK, Rombel, serta Log Sinkronisasi) dalam format berkas JSON lokal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExportJson}
              className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition-colors flex flex-col items-center justify-center gap-2 text-blue-900 font-semibold group text-center"
            >
              <Download className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Unduh Berkas Cadangan (.JSON)</span>
            </button>

            <label className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors flex flex-col items-center justify-center gap-2 text-emerald-900 font-semibold group cursor-pointer text-center">
              <Upload className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Pulihkan dari Berkas JSON</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Kembalikan ke Contoh Standar</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Gunakan tombol ini jika Anda ingin mengembalikan basis data ke contoh asli SMKN 1 Graha Nusantara.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data Contoh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setIsBackupModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
