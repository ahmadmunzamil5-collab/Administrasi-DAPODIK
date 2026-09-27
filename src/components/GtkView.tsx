import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Users2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap, 
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Download
} from 'lucide-react';
import { GTK } from '../types/dapodik';

export const GtkView: React.FC = () => {
  const { 
    gtkList, 
    addGTK, 
    updateGTK, 
    deleteGTK 
  } = useDapodik();

  const [activeCategory, setActiveCategory] = useState<'all' | 'Guru' | 'Tendik'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKepegawaian, setFilterKepegawaian] = useState<string>('all');
  const [filterSertifikasi, setFilterSertifikasi] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGtk, setEditingGtk] = useState<GTK | null>(null);
  const [detailGtk, setDetailGtk] = useState<GTK | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<GTK>>({
    namaLengkap: '',
    gelarDepan: '',
    gelarBelakang: '',
    nik: '',
    nuptk: '',
    nip: '',
    jenisKelamin: 'L',
    tempatLahir: 'Bandung',
    tanggalLahir: '1985-05-15',
    kategoriPtk: 'Guru',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'PNS',
    pendidikanTerakhir: 'S1/D4',
    bidangStudiPendidikan: 'Pendidikan',
    mapelUtama: '',
    sertifikasiPendidik: false,
    noSertifikatPendidik: '',
    nrg: '',
    jamMengajarLinier: 24,
    totalJamMengajar: 24,
    statusKeaktifan: 'Aktif',
    email: '',
    telepon: '',
    alamat: ''
  });

  // Filter logic
  const filteredGtk = gtkList.filter(gtk => {
    const matchesCategory = activeCategory === 'all' || gtk.kategoriPtk === activeCategory;
    const matchesSearch = 
      gtk.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gtk.nik.includes(searchQuery) ||
      (gtk.nuptk && gtk.nuptk.includes(searchQuery)) ||
      (gtk.nip && gtk.nip.includes(searchQuery));
    
    const matchesKepegawaian = filterKepegawaian === 'all' || gtk.statusKepegawaian === filterKepegawaian;
    const matchesSertifikasi = 
      filterSertifikasi === 'all' || 
      (filterSertifikasi === 'sudah' && gtk.sertifikasiPendidik) || 
      (filterSertifikasi === 'belum' && !gtk.sertifikasiPendidik);

    return matchesCategory && matchesSearch && matchesKepegawaian && matchesSertifikasi;
  });

  const handleOpenAdd = () => {
    setEditingGtk(null);
    setFormData({
      namaLengkap: '',
      gelarDepan: '',
      gelarBelakang: 'S.Pd.',
      nik: `327311${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      nuptk: `${Math.floor(Math.random() * 9000000000000000 + 1000000000000000)}`,
      nip: '',
      jenisKelamin: 'L',
      tempatLahir: 'Bandung',
      tanggalLahir: '1988-06-20',
      kategoriPtk: 'Guru',
      jenisPtk: 'Guru Mapel',
      statusKepegawaian: 'PPPK',
      pendidikanTerakhir: 'S1/D4',
      bidangStudiPendidikan: 'Pendidikan Kejuruan',
      mapelUtama: 'Teknik Kejuruan',
      sertifikasiPendidik: false,
      noSertifikatPendidik: '',
      nrg: '',
      jamMengajarLinier: 24,
      totalJamMengajar: 24,
      statusKeaktifan: 'Aktif',
      email: '',
      telepon: '0812' + Math.floor(Math.random() * 90000000 + 10000000),
      alamat: 'Bandung, Jawa Barat'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (gtk: GTK) => {
    setEditingGtk(gtk);
    setFormData(gtk);
    setIsFormModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.nik) return;

    const payload = {
      ...formData,
      namaLengkap: formData.namaLengkap,
      nik: formData.nik,
      jamMengajarLinier: Number(formData.jamMengajarLinier) || 0,
      totalJamMengajar: Number(formData.totalJamMengajar) || 0
    } as any;

    if (editingGtk) {
      updateGTK(editingGtk.id, payload);
    } else {
      addGTK(payload);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data GTK "${nama}"?`)) {
      deleteGTK(id);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-emerald-600" />
            <span>Guru dan Tenaga Kependidikan (GTK)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendataan pendidik (guru mapel/kelas), tenaga kependidikan (TU, pustakawan, laboran, operator), linieritas beban jam & sertifikasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua GTK ({gtkList.length})
            </button>
            <button
              onClick={() => setActiveCategory('Guru')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === 'Guru'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guru ({gtkList.filter(g => g.kategoriPtk === 'Guru').length})
            </button>
            <button
              onClick={() => setActiveCategory('Tendik')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === 'Tendik'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tendik ({gtkList.filter(g => g.kategoriPtk === 'Tendik').length})
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah GTK</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, NIK, NUPTK, atau NIP..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <select
            value={filterKepegawaian}
            onChange={e => setFilterKepegawaian(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Semua Status Kepegawaian</option>
            <option value="PNS">Aparatur Sipil Negara (PNS)</option>
            <option value="PPPK">Pegawai Pemerintah (PPPK)</option>
            <option value="Guru Tetap Yayasan">Guru Tetap Yayasan</option>
            <option value="Honorer Daerah">Honorer Daerah</option>
            <option value="Tenaga Honorer">Tenaga Honorer</option>
          </select>

          <select
            value={filterSertifikasi}
            onChange={e => setFilterSertifikasi(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Semua Status Sertifikasi</option>
            <option value="sudah">Sudah Sertifikasi Pendidik</option>
            <option value="belum">Belum Sertifikasi</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <strong>{filteredGtk.length}</strong> pegawai
        </div>
      </div>

      {/* GTK Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Nama Lengkap & NIK/NUPTK</th>
                <th className="py-3 px-3 font-semibold">Jenis PTK</th>
                <th className="py-3 px-3 font-semibold">Kepegawaian</th>
                <th className="py-3 px-3 font-semibold">Mapel / Tugas</th>
                <th className="py-3 px-3 font-semibold">Sertifikasi</th>
                <th className="py-3 px-3 font-semibold">Jam Linier / Beban</th>
                <th className="py-3 px-3 font-semibold">Keaktifan</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGtk.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data GTK dengan kriteria tersebut.
                  </td>
                </tr>
              ) : (
                filteredGtk.map(gtk => {
                  const isNikValid = gtk.nik && gtk.nik.length === 16;
                  const isLinierValid = !gtk.sertifikasiPendidik || gtk.jamMengajarLinier >= 24;

                  return (
                    <tr key={gtk.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            gtk.kategoriPtk === 'Guru' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {gtk.namaLengkap.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{gtk.namaLengkap}</span>
                              {!isNikValid && (
                                <span className="w-2 h-2 rounded-full bg-rose-500" title="NIK belum 16 digit!"></span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                              <span>NUPTK: {gtk.nuptk || '-'}</span>
                              <span>•</span>
                              <span className={isNikValid ? 'text-slate-600' : 'text-rose-600 font-bold'}>
                                NIK: {gtk.nik}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          gtk.kategoriPtk === 'Guru' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {gtk.jenisPtk}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700">
                        <div className="font-semibold">{gtk.statusKepegawaian}</div>
                        {gtk.nip && (
                          <div className="text-[10px] font-mono text-slate-400">NIP: {gtk.nip}</div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                        {gtk.mapelUtama || <span className="text-slate-400 italic">Administrasi</span>}
                      </td>

                      <td className="py-3 px-3">
                        {gtk.sertifikasiPendidik ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>Tersertifikasi</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Belum</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        {gtk.kategoriPtk === 'Guru' ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono font-bold ${
                              gtk.jamMengajarLinier >= 24 ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                              {gtk.jamMengajarLinier} Jam
                            </span>
                            <span className="text-slate-400 text-[10px]">/mgg</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">Non-Mengajar</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {gtk.statusKeaktifan}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailGtk(gtk)}
                            title="Lihat Profil Lengkap"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(gtk)}
                            title="Edit Data GTK"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(gtk.id, gtk.namaLengkap)}
                            title="Hapus GTK"
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL GTK */}
      {detailGtk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-base">
                  {detailGtk.namaLengkap.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base">{detailGtk.namaLengkap}</h3>
                  <p className="text-xs text-emerald-200">
                    {detailGtk.jenisPtk} • {detailGtk.statusKepegawaian}
                  </p>
                </div>
              </div>
              <button onClick={() => setDetailGtk(null)} className="text-white font-bold p-1">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Nomor Induk Kependudukan (NIK):</span>
                  <strong className="text-slate-800 font-mono text-xs">{detailGtk.nik}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">NUPTK:</span>
                  <strong className="text-slate-800 font-mono text-xs">{detailGtk.nuptk || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Pendidikan Terakhir:</span>
                  <strong className="text-slate-800">{detailGtk.pendidikanTerakhir} - {detailGtk.bidangStudiPendidikan}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Status Keaktifan:</span>
                  <strong className="text-emerald-700">{detailGtk.statusKeaktifan}</strong>
                </div>
              </div>

              {/* Sertifikasi & Jam Mengajar */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-xs">Status Sertifikasi Profesi Guru:</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    detailGtk.sertifikasiPendidik ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {detailGtk.sertifikasiPendidik ? 'Sertifikasi Valid' : 'Belum Bersertifikat'}
                  </span>
                </div>
                {detailGtk.sertifikasiPendidik && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">No. Sertifikat:</span>
                      <span className="font-mono font-semibold">{detailGtk.noSertifikatPendidik || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">NRG:</span>
                      <span className="font-mono font-semibold">{detailGtk.nrg || '-'}</span>
                    </div>
                  </div>
                )}
                {detailGtk.kategoriPtk === 'Guru' && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-900">Beban Jam Mengajar Linier:</span>
                    <strong className="font-mono text-emerald-800 text-sm">
                      {detailGtk.jamMengajarLinier} Jam / Minggu (Syarat min: 24 Jam)
                    </strong>
                  </div>
                )}
              </div>

              {/* Kontak */}
              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email: {detailGtk.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Telepon/WhatsApp: {detailGtk.telepon || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat: {detailGtk.alamat || '-'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setDetailGtk(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL GTK (Add / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingGtk ? 'Edit Data Pendidik & Tenaga Kependidikan' : 'Tambah GTK Baru'}
                </h3>
                <p className="text-xs text-emerald-200">
                  Formulir sinkronisasi GTK standar Dapodik Kemendikbudristek
                </p>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori PTK *
                  </label>
                  <select
                    value={formData.kategoriPtk}
                    onChange={e => setFormData(p => ({ ...p, kategoriPtk: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Guru">Pendidik (Guru)</option>
                    <option value="Tendik">Tenaga Kependidikan (Tendik)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Penugasan PTK *
                  </label>
                  <select
                    value={formData.jenisPtk}
                    onChange={e => setFormData(p => ({ ...p, jenisPtk: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Guru Mapel">Guru Mapel</option>
                    <option value="Guru Kelas">Guru Kelas</option>
                    <option value="Guru BK">Guru BK</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Tenaga Administrasi Sekolah">Tenaga Administrasi Sekolah (TU)</option>
                    <option value="Tenaga Perpustakaan">Tenaga Perpustakaan</option>
                    <option value="Laboran">Laboran</option>
                    <option value="Operator Dapodik">Operator Dapodik</option>
                    <option value="Penjaga Sekolah">Penjaga Sekolah</option>
                    <option value="Petugas Keamanan">Petugas Keamanan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaLengkap}
                  onChange={e => setFormData(p => ({ ...p, namaLengkap: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Contoh: Rina Kusuma Dewi, S.T., M.Kom."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK (16 Digit) *
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    required
                    value={formData.nik}
                    onChange={e => setFormData(p => ({ ...p, nik: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    placeholder="327311XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NUPTK (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nuptk}
                    onChange={e => setFormData(p => ({ ...p, nuptk: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    placeholder="Opsional jika belum punya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP (18 Digit untuk PNS)
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={formData.nip}
                    onChange={e => setFormData(p => ({ ...p, nip: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    placeholder="19XXXXXXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Kepegawaian *
                  </label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={e => setFormData(p => ({ ...p, statusKepegawaian: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="PNS">Aparatur Sipil Negara (PNS)</option>
                    <option value="PPPK">Pegawai Pemerintah (PPPK)</option>
                    <option value="Guru Tetap Yayasan">Guru Tetap Yayasan</option>
                    <option value="Honorer Daerah">Honorer Daerah</option>
                    <option value="Guru Honor Sekolah">Guru Honor Sekolah</option>
                    <option value="Tenaga Honorer">Tenaga Honorer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pendidikan Terakhir *
                  </label>
                  <select
                    value={formData.pendidikanTerakhir}
                    onChange={e => setFormData(p => ({ ...p, pendidikanTerakhir: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="S1/D4">S1 / D4</option>
                    <option value="S2">S2 (Magister)</option>
                    <option value="S3">S3 (Doktor)</option>
                    <option value="D3">D3 (Diploma Tiga)</option>
                    <option value="SMA/SMK">SMA / SMK / Sederajat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran Utama
                  </label>
                  <input
                    type="text"
                    value={formData.mapelUtama}
                    onChange={e => setFormData(p => ({ ...p, mapelUtama: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Contoh: Matematika / RPL"
                  />
                </div>
              </div>

              {/* Beban Jam & Linieritas */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Beban Mengajar & Sertifikasi Pendidik
                </span>
                
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sertifikasiPendidik}
                    onChange={e => setFormData(p => ({ ...p, sertifikasiPendidik: e.target.checked }))}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Telah Memiliki Sertifikat Pendidik (Sertifikasi Guru)</span>
                </label>

                {formData.sertifikasiPendidik && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Nomor Peserta Sertifikasi</label>
                      <input
                        type="text"
                        value={formData.noSertifikatPendidik}
                        onChange={e => setFormData(p => ({ ...p, noSertifikatPendidik: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="Contoh: 16022018021190"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Nomor Registrasi Guru (NRG)</label>
                      <input
                        type="text"
                        value={formData.nrg}
                        onChange={e => setFormData(p => ({ ...p, nrg: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        placeholder="Contoh: 091598452002"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Jam Mengajar Linier (Jam/Mgg)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.jamMengajarLinier}
                      onChange={e => setFormData(p => ({ ...p, jamMengajarLinier: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="text-[10px] text-slate-400">Minimal 24 jam untuk tunjangan profesi</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Total Jam Mengajar</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalJamMengajar}
                      onChange={e => setFormData(p => ({ ...p, totalJamMengajar: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi Sekolah / Pribadi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="nama@smkn1grahanusantara.sch.id"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={e => setFormData(p => ({ ...p, telepon: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="0812XXXXXXXX"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Simpan GTK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
