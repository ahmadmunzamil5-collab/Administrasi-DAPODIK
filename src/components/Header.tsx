import React from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Zap, 
  ShieldCheck, 
  FileText,
  Database,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    sekolah, 
    activeTab, 
    setActiveTab, 
    invalidCount, 
    warningCount, 
    serverLatency, 
    serverStatus, 
    unsyncedChangesCount, 
    realtimeSyncEnabled, 
    setRealtimeSyncEnabled, 
    isSyncing,
    startFullSync,
    setIsProfileModalOpen,
    setIsBackupModalOpen,
    currentUser,
    logout
  } = useDapodik();

  return (
    <header className="sticky top-0 z-30 bg-[#0c2340] text-white border-b border-blue-900/60 shadow-md">
      {/* Top Ministry Banner */}
      <div className="bg-[#07172c] px-4 py-1 text-xs text-blue-200/80 flex flex-wrap items-center justify-between border-b border-blue-900/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-100 tracking-wide uppercase">Kementerian Pendidikan Dasar dan Menengah RI</span>
          <span className="text-blue-400/60">•</span>
          <span className="text-blue-300">Direktorat Jenderal PAUD, Pendidikan Dasar dan Pendidikan Menengah</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-blue-200">
            Tahun Ajaran: <strong className="text-white">{sekolah.tahunAjaran} {sekolah.semester}</strong>
          </span>
          <span className="text-blue-400/60">•</span>
          <span className="font-mono text-emerald-300">
            NPSN: <strong className="text-white">{sekolah.npsn}</strong>
          </span>
          <span className="text-blue-400/60">•</span>
          <span className="text-blue-200">
            Status: <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Akreditasi {sekolah.akreditasi}</span>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: School Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 p-2 flex items-center justify-center shadow-md shadow-blue-950/50 border border-blue-400/30">
            {/* Tut Wuri Handayani icon abstraction */}
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
                {sekolah.nama}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {sekolah.bentukPendidikan} {sekolah.status}
              </span>
            </div>
            <p className="text-xs text-blue-200/75 flex items-center gap-2">
              <span>{sekolah.kabKota}, {sekolah.provinsi}</span>
              <span className="text-blue-400/40">•</span>
              <span className="font-mono text-[11px] text-blue-300">Reg: {sekolah.kodeRegistrasi}</span>
            </p>
          </div>
        </div>

        {/* Right: Live Connection & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Server Gateway Real-Time Ping */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium text-[11px]">Pusdatin Gateway</span>
            </div>
            <span className="text-blue-400/40">|</span>
            <span className="font-mono text-emerald-400 text-[11px]">{serverLatency}ms</span>
          </div>

          {/* Realtime Auto-Sync Status Badge */}
          <div 
            onClick={() => setRealtimeSyncEnabled(!realtimeSyncEnabled)}
            title="Klik untuk beralih mode sinkronisasi otomatis"
            className={`cursor-pointer transition-all flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border font-medium ${
              realtimeSyncEnabled
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${realtimeSyncEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[11px]">Real-Time Sync</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
              realtimeSyncEnabled ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-700 text-slate-400'
            }`}>
              {realtimeSyncEnabled ? 'Aktif' : 'Manual'}
            </span>
          </div>

          {/* Unsynced Changes Badge */}
          {unsyncedChangesCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-[11px]">{unsyncedChangesCount} belum sinkron</span>
            </div>
          )}

          {/* Validation Indicator */}
          <button
            onClick={() => setActiveTab('validasi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              invalidCount > 0
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 hover:bg-rose-900/50'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
            }`}
          >
            {invalidCount > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{invalidCount} Invalid</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>0 Invalid (Siap Sinkron)</span>
              </>
            )}
            {warningCount > 0 && (
              <span className="ml-1 text-[10px] text-amber-300/90 font-mono">({warningCount} War)</span>
            )}
          </button>

          {/* Quick Manual Sync Button */}
          <button
            onClick={() => {
              if (activeTab !== 'sinkronisasi') {
                setActiveTab('sinkronisasi');
              } else {
                startFullSync();
              }
            }}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              isSyncing
                ? 'bg-blue-600 text-white cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkron...' : 'Sinkronisasi'}</span>
          </button>

          {/* School Profile Settings */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            title="Pengaturan Profil Sekolah"
            className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-200 transition-colors"
          >
            <Building2 className="w-4 h-4" />
          </button>

          {/* Database Backup/Export */}
          <button
            onClick={() => setIsBackupModalOpen(true)}
            title="Cadangkan / Ekspor Data"
            className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-200 transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Current User & Logout Button */}
          {currentUser && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-blue-800/60">
              <div 
                title={`${currentUser.nama} (${currentUser.roleLabel})`}
                className="hidden xl:flex flex-col text-right pr-1"
              >
                <span className="text-[11px] font-bold text-white max-w-[120px] truncate leading-tight">
                  {currentUser.nama.split(' ')[0]}
                </span>
                <span className="text-[9px] text-blue-300 uppercase font-mono font-semibold">
                  {currentUser.role}
                </span>
              </div>

              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs border border-blue-400">
                {currentUser.nama.charAt(0)}
              </div>

              <button
                onClick={logout}
                title="Keluar / Logout dari Sistem"
                className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
