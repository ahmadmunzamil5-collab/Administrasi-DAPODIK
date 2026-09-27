import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Eye, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Download,
  Share2,
  Calendar,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { PesertaDidik } from '../types/dapodik';

export const PesertaDidikView: React.FC = () => {
  const { 
    pesertaDidikList, 
    rombelList, 
    addPesertaDidik, 
    updatePesertaDidik, 
    deletePesertaDidik,
    logActivity 
  } = useDapodik();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRombel, setFilterRombel] = useState<string>('all');
  const [filterPip, setFilterPip] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('Aktif');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<PesertaDidik | null>(null);
  const [detailStudent, setDetailStudent] = useState<PesertaDidik | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PesertaDidik>>({
    nisn: '',
    nik: '',
    nama: '',
    jenisKelamin: 'L',
    tempatLahir: '',
    tanggalLahir: '2008-01-01',
    namaIbuKandung: '',
    namaAyah: '',
    agama: 'Islam',
    tingkat: 10,
    rombelId: rombelList[0]?.id || '',
    namaRombel: rombelList[0]?.namaRombel || '',
    statusSiswa: 'Aktif',
    penerimaPip: false,
    noKip: '',
    alamat: '',
    telepon: '',
    tinggiBadan: 165,
    beratBadan: 55,
    jarakSekolahKm: 2,
    waktuTempuhMenit: 15,
    jumlahSaudaraKandung: 1,
    anakKe: 1
  });

  // Filter logic
  const filteredStudents = pesertaDidikList.filter(pd => {
    const matchesSearch = 
      pd.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pd.nisn.includes(searchQuery) ||
      pd.nik.includes(searchQuery);

    const matchesRombel = filterRombel === 'all' || pd.rombelId === filterRombel;
    const matchesPip = 
      filterPip === 'all' || 
      (filterPip === 'pip' && pd.penerimaPip) || 
      (filterPip === 'non-pip' && !pd.penerimaPip);
    const matchesStatus = filterStatus === 'all' || pd.statusSiswa === filterStatus;

    return matchesSearch && matchesRombel && matchesPip && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const defaultRombel = rombelList[0];
    setFormData({
      nisn: `008${Math.floor(Math.random() * 9000000 + 1000000)}`,
      nik: `327311${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      nama: '',
      jenisKelamin: 'L',
      tempatLahir: 'Bandung',
      tanggalLahir: '2008-05-12',
      namaIbuKandung: '',
      namaAyah: '',
      agama: 'Islam',
      tingkat: defaultRombel?.tingkat || 10,
      rombelId: defaultRombel?.id || '',
      namaRombel: defaultRombel?.namaRombel || '',
      statusSiswa: 'Aktif',
      penerimaPip: false,
      noKip: '',
      alamat: '',
      telepon: '0812' + Math.floor(Math.random() * 90000000 + 10000000),
      tinggiBadan: 165,
      beratBadan: 55,
      jarakSekolahKm: 2.5,
      waktuTempuhMenit: 15,
      jumlahSaudaraKandung: 1,
      anakKe: 1
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (pd: PesertaDidik) => {
    setEditingStudent(pd);
    setFormData(pd);
    setIsFormModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn || !formData.nik) return;

    const selectedRombelObj = rombelList.find(r => r.id === formData.rombelId);

    const payload = {
      ...formData,
      nama: formData.nama,
      nisn: formData.nisn,
      nik: formData.nik,
      namaRombel: selectedRombelObj ? selectedRombelObj.namaRombel : (formData.namaRombel || '')
    } as any;

    if (editingStudent) {
      updatePesertaDidik(editingStudent.id, payload);
    } else {
      addPesertaDidik(payload);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus peserta didik "${nama}"?`)) {
      deletePesertaDidik(id);
    }
  };

  // Export to CSV helper
  const handleExportCsv = () => {
    const headers = ['NISN', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Rombel', 'Penerima PIP', 'Nama Ibu Kandung', 'Alamat'];
    const rows = filteredStudents.map(s => [
      `"${s.nisn}"`,
      `"${s.nik}"`,
      `"${s.nama}"`,
      `"${s.jenisKelamin}"`,
      `"${s.namaRombel}"`,
      `"${s.penerimaPip ? 'Ya' : 'Tidak'}"`,
      `"${s.namaIbuKandung}"`,
      `"${s.alamat.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dapodik_PesertaDidik_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity(
      'EXPORT',
      'Peserta Didik',
      'Ekspor Data Peserta Didik',
      `Mengunduh berkas CSV memuat ${filteredStudents.length} peserta didik.`
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Administrasi Peserta Didik (Siswa)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendataan biodata kependudukan (Dukcapil), NISN, data periodik, dan bantuan Program Indonesia Pintar (PIP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-300"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi Siswa Baru</span>
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
              placeholder="Cari nama, NISN, atau NIK siswa..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={filterRombel}
            onChange={e => setFilterRombel(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Semua Rombel</option>
            {rombelList.map(r => (
              <option key={r.id} value={r.id}>
                {r.namaRombel}
              </option>
            ))}
          </select>

          <select
            value={filterPip}
            onChange={e => setFilterPip(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Semua Status Bantuan</option>
            <option value="pip">Penerima PIP / KIP</option>
            <option value="non-pip">Bukan Penerima PIP</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Mutasi Masuk">Mutasi Masuk</option>
            <option value="Mutasi Keluar">Mutasi Keluar</option>
            <option value="Lulus">Lulus</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <strong>{filteredStudents.length}</strong> dari {pesertaDidikList.length} siswa
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Identitas Siswa (Nama / NISN / NIK)</th>
                <th className="py-3 px-3 font-semibold">L/P</th>
                <th className="py-3 px-3 font-semibold">Rombel / Kelas</th>
                <th className="py-3 px-3 font-semibold">Ibu Kandung</th>
                <th className="py-3 px-3 font-semibold">Bantuan PIP</th>
                <th className="py-3 px-3 font-semibold">Data Periodik</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ditemukan peserta didik dengan kriteria pencarian tersebut.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const isNisnValid = student.nisn && student.nisn.length === 10;
                  const isNikValid = student.nik && student.nik.length === 16;
                  const isMotherValid = !!student.namaIbuKandung;
                  const hasInvalidField = !isNisnValid || !isNikValid || !isMotherValid;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            student.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {student.nama.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{student.nama}</span>
                              {hasInvalidField && (
                                <span className="w-2 h-2 rounded-full bg-rose-500" title="Data belum lengkap untuk sinkronisasi"></span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                              <span className={isNisnValid ? 'text-blue-700' : 'text-rose-600 font-bold'}>
                                NISN: {student.nisn || '-'}
                              </span>
                              <span>•</span>
                              <span className={isNikValid ? 'text-slate-600' : 'text-rose-600 font-bold'}>
                                NIK: {student.nik || '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.jenisKelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                        }`}>
                          {student.jenisKelamin === 'L' ? 'L' : 'P'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700">
                        <div className="font-semibold">{student.namaRombel || '-'}</div>
                        <div className="text-[10px] text-slate-400">Tingkat {student.tingkat}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-700">
                        {student.namaIbuKandung ? (
                          <span>{student.namaIbuKandung}</span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">
                            Wajib Diisi!
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {student.penerimaPip ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                            <HeartHandshake className="w-3 h-3 text-amber-600" />
                            <span>Penerima PIP</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        {student.tinggiBadan > 0 ? (
                          <span>{student.tinggiBadan}cm / {student.beratBadan}kg</span>
                        ) : (
                          <span className="text-amber-600 text-[10px]">Belum diukur</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {student.statusSiswa}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailStudent(student)}
                            title="Lihat Detail Profil Siswa"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="Edit Biodata Siswa"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.nama)}
                            title="Hapus Siswa"
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
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

      {/* DETAIL MODAL */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-base">
                  {detailStudent.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base">{detailStudent.nama}</h3>
                  <p className="text-xs text-blue-200 font-mono">
                    NISN: {detailStudent.nisn} | NIK: {detailStudent.nik}
                  </p>
                </div>
              </div>
              <button onClick={() => setDetailStudent(null)} className="text-white/80 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Tempat, Tanggal Lahir:</span>
                  <strong className="text-slate-800">{detailStudent.tempatLahir}, {detailStudent.tanggalLahir}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Jenis Kelamin & Agama:</span>
                  <strong className="text-slate-800">{detailStudent.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} ({detailStudent.agama})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Rombel Belajar:</span>
                  <strong className="text-blue-700">{detailStudent.namaRombel} (Tingkat {detailStudent.tingkat})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Status Siswa:</span>
                  <strong className="text-emerald-700">{detailStudent.statusSiswa}</strong>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Data Orang Tua / Wali</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Nama Ibu Kandung:</span>
                    <strong className="text-slate-800">{detailStudent.namaIbuKandung || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Nama Ayah:</span>
                    <strong className="text-slate-800">{detailStudent.namaAyah || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Data Bantuan PIP */}
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-amber-600" />
                    <span>Program Indonesia Pintar (PIP)</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    detailStudent.penerimaPip ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {detailStudent.penerimaPip ? 'Layak Menerima' : 'Tidak Menerima'}
                  </span>
                </div>
                {detailStudent.penerimaPip && (
                  <div className="text-[11px] text-amber-800">
                    No. KIP/KPS: <strong className="font-mono">{detailStudent.noKip || 'Dalam Proses Penerbitan'}</strong>
                  </div>
                )}
              </div>

              {/* Data Periodik */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Data Periodik Semester Ini</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tinggi Badan:</span>
                    <strong className="text-slate-800">{detailStudent.tinggiBadan} cm</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Berat Badan:</span>
                    <strong className="text-slate-800">{detailStudent.beratBadan} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Jarak Sekolah:</span>
                    <strong className="text-slate-800">{detailStudent.jarakSekolahKm} km</strong>
                  </div>
                </div>
              </div>

              <div className="text-slate-600">
                <span className="text-slate-500 block text-[10px]">Alamat Domisili:</span>
                <p className="mt-0.5">{detailStudent.alamat}</p>
                <div className="mt-1 text-[11px]">No. Telepon / WA: <strong>{detailStudent.telepon}</strong></div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setDetailStudent(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (Add / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingStudent ? 'Edit Biodata Peserta Didik' : 'Registrasi Peserta Didik Baru'}
                </h3>
                <p className="text-xs text-blue-200">
                  Formulir sinkronisasi data siswa standar Dapodik dan Dukcapil Kemendikbud
                </p>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-white font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Row 1: NISN & NIK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN (10 Digit Angka) *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    required
                    value={formData.nisn}
                    onChange={e => setFormData(p => ({ ...p, nisn: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono"
                    placeholder="Contoh: 0087452910"
                  />
                  <span className="text-[10px] text-slate-400">Panjang harus tepat 10 digit</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK / No. KTP Siswa (16 Digit Angka) *
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    required
                    value={formData.nik}
                    onChange={e => setFormData(p => ({ ...p, nik: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono"
                    placeholder="Contoh: 3273111403080001"
                  />
                  <span className="text-[10px] text-slate-400">Panjang harus tepat 16 digit sesuai KK</span>
                </div>
              </div>

              {/* Row 2: Nama & Jenis Kelamin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Sesuai akta kelahiran..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={e => setFormData(p => ({ ...p, jenisKelamin: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: TTL & Agama */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tempatLahir}
                    onChange={e => setFormData(p => ({ ...p, tempatLahir: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Kota kelahiran"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={e => setFormData(p => ({ ...p, tanggalLahir: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agama *
                  </label>
                  <select
                    value={formData.agama}
                    onChange={e => setFormData(p => ({ ...p, agama: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Parents */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Identitas Orang Tua (Kunci Validasi Dukcapil)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Ibu Kandung * (Wajib untuk Sinkron)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.namaIbuKandung}
                      onChange={e => setFormData(p => ({ ...p, namaIbuKandung: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Nama ibu kandung tanpa gelar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Ayah Kandung
                    </label>
                    <input
                      type="text"
                      value={formData.namaAyah}
                      onChange={e => setFormData(p => ({ ...p, namaAyah: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      placeholder="Nama ayah kandung"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Rombel & Tingkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rombongan Belajar (Kelas) *
                  </label>
                  <select
                    value={formData.rombelId}
                    onChange={e => {
                      const selectedId = e.target.value;
                      const rombelObj = rombelList.find(r => r.id === selectedId);
                      setFormData(p => ({
                        ...p,
                        rombelId: selectedId,
                        namaRombel: rombelObj?.namaRombel || '',
                        tingkat: rombelObj?.tingkat || 10
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    {rombelList.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.namaRombel} (Tingkat {r.tingkat})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Keaktifan
                  </label>
                  <select
                    value={formData.statusSiswa}
                    onChange={e => setFormData(p => ({ ...p, statusSiswa: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Mutasi Masuk">Mutasi Masuk</option>
                    <option value="Mutasi Keluar">Mutasi Keluar</option>
                    <option value="Lulus">Lulus</option>
                  </select>
                </div>
              </div>

              {/* Row 6: PIP Assistance */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-amber-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.penerimaPip}
                    onChange={e => setFormData(p => ({ ...p, penerimaPip: e.target.checked }))}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Siswa Penerima Bantuan Program Indonesia Pintar (PIP / KIP)</span>
                </label>

                {formData.penerimaPip && (
                  <div>
                    <label className="block text-[11px] text-amber-800 mb-1">
                      Nomor KIP (Kartu Indonesia Pintar)
                    </label>
                    <input
                      type="text"
                      value={formData.noKip}
                      onChange={e => setFormData(p => ({ ...p, noKip: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white font-mono"
                      placeholder="KIP-2026-XXXX-XXXX"
                    />
                  </div>
                )}
              </div>

              {/* Row 7: Periodik */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Data Periodik Peserta Didik
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Tinggi (cm)</label>
                    <input
                      type="number"
                      value={formData.tinggiBadan}
                      onChange={e => setFormData(p => ({ ...p, tinggiBadan: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Berat (kg)</label>
                    <input
                      type="number"
                      value={formData.beratBadan}
                      onChange={e => setFormData(p => ({ ...p, beratBadan: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Jarak (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.jarakSekolahKm}
                      onChange={e => setFormData(p => ({ ...p, jarakSekolahKm: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Waktu (menit)</label>
                    <input
                      type="number"
                      value={formData.waktuTempuhMenit}
                      onChange={e => setFormData(p => ({ ...p, waktuTempuhMenit: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Row 8: Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Domisili
                  </label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={e => setFormData(p => ({ ...p, alamat: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Handphone / WhatsApp
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

              {/* Buttons */}
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Simpan Peserta Didik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
