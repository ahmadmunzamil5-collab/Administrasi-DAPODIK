export interface SekolahProfile {
  npsn: string;
  nama: string;
  bentukPendidikan: 'SD' | 'SMP' | 'SMA' | 'SMK';
  status: 'Negeri' | 'Swasta';
  skIzinOperasional: string;
  tanggalSk: string;
  akreditasi: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
  alamat: string;
  rtRw: string;
  desaKelurahan: string;
  kecamatan: string;
  kabKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  operator: string;
  kodeRegistrasi: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  kurikulum: string;
}

export interface Tanah {
  id: string;
  nama: string;
  luas: number; // m²
  statusKepemilikan: 'Milik Sendiri' | 'Sewa' | 'Pinjam' | 'Pemerintah Daerah';
  noSertifikat: string;
  njop: number;
}

export interface Bangunan {
  id: string;
  tanahId: string;
  namaBangunan: string;
  jumlahLantai: number;
  luasTapak: number; // m²
  tahunDibangun: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat';
}

export interface Ruang {
  id: string;
  bangunanId: string;
  kodeRuang: string;
  namaRuang: string;
  jenisRuang: 
    | 'Ruang Teori/Kelas'
    | 'Laboratorium Komputer'
    | 'Laboratorium IPA'
    | 'Perpustakaan'
    | 'Ruang Guru'
    | 'Ruang Pimpinan/Kepsek'
    | 'Toilet/Sanitasi Siswa'
    | 'Toilet Guru'
    | 'Ruang UKS'
    | 'Ruang OSIS'
    | 'Ruang Praktik Kerja/Bengkel'
    | 'Gudang'
    | 'Lapangan Upacara/Olahraga';
  panjang: number; // m
  lebar: number; // m
  luas: number; // m²
  kapasitas: number; // orang
  lantaiKe: number;
  tingkatKerusakan: number; // 0 - 100%
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat';
  laikPakai: boolean;
  kerusakanDetail: {
    pondasi: number;
    struktur: number;
    atap: number;
    plafon: number;
    dinding: number;
    lantai: number;
    kusenPintuJendela: number;
    instalasiListrik: number;
  };
}

export interface SaranaAlat {
  id: string;
  ruangId: string;
  namaAlat: string;
  kategori: 'Perabot' | 'Peralatan Pendidikan' | 'Media Pendidikan' | 'Buku/Pustaka' | 'Perlengkapan Lain';
  jumlahTotal: number;
  jumlahLaik: number;
  jumlahRusak: number;
  kepemilikan: 'Milik' | 'Bukan Milik';
  spesifikasi?: string;
}

export interface PesertaDidik {
  id: string;
  nisn: string;
  nik: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  namaIbuKandung: string;
  namaAyah: string;
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  tingkat: number; // e.g. 10, 11, 12
  rombelId: string;
  namaRombel: string;
  statusSiswa: 'Aktif' | 'Mutasi Masuk' | 'Mutasi Keluar' | 'Lulus' | 'Dikeluarkan';
  penerimaPip: boolean;
  noKip?: string;
  alamat: string;
  telepon: string;
  email?: string;
  // Data Periodik
  tinggiBadan: number; // cm
  beratBadan: number; // kg
  jarakSekolahKm: number;
  waktuTempuhMenit: number;
  jumlahSaudaraKandung: number;
  anakKe: number;
  createdAt: string;
  updatedAt: string;
}

export interface GTK {
  id: string;
  namaLengkap: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  nik: string;
  nuptk?: string;
  nip?: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  jenisPtk: 
    | 'Guru Mapel'
    | 'Guru Kelas'
    | 'Guru BK'
    | 'Kepala Sekolah'
    | 'Tenaga Administrasi Sekolah'
    | 'Tenaga Perpustakaan'
    | 'Laboran'
    | 'Operator Dapodik'
    | 'Penjaga Sekolah'
    | 'Petugas Keamanan';
  kategoriPtk: 'Guru' | 'Tendik';
  statusKepegawaian: 'PNS' | 'PPPK' | 'Guru Tetap Yayasan' | 'Honorer Daerah' | 'Guru Honor Sekolah' | 'Tenaga Honorer';
  pendidikanTerakhir: 'D3' | 'S1/D4' | 'S2' | 'S3' | 'SMA/SMK';
  bidangStudiPendidikan: string;
  mapelUtama?: string;
  sertifikasiPendidik: boolean;
  noSertifikatPendidik?: string;
  nrg?: string;
  jamMengajarLinier: number;
  totalJamMengajar: number;
  statusKeaktifan: 'Aktif' | 'Cuti' | 'Pensiun' | 'Tugas Belajar' | 'Mutasi';
  email: string;
  telepon: string;
  alamat: string;
  createdAt: string;
  updatedAt: string;
}

export interface RombonganBelajar {
  id: string;
  namaRombel: string;
  tingkat: number;
  jurusanPeminatan: string;
  kurikulum: 'Kurikulum Merdeka' | 'Kurikulum 2013';
  waliKelasId: string;
  waliKelasNama: string;
  ruangId: string;
  ruangNama: string;
  jumlahSiswa: number;
}

export interface ValidasiItem {
  id: string;
  modul: 'Sekolah' | 'Sarpras' | 'Peserta Didik' | 'GTK' | 'Rombel';
  kategori: 'Invalid' | 'Warning';
  judul: string;
  keterangan: string;
  recordId?: string;
  recordNama?: string;
  field?: string;
  tindakanPerbaikan: string;
}

export interface SyncStep {
  stepId: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message: string;
  timestamp?: string;
  recordsCount?: number;
}

export interface SyncHistoryLog {
  id: string;
  tanggal: string;
  operator: string;
  status: 'Sukses' | 'Gagal' | 'Sebagian';
  sptjmId: string;
  serverChecksum: string;
  recordsSummary: {
    sarpras: number;
    pesertaDidik: number;
    gtk: number;
    rombel: number;
  };
  serverLatencyMs: number;
  pesanServer: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'sarpras'
  | 'peserta-didik'
  | 'gtk'
  | 'rombel'
  | 'validasi'
  | 'sinkronisasi';

export type UserRole = 'operator' | 'kepsek' | 'guru';

export interface AuthUser {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  nip?: string;
  nuptk?: string;
  loginTime: string;
}

export type ActivityActionType = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'SYNC' 
  | 'EXPORT' 
  | 'IMPORT' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'VALIDATION';

export type ActivityModul = 
  | 'Peserta Didik' 
  | 'Sarpras' 
  | 'GTK' 
  | 'Rombel' 
  | 'Sinkronisasi' 
  | 'Sistem' 
  | 'Autentikasi';

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  action: ActivityActionType;
  modul: ActivityModul;
  title: string;
  description: string;
  details?: Record<string, any>;
  status: 'Sukses' | 'Peringatan' | 'Gagal';
}
