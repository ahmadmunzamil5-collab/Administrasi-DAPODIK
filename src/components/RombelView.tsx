import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  Building, 
  UserCheck, 
  BookOpen,
  ChevronRight,
  Eye
} from 'lucide-react';
import { RombonganBelajar } from '../types/dapodik';

export const RombelView: React.FC = () => {
  const { 
    rombelList, 
    gtkList, 
    ruangList, 
    pesertaDidikList, 
    addRombel, 
    updateRombel, 
    deleteRombel,
    setActiveTab 
  } = useDapodik();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTingkat, setFilterTingkat] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRombel, setEditingRombel] = useState<RombonganBelajar | null>(null);
  const [selectedRombelDetail, setSelectedRombelDetail] = useState<RombonganBelajar | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<RombonganBelajar>>({
    namaRombel: '',
    tingkat: 10,
    jurusanPeminatan: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
    kurikulum: 'Kurikulum Merdeka',
    waliKelasId: gtkList.find(g => g.kategoriPtk === 'Guru')?.id || '',
    ruangId: ruangList.find(r => r.jenisRuang === 'Ruang Teori/Kelas')?.id || '',
    jumlahSiswa: 36
  });

  const filteredRombel = rombelList.filter(r => {
    const matchesSearch = r.namaRombel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.jurusanPeminatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.waliKelasNama.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTingkat = filterTingkat === 'all' || r.tingkat.toString() === filterTingkat;
    return matchesSearch && matchesTingkat;
  });

  const handleOpenAdd = () => {
    setEditingRombel(null);
    const defaultGuru = gtkList.find(g => g.kategoriPtk === 'Guru');
    const defaultRuang = ruangList.find(r => r.jenisRuang === 'Ruang Teori/Kelas');

    setFormData({
      namaRombel: '',
      tingkat: 10,
      jurusanPeminatan: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
      kurikulum: 'Kurikulum Merdeka',
      waliKelasId: defaultGuru?.id || '',
      waliKelasNama: defaultGuru?.namaLengkap || '',
      ruangId: defaultRuang?.id || '',
      ruangNama: defaultRuang?.namaRuang || '',
      jumlahSiswa: 36
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (rombel: RombonganBelajar) => {
    setEditingRombel(rombel);
    setFormData(rombel);
    setIsFormModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaRombel || !formData.waliKelasId) return;

    const waliObj = gtkList.find(g => g.id === formData.waliKelasId);
    const ruangObj = ruangList.find(r => r.id === formData.ruangId);
    const studentsInRombel = pesertaDidikList.filter(p => p.rombelId === (editingRombel?.id || '')).length;

    const payload: RombonganBelajar = {
      id: editingRombel ? editingRombel.id : `rmb-${Date.now()}`,
      namaRombel: formData.namaRombel,
      tingkat: Number(formData.tingkat) || 10,
      jurusanPeminatan: formData.jurusanPeminatan || 'Umum',
      kurikulum: formData.kurikulum as any,
      waliKelasId: formData.waliKelasId,
      waliKelasNama: waliObj ? waliObj.namaLengkap : '',
      ruangId: formData.ruangId || '',
      ruangNama: ruangObj ? ruangObj.namaRuang : '',
      jumlahSiswa: editingRombel ? studentsInRombel : (Number(formData.jumlahSiswa) || 36)
    };

    if (editingRombel) {
      updateRombel(editingRombel.id, payload);
    } else {
      addRombel(payload);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Rombel "${nama}"?`)) {
      deleteRombel(id);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" />
            <span>Rombongan Belajar (Rombel)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan rombongan belajar kelas, penetapan guru wali kelas, dan alokasi ruang teori Dapodik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rombel Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari rombel, jurusan, atau wali kelas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <select
            value={filterTingkat}
            onChange={e => setFilterTingkat(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">Semua Tingkat</option>
            <option value="10">Tingkat 10</option>
            <option value="11">Tingkat 11</option>
            <option value="12">Tingkat 12</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total <strong>{filteredRombel.length}</strong> rombongan belajar
        </div>
      </div>

      {/* Rombel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRombel.map(rombel => {
          const students = pesertaDidikList.filter(p => p.rombelId === rombel.id);

          return (
            <div 
              key={rombel.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Tingkat {rombel.tingkat}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {rombel.namaRombel}
                  </h3>
                  <p className="text-xs text-slate-500">{rombel.jurusanPeminatan}</p>
                </div>
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  {rombel.kurikulum}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">Wali Kelas:</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{rombel.waliKelasNama || 'Belum Ditugaskan'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">Ruang Pembelajaran:</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-600" />
                    <span>{rombel.ruangNama || 'Belum Dipilih'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>{students.length}</strong> Siswa Terdaftar
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedRombelDetail(rombel)}
                    className="px-2.5 py-1 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded text-xs font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Anggota</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(rombel)}
                    className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rombel.id, rombel.namaRombel)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: DAFTAR SISWA ROMBEL */}
      {selectedRombelDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-purple-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Anggota Siswa: {selectedRombelDetail.namaRombel}</h3>
                <p className="text-xs text-purple-200">
                  Wali Kelas: {selectedRombelDetail.waliKelasNama}
                </p>
              </div>
              <button onClick={() => setSelectedRombelDetail(null)} className="text-white font-bold p-1">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              {pesertaDidikList.filter(p => p.rombelId === selectedRombelDetail.id).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  Belum ada peserta didik yang dialokasikan ke dalam rombel ini.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {pesertaDidikList.filter(p => p.rombelId === selectedRombelDetail.id).map((student, idx) => (
                    <div key={student.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                        <div>
                          <div className="font-semibold text-slate-900">{student.nama}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            NISN: {student.nisn} • NIK: {student.nik}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.jenisKelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {student.jenisKelamin === 'L' ? 'L' : 'P'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedRombelDetail(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT ROMBEL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-purple-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingRombel ? 'Edit Rombel Belajar' : 'Tambah Rombel Baru'}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Rombongan Belajar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaRombel}
                  onChange={e => setFormData(p => ({ ...p, namaRombel: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Contoh: X Rekayasa Perangkat Lunak 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kelas *
                  </label>
                  <select
                    value={formData.tingkat}
                    onChange={e => setFormData(p => ({ ...p, tingkat: parseInt(e.target.value) || 10 }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value={10}>Tingkat 10</option>
                    <option value={11}>Tingkat 11</option>
                    <option value={12}>Tingkat 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kurikulum *
                  </label>
                  <select
                    value={formData.kurikulum}
                    onChange={e => setFormData(p => ({ ...p, kurikulum: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                    <option value="Kurikulum 2013">Kurikulum 2013</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jurusan / Peminatan / Konsentrasi Keahlian
                </label>
                <input
                  type="text"
                  value={formData.jurusanPeminatan}
                  onChange={e => setFormData(p => ({ ...p, jurusanPeminatan: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  placeholder="Contoh: Pengembangan Perangkat Lunak dan Gim (PPLG)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guru Wali Kelas *
                </label>
                <select
                  value={formData.waliKelasId}
                  onChange={e => setFormData(p => ({ ...p, waliKelasId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="">Pilih Guru Wali Kelas...</option>
                  {gtkList.filter(g => g.kategoriPtk === 'Guru').map(g => (
                    <option key={g.id} value={g.id}>
                      {g.namaLengkap} ({g.jenisPtk})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alokasi Ruang Kelas Pembelajaran *
                </label>
                <select
                  value={formData.ruangId}
                  onChange={e => setFormData(p => ({ ...p, ruangId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="">Pilih Ruang Kelas...</option>
                  {ruangList.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.namaRuang} ({r.jenisRuang} - {r.luas}m²)
                    </option>
                  ))}
                </select>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
