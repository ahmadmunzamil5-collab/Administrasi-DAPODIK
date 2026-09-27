import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  SekolahProfile, 
  Tanah, 
  Bangunan, 
  Ruang, 
  SaranaAlat, 
  PesertaDidik, 
  GTK, 
  RombonganBelajar,
  ValidasiItem,
  SyncHistoryLog,
  SyncStep,
  ActiveTab,
  AuthUser,
  UserRole,
  ActivityLog,
  ActivityActionType,
  ActivityModul
} from '../types/dapodik';
import { 
  initialSekolahProfile, 
  initialTanah, 
  initialBangunan, 
  initialRuang, 
  initialSaranaAlat, 
  initialPesertaDidik, 
  initialGTK, 
  initialRombel, 
  initialSyncLogs,
  demoUsers,
  initialActivityLogs
} from '../data/initialData';

interface DapodikContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Authentication
  currentUser: AuthUser | null;
  login: (email: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;

  // Activity Logging System
  activityLogs: ActivityLog[];
  logActivity: (
    action: ActivityActionType,
    modul: ActivityModul,
    title: string,
    description: string,
    status?: 'Sukses' | 'Peringatan' | 'Gagal',
    details?: Record<string, any>
  ) => void;
  clearActivityLogs: () => void;
  exportActivityLogs: () => void;

  // School data
  sekolah: SekolahProfile;
  updateSekolah: (profile: Partial<SekolahProfile>) => void;

  // Sarpras
  tanahList: Tanah[];
  bangunanList: Bangunan[];
  ruangList: Ruang[];
  saranaAlatList: SaranaAlat[];
  addTanah: (tanah: Omit<Tanah, 'id'>) => void;
  updateTanah: (id: string, tanah: Partial<Tanah>) => void;
  deleteTanah: (id: string) => void;
  addBangunan: (bgn: Omit<Bangunan, 'id'>) => void;
  updateBangunan: (id: string, bgn: Partial<Bangunan>) => void;
  deleteBangunan: (id: string) => void;
  addRuang: (ruang: Omit<Ruang, 'id'>) => void;
  updateRuang: (id: string, ruang: Partial<Ruang>) => void;
  deleteRuang: (id: string) => void;
  addSaranaAlat: (alat: Omit<SaranaAlat, 'id'>) => void;
  updateSaranaAlat: (id: string, alat: Partial<SaranaAlat>) => void;
  deleteSaranaAlat: (id: string) => void;

  // Peserta Didik
  pesertaDidikList: PesertaDidik[];
  addPesertaDidik: (pd: Omit<PesertaDidik, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePesertaDidik: (id: string, pd: Partial<PesertaDidik>) => void;
  deletePesertaDidik: (id: string) => void;

  // GTK
  gtkList: GTK[];
  addGTK: (gtk: Omit<GTK, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGTK: (id: string, gtk: Partial<GTK>) => void;
  deleteGTK: (id: string) => void;

  // Rombel
  rombelList: RombonganBelajar[];
  addRombel: (rombel: Omit<RombonganBelajar, 'id'>) => void;
  updateRombel: (id: string, rombel: Partial<RombonganBelajar>) => void;
  deleteRombel: (id: string) => void;

  // Validation
  validationResults: ValidasiItem[];
  invalidCount: number;
  warningCount: number;
  runValidation: () => void;

  // Sync state & action
  isSyncing: boolean;
  syncProgress: number;
  syncCurrentStep: string;
  syncSteps: SyncStep[];
  syncLogs: SyncHistoryLog[];
  unsyncedChangesCount: number;
  lastSyncTimestamp: string;
  realtimeSyncEnabled: boolean;
  setRealtimeSyncEnabled: (val: boolean) => void;
  serverStatus: 'online' | 'slow' | 'offline';
  serverLatency: number;
  startFullSync: () => Promise<boolean>;
  cancelSync: () => void;

  // Modals
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (val: boolean) => void;
  isSptjmModalOpen: boolean;
  setIsSptjmModalOpen: (val: boolean) => void;
  selectedSptjmLog: SyncHistoryLog | null;
  setSelectedSptjmLog: (log: SyncHistoryLog | null) => void;
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (val: boolean) => void;

  // Global Actions
  resetToInitialData: () => void;
  triggerSampleInvalidData: () => void;
  fixAllInvalidData: () => void;
}

const STORAGE_KEY = 'DAPODIK_STORAGE_V1';

const DapodikContext = createContext<DapodikContextType | null>(null);

export const DapodikProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Load from local storage or defaults
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  };

  const initial = useMemo(() => loadSavedData(), []);

  const [sekolah, setSekolah] = useState<SekolahProfile>(initial?.sekolah || initialSekolahProfile);
  const [tanahList, setTanahList] = useState<Tanah[]>(initial?.tanahList || initialTanah);
  const [bangunanList, setBangunanList] = useState<Bangunan[]>(initial?.bangunanList || initialBangunan);
  const [ruangList, setRuangList] = useState<Ruang[]>(initial?.ruangList || initialRuang);
  const [saranaAlatList, setSaranaAlatList] = useState<SaranaAlat[]>(initial?.saranaAlatList || initialSaranaAlat);
  const [pesertaDidikList, setPesertaDidikList] = useState<PesertaDidik[]>(initial?.pesertaDidikList || initialPesertaDidik);
  const [gtkList, setGtkList] = useState<GTK[]>(initial?.gtkList || initialGTK);
  const [rombelList, setRombelList] = useState<RombonganBelajar[]>(initial?.rombelList || initialRombel);
  const [syncLogs, setSyncLogs] = useState<SyncHistoryLog[]>(initial?.syncLogs || initialSyncLogs);
  
  // Authentication & Activity Logs
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    initial?.currentUser !== undefined ? initial.currentUser : demoUsers.operator
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(
    initial?.activityLogs || initialActivityLogs
  );

  const [unsyncedChangesCount, setUnsyncedChangesCount] = useState<number>(initial?.unsyncedChangesCount || 0);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>(
    initial?.lastSyncTimestamp || '2026-09-24 14:32:18 WIB'
  );
  const [realtimeSyncEnabled, setRealtimeSyncEnabled] = useState<boolean>(
    initial?.realtimeSyncEnabled !== undefined ? initial.realtimeSyncEnabled : true
  );

  // Sync animation states
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncCurrentStep, setSyncCurrentStep] = useState<string>('');
  const [syncSteps, setSyncSteps] = useState<SyncStep[]>([]);
  const [syncAborted, setSyncAborted] = useState<boolean>(false);

  // Server health simulation
  const [serverStatus] = useState<'online' | 'slow' | 'offline'>('online');
  const [serverLatency, setServerLatency] = useState<number>(32);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSptjmModalOpen, setIsSptjmModalOpen] = useState(false);
  const [selectedSptjmLog, setSelectedSptjmLog] = useState<SyncHistoryLog | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    const dataToSave = {
      sekolah,
      tanahList,
      bangunanList,
      ruangList,
      saranaAlatList,
      pesertaDidikList,
      gtkList,
      rombelList,
      syncLogs,
      unsyncedChangesCount,
      lastSyncTimestamp,
      realtimeSyncEnabled,
      currentUser,
      activityLogs
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [
    sekolah,
    tanahList,
    bangunanList,
    ruangList,
    saranaAlatList,
    pesertaDidikList,
    gtkList,
    rombelList,
    syncLogs,
    unsyncedChangesCount,
    lastSyncTimestamp,
    realtimeSyncEnabled,
    currentUser,
    activityLogs
  ]);

  // Activity Logger helper
  const logActivity = useCallback((
    action: ActivityActionType,
    modul: ActivityModul,
    title: string,
    description: string,
    status: 'Sukses' | 'Peringatan' | 'Gagal' = 'Sukses',
    details?: Record<string, any>
  ) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;

    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      userName: currentUser?.nama || 'Operator Sekolah',
      userRole: currentUser?.role || 'operator',
      userEmail: currentUser?.email || 'operator@dapodik.id',
      action,
      modul,
      title,
      description,
      status,
      details
    };

    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]); // keep up to 100 recent actions
  }, [currentUser]);

  // Authentication methods
  const login = (email: string, _password?: string, role: UserRole = 'operator'): boolean => {
    const matched = Object.values(demoUsers).find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      nama: email.split('@')[0].toUpperCase(),
      email,
      role,
      roleLabel: role === 'kepsek' ? 'Kepala Satuan Pendidikan' : role === 'guru' ? 'Pendidik / Guru' : 'Operator Dapodik',
      loginTime: new Date().toLocaleTimeString('id-ID')
    };

    const userToSet: AuthUser = {
      ...matched,
      role: role || matched.role,
      roleLabel: role === 'kepsek' ? 'Kepala Satuan Pendidikan' : role === 'guru' ? 'Pendidik / Guru' : 'Operator Dapodik',
      loginTime: new Date().toLocaleTimeString('id-ID')
    };

    setCurrentUser(userToSet);

    // Record activity log
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      userName: userToSet.nama,
      userRole: userToSet.role,
      userEmail: userToSet.email,
      action: 'LOGIN',
      modul: 'Autentikasi',
      title: 'Masuk ke Sistem Dapodik',
      description: `Pengguna berhasil login sebagai ${userToSet.roleLabel} (${userToSet.email}).`,
      status: 'Sukses'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    return true;
  };

  const logout = () => {
    if (currentUser) {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        userName: currentUser.nama,
        userRole: currentUser.role,
        userEmail: currentUser.email,
        action: 'LOGOUT',
        modul: 'Autentikasi',
        title: 'Keluar dari Sistem Dapodik',
        description: `Pengguna ${currentUser.nama} (${currentUser.roleLabel}) telah mengakhiri sesi.`,
        status: 'Sukses'
      };
      setActivityLogs(prev => [newLog, ...prev]);
    }
    setCurrentUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = demoUsers[role];
    if (targetUser) {
      setCurrentUser(targetUser);
      logActivity(
        'LOGIN',
        'Autentikasi',
        'Beralih Peran Pengguna',
        `Beralih ke akun ${targetUser.roleLabel} (${targetUser.nama}).`
      );
    }
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
  };

  const exportActivityLogs = () => {
    const headers = ['Waktu', 'Pengguna', 'Peran', 'Email', 'Aksi', 'Modul', 'Judul', 'Keterangan', 'Status'];
    const rows = activityLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.userEmail}"`,
      `"${l.action}"`,
      `"${l.modul}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dapodik_Activity_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Jitter ping latency slightly to feel live
  useEffect(() => {
    const interval = setInterval(() => {
      setServerLatency(prev => {
        const jitter = Math.floor(Math.random() * 9) - 4;
        const next = prev + jitter;
        return Math.min(Math.max(next, 20), 55);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Record an unsynced modification
  const markChanged = useCallback(() => {
    setUnsyncedChangesCount(prev => prev + 1);
  }, []);

  // Validation Engine
  const validationResults = useMemo<ValidasiItem[]>(() => {
    const results: ValidasiItem[] = [];

    // 1. Sekolah
    if (!sekolah.npsn || sekolah.npsn.length !== 8) {
      results.push({
        id: 'val-sch-01',
        modul: 'Sekolah',
        kategori: 'Invalid',
        judul: 'NPSN Tidak Valid',
        keterangan: 'Nomor Pokok Sekolah Nasional (NPSN) harus tepat 8 digit angka terdaftar.',
        field: 'npsn',
        tindakanPerbaikan: 'Buka menu Profil Sekolah lalu sesuaikan nomor NPSN 8 digit resmi.'
      });
    }
    if (!sekolah.skIzinOperasional || sekolah.skIzinOperasional.trim() === '') {
      results.push({
        id: 'val-sch-02',
        modul: 'Sekolah',
        kategori: 'Invalid',
        judul: 'Nomor SK Izin Operasional Kosong',
        keterangan: 'SK pendirian / izin operasional sekolah dari Dinas Pendidikan wajib diisi.',
        field: 'skIzinOperasional',
        tindakanPerbaikan: 'Lengkapi nomor SK izin operasional pada Profil Sekolah.'
      });
    }
    if (!sekolah.kepalaSekolah || sekolah.kepalaSekolah.trim() === '') {
      results.push({
        id: 'val-sch-03',
        modul: 'Sekolah',
        kategori: 'Invalid',
        judul: 'Kepala Sekolah Belum Ditentukan',
        keterangan: 'Satuan pendidikan wajib memiliki Kepala Sekolah definitif atau Plt.',
        field: 'kepalaSekolah',
        tindakanPerbaikan: 'Pilih Kepala Sekolah pada profil satuan pendidikan.'
      });
    }

    // 2. Sarpras
    ruangList.forEach(ruang => {
      if (ruang.luas <= 0 || ruang.panjang <= 0 || ruang.lebar <= 0) {
        results.push({
          id: `val-rng-luas-${ruang.id}`,
          modul: 'Sarpras',
          kategori: 'Invalid',
          judul: `Dimensi Ruang ${ruang.namaRuang} Tidak Valid`,
          keterangan: `Panjang (${ruang.panjang}m), lebar (${ruang.lebar}m), atau luas (${ruang.luas}m²) tidak boleh 0.`,
          recordId: ruang.id,
          recordNama: ruang.namaRuang,
          field: 'panjang/lebar/luas',
          tindakanPerbaikan: 'Perbarui ukuran panjang dan lebar ruang pada data Sarpras.'
        });
      }

      if (ruang.tingkatKerusakan >= 65 && ruang.laikPakai) {
        results.push({
          id: `val-rng-rusak-${ruang.id}`,
          modul: 'Sarpras',
          kategori: 'Warning',
          judul: `Ruang Rusak Berat Masih Berstatus Laik Pakai (${ruang.namaRuang})`,
          keterangan: `Tingkat kerusakan mencapai ${ruang.tingkatKerusakan}%. Pastikan keselamatan peserta didik dan kelayakan ruang diperiksa kembali.`,
          recordId: ruang.id,
          recordNama: ruang.namaRuang,
          tindakanPerbaikan: 'Cek kondisi fisik ruang atau update status kelayakan pakai.'
        });
      }
    });

    if (tanahList.length === 0) {
      results.push({
        id: 'val-tnh-empty',
        modul: 'Sarpras',
        kategori: 'Invalid',
        judul: 'Data Tanah Sekolah Kosong',
        keterangan: 'Sekolah minimal harus memiliki 1 data bidang tanah tempat bangunan berdiri.',
        tindakanPerbaikan: 'Tambahkan data bidang tanah pada modul Sarana dan Prasarana.'
      });
    }

    // 3. Peserta Didik
    pesertaDidikList.forEach(pd => {
      if (pd.statusSiswa === 'Aktif') {
        if (!pd.nisn || pd.nisn.length !== 10) {
          results.push({
            id: `val-pd-nisn-${pd.id}`,
            modul: 'Peserta Didik',
            kategori: 'Invalid',
            judul: `NISN Tidak Valid: ${pd.nama}`,
            keterangan: `NISN "${pd.nisn}" tidak memenuhi syarat panjang 10 digit angka standar Pusdatin.`,
            recordId: pd.id,
            recordNama: pd.nama,
            field: 'nisn',
            tindakanPerbaikan: 'Sesuaikan NISN 10 digit berdasarkan arsip Ijazah SMP/SD.'
          });
        }

        if (!pd.nik || pd.nik.length !== 16) {
          results.push({
            id: `val-pd-nik-${pd.id}`,
            modul: 'Peserta Didik',
            kategori: 'Invalid',
            judul: `NIK Tidak Valid: ${pd.nama}`,
            keterangan: `Nomor Induk Kependudukan (NIK) harus 16 digit sesuai Kartu Keluarga (KK).`,
            recordId: pd.id,
            recordNama: pd.nama,
            field: 'nik',
            tindakanPerbaikan: 'Periksa NIK di Kartu Keluarga calon peserta didik.'
          });
        }

        if (!pd.namaIbuKandung || pd.namaIbuKandung.trim() === '') {
          results.push({
            id: `val-pd-ibu-${pd.id}`,
            modul: 'Peserta Didik',
            kategori: 'Invalid',
            judul: `Nama Ibu Kandung Kosong: ${pd.nama}`,
            keterangan: 'Nama ibu kandung adalah identitas primer untuk integrasi Dukcapil Kemendikbud.',
            recordId: pd.id,
            recordNama: pd.nama,
            field: 'namaIbuKandung',
            tindakanPerbaikan: 'Isi nama ibu kandung sesuai Akta Kelahiran/Kartu Keluarga.'
          });
        }

        if (!pd.rombelId) {
          results.push({
            id: `val-pd-rombel-${pd.id}`,
            modul: 'Peserta Didik',
            kategori: 'Invalid',
            judul: `Siswa Belum Memiliki Rombel: ${pd.nama}`,
            keterangan: 'Peserta didik aktif wajib dimasukkan ke dalam salah satu Rombongan Belajar.',
            recordId: pd.id,
            recordNama: pd.nama,
            tindakanPerbaikan: 'Daftarkan siswa ke dalam rombel kelas yang sesuai.'
          });
        }

        if (pd.tinggiBadan <= 0 || pd.beratBadan <= 0) {
          results.push({
            id: `val-pd-periodik-${pd.id}`,
            modul: 'Peserta Didik',
            kategori: 'Warning',
            judul: `Data Periodik Belum Lengkap: ${pd.nama}`,
            keterangan: 'Tinggi badan dan berat badan belum diisi (masih bernilai 0).',
            recordId: pd.id,
            recordNama: pd.nama,
            tindakanPerbaikan: 'Lengkapi data fisik periodik semester ini di tab Peserta Didik.'
          });
        }
      }
    });

    // 4. GTK
    gtkList.forEach(gtk => {
      if (gtk.statusKeaktifan === 'Aktif') {
        if (!gtk.nik || gtk.nik.length !== 16) {
          results.push({
            id: `val-gtk-nik-${gtk.id}`,
            modul: 'GTK',
            kategori: 'Invalid',
            judul: `NIK GTK Tidak Valid: ${gtk.namaLengkap}`,
            keterangan: `NIK GTK harus 16 digit. NIK saat ini: ${gtk.nik || '(kosong)'}`,
            recordId: gtk.id,
            recordNama: gtk.namaLengkap,
            field: 'nik',
            tindakanPerbaikan: 'Lengkapi NIK GTK sesuai e-KTP.'
          });
        }

        if (gtk.kategoriPtk === 'Guru' && gtk.jenisPtk !== 'Kepala Sekolah') {
          if (gtk.sertifikasiPendidik && gtk.jamMengajarLinier < 24) {
            results.push({
              id: `val-gtk-linier-${gtk.id}`,
              modul: 'GTK',
              kategori: 'Warning',
              judul: `Beban Jam Linier Kurang dari 24 Jam: ${gtk.namaLengkap}`,
              keterangan: `Guru tersertifikasi membutuhkan minimal 24 jam tatap muka linier/minggu. Saat ini terisi ${gtk.jamMengajarLinier} jam.`,
              recordId: gtk.id,
              recordNama: gtk.namaLengkap,
              tindakanPerbaikan: 'Atur jadwal pembagian jam mengajar atau tambahkan tugas ekuivalen.'
            });
          }
        }
      }
    });

    // 5. Rombel
    rombelList.forEach(rombel => {
      if (!rombel.waliKelasId) {
        results.push({
          id: `val-rmb-wali-${rombel.id}`,
          modul: 'Rombel',
          kategori: 'Invalid',
          judul: `Rombel Tanpa Wali Kelas: ${rombel.namaRombel}`,
          keterangan: 'Setiap rombongan belajar wajib memiliki Wali Kelas yang ditugaskan.',
          recordId: rombel.id,
          recordNama: rombel.namaRombel,
          tindakanPerbaikan: 'Tetapkan salah satu guru sebagai wali kelas pada menu Rombel.'
        });
      }
      if (!rombel.ruangId) {
        results.push({
          id: `val-rmb-ruang-${rombel.id}`,
          modul: 'Rombel',
          kategori: 'Warning',
          judul: `Ruang Kelas Belum Dialokasikan: ${rombel.namaRombel}`,
          keterangan: 'Rombel sebaiknya memiliki alokasi ruang pembelajaran tetap.',
          recordId: rombel.id,
          recordNama: rombel.namaRombel,
          tindakanPerbaikan: 'Tautkan rombel ke salah satu ruang teori di menu Rombel.'
        });
      }
    });

    return results;
  }, [sekolah, tanahList, ruangList, pesertaDidikList, gtkList, rombelList]);

  const invalidCount = useMemo(() => {
    return validationResults.filter(r => r.kategori === 'Invalid').length;
  }, [validationResults]);

  const warningCount = useMemo(() => {
    return validationResults.filter(r => r.kategori === 'Warning').length;
  }, [validationResults]);

  const runValidation = () => {
    // triggers re-evaluation
    setServerLatency(prev => prev + 1);
  };

  // Real-time synchronization background trigger simulation
  useEffect(() => {
    if (!realtimeSyncEnabled || unsyncedChangesCount === 0 || isSyncing) return;

    // Debounce 4 seconds after user stops editing
    const timer = setTimeout(() => {
      // Auto-sync delta quietly
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;
      
      const checksumPart = Math.random().toString(36).substring(2, 10);
      const newLog: SyncHistoryLog = {
        id: `sync-auto-${Date.now()}`,
        tanggal: timeStr,
        operator: `${sekolah.operator} (Real-time Daemon)`,
        status: 'Sukses',
        sptjmId: `SPTJM-${sekolah.npsn}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 900 + 100))}`,
        serverChecksum: `auto-delta-${checksumPart}e9921bc4`,
        recordsSummary: {
          sarpras: ruangList.length + tanahList.length + bangunanList.length,
          pesertaDidik: pesertaDidikList.length,
          gtk: gtkList.length,
          rombel: rombelList.length
        },
        serverLatencyMs: Math.floor(Math.random() * 15 + 25),
        pesanServer: `Delta sinkronisasi real-time berhasil diproses (${unsyncedChangesCount} perubahan terkirim). Hash valid.`
      };

      setSyncLogs(prev => [newLog, ...prev]);
      setLastSyncTimestamp(timeStr);
      setUnsyncedChangesCount(0);
    }, 4500);

    return () => clearTimeout(timer);
  }, [
    unsyncedChangesCount, 
    realtimeSyncEnabled, 
    isSyncing, 
    sekolah, 
    tanahList.length, 
    bangunanList.length, 
    ruangList.length, 
    pesertaDidikList.length, 
    gtkList.length, 
    rombelList.length
  ]);

  // Full Manual Sync Execution
  const startFullSync = async (): Promise<boolean> => {
    if (invalidCount > 0) {
      return false; // cannot sync with invalid data
    }

    setIsSyncing(true);
    setSyncProgress(0);
    setSyncAborted(false);

    const stepsDefinition: SyncStep[] = [
      { stepId: 'step-1', name: 'Validasi Integritas Data Lokal', status: 'pending', message: 'Memeriksa kevalidan 0 data invalid...' },
      { stepId: 'step-2', name: 'Handshake & Autentikasi Server Pusat', status: 'pending', message: `Menghubungi gateway Pusdatin Kemendikbud (${sekolah.npsn})...` },
      { stepId: 'step-3', name: 'Sinkronisasi Paket Sarana & Prasarana', status: 'pending', message: `Mengirim ${tanahList.length} tanah, ${bangunanList.length} bangunan, ${ruangList.length} ruang...` },
      { stepId: 'step-4', name: 'Sinkronisasi Paket Peserta Didik & Rombel', status: 'pending', message: `Mengunggah ${pesertaDidikList.length} siswa dan ${rombelList.length} rombel...` },
      { stepId: 'step-5', name: 'Sinkronisasi Paket Guru & Tenaga Kependidikan', status: 'pending', message: `Mengirim ${gtkList.length} GTK dan beban jam linier...` },
      { stepId: 'step-6', name: 'Unduh Referensi & Surat Keputusan Pusat', status: 'pending', message: 'Mengunduh referensi kurikulum & status SK BOSP/PIP...' },
      { stepId: 'step-7', name: 'Finalisasi & Penerbitan SPTJM Resmi', status: 'pending', message: 'Menghasilkan checksum kriptografis SHA-256 dan token valid...' }
    ];

    setSyncSteps(stepsDefinition);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < stepsDefinition.length; i++) {
      if (syncAborted) {
        setIsSyncing(false);
        return false;
      }

      const current = stepsDefinition[i];
      setSyncCurrentStep(current.name);
      
      // Mark current in progress
      setSyncSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'in_progress', timestamp: new Date().toLocaleTimeString() } : s));
      
      const stepDuration = 800 + Math.random() * 600;
      await delay(stepDuration);

      // Increment progress
      const targetProgress = Math.round(((i + 1) / stepsDefinition.length) * 100);
      setSyncProgress(targetProgress);

      // Mark completed
      setSyncSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed', timestamp: new Date().toLocaleTimeString() } : s));
    }

    // Success log creation
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newSptjmId = `SPTJM-${sekolah.npsn}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000 + 1000))}`;

    const newLog: SyncHistoryLog = {
      id: `sync-full-${Date.now()}`,
      tanggal: dateFormatted,
      operator: sekolah.operator,
      status: 'Sukses',
      sptjmId: newSptjmId,
      serverChecksum: randomHex,
      recordsSummary: {
        sarpras: tanahList.length + bangunanList.length + ruangList.length + saranaAlatList.length,
        pesertaDidik: pesertaDidikList.length,
        gtk: gtkList.length,
        rombel: rombelList.length
      },
      serverLatencyMs: serverLatency,
      pesanServer: 'Sinkronisasi Penuh Berhasil! Server Pusdatin Kemendikbudristek telah mencatat seluruh entitas satuan pendidikan.'
    };

    setSyncLogs(prev => [newLog, ...prev]);
    setLastSyncTimestamp(dateFormatted);
    setUnsyncedChangesCount(0);
    setIsSyncing(false);
    setSelectedSptjmLog(newLog);

    logActivity(
      'SYNC',
      'Sinkronisasi',
      'Transmisi Data 7-Fase Berhasil',
      `Sinkronisasi manual berhasil dikirim ke Pusdatin (${pesertaDidikList.length} siswa, ${gtkList.length} GTK, ${ruangList.length} ruang). Checksum valid.`,
      'Sukses',
      { sptjmId: newSptjmId }
    );

    return true;
  };

  const cancelSync = () => {
    setSyncAborted(true);
    setIsSyncing(false);
    setSyncCurrentStep('Sinkronisasi dibatalkan pengguna.');
    logActivity('SYNC', 'Sinkronisasi', 'Sinkronisasi Dibatalkan', 'Proses sinkronisasi dihentikan oleh pengguna.', 'Peringatan');
  };

  // CRUD Implementations
  const updateSekolah = (profile: Partial<SekolahProfile>) => {
    setSekolah(prev => ({ ...prev, ...profile }));
    markChanged();
    logActivity('UPDATE', 'Sistem', 'Pembaruan Profil Sekolah', `Memperbarui profil ${profile.nama || sekolah.nama} (NPSN: ${profile.npsn || sekolah.npsn}).`);
  };

  // Tanah
  const addTanah = (item: Omit<Tanah, 'id'>) => {
    const newItem: Tanah = { ...item, id: `tanah-${Date.now()}` };
    setTanahList(prev => [...prev, newItem]);
    markChanged();
    logActivity('CREATE', 'Sarpras', 'Penambahan Data Tanah', `Menambahkan bidang tanah baru: ${item.nama} (${item.luas} m²).`);
  };
  const updateTanah = (id: string, partial: Partial<Tanah>) => {
    setTanahList(prev => prev.map(t => t.id === id ? { ...t, ...partial } : t));
    markChanged();
    logActivity('UPDATE', 'Sarpras', 'Pembaruan Data Tanah', `Memperbarui informasi bidang tanah ID ${id}.`);
  };
  const deleteTanah = (id: string) => {
    const item = tanahList.find(t => t.id === id);
    setTanahList(prev => prev.filter(t => t.id !== id));
    markChanged();
    logActivity('DELETE', 'Sarpras', 'Penghapusan Data Tanah', `Menghapus bidang tanah: ${item?.nama || id}.`);
  };

  // Bangunan
  const addBangunan = (item: Omit<Bangunan, 'id'>) => {
    const newItem: Bangunan = { ...item, id: `bgn-${Date.now()}` };
    setBangunanList(prev => [...prev, newItem]);
    markChanged();
    logActivity('CREATE', 'Sarpras', 'Penambahan Gedung/Bangunan', `Menambahkan gedung baru: ${item.namaBangunan}.`);
  };
  const updateBangunan = (id: string, partial: Partial<Bangunan>) => {
    setBangunanList(prev => prev.map(b => b.id === id ? { ...b, ...partial } : b));
    markChanged();
    logActivity('UPDATE', 'Sarpras', 'Pembaruan Gedung/Bangunan', `Memperbarui informasi gedung ID ${id}.`);
  };
  const deleteBangunan = (id: string) => {
    const item = bangunanList.find(b => b.id === id);
    setBangunanList(prev => prev.filter(b => b.id !== id));
    markChanged();
    logActivity('DELETE', 'Sarpras', 'Penghapusan Gedung/Bangunan', `Menghapus gedung: ${item?.namaBangunan || id}.`);
  };

  // Ruang
  const addRuang = (item: Omit<Ruang, 'id'>) => {
    const newItem: Ruang = { ...item, id: `rng-${Date.now()}` };
    setRuangList(prev => [...prev, newItem]);
    markChanged();
    logActivity('CREATE', 'Sarpras', 'Penambahan Ruang Baru', `Menambahkan ruang: ${item.namaRuang} (${item.jenisRuang}, ${item.luas} m²).`);
  };
  const updateRuang = (id: string, partial: Partial<Ruang>) => {
    setRuangList(prev => prev.map(r => r.id === id ? { ...r, ...partial } : r));
    markChanged();
    logActivity('UPDATE', 'Sarpras', 'Pembaruan Kondisi Ruang', `Memperbarui ruang: ${partial.namaRuang || id} (Kerusakan: ${partial.tingkatKerusakan}%).`);
  };
  const deleteRuang = (id: string) => {
    const item = ruangList.find(r => r.id === id);
    setRuangList(prev => prev.filter(r => r.id !== id));
    markChanged();
    logActivity('DELETE', 'Sarpras', 'Penghapusan Ruang', `Menghapus ruang: ${item?.namaRuang || id}.`);
  };

  // Sarana Alat
  const addSaranaAlat = (item: Omit<SaranaAlat, 'id'>) => {
    const newItem: SaranaAlat = { ...item, id: `alat-${Date.now()}` };
    setSaranaAlatList(prev => [...prev, newItem]);
    markChanged();
    logActivity('CREATE', 'Sarpras', 'Penambahan Alat/Inventaris', `Mendata ${item.jumlahTotal} unit ${item.namaAlat}.`);
  };
  const updateSaranaAlat = (id: string, partial: Partial<SaranaAlat>) => {
    setSaranaAlatList(prev => prev.map(a => a.id === id ? { ...a, ...partial } : a));
    markChanged();
    logActivity('UPDATE', 'Sarpras', 'Pembaruan Sarana Alat', `Memperbarui sarana alat ${partial.namaAlat || id}.`);
  };
  const deleteSaranaAlat = (id: string) => {
    const item = saranaAlatList.find(a => a.id === id);
    setSaranaAlatList(prev => prev.filter(a => a.id !== id));
    markChanged();
    logActivity('DELETE', 'Sarpras', 'Penghapusan Sarana Alat', `Menghapus sarana alat: ${item?.namaAlat || id}.`);
  };

  // Peserta Didik
  const addPesertaDidik = (item: Omit<PesertaDidik, 'id' | 'createdAt' | 'updatedAt'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newItem: PesertaDidik = {
      ...item,
      id: `pd-${Date.now()}`,
      createdAt: dateStr,
      updatedAt: dateStr
    };
    setPesertaDidikList(prev => [newItem, ...prev]);
    markChanged();
    logActivity('CREATE', 'Peserta Didik', 'Registrasi Peserta Didik Baru', `Mendaftarkan siswa: ${item.nama} (NISN: ${item.nisn}, Rombel: ${item.namaRombel}).`);
  };
  const updatePesertaDidik = (id: string, partial: Partial<PesertaDidik>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    setPesertaDidikList(prev => prev.map(p => p.id === id ? { ...p, ...partial, updatedAt: dateStr } : p));
    markChanged();
    logActivity('UPDATE', 'Peserta Didik', 'Pembaruan Biodata Siswa', `Memperbarui biodata siswa: ${partial.nama || id}.`);
  };
  const deletePesertaDidik = (id: string) => {
    const item = pesertaDidikList.find(p => p.id === id);
    setPesertaDidikList(prev => prev.filter(p => p.id !== id));
    markChanged();
    logActivity('DELETE', 'Peserta Didik', 'Penghapusan/Mutasi Siswa', `Menghapus peserta didik: ${item?.nama || id} (NISN: ${item?.nisn}).`);
  };

  // GTK
  const addGTK = (item: Omit<GTK, 'id' | 'createdAt' | 'updatedAt'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newItem: GTK = {
      ...item,
      id: `gtk-${Date.now()}`,
      createdAt: dateStr,
      updatedAt: dateStr
    };
    setGtkList(prev => [newItem, ...prev]);
    markChanged();
    logActivity('CREATE', 'GTK', 'Penambahan Pegawai GTK', `Menambahkan ${item.kategoriPtk}: ${item.namaLengkap} (${item.jenisPtk}).`);
  };
  const updateGTK = (id: string, partial: Partial<GTK>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    setGtkList(prev => prev.map(g => g.id === id ? { ...g, ...partial, updatedAt: dateStr } : g));
    markChanged();
    logActivity('UPDATE', 'GTK', 'Pembaruan Data GTK', `Memperbarui data GTK: ${partial.namaLengkap || id}.`);
  };
  const deleteGTK = (id: string) => {
    const item = gtkList.find(g => g.id === id);
    setGtkList(prev => prev.filter(g => g.id !== id));
    markChanged();
    logActivity('DELETE', 'GTK', 'Penghapusan Pegawai GTK', `Menghapus data GTK: ${item?.namaLengkap || id}.`);
  };

  // Rombel
  const addRombel = (item: Omit<RombonganBelajar, 'id'>) => {
    const newItem: RombonganBelajar = { ...item, id: `rmb-${Date.now()}` };
    setRombelList(prev => [...prev, newItem]);
    markChanged();
    logActivity('CREATE', 'Rombel', 'Pembentukan Rombel Baru', `Membentuk rombel: ${item.namaRombel} (Wali: ${item.waliKelasNama}).`);
  };
  const updateRombel = (id: string, partial: Partial<RombonganBelajar>) => {
    setRombelList(prev => prev.map(r => r.id === id ? { ...r, ...partial } : r));
    markChanged();
    logActivity('UPDATE', 'Rombel', 'Pembaruan Data Rombel', `Memperbarui rombel: ${partial.namaRombel || id}.`);
  };
  const deleteRombel = (id: string) => {
    const item = rombelList.find(r => r.id === id);
    setRombelList(prev => prev.filter(r => r.id !== id));
    markChanged();
    logActivity('DELETE', 'Rombel', 'Penghapusan Rombel', `Menghapus rombel: ${item?.namaRombel || id}.`);
  };

  // Reset to default
  const resetToInitialData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSekolah(initialSekolahProfile);
    setTanahList(initialTanah);
    setBangunanList(initialBangunan);
    setRuangList(initialRuang);
    setSaranaAlatList(initialSaranaAlat);
    setPesertaDidikList(initialPesertaDidik);
    setGtkList(initialGTK);
    setRombelList(initialRombel);
    setSyncLogs(initialSyncLogs);
    setUnsyncedChangesCount(0);
  };

  // Testing tools for user: inject invalid record to test pre-sync validation block
  const triggerSampleInvalidData = () => {
    // inject a student with invalid NISN & NIK
    const invalidStudent: PesertaDidik = {
      id: `pd-invalid-${Date.now()}`,
      nisn: '123', // invalid length
      nik: '327311', // invalid length
      nama: 'Contoh Siswa Data Belum Lengkap (Uji Validasi)',
      jenisKelamin: 'L',
      tempatLahir: 'Bandung',
      tanggalLahir: '2008-01-01',
      namaIbuKandung: '', // empty
      namaAyah: 'Herman',
      agama: 'Islam',
      tingkat: 10,
      rombelId: '', // no rombel
      namaRombel: '',
      statusSiswa: 'Aktif',
      penerimaPip: false,
      alamat: 'Jl. Riau No. 12',
      telepon: '08123456789',
      tinggiBadan: 0,
      beratBadan: 0,
      jarakSekolahKm: 1,
      waktuTempuhMenit: 10,
      jumlahSaudaraKandung: 0,
      anakKe: 1,
      createdAt: '2026-09-27',
      updatedAt: '2026-09-27'
    };
    setPesertaDidikList(prev => [invalidStudent, ...prev]);
    markChanged();
  };

  // Fix all invalid test items
  const fixAllInvalidData = () => {
    setPesertaDidikList(prev => prev.filter(p => !p.id.startsWith('pd-invalid')));
    setSekolah(prev => ({
      ...prev,
      npsn: prev.npsn.length === 8 ? prev.npsn : '20219845',
      skIzinOperasional: prev.skIzinOperasional || '421.5/1042-Disdik/2008',
      kepalaSekolah: prev.kepalaSekolah || 'Dr. H. Bambang Sudarmono, M.Pd.'
    }));
    markChanged();
  };

  return (
    <DapodikContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        login,
        logout,
        switchUserRole,
        activityLogs,
        logActivity,
        clearActivityLogs,
        exportActivityLogs,
        sekolah,
        updateSekolah,
        tanahList,
        bangunanList,
        ruangList,
        saranaAlatList,
        addTanah,
        updateTanah,
        deleteTanah,
        addBangunan,
        updateBangunan,
        deleteBangunan,
        addRuang,
        updateRuang,
        deleteRuang,
        addSaranaAlat,
        updateSaranaAlat,
        deleteSaranaAlat,
        pesertaDidikList,
        addPesertaDidik,
        updatePesertaDidik,
        deletePesertaDidik,
        gtkList,
        addGTK,
        updateGTK,
        deleteGTK,
        rombelList,
        addRombel,
        updateRombel,
        deleteRombel,
        validationResults,
        invalidCount,
        warningCount,
        runValidation,
        isSyncing,
        syncProgress,
        syncCurrentStep,
        syncSteps,
        syncLogs,
        unsyncedChangesCount,
        lastSyncTimestamp,
        realtimeSyncEnabled,
        setRealtimeSyncEnabled,
        serverStatus,
        serverLatency,
        startFullSync,
        cancelSync,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSptjmModalOpen,
        setIsSptjmModalOpen,
        selectedSptjmLog,
        setSelectedSptjmLog,
        isBackupModalOpen,
        setIsBackupModalOpen,
        resetToInitialData,
        triggerSampleInvalidData,
        fixAllInvalidData
      }}
    >
      {children}
    </DapodikContext.Provider>
  );
};

export const useDapodik = () => {
  const context = useContext(DapodikContext);
  if (!context) {
    throw new Error('useDapodik must be used within a DapodikProvider');
  }
  return context;
};
