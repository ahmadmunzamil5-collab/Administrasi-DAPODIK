import React from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Printer, 
  X, 
  Download, 
  ShieldCheck, 
  Building2, 
  QrCode 
} from 'lucide-react';
import { SyncHistoryLog } from '../types/dapodik';

export const SptjmModal: React.FC = () => {
  const { 
    sekolah, 
    isSptjmModalOpen, 
    setIsSptjmModalOpen, 
    selectedSptjmLog,
    pesertaDidikList,
    gtkList,
    ruangList,
    tanahList,
    rombelList
  } = useDapodik();

  if (!isSptjmModalOpen || !selectedSptjmLog) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalSiswa = pesertaDidikList.length;
  const siswaL = pesertaDidikList.filter(s => s.jenisKelamin === 'L').length;
  const siswaP = pesertaDidikList.filter(s => s.jenisKelamin === 'P').length;
  const siswaPip = pesertaDidikList.filter(s => s.penerimaPip).length;

  const totalGuru = gtkList.filter(g => g.kategoriPtk === 'Guru').length;
  const totalTendik = gtkList.filter(g => g.kategoriPtk === 'Tendik').length;
  const guruSertifikasi = gtkList.filter(g => g.sertifikasiPendidik).length;

  const ruangBaik = ruangList.filter(r => r.kondisi === 'Baik').length;
  const ruangRusak = ruangList.filter(r => r.kondisi !== 'Baik').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:p-0 print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Dokumen Resmi SPTJM Sinkronisasi Kemendikbudristek</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Cetak PDF</span>
            </button>
            <button
              onClick={() => setIsSptjmModalOpen(false)}
              className="text-white/80 hover:text-white p-1 font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT BODY */}
        <div className="p-8 sm:p-12 text-slate-900 font-serif leading-relaxed text-xs space-y-5 print:p-4">
          {/* Header Kop Surat Kementerian */}
          <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center font-bold text-lg font-sans">
                🇮🇩
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                  Kementerian Pendidikan Dasar dan Menengah Republik Indonesia
                </h4>
                <h3 className="font-sans font-extrabold text-sm uppercase tracking-wide text-slate-900">
                  Direktorat Jenderal Pendidikan Anak Usia Dini, Pendidikan Dasar dan Menengah
                </h3>
                <h2 className="font-sans font-black text-base text-slate-900 uppercase">
                  {sekolah.nama}
                </h2>
                <p className="font-sans text-[10px] text-slate-600">
                  {sekolah.alamat}, {sekolah.desaKelurahan}, Kec. {sekolah.kecamatan}, {sekolah.kabKota}, {sekolah.provinsi} {sekolah.kodePos} • Telp: {sekolah.telepon}
                </p>
              </div>
            </div>
          </div>

          {/* Judul SPTJM */}
          <div className="text-center space-y-1 pt-1">
            <h3 className="font-sans font-bold text-sm md:text-base uppercase underline tracking-wide">
              SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK (SPTJM)
            </h3>
            <p className="font-sans text-xs font-semibold">
              DATA POKOK PENDIDIKAN (DAPODIK) TAHUN AJARAN {sekolah.tahunAjaran} {sekolah.semester.toUpperCase()}
            </p>
            <p className="font-mono text-[11px] text-slate-600">
              Nomor Registrasi: <strong>{selectedSptjmLog.sptjmId}</strong>
            </p>
          </div>

          <p className="text-justify font-sans text-xs">
            Yang bertanda tangan di bawah ini:
          </p>

          <table className="w-full text-xs font-sans border-collapse">
            <tbody>
              <tr>
                <td className="w-44 py-1 text-slate-600">Nama Satuan Pendidikan</td>
                <td className="w-3 py-1">:</td>
                <td className="py-1 font-bold text-slate-900">{sekolah.nama}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">NPSN</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono font-bold">{sekolah.npsn}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Nama Kepala Sekolah</td>
                <td className="py-1">:</td>
                <td className="py-1 font-bold">{sekolah.kepalaSekolah}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">NIP Kepala Sekolah</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono">{sekolah.nipKepalaSekolah || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Operator Pendataan</td>
                <td className="py-1">:</td>
                <td className="py-1">{selectedSptjmLog.operator}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Waktu Sinkronisasi</td>
                <td className="py-1">:</td>
                <td className="py-1 font-medium">{selectedSptjmLog.tanggal}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Checksum Server SHA-256</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono text-[10px] break-all">{selectedSptjmLog.serverChecksum}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-justify font-sans text-xs leading-relaxed pt-1">
            Menyatakan dengan sesungguhnya bahwa seluruh data yang telah diinput dan disinkronkan ke dalam sistem Data Pokok Pendidikan (Dapodik) Kementerian Pendidikan Dasar dan Menengah adalah <strong>BENAR, SAH, DAN DAPAT DIPERTANGGUNGJAWABKAN</strong> sesuai dengan keadaan riil di satuan pendidikan.
          </p>

          {/* Rincian Rekapitulasi Data Terkirim */}
          <div className="font-sans pt-1">
            <h5 className="font-bold text-xs mb-1.5 uppercase text-slate-800">
              REKAPITULASI ENTITAS DATA YANG TELAH TERSINKRONISASI:
            </h5>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400 text-center font-bold">
                  <th className="py-1.5 px-2 border-r border-slate-400 w-10">No</th>
                  <th className="py-1.5 px-3 border-r border-slate-400 text-left">Entitas Modul Data</th>
                  <th className="py-1.5 px-3 border-r border-slate-400">Total Record</th>
                  <th className="py-1.5 px-3 text-left">Rincian Keterangan Entitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="py-1 px-2 text-center border-r border-slate-400">1</td>
                  <td className="py-1 px-3 font-semibold border-r border-slate-400">Peserta Didik (Siswa)</td>
                  <td className="py-1 px-3 text-center font-bold font-mono border-r border-slate-400">{totalSiswa}</td>
                  <td className="py-1 px-3 text-[11px]">
                    L: {siswaL} siswa, P: {siswaP} siswa, Penerima PIP: {siswaPip} siswa
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-center border-r border-slate-400">2</td>
                  <td className="py-1 px-3 font-semibold border-r border-slate-400">Pendidik (Guru)</td>
                  <td className="py-1 px-3 text-center font-bold font-mono border-r border-slate-400">{totalGuru}</td>
                  <td className="py-1 px-3 text-[11px]">
                    Tersertifikasi: {guruSertifikasi} guru, Beban Jam Linier &ge; 24 jam/mgg
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-center border-r border-slate-400">3</td>
                  <td className="py-1 px-3 font-semibold border-r border-slate-400">Tenaga Kependidikan</td>
                  <td className="py-1 px-3 text-center font-bold font-mono border-r border-slate-400">{totalTendik}</td>
                  <td className="py-1 px-3 text-[11px]">
                    TU, Tenaga Perpustakaan, Laboran, Operator Sekolah
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-center border-r border-slate-400">4</td>
                  <td className="py-1 px-3 font-semibold border-r border-slate-400">Sarana & Prasarana</td>
                  <td className="py-1 px-3 text-center font-bold font-mono border-r border-slate-400">{ruangList.length}</td>
                  <td className="py-1 px-3 text-[11px]">
                    {tanahList.length} Bidang Tanah, Ruang Baik: {ruangBaik}, Rusak: {ruangRusak}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-center border-r border-slate-400">5</td>
                  <td className="py-1 px-3 font-semibold border-r border-slate-400">Rombongan Belajar</td>
                  <td className="py-1 px-3 text-center font-bold font-mono border-r border-slate-400">{rombelList.length}</td>
                  <td className="py-1 px-3 text-[11px]">
                    Seluruh rombel memiliki Wali Kelas & Ruang pembelajaran
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-justify font-sans text-xs leading-relaxed">
            Apabila di kemudian hari ditemukan ketidakbenaran atau manipulasi data yang mengakibatkan kerugian negara (termasuk pada penyaluran BOSP, PIP, TPG, maupun DAK Fisik), kami bersedia menerima sanksi administratif dan/atau sanksi hukum sesuai ketentuan peraturan perundang-undangan yang berlaku.
          </p>

          {/* Signature & QR Verification */}
          <div className="pt-6 font-sans flex items-start justify-between text-xs">
            {/* Left QR Code Digital Seal */}
            <div className="text-center space-y-1.5">
              <div className="w-24 h-24 border-2 border-slate-900 p-1 flex items-center justify-center mx-auto bg-slate-50">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <p className="text-[9px] font-mono text-slate-500 max-w-[120px]">
                Validasi Digital Pusdatin Kemendikbud RI
              </p>
            </div>

            {/* Right Headmaster Signature */}
            <div className="text-center w-64 space-y-1">
              <p>{sekolah.kabKota}, {selectedSptjmLog.tanggal.slice(0, 10)}</p>
              <p className="font-semibold">Kepala {sekolah.nama}</p>
              
              {/* Stamp box */}
              <div className="h-16 flex items-center justify-center text-[10px] text-slate-400 italic">
                [ Tanda Tangan & Materai Digital ]
              </div>

              <p className="font-bold underline text-slate-900">{sekolah.kepalaSekolah}</p>
              <p className="text-[11px] font-mono text-slate-700">NIP: {sekolah.nipKepalaSekolah || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
