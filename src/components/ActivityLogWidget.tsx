import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  RefreshCw, 
  PlusCircle, 
  Edit3, 
  Trash, 
  FileSpreadsheet, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { ActivityActionType, ActivityLog } from '../types/dapodik';

export const ActivityLogWidget: React.FC = () => {
  const { 
    activityLogs, 
    clearActivityLogs, 
    exportActivityLogs 
  } = useDapodik();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterModul, setFilterModul] = useState<string>('all');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesModul = filterModul === 'all' || log.modul === filterModul;

    return matchesSearch && matchesAction && matchesModul;
  });

  const getActionBadge = (action: ActivityActionType) => {
    switch (action) {
      case 'CREATE':
        return {
          icon: <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />,
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'TAMBAH'
        };
      case 'UPDATE':
        return {
          icon: <Edit3 className="w-3.5 h-3.5 text-blue-600" />,
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'UBAH'
        };
      case 'DELETE':
        return {
          icon: <Trash className="w-3.5 h-3.5 text-rose-600" />,
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          label: 'HAPUS'
        };
      case 'SYNC':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />,
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          label: 'SINKRON'
        };
      case 'EXPORT':
        return {
          icon: <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />,
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'EKSPOR'
        };
      case 'LOGIN':
      case 'LOGOUT':
        return {
          icon: <LogIn className="w-3.5 h-3.5 text-purple-600" />,
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
          label: action
        };
      case 'VALIDATION':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />,
          badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
          label: 'VALIDASI'
        };
      default:
        return {
          icon: <Activity className="w-3.5 h-3.5 text-slate-600" />,
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          label: action
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Audit Trail & Log Aktivitas Pengguna (Real-Time Activity Log)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Merekam seluruh aksi pembaruan data, penambahan, ekspor berkas, dan sinkronisasi server untuk transparansi administrasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportActivityLogs}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Log (CSV)</span>
          </button>
          {activityLogs.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin membersihkan riwayat log aktivitas?')) {
                  clearActivityLogs();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
              title="Bersihkan log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari deskripsi, operator, atau aksi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
            />
          </div>

          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white"
          >
            <option value="all">Semua Tipe Aksi</option>
            <option value="UPDATE">Pembaruan (UPDATE)</option>
            <option value="CREATE">Penambahan (CREATE)</option>
            <option value="DELETE">Penghapusan (DELETE)</option>
            <option value="SYNC">Sinkronisasi (SYNC)</option>
            <option value="EXPORT">Ekspor Berkas (EXPORT)</option>
            <option value="LOGIN">Autentikasi (LOGIN)</option>
          </select>

          <select
            value={filterModul}
            onChange={e => setFilterModul(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-white"
          >
            <option value="all">Semua Modul</option>
            <option value="Peserta Didik">Peserta Didik</option>
            <option value="Sarpras">Sarpras</option>
            <option value="GTK">GTK</option>
            <option value="Rombel">Rombel</option>
            <option value="Sinkronisasi">Sinkronisasi</option>
            <option value="Sistem">Sistem</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-500 font-medium">
          Menampilkan <strong>{filteredLogs.length}</strong> aktivitas
        </span>
      </div>

      {/* Log Feed List */}
      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Belum ada catatan aktivitas yang sesuai dengan filter.
          </div>
        ) : (
          filteredLogs.map(log => {
            const badge = getActionBadge(log.action);
            return (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    {badge.icon}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${badge.badgeClass}`}>
                        {badge.label}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                        {log.modul}
                      </span>
                      <h4 className="font-bold text-slate-900 truncate">
                        {log.title}
                      </h4>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed break-words">
                      {log.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{log.userName}</span>
                        <span className="px-1 rounded bg-slate-200 text-slate-700 text-[9px] uppercase font-bold">
                          {log.userRole}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    log.status === 'Sukses' ? 'bg-emerald-100 text-emerald-800' :
                    log.status === 'Peringatan' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
