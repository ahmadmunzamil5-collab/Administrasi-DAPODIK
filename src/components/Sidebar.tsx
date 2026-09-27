import React from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  LayoutDashboard, 
  Warehouse, 
  GraduationCap, 
  Users2, 
  Layers, 
  CheckSquare, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle,
  UserCheck,
  Building,
  School,
  LogOut
} from 'lucide-react';
import { ActiveTab } from '../types/dapodik';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    invalidCount, 
    unsyncedChangesCount, 
    pesertaDidikList, 
    gtkList, 
    ruangList, 
    rombelList,
    sekolah,
    currentUser,
    logout,
    switchUserRole
  } = useDapodik();

  const navItems: {
    id: ActiveTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Beranda / Dashboard',
      description: 'Ringkasan & status satuan',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'sarpras',
      label: 'Sarana & Prasarana',
      description: 'Tanah, gedung, ruang & alat',
      icon: <Warehouse className="w-5 h-5" />,
      badge: ruangList.length,
      badgeColor: 'bg-slate-200 text-slate-700'
    },
    {
      id: 'peserta-didik',
      label: 'Peserta Didik',
      description: 'Biodata siswa & periodik',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: pesertaDidikList.length,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'gtk',
      label: 'Guru & Tendik (GTK)',
      description: 'Pendidik, tendik, sertifikasi',
      icon: <Users2 className="w-5 h-5" />,
      badge: gtkList.length,
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'rombel',
      label: 'Rombongan Belajar',
      description: 'Manajemen kelas & wali kelas',
      icon: <Layers className="w-5 h-5" />,
      badge: rombelList.length,
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'validasi',
      label: 'Validasi Data',
      description: 'Pemeriksaan integritas pra-sinkron',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: invalidCount > 0 ? `${invalidCount} Invalid` : '0 Invalid',
      badgeColor: invalidCount > 0 ? 'bg-rose-100 text-rose-700 font-semibold' : 'bg-emerald-100 text-emerald-700 font-semibold'
    },
    {
      id: 'sinkronisasi',
      label: 'Sinkronisasi Real-Time',
      description: 'Gateway Pusat Kemendikbud',
      icon: <RefreshCw className={`w-5 h-5 ${unsyncedChangesCount > 0 ? 'text-blue-600' : ''}`} />,
      badge: unsyncedChangesCount > 0 ? `${unsyncedChangesCount} Baru` : 'Sinkron',
      badgeColor: unsyncedChangesCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm print:hidden">
      <div className="p-3">
        {/* App Version Tag */}
        <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              <span>DAPODIK CLOUD</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-blue-600 text-white rounded font-mono">v2026.a</span>
            </div>
            <p className="text-[10px] text-blue-700/80">Sistem Registrasi Sekolah</p>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-600'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operator and School Profile Mini-Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentUser ? currentUser.nama.charAt(0) : 'O'}
            </div>
            <div className="truncate min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">
                {currentUser?.nama || sekolah.operator}
              </div>
              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{currentUser?.roleLabel || 'Operator Dapodik'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Keluar / Logout"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Role Switcher */}
        <div className="p-2 rounded-lg bg-white border border-slate-200 space-y-1 text-[11px]">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">
            Beralih Peran Akun:
          </span>
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <button
              onClick={() => switchUserRole('operator')}
              className={`py-1 px-1 rounded text-center font-semibold transition-all ${
                currentUser?.role === 'operator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Operator
            </button>
            <button
              onClick={() => switchUserRole('kepsek')}
              className={`py-1 px-1 rounded text-center font-semibold transition-all ${
                currentUser?.role === 'kepsek'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Kepsek
            </button>
            <button
              onClick={() => switchUserRole('guru')}
              className={`py-1 px-1 rounded text-center font-semibold transition-all ${
                currentUser?.role === 'guru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Guru
            </button>
          </div>
        </div>

        <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-600">Kode Satuan:</span>
            <span className="font-mono font-medium text-slate-700">{sekolah.npsn}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-600">Status Sync:</span>
            <span className="text-emerald-800 font-medium">Terhubung</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
