    import { createFileRoute } from '@tanstack/react-router';
    import React, { useState } from 'react';
    import { 
    Lock, 
    Mail, 
    User, 
    ArrowRight, 
    Eye, 
    EyeOff, 
    CheckCircle, 
    AlertCircle,
    } from 'lucide-react';

    export const Route = createFileRoute('/loster')({
    component: App,
    })

    export default function App() {
    // State untuk melacak halaman aktif ('login' atau 'register')
    const [activeTab, setActiveTab] = useState('login');
    
    // State untuk tampilkan/sembunyikan kata sandi
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State Form Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // State Form Register
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // State untuk Feedback & Validasi UI (Alert)
    const [alertMessage, setAlertMessage] = useState<{
        type: string;
        text: string;
        } | null>(null);

    // Fungsi untuk menampilkan notifikasi kustom
    const triggerAlert = (type: string, text: string) => {
        setAlertMessage({ type, text });
        setTimeout(() => {
        setAlertMessage(null);
        }, 4000);
    };

    // Handler Kirim Form Login
    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
        triggerAlert('error', 'Silakan isi semua kolom login.');
        return;
        }
        triggerAlert('success', `Selamat datang kembali! Login berhasil sebagai ${loginEmail}`);
    };

    // Handler Kirim Form Register
    const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
        triggerAlert('error', 'Silakan lengkapi seluruh formulir pendaftaran.');
        return;
        }
        if (regPassword !== regConfirmPassword) {
        triggerAlert('error', 'Konfirmasi sandi tidak cocok dengan kata sandi.');
        return;
        }
        if (!agreeTerms) {
        triggerAlert('error', 'Anda harus menyetujui Syarat dan Ketentuan.');
        return;
        }
        
        triggerAlert('success', 'Akun Anda berhasil dibuat! Silakan masuk.');
        setTimeout(() => {
        setActiveTab('login');
        setLoginEmail(regEmail);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setAgreeTerms(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#f3f0ff] via-[#f5f3ff] to-[#eddffd] flex items-center justify-center p-4 md:p-6 font-sans antialiased text-slate-800">
        
        {/* Container Utama dengan Efek Glassmorphism Lembut */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-purple-100 w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-200/50">
            
            {/* Sisi Kiri: Visual Branding */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-[#d8b4fe] via-[#c084fc] to-[#a855f7] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            
            {/* Aksen Dekoratif Geometris Lembut */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Bagian Tengah Visual */}
            <div className="my-12 md:my-0 relative z-10">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4">
                Mulai Langkah Baru Bersama Kami.
                </h1>
                <p className="text-purple-50/90 text-sm md:text-base leading-relaxed max-w-sm">
                Kelola aktivitas harian Anda dengan antarmuka yang tenang, damai, dan didesain khusus untuk produktivitas Anda yang berharga.
                </p>
            </div>

            {/* Bagian Bawah Visual */}
            <div className="text-xs text-purple-100/80 relative z-10 pt-4 border-t border-white/10 flex justify-between">
                <span>© 2026 Natania</span>
                <span>Semua Hak Dilindungi.</span>
            </div>
            </div>

            {/* Sisi Kanan: Form Kontrol (Login & Register) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white/40">
            
            {/* Header & Navigasi Tab */}
            <div>
                <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-950">
                    {activeTab === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
                </h2>
                
                {/* Tab Switcher */}
                <div className="bg-purple-100/50 p-1 rounded-xl flex items-center">
                    <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setAlertMessage(null); }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                        activeTab === 'login' 
                        ? 'bg-white text-purple-700 shadow-sm' 
                        : 'text-purple-600 hover:text-purple-800'
                    }`}
                    >
                    Masuk
                    </button>
                    <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setAlertMessage(null); }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                        activeTab === 'register' 
                        ? 'bg-white text-purple-700 shadow-sm' 
                        : 'text-purple-600 hover:text-purple-800'
                    }`}
                    >
                    Daftar
                    </button>
                </div>
                </div>

                {/* Banner Kustom Alert */}
                {alertMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border transition-all duration-300 ${
                    alertMessage.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                    {alertMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{alertMessage.text}</p>
                </div>
                )}

                {/* TAB LOGIN */}
                {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                    <label className="block text-xs font-semibold text-purple-900/75 uppercase tracking-wider mb-2 text-start">
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                        <Mail className="w-5 h-5" />
                        </span>
                        <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-purple-50/50 border border-purple-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-purple-300"
                        required
                        />
                    </div>
                    </div>

                    <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-purple-900/75 uppercase tracking-wider">
                        Kata Sandi
                        </label>
                        <button 
                        type="button" 
                        onClick={() => triggerAlert('success', 'Tautan pemulihan kata sandi telah dikirim ke email Anda.')} 
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                        >
                        Lupa Sandi?
                        </button>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                        <Lock className="w-5 h-5" />
                        </span>
                        <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Masukkan kata sandi"
                        className="w-full pl-11 pr-11 py-3 bg-purple-50/50 border border-purple-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-purple-300"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-purple-400 hover:text-purple-600 transition-colors"
                        >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    </div>

                    {/* Ingat Saya Checkbox */}
                    <div className="flex items-center">
                    <label className="flex items-center cursor-pointer select-none">
                        <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-purple-200 rounded-md bg-white peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center mr-2.5">
                        <svg className="w-3.5 h-3.5 text-white fill-current opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                        </div>
                        <span className="text-xs font-semibold text-purple-900/70">Ingat perangkat saya</span>
                    </label>
                    </div>

                    {/* Tombol Submit Login */}
                    <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300/80 transition-all flex items-center justify-center gap-2 group mt-2"
                    >
                    Masuk ke Akun
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
                )}

                {/* TAB REGISTER */}
                {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-start">
                    <div>
                    <label className="block text-xs font-semibold text-purple-900/75 uppercase tracking-wider mb-1.5">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                        <User className="w-5 h-5" />
                        </span>
                        <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full pl-11 pr-4 py-2.5 bg-purple-50/50 border border-purple-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-purple-300"
                        required
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-semibold text-purple-900/75 uppercase tracking-wider mb-1.5">
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                        <Mail className="w-5 h-5" />
                        </span>
                        <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-11 pr-4 py-2.5 bg-purple-50/50 border border-purple-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-purple-300"
                        required
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-semibold text-purple-900/75 uppercase tracking-wider mb-1.5">
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                        <Lock className="w-5 h-5" />
                        </span>
                        <input
                        type={showPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-11 pr-11 py-2.5 bg-purple-50/50 border border-purple-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-purple-300"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-purple-400 hover:text-purple-600 transition-colors"
                        >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-semibold text-purple-900/75 uppercase tracking-wider mb-1.5">
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                        <Lock className="w-5 h-5" />
                        </span>
                        <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="w-full pl-11 pr-11 py-2.5 bg-purple-50/50 border border-purple-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-purple-300"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-purple-400 hover:text-purple-600 transition-colors"
                        >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    </div>

                    {/* Syarat & Ketentuan Checkbox */}
                    <div className="flex items-start py-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="sr-only peer"
                        />
                    </label>
                    </div>

                    {/* Tombol Submit Register */}
                    <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300/80 transition-all flex items-center justify-center gap-2 group mt-2"
                    >
                    Daftarkan Akun
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
                )}
            </div>
            </div>

        </div>
        </div>
    );
    }