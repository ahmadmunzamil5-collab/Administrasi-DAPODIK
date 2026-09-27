import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  RefreshCw, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Clock, 
  Terminal, 
  Check, 
  Loader2, 
  Lock, 
  Wifi, 
  Printer, 
  Download,
  AlertCircle
} from 'lucide-react';
import { SyncStep, SyncHistoryLog } from '../types/dapodik';

export const SinkronisasiView: React.FC = () => {
  const { 
    sekolah, 
    pesertaDidikList, 
    gtkList, 
    ruangList, 
    tanahList, 
    bangunanList, 
    rombelList, 
    syncLogs, 
    invalidCount, 
    warningCount, 
    unsyncedChangesCount, 
    lastSyncTimestamp, 
    realtimeSyncEnabled, 
    setRealtimeSyncEnabled, 
    serverLatency, 
    serverStatus, 
    isSyncing, 
    syncProgress, 
    syncCurrentStep, 
    syncSteps, 
    startFullSync, 
    cancelSync, 
    setSelectedSptjmLog, 
    setIsSptjmModalOpen,
    setActiveTab 
  } = useDapodik();

  const [activeLogTab, setActiveLogTab] = useState<'status' | 'riwayat'>('status');

  const handleStartSync = async () => {
    if (invalidCount > 0) {
      alert(`Sinkronisasi tidak dapat dilanjutkan karena masih terdapat ${invalidCount} data invalid. Harap perbaiki pada menu Validasi.`);
      setActiveTab('validasi');
      return;
    }
    await startFullSync();
  };

  const latestLog = syncLogs[0];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className={`w-6 h-6 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sinkronisasi Data Real-Time ke Server Pusat</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat transmisi dan komunikasi data terintegrasi dengan Pusdatin Kemendikbudristek RI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {latestLog && (
            <button
              onClick={() => {
                setSelectedSptjmLog(latestLog);
                setIsSptjmModalOpen(true);
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-300"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Cetak Berita Acara (SPTJM)</span>
            </button>
          )}
        </div>
      </div>

      {/* Gateway Connection & Real-Time Sync Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gateway Info */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold text-sm text-slate-100 tracking-wide uppercase">Gateway Server Pusdatin Kemendikbudristek</span>
                </div>
                <div className="text-xs font-mono text-blue-300 mt-0.5">
                  https://sync.dapodik.kemdikbud.go.id/v2026/gateway
                </div>
                <div className="text-[11px] text-slate-300 mt-2 flex flex-wrap items-center gap-3">
                  <span>NPSN Terdaftar: <strong className="text-white font-mono">{sekolah.npsn}</strong></span>
                  <span>•</span>
                  <span>Enkripsi: <strong className="text-emerald-300 font-mono">TLS 1.3 / AES-256</strong></span>
                  <span>•</span>
                  <span>Latensi: <strong className="text-emerald-400 font-mono">{serverLatency} ms</strong></span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span>Terhubung Online</span>
              </span>
              <span className="text-[10px] text-blue-300/80">
                Protokol: REST / WSS v2026.a
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time Auto Sync Switcher Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className={`w-4 h-4 ${realtimeSyncEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Mode Real-Time Auto-Sync</span>
              </span>
              <button
                onClick={() => setRealtimeSyncEnabled(!realtimeSyncEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  realtimeSyncEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    realtimeSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Jika aktif, setiap perubahan biodata siswa, sarpras, atau GTK akan otomatis disinkronkan secara background delta tanpa menunggu sinkronisasi manual.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Perubahan belum terkirim:</span>
            <span className={`font-mono font-bold ${unsyncedChangesCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {unsyncedChangesCount} record
            </span>
          </div>
        </div>
      </div>

      {/* Main Sync Runner & Status Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Readiness Checklist */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">
                Pemeriksaan Prasyarat Transmisi Data
              </span>
              {invalidCount === 0 ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Lolos Validasi
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  Terdapat {invalidCount} Data Invalid
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Sinkronisasi akan mengirim seluruh data sekolah ke Pangkalan Data Pokok Pendidikan Nasional.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isSyncing ? (
              <button
                onClick={cancelSync}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Batalkan Sinkronisasi
              </button>
            ) : (
              <button
                onClick={handleStartSync}
                disabled={invalidCount > 0}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                  invalidCount > 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Mulai Sinkronisasi Penuh ke Server Pusat</span>
              </button>
            )}
          </div>
        </div>

        {/* Warning if Invalid exists */}
        {invalidCount > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Tombol Sinkronisasi Dinonaktifkan Sementara</strong>
              <p className="mt-0.5 text-rose-700">
                Sistem Dapodik menerapkan aturan ketat integritas data nasional. Terdapat {invalidCount} data invalid yang wajib diperbaiki sebelum transmisi dapat dieksekusi.
              </p>
              <button
                onClick={() => setActiveTab('validasi')}
                className="mt-2 text-rose-800 font-bold underline hover:text-rose-950 inline-flex items-center gap-1"
              >
                Buka Menu Validasi untuk Memperbaiki Data &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Live Sync Progress Animation */}
        {isSyncing && (
          <div className="space-y-4 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-bold text-sm text-blue-950">
                  Sedang Menyinkronkan Data: {syncCurrentStep}
                </span>
              </div>
              <span className="font-mono font-bold text-sm text-blue-800">
                {syncProgress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-blue-200/60 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>

            {/* Step list visualization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {syncSteps.map((step, idx) => (
                <div
                  key={step.stepId}
                  className={`p-2.5 rounded-lg border text-xs transition-colors flex items-start gap-2 ${
                    step.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : step.status === 'in_progress'
                      ? 'bg-blue-100 border-blue-300 text-blue-950 font-semibold shadow-xs'
                      : 'bg-white/80 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : step.status === 'in_progress' ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 inline-block"></span>
                    )}
                  </div>
                  <div>
                    <div className="leading-tight">{step.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{step.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Terminal / Packet Inspection view */}
        <div className="rounded-xl bg-[#0f172a] text-slate-200 p-4 font-mono text-xs border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Real-Time WebSocket & REST Telemetry Packet Stream</span>
            </span>
            <span className="text-emerald-400">STATUS: 200 OK (CONNECTED)</span>
          </div>

          <div className="space-y-1 text-[11px] max-h-40 overflow-y-auto pt-1">
            <div className="text-slate-400">[SYSTEM] Session Auth: Bearer token initialized for NPSN {sekolah.npsn}</div>
            <div className="text-slate-400">[SOCKET] Heartbeat ping sent (latency: {serverLatency}ms, jitter: &plusmn;2ms)</div>
            <div className="text-emerald-400">[SYNC-DAEMON] Realtime delta monitor: Active ({unsyncedChangesCount} uncommitted local records)</div>
            <div className="text-blue-300">
              [PAYLOAD] Sarpras: {ruangList.length} ruang ({tanahList.length} bidang tanah) • Siswa: {pesertaDidikList.length} siswa • GTK: {gtkList.length} GTK
            </div>
            {latestLog && (
              <div className="text-amber-300">
                [LAST-TX] Checksum: {latestLog.serverChecksum} • SPTJM: {latestLog.sptjmId}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Log Riwayat Sinkronisasi Resmi Satuan Pendidikan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Semua bukti transaksi pengiriman data ke server kementerian terekam permanen dengan nomor registrasi unik.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Waktu Sinkronisasi</th>
                <th className="py-3 px-3 font-semibold">Operator Sekolah</th>
                <th className="py-3 px-3 font-semibold">Status Pusat</th>
                <th className="py-3 px-3 font-semibold">Nomor Registrasi SPTJM</th>
                <th className="py-3 px-3 font-semibold">Checksum Server SHA-256</th>
                <th className="py-3 px-3 font-semibold">Ringkasan Paket Data</th>
                <th className="py-3 px-4 font-semibold text-right">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                    {log.tanggal}
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    {log.operator}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700 font-semibold whitespace-nowrap">
                    {log.sptjmId}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={log.serverChecksum}>
                    {log.serverChecksum.substring(0, 16)}...
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap text-[11px]">
                    <span className="font-semibold text-slate-800">{log.recordsSummary.pesertaDidik}</span> Siswa •{' '}
                    <span className="font-semibold text-slate-800">{log.recordsSummary.gtk}</span> GTK •{' '}
                    <span className="font-semibold text-slate-800">{log.recordsSummary.sarpras}</span> Sarpras
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedSptjmLog(log);
                        setIsSptjmModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Cetak SPTJM</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
