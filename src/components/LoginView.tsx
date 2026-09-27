import React, { useState } from 'react';
import { 
  useDapodik 
} from '../context/DapodikContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  LogIn, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  UserCheck,
  Award,
  BookOpen
} from 'lucide-react';
import { demoUsers } from '../data/initialData';
import { UserRole } from '../types/dapodik';

export const LoginView: React.FC = () => {
  const { sekolah, login } = useDapodik();

  const [email, setEmail] = useState('operator@smkn1grahanusantara.sch.id');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('operator');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027 Ganjil');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password, role);
      setIsLoading(false);
    }, 400);
  };

  const handleSelectDemo = (userRole: UserRole) => {
    const user = demoUsers[userRole];
    if (user) {
      setEmail(user.email);
      setRole(user.role);
      setPassword('dapodik2026');
    }
  };

  const handleBelajarIdLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('operator@admin.smk.belajar.id', 'belajarid-token', 'operator');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07172c] via-[#0d2a4d] to-[#0f3460] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-slate-100">
      {/* Top Header */}
      <header className="px-6 py-3 border-b border-blue-900/50 bg-[#061426]/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md border border-blue-400/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide">
              KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH RI
            </h1>
            <p className="text-[10px] text-blue-300">
              Direktorat Jenderal PAUD, Pendidikan Dasar dan Menengah
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Gateway Pusat: <strong className="text-emerald-300">Online</strong></span>
        </div>
      </header>

      {/* Main Login Box */}
      <div className="flex-1 flex items-center justify-center p-4 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 p-6 text-white text-center relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg mb-3">
              <Building2 className="w-8 h-8 text-blue-200" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              DAPODIK CLOUD v2026.a
            </h2>
            <p className="text-xs text-blue-200 mt-1">
              Sistem Manajemen Administrasi Data Pokok Pendidikan
            </p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono text-emerald-300">
              NPSN: {sekolah.npsn} • {sekolah.nama}
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Akun Dapodik / SSO *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                    placeholder="nama@smkn1grahanusantara.sch.id"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peran Penugasan *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="operator">Operator Sekolah</option>
                    <option value="kepsek">Kepala Sekolah</option>
                    <option value="guru">Guru / Pendidik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Ajaran *
                  </label>
                  <select
                    value={tahunAjaran}
                    onChange={e => setTahunAjaran(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="2026/2027 Ganjil">2026/2027 Ganjil</option>
                    <option value="2026/2027 Genap">2026/2027 Genap</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Ingat perangkat ini</span>
                </label>
                <a href="#bantuan" onClick={e => { e.preventDefault(); alert('Hubungi Dinas Pendidikan Provinsi atau Pusat Bantuan Dapodik untuk pemulihan akun.'); }} className="text-blue-600 hover:underline">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Memverifikasi Akses...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk Aplikasi Dapodik</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                Atau
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Login dengan Akun belajar.id */}
            <button
              onClick={handleBelajarIdLogin}
              className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <img 
                src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" 
                alt="Google" 
                className="w-4 h-4" 
              />
              <span>Masuk dengan Akun belajar.id</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih Akun Demo Cepat (1-Klik):</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('operator')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    role === 'operator'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>Operator</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('kepsek')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    role === 'kepsek'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>Kepala Sekolah</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemo('guru')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    role === 'guru'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>Guru / Wali</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-blue-900/50 text-center text-xs text-blue-300/80">
        <p>
          &copy; 2026 Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Pendidikan Dasar dan Menengah RI.
        </p>
      </footer>
    </div>
  );
};
