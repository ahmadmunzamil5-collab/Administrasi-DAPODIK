import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Warehouse, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Building, 
  MapPin, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Layers, 
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { Ruang, Tanah, Bangunan, SaranaAlat } from '../types/dapodik';

export const SarprasView: React.FC = () => {
  const { 
    tanahList, 
    bangunanList, 
    ruangList, 
    saranaAlatList,
    addRuang,
    updateRuang,
    deleteRuang,
    addTanah,
    updateTanah,
    deleteTanah,
    addBangunan,
    updateBangunan,
    deleteBangunan,
    addSaranaAlat,
    updateSaranaAlat,
    deleteSaranaAlat
  } = useDapodik();

  const [activeSubTab, setActiveSubTab] = useState<'ruang' | 'tanah-bangunan' | 'alat'>('ruang');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterKondisi, setFilterKondisi] = useState<string>('all');

  // Modal State for Ruang
  const [isRuangModalOpen, setIsRuangModalOpen] = useState(false);
  const [editingRuang, setEditingRuang] = useState<Ruang | null>(null);
  const [formDataRuang, setFormDataRuang] = useState<Partial<Ruang>>({
    kodeRuang: '',
    namaRuang: '',
    jenisRuang: 'Ruang Teori/Kelas',
    bangunanId: bangunanList[0]?.id || '',
    panjang: 8,
    lebar: 7,
    luas: 56,
    kapasitas: 32,
    lantaiKe: 1,
    tingkatKerusakan: 0,
    kondisi: 'Baik',
    laikPakai: true,
    kerusakanDetail: {
      pondasi: 0,
      struktur: 0,
      atap: 0,
      plafon: 0,
      dinding: 0,
      lantai: 0,
      kusenPintuJendela: 0,
      instalasiListrik: 0
    }
  });

  // Modal state for Alat
  const [isAlatModalOpen, setIsAlatModalOpen] = useState(false);
  const [editingAlat, setEditingAlat] = useState<SaranaAlat | null>(null);
  const [formDataAlat, setFormDataAlat] = useState<Partial<SaranaAlat>>({
    ruangId: ruangList[0]?.id || '',
    namaAlat: '',
    kategori: 'Peralatan Pendidikan',
    jumlahTotal: 10,
    jumlahLaik: 10,
    jumlahRusak: 0,
    kepemilikan: 'Milik',
    spesifikasi: ''
  });

  // Filtered Ruang List
  const filteredRuang = ruangList.filter(ruang => {
    const matchesSearch = 
      ruang.namaRuang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ruang.kodeRuang.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJenis = filterJenis === 'all' || ruang.jenisRuang === filterJenis;
    const matchesKondisi = filterKondisi === 'all' || ruang.kondisi === filterKondisi;

    return matchesSearch && matchesJenis && matchesKondisi;
  });

  // Calculate damage condition helper
  const calculateDamageCategory = (percentage: number): 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat' => {
    if (percentage < 30) return 'Baik';
    if (percentage <= 45) return 'Rusak Ringan';
    if (percentage <= 65) return 'Rusak Sedang';
    return 'Rusak Berat';
  };

  const handleOpenAddRuang = () => {
    setEditingRuang(null);
    setFormDataRuang({
      kodeRuang: `RNG-${Date.now().toString().slice(-4)}`,
      namaRuang: '',
      jenisRuang: 'Ruang Teori/Kelas',
      bangunanId: bangunanList[0]?.id || '',
      panjang: 9,
      lebar: 8,
      luas: 72,
      kapasitas: 36,
      lantaiKe: 1,
      tingkatKerusakan: 5,
      kondisi: 'Baik',
      laikPakai: true,
      kerusakanDetail: {
        pondasi: 0,
        struktur: 0,
        atap: 0,
        plafon: 5,
        dinding: 5,
        lantai: 5,
        kusenPintuJendela: 5,
        instalasiListrik: 5
      }
    });
    setIsRuangModalOpen(true);
  };

  const handleOpenEditRuang = (ruang: Ruang) => {
    setEditingRuang(ruang);
    setFormDataRuang(ruang);
    setIsRuangModalOpen(true);
  };

  const handleSaveRuang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataRuang.namaRuang || !formDataRuang.kodeRuang) return;

    const p = Number(formDataRuang.panjang) || 1;
    const l = Number(formDataRuang.lebar) || 1;
    const computedLuas = p * l;
    const damage = Number(formDataRuang.tingkatKerusakan) || 0;
    const computedKondisi = calculateDamageCategory(damage);

    const payload: Ruang = {
      id: editingRuang ? editingRuang.id : `rng-${Date.now()}`,
      kodeRuang: formDataRuang.kodeRuang || '',
      namaRuang: formDataRuang.namaRuang || '',
      jenisRuang: formDataRuang.jenisRuang as any,
      bangunanId: formDataRuang.bangunanId || (bangunanList[0]?.id || ''),
      panjang: p,
      lebar: l,
      luas: computedLuas,
      kapasitas: Number(formDataRuang.kapasitas) || 30,
      lantaiKe: Number(formDataRuang.lantaiKe) || 1,
      tingkatKerusakan: damage,
      kondisi: computedKondisi,
      laikPakai: formDataRuang.laikPakai !== undefined ? formDataRuang.laikPakai : true,
      kerusakanDetail: formDataRuang.kerusakanDetail || {
        pondasi: 0,
        struktur: 0,
        atap: 0,
        plafon: 0,
        dinding: 0,
        lantai: 0,
        kusenPintuJendela: 0,
        instalasiListrik: 0
      }
    };

    if (editingRuang) {
      updateRuang(editingRuang.id, payload);
    } else {
      addRuang(payload);
    }

    setIsRuangModalOpen(false);
  };

  const handleDeleteRuang = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data ruang "${nama}"?`)) {
      deleteRuang(id);
    }
  };

  // Sarana Alat handlers
  const handleOpenAddAlat = () => {
    setEditingAlat(null);
    setFormDataAlat({
      ruangId: ruangList[0]?.id || '',
      namaAlat: '',
      kategori: 'Peralatan Pendidikan',
      jumlahTotal: 10,
      jumlahLaik: 10,
      jumlahRusak: 0,
      kepemilikan: 'Milik',
      spesifikasi: ''
    });
    setIsAlatModalOpen(true);
  };

  const handleOpenEditAlat = (alat: SaranaAlat) => {
    setEditingAlat(alat);
    setFormDataAlat(alat);
    setIsAlatModalOpen(true);
  };

  const handleSaveAlat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataAlat.namaAlat) return;

    const total = Number(formDataAlat.jumlahTotal) || 0;
    const laik = Number(formDataAlat.jumlahLaik) || 0;
    const rusak = total - laik > 0 ? total - laik : 0;

    const payload: SaranaAlat = {
      id: editingAlat ? editingAlat.id : `alat-${Date.now()}`,
      ruangId: formDataAlat.ruangId || (ruangList[0]?.id || ''),
      namaAlat: formDataAlat.namaAlat,
      kategori: formDataAlat.kategori as any,
      jumlahTotal: total,
      jumlahLaik: laik,
      jumlahRusak: rusak,
      kepemilikan: formDataAlat.kepemilikan as any,
      spesifikasi: formDataAlat.spesifikasi || ''
    };

    if (editingAlat) {
      updateSaranaAlat(editingAlat.id, payload);
    } else {
      addSaranaAlat(payload);
    }
    setIsAlatModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-purple-600" />
            <span>Manajemen Sarana dan Prasarana (Sarpras)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendataan tanah, bangunan, ruang kelas/laboratorium, dan sarana inventaris sesuai standar validasi Dapodik.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('ruang')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'ruang'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ruang ({ruangList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('tanah-bangunan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'tanah-bangunan'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tanah & Bangunan ({tanahList.length}/{bangunanList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('alat')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'alat'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alat & Sarana ({saranaAlatList.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DAFTAR RUANG */}
      {activeSubTab === 'ruang' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama atau kode ruang..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <select
                value={filterJenis}
                onChange={e => setFilterJenis(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all">Semua Jenis Ruang</option>
                <option value="Ruang Teori/Kelas">Ruang Teori/Kelas</option>
                <option value="Laboratorium Komputer">Lab Komputer</option>
                <option value="Perpustakaan">Perpustakaan</option>
                <option value="Ruang Guru">Ruang Guru</option>
                <option value="Toilet/Sanitasi Siswa">Toilet/Sanitasi Siswa</option>
                <option value="Ruang UKS">Ruang UKS</option>
              </select>

              <select
                value={filterKondisi}
                onChange={e => setFilterKondisi(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all">Semua Kondisi</option>
                <option value="Baik">Baik (&lt; 30%)</option>
                <option value="Rusak Ringan">Rusak Ringan (30-45%)</option>
                <option value="Rusak Sedang">Rusak Sedang (46-65%)</option>
                <option value="Rusak Berat">Rusak Berat (&gt; 65%)</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddRuang}
              className="w-full md:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ruang Baru</span>
            </button>
          </div>

          {/* Table of Ruang */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Kode / Nama Ruang</th>
                    <th className="py-3 px-3 font-semibold">Jenis Ruang</th>
                    <th className="py-3 px-3 font-semibold">Gedung / Lantai</th>
                    <th className="py-3 px-3 font-semibold">Dimensi (P x L)</th>
                    <th className="py-3 px-3 font-semibold">Luas & Kapasitas</th>
                    <th className="py-3 px-3 font-semibold">Tingkat Kerusakan</th>
                    <th className="py-3 px-3 font-semibold">Kelayakan</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRuang.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Tidak ada data ruang yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredRuang.map(ruang => {
                      const gedung = bangunanList.find(b => b.id === ruang.bangunanId);
                      return (
                        <tr key={ruang.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <div className="font-semibold text-slate-900">{ruang.namaRuang}</div>
                            <div className="text-[10px] font-mono text-slate-500">{ruang.kodeRuang}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                              {ruang.jenisRuang}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            <div>{gedung?.namaBangunan || '-'}</div>
                            <div className="text-[10px] text-slate-400">Lantai {ruang.lantaiKe}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700">
                            {ruang.panjang}m × {ruang.lebar}m
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <div className="font-semibold">{ruang.luas} m²</div>
                            <div className="text-[10px] text-slate-500">{ruang.kapasitas} Orang</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                ruang.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                                ruang.kondisi === 'Rusak Ringan' ? 'bg-blue-100 text-blue-800' :
                                ruang.kondisi === 'Rusak Sedang' ? 'bg-amber-100 text-amber-800' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {ruang.kondisi} ({ruang.tingkatKerusakan}%)
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {ruang.laikPakai ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Laik</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-medium">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Tidak Laik</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditRuang(ruang)}
                                title="Edit Ruang"
                                className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRuang(ruang.id, ruang.namaRuang)}
                                title="Hapus Ruang"
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
        </div>
      )}

      {/* SUBTAB 2: TANAH & BANGUNAN */}
      {activeSubTab === 'tanah-bangunan' && (
        <div className="space-y-6">
          {/* Tanah Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>Daftar Bidang Tanah Satuan Pendidikan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Total luas tanah operasional terdaftar di Dapodik: <strong>{tanahList.reduce((a, b) => a + b.luas, 0).toLocaleString('id-ID')} m²</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tanahList.map(tanah => (
                <div key={tanah.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-purple-200 transition-colors space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{tanah.nama}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800">
                      {tanah.statusKepemilikan}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Luas Tanah:</span>
                      <strong className="text-slate-800 font-mono text-sm">{tanah.luas.toLocaleString('id-ID')} m²</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Nomor Sertifikat:</span>
                      <span className="text-slate-700 font-mono text-xs">{tanah.noSertifikat}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Estimasi NJOP / Nilai Aset: <strong>Rp {tanah.njop.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bangunan Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>Daftar Bangunan / Gedung</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Bangunan tempat ruang kegiatan belajar mengajar dan administrasi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bangunanList.map(bgn => {
                const roomsInBgn = ruangList.filter(r => r.bangunanId === bgn.id).length;
                return (
                  <div key={bgn.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{bgn.namaBangunan}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Kondisi: {bgn.kondisi}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Jumlah Lantai:</span>
                        <strong className="text-slate-800">{bgn.jumlahLantai} Lantai</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Luas Tapak:</span>
                        <strong className="text-slate-800 font-mono">{bgn.luasTapak} m²</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Tahun Dibangun:</span>
                        <strong className="text-slate-800">{bgn.tahunDibangun}</strong>
                      </div>
                    </div>
                    <div className="text-[11px] text-purple-700 bg-purple-50 px-2 py-1 rounded font-medium mt-1">
                      Memuat {roomsInBgn} ruang terdaftar
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ALAT & SARANA */}
      {activeSubTab === 'alat' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-600" />
                <span>Inventaris Sarana & Alat Pendidikan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Perabot, media pembelajaran, komputer, proyektor, dan buku perpustakaan.
              </p>
            </div>
            <button
              onClick={handleOpenAddAlat}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Alat</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Nama Sarana / Alat</th>
                    <th className="py-3 px-3 font-semibold">Kategori</th>
                    <th className="py-3 px-3 font-semibold">Alokasi Ruang</th>
                    <th className="py-3 px-3 font-semibold">Spesifikasi</th>
                    <th className="py-3 px-3 font-semibold">Jumlah Total</th>
                    <th className="py-3 px-3 font-semibold">Kondisi Laik / Rusak</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {saranaAlatList.map(alat => {
                    const room = ruangList.find(r => r.id === alat.ruangId);
                    return (
                      <tr key={alat.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {alat.namaAlat}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                            {alat.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {room?.namaRuang || '-'}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                          {alat.spesifikasi || '-'}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800 font-mono">
                          {alat.jumlahTotal} unit
                        </td>
                        <td className="py-3 px-3 text-[11px]">
                          <span className="text-emerald-700 font-semibold">{alat.jumlahLaik} Laik</span>
                          {alat.jumlahRusak > 0 && (
                            <span className="text-rose-600 font-semibold ml-2">({alat.jumlahRusak} Rusak)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditAlat(alat)}
                              className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteSaranaAlat(alat.id)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tambah / Edit Ruang */}
      {isRuangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingRuang ? 'Edit Data Ruang Sarpras' : 'Tambah Ruang Baru'}
                </h3>
                <p className="text-xs text-purple-200">
                  Formulir validasi sarana dan prasarana Dapodik Kemendikbudristek
                </p>
              </div>
              <button
                onClick={() => setIsRuangModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRuang} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Ruang *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDataRuang.kodeRuang}
                    onChange={e => setFormDataRuang(p => ({ ...p, kodeRuang: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
                    placeholder="Contoh: R-TEORI-X-3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Ruang *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDataRuang.namaRuang}
                    onChange={e => setFormDataRuang(p => ({ ...p, namaRuang: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="Contoh: Ruang Teori X DKV 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Ruang *
                  </label>
                  <select
                    value={formDataRuang.jenisRuang}
                    onChange={e => setFormDataRuang(p => ({ ...p, jenisRuang: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="Ruang Teori/Kelas">Ruang Teori/Kelas</option>
                    <option value="Laboratorium Komputer">Laboratorium Komputer</option>
                    <option value="Laboratorium IPA">Laboratorium IPA</option>
                    <option value="Perpustakaan">Perpustakaan</option>
                    <option value="Ruang Guru">Ruang Guru</option>
                    <option value="Ruang Pimpinan/Kepsek">Ruang Pimpinan/Kepsek</option>
                    <option value="Toilet/Sanitasi Siswa">Toilet/Sanitasi Siswa</option>
                    <option value="Toilet Guru">Toilet Guru</option>
                    <option value="Ruang UKS">Ruang UKS</option>
                    <option value="Ruang Praktik Kerja/Bengkel">Ruang Praktik Kerja/Bengkel</option>
                    <option value="Lapangan Upacara/Olahraga">Lapangan Upacara/Olahraga</option>
                    <option value="Gudang">Gudang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gedung / Bangunan *
                  </label>
                  <select
                    value={formDataRuang.bangunanId}
                    onChange={e => setFormDataRuang(p => ({ ...p, bangunanId: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                  >
                    {bangunanList.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.namaBangunan} (Lt. {b.jumlahLantai})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Dimensi & Kapasitas Ruang
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Panjang (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={formDataRuang.panjang}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormDataRuang(p => ({ 
                          ...p, 
                          panjang: val,
                          luas: val * (p.lebar || 0)
                        }));
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Lebar (m)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={formDataRuang.lebar}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormDataRuang(p => ({ 
                          ...p, 
                          lebar: val,
                          luas: val * (p.panjang || 0)
                        }));
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Luas (m²)</label>
                    <input
                      type="number"
                      disabled
                      value={formDataRuang.luas}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-100 font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Kapasitas (Orang)</label>
                    <input
                      type="number"
                      min="1"
                      value={formDataRuang.kapasitas}
                      onChange={e => setFormDataRuang(p => ({ ...p, kapasitas: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Damage & Condition */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Penilaian Tingkat Kerusakan Bangunan (%)
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    calculateDamageCategory(formDataRuang.tingkatKerusakan || 0) === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                    calculateDamageCategory(formDataRuang.tingkatKerusakan || 0) === 'Rusak Ringan' ? 'bg-blue-100 text-blue-800' :
                    calculateDamageCategory(formDataRuang.tingkatKerusakan || 0) === 'Rusak Sedang' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {calculateDamageCategory(formDataRuang.tingkatKerusakan || 0)}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Persentase Total Kerusakan:</span>
                    <span className="font-bold text-purple-700 font-mono">{formDataRuang.tingkatKerusakan}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formDataRuang.tingkatKerusakan}
                    onChange={e => setFormDataRuang(p => ({ ...p, tingkatKerusakan: parseInt(e.target.value) || 0 }))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0% (Sempurna)</span>
                    <span>30% (Batas Baik)</span>
                    <span>45% (Rusak Ringan)</span>
                    <span>65% (Rusak Sedang)</span>
                    <span>100% (Roboh/Rusak Total)</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formDataRuang.laikPakai}
                      onChange={e => setFormDataRuang(p => ({ ...p, laikPakai: e.target.checked }))}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span>Status Kelayakan: Ruang Masih Laik Digunakan</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRuangModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Simpan Data Ruang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah / Edit Alat */}
      {isAlatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-purple-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingAlat ? 'Edit Sarana / Alat' : 'Tambah Sarana & Alat'}
              </h3>
              <button onClick={() => setIsAlatModalOpen(false)} className="text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAlat} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Alat / Sarana *
                </label>
                <input
                  type="text"
                  required
                  value={formDataAlat.namaAlat}
                  onChange={e => setFormDataAlat(p => ({ ...p, namaAlat: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Contoh: Proyektor Epson EB-E01"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formDataAlat.kategori}
                    onChange={e => setFormDataAlat(p => ({ ...p, kategori: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Perabot">Perabot</option>
                    <option value="Peralatan Pendidikan">Peralatan Pendidikan</option>
                    <option value="Media Pendidikan">Media Pendidikan</option>
                    <option value="Buku/Pustaka">Buku/Pustaka</option>
                    <option value="Perlengkapan Lain">Perlengkapan Lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alokasi Ruang *
                  </label>
                  <select
                    value={formDataAlat.ruangId}
                    onChange={e => setFormDataAlat(p => ({ ...p, ruangId: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    {ruangList.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.namaRuang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Total (Unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formDataAlat.jumlahTotal}
                    onChange={e => setFormDataAlat(p => ({ ...p, jumlahTotal: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Kondisi Laik
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formDataAlat.jumlahLaik}
                    onChange={e => setFormDataAlat(p => ({ ...p, jumlahLaik: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spesifikasi Teknis / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={formDataAlat.spesifikasi}
                  onChange={e => setFormDataAlat(p => ({ ...p, spesifikasi: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  placeholder="Keterangan merk, daya listrik, atau nomor inventaris..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAlatModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Simpan Sarana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
