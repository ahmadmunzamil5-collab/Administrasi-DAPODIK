import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Building2, 
  X, 
  Save, 
  MapPin, 
  UserCheck, 
  FileBadge 
} from 'lucide-react';
import { SekolahProfile } from '../types/dapodik';

export const SekolahProfileModal: React.FC = () => {
  const { 
    sekolah, 
    updateSekolah, 
    isProfileModalOpen, 
    setIsProfileModalOpen 
  } = useDapodik();

  const [formData, setFormData] = useState<SekolahProfile>({ ...sekolah });

  if (!isProfileModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSekolah(formData);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-300" />
            <div>
              <h3 className="font-bold text-base">Profil Satuan Pendidikan</h3>
              <p className="text-xs text-blue-200">Data identitas resmi sekolah terdaftar di Kemendikbudristek</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="text-white/80 hover:text-white font-bold p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Resmi Satuan Pendidikan *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional) * (8 Digit)
              </label>
              <input
                type="text"
                maxLength={8}
                required
                value={formData.npsn}
                onChange={e => setFormData(p => ({ ...p, npsn: e.target.value.replace(/\D/g, '') }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bentuk Pendidikan
              </label>
              <select
                value={formData.bentukPendidikan}
                onChange={e => setFormData(p => ({ ...p, bentukPendidikan: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="SMK">SMK</option>
                <option value="SMA">SMA</option>
                <option value="SMP">SMP</option>
                <option value="SD">SD</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Sekolah
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Akreditasi BAN-PDM
              </label>
              <select
                value={formData.akreditasi}
                onChange={e => setFormData(p => ({ ...p, akreditasi: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              >
                <option value="A">A (Unggul)</option>
                <option value="B">B (Baik)</option>
                <option value="C">C (Cukup)</option>
                <option value="Belum Terakreditasi">Belum Terakreditasi</option>
              </select>
            </div>
          </div>

          {/* Legalitas SK */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 block text-xs">
              Izin Operasional & Registrasi
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">SK Izin Operasional *</label>
                <input
                  type="text"
                  required
                  value={formData.skIzinOperasional}
                  onChange={e => setFormData(p => ({ ...p, skIzinOperasional: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Tanggal SK Operasional</label>
                <input
                  type="date"
                  value={formData.tanggalSk}
                  onChange={e => setFormData(p => ({ ...p, tanggalSk: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Kode Registrasi Dapodik</label>
              <input
                type="text"
                value={formData.kodeRegistrasi}
                onChange={e => setFormData(p => ({ ...p, kodeRegistrasi: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Kepala Sekolah & Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kepala Sekolah (Definitif / Plt) *
              </label>
              <input
                type="text"
                required
                value={formData.kepalaSekolah}
                onChange={e => setFormData(p => ({ ...p, kepalaSekolah: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={e => setFormData(p => ({ ...p, nipKepalaSekolah: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Operator Pendataan Dapodik Sekolah *
            </label>
            <input
              type="text"
              required
              value={formData.operator}
              onChange={e => setFormData(p => ({ ...p, operator: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Alamat */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 block text-xs">
              Lokasi & Alamat Satuan Pendidikan
            </span>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Jalan & Nomor</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={e => setFormData(p => ({ ...p, alamat: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={e => setFormData(p => ({ ...p, kecamatan: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kab/Kota</label>
                <input
                  type="text"
                  value={formData.kabKota}
                  onChange={e => setFormData(p => ({ ...p, kabKota: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={e => setFormData(p => ({ ...p, provinsi: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={e => setFormData(p => ({ ...p, kodePos: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
