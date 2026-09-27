import React from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Users, 
  GraduationCap, 
  Warehouse, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  ArrowUpRight, 
  TrendingUp,
  Building,
  UserCheck,
  Award
} from 'lucide-react';
import { ActivityLogWidget } from './ActivityLogWidget';

export const DashboardView: React.FC = () => {
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
    serverLatency, 
    setActiveTab, 
    startFullSync, 
    isSyncing,
    setSelectedSptjmLog,
    setIsSptjmModalOpen
  } = useDapodik();

  // Computations
  const totalSiswa = pesertaDidikList.length;
  const siswaLaki = pesertaDidikList.filter(s => s.jenisKelamin === 'L').length;
  const siswaPerempuan = pesertaDidikList.filter(s => s.jenisKelamin === 'P').length;
  const siswaPip = pesertaDidikList.filter(s => s.penerimaPip).length;

  const totalGuru = gtkList.filter(g => g.kategoriPtk === 'Guru').length;
  const totalTendik = gtkList.filter(g => g.kategoriPtk === 'Tendik').length;
  const guruSertifikasi = gtkList.filter(g => g.sertifikasiPendidik).length;

  const ruangBaik = ruangList.filter(r => r.kondisi === 'Baik').length;
  const ruangRusakRingan = ruangList.filter(r => r.kondisi === 'Rusak Ringan').length;
  const ruangRusakSedang = ruangList.filter(r => r.kondisi === 'Rusak Sedang').length;
  const ruangRusakBerat = ruangList.filter(r => r.kondisi === 'Rusak Berat').length;

  const totalLuasTanah = tanahList.reduce((acc, curr) => acc + curr.luas, 0);

  const latestLog = syncLogs[0];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Status Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-40 bottom-0 translate-y-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-blue-300 text-xs font-medium">
              <span>Selamat Datang di Portal Resmi Administrasi</span>
              <span>•</span>
              <span className="font-mono text-emerald-400">Tahun Ajaran {sekolah.tahunAjaran} ({sekolah.semester})</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {sekolah.nama}
            </h2>
            <p className="text-blue-200/80 text-xs md:text-sm mt-1 max-w-2xl">
              Sistem Sinkronisasi Terpusat Dapodik Kemendikbudristek RI. Seluruh perubahan data sarpras, siswa, dan GTK terverifikasi secara real-time.
            </p>
          </div>

          {/* Quick sync trigger box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="text-left">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                <span>Sinkronisasi Terakhir:</span>
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {lastSyncTimestamp || 'Belum pernah sinkron'}
              </div>
              <div className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Server Pusdatin: Respon {serverLatency}ms</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sinkronisasi')}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Kelola Sinkron</span>
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-400/30 text-blue-200 text-[11px]">
              NPSN: <strong className="text-white font-mono">{sekolah.npsn}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-400/30 text-blue-200 text-[11px]">
              Kurikulum: <strong className="text-white">{sekolah.kurikulum}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-400/30 text-blue-200 text-[11px]">
              SK Operasional: <strong className="text-white font-mono">{sekolah.skIzinOperasional}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invalidCount === 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-300 font-medium text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Data Siap Disinkronkan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-300 font-medium text-[11px]">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Perlu Perbaikan ({invalidCount} Data Invalid)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Peserta Didik */}
        <div 
          onClick={() => setActiveTab('peserta-didik')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Peserta Didik</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalSiswa}</span>
            <span className="text-xs text-slate-500 font-medium">Siswa Aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>L: <strong>{siswaLaki}</strong> | P: <strong>{siswaPerempuan}</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[10px]">
              {siswaPip} KIP/PIP
            </span>
          </div>
        </div>

        {/* Card 2: Pendidik & Tendik (GTK) */}
        <div 
          onClick={() => setActiveTab('gtk')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendidik & Tendik</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{gtkList.length}</span>
            <span className="text-xs text-slate-500 font-medium">Pegawai GTK</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{totalGuru} Guru | {totalTendik} Tendik</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[10px]">
              {guruSertifikasi} Sertifikasi
            </span>
          </div>
        </div>

        {/* Card 3: Sarana & Prasarana */}
        <div 
          onClick={() => setActiveTab('sarpras')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sarana & Prasarana</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Warehouse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{ruangList.length}</span>
            <span className="text-xs text-slate-500 font-medium">Ruang Bangunan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{tanahList.length} Bidang Tanah</span>
            <span className="text-[11px] font-medium text-slate-700">
              {totalLuasTanah.toLocaleString('id-ID')} m²
            </span>
          </div>
        </div>

        {/* Card 4: Rombongan Belajar */}
        <div 
          onClick={() => setActiveTab('rombel')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rombel Belajar</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{rombelList.length}</span>
            <span className="text-xs text-slate-500 font-medium">Rombel Aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Tingkat 10, 11, 12</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[10px]">
              100% Ada Wali Kelas
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Sarpras Health & Validation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sarpras Condition Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span>Kelayakan Kondisi Sarpras</span>
            </h3>
            <button 
              onClick={() => setActiveTab('sarpras')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Kondisi Baik (&lt; 30%)
                </span>
                <span className="font-semibold text-slate-800">{ruangBaik} Ruang</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${ruangList.length ? (ruangBaik / ruangList.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Rusak Ringan (30% - 45%)
                </span>
                <span className="font-semibold text-slate-800">{ruangRusakRingan} Ruang</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${ruangList.length ? (ruangRusakRingan / ruangList.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Rusak Sedang (46% - 65%)
                </span>
                <span className="font-semibold text-slate-800">{ruangRusakSedang} Ruang</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${ruangList.length ? (ruangRusakSedang / ruangList.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Rusak Berat (&gt; 65%)
                </span>
                <span className="font-semibold text-slate-800">{ruangRusakBerat} Ruang</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-rose-500 h-2 rounded-full transition-all"
                  style={{ width: `${ruangList.length ? (ruangRusakBerat / ruangList.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-xs text-purple-900 leading-relaxed">
            Data sarpras terhubung dengan pangkalan data DAK Fisik Kemendikbudristek untuk perencanaan bantuan rehabilitasi dan pemenuhan sarana.
          </div>
        </div>

        {/* GTK Certification & Teachers workload */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Status Sertifikasi & Linieritas GTK</span>
            </h3>
            <button 
              onClick={() => setActiveTab('gtk')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Sertifikasi Pendidik</div>
              <div className="text-xl font-bold text-emerald-700 mt-1">{guruSertifikasi} Guru</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {totalGuru ? Math.round((guruSertifikasi / totalGuru) * 100) : 0}% dari total guru
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Belum Sertifikasi</div>
              <div className="text-xl font-bold text-slate-700 mt-1">{totalGuru - guruSertifikasi} Guru</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Calon PPG Prajab/Daljab</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold text-slate-700">Komposisi Pegawai:</div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-600">Aparatur Sipil Negara (PNS)</span>
              <span className="font-semibold text-slate-800">{gtkList.filter(g => g.statusKepegawaian === 'PNS').length}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-600">Pegawai Pemerintah (PPPK)</span>
              <span className="font-semibold text-slate-800">{gtkList.filter(g => g.statusKepegawaian === 'PPPK').length}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-600">Guru Tetap Yayasan / Honorer</span>
              <span className="font-semibold text-slate-800">{gtkList.filter(g => ['Guru Tetap Yayasan', 'Honorer Daerah', 'Guru Honor Sekolah', 'Tenaga Honorer'].includes(g.statusKepegawaian)).length}</span>
            </div>
          </div>
        </div>

        {/* Validation & Sync Readiness Status */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Kesiapan Sinkronisasi Dapodik</span>
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                invalidCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {invalidCount === 0 ? 'Valid' : 'Invalid'}
              </span>
            </div>

            <div className="mt-4 p-3 rounded-lg border text-xs leading-relaxed space-y-2.5 ${
              invalidCount === 0 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }">
              {invalidCount === 0 ? (
                <div className="flex items-start gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Seluruh Data Memenuhi Syarat</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Tidak ditemukan data invalid pada profil sekolah, sarpras, siswa, GTK maupun rombel. Sinkronisasi siap dilakukan.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Ditemukan {invalidCount} Data Invalid</p>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Perbaiki seluruh data invalid terlebih dahulu agar tombol sinkronisasi server pusat dapat diaktifkan.
                    </p>
                  </div>
                </div>
              )}

              {warningCount > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-amber-800">
                  <span>Peringatan (Warning):</span>
                  <span className="font-bold">{warningCount} catatan</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setActiveTab('validasi')}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Periksa Rincian Validasi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('sinkronisasi')}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Buka Menu Sinkronisasi Pusat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Sync History */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Riwayat Sinkronisasi Server Pusat (Pusdatin)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan transaksi lembar konfirmasi sinkronisasi data satuan pendidikan resmi.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('sinkronisasi')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <span>Semua Riwayat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Waktu Sinkron</th>
                <th className="py-2.5 px-3 font-semibold">Operator</th>
                <th className="py-2.5 px-3 font-semibold">Status Pusat</th>
                <th className="py-2.5 px-3 font-semibold">No. Registrasi SPTJM</th>
                <th className="py-2.5 px-3 font-semibold">Rekap Record Terkirim</th>
                <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncLogs.slice(0, 4).map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                    {log.tanggal}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {log.operator}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 text-[11px] whitespace-nowrap">
                    {log.sptjmId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap text-[11px]">
                    <span className="font-semibold text-slate-800">{log.recordsSummary.pesertaDidik}</span> Siswa,{' '}
                    <span className="font-semibold text-slate-800">{log.recordsSummary.gtk}</span> GTK,{' '}
                    <span className="font-semibold text-slate-800">{log.recordsSummary.sarpras}</span> Sarpras
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedSptjmLog(log);
                        setIsSptjmModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Lihat SPTJM</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Activity Log System */}
      <ActivityLogWidget />
    </div>
  );
};
