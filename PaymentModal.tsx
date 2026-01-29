
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [displayTime, setDisplayTime] = useState('');
  const [idGame, setIdGame] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const adminNumber = "6285198326016"; 
  
  // GANTI URL INI dengan URL Webhook Google Apps Script Anda nanti
  const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxM2Vq53RYhxctR7KSG7ixyxrG2qy9FtLlws9uKGgW0wFDlNGunTNnnSQutDTJmBZh_/exec"; 

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsConfirmed(false);
        setTransactionId('');
        setDisplayDate('');
        setDisplayTime('');
        setIdGame('');
        setWhatsapp('');
        setIsLogging(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const qrisFullImage = "https://i.ibb.co.com/Fb3g4Qk0/Screenshot-2026-01-28-15-37-11-859-com-android-chrome.png";
  const privateServerUrl = "https://www.roblox.com/share?code=eb8ac06f96738c4b9fa374eacd15f495&type=Server";

  const logTransaction = async (data: any) => {
    // 1. Simpan ke database lokal browser (LocalStorage)
    const history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
    history.push(data);
    localStorage.setItem('transaction_history', JSON.stringify(history));

    // 2. Kirim ke Google Sheets jika URL tersedia
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (e) {
        console.error("Gagal mengirim ke Spreadsheet:", e);
      }
    }
  };

  const handleConfirm = async () => {
    if (!idGame.trim()) {
      alert("Silahkan masukkan ID Game / Nickname Anda agar pesanan dapat diproses.");
      return;
    }

    setIsLogging(true);

    const now = new Date();
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const uniqueCode = `${date}${month}${year}${hours}${minutes}${seconds}`;
    
    const transactionData = {
      id: uniqueCode,
      productName: product.name,
      price: product.price,
      gameId: idGame,
      customerWa: whatsapp || 'Tidak ada',
      date: `${date}/${month}/${year}`,
      time: `${hours}:${minutes}:${seconds} WIB`,
      status: 'PAID'
    };

    await logTransaction(transactionData);

    setTransactionId(uniqueCode);
    setDisplayDate(`${date}/${month}/${year}`);
    setDisplayTime(`${hours}:${minutes} WIB`);
    setIsConfirmed(true);
    setIsLogging(false);
  };

  const downloadQR = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(qrisFullImage, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRIS-FISH-IT-STORE.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Gagal mendownload otomatis. Gambar akan dibuka di tab baru.");
      window.open(qrisFullImage, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const sendNotificationToAdmin = () => {
    const message = `*NOTIFIKASI PESANAN BARU - FISH IT STORE*%0A` +
      `--------------------------------------%0A` +
      `*ID Transaksi:* ${transactionId}%0A` +
      `*Produk:* ${product.name}%0A` +
      `*Harga:* Rp ${product.price.toLocaleString('id-ID')}%0A` +
      `*ID Game:* ${idGame}%0A` +
      `*WhatsApp Pembeli:* ${whatsapp || '-'}%0A` +
      `*Waktu:* ${displayDate} | ${displayTime}%0A` +
      `--------------------------------------%0A` +
      `_Mohon segera diproses, terima kasih!_`;

    window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {!isConfirmed ? (
          <>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex flex-col">
                <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-tight">Metode QRIS</h2>
                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em]">Aman Store • Pembayaran Instant</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto max-h-[75vh] hide-scrollbar">
              <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800/50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${product.color} p-0.5 shadow-lg`}>
                      <img src={product.image} alt="" className="w-full h-full object-cover rounded-md opacity-90" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Produk</p>
                      <p className="text-sm font-bold text-white leading-tight">{product.name}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total</p>
                    <p className="text-xl font-black text-cyan-400">Rp {product.price.toLocaleString('id-ID')}</p>
                 </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative flex flex-col items-center">
                  <div className="absolute -inset-10 bg-cyan-500/10 rounded-full blur-[80px]"></div>
                  <div className="relative w-full max-w-[320px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-white p-1">
                    <div className="overflow-hidden rounded-2xl bg-white aspect-square flex items-center justify-center">
                       <img 
                        src={qrisFullImage} 
                        alt="QRIS" 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: 'center 15%' }} 
                        crossOrigin="anonymous"
                       />
                    </div>
                  </div>
                  
                  <button 
                    onClick={downloadQR}
                    disabled={isDownloading}
                    className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all border active:scale-95 disabled:opacity-50 ${isDownloading ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-900 border-white hover:bg-slate-200'}`}
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    {isDownloading ? 'Sedang Memproses...' : 'Simpan QR Code'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">ID Game / Nickname *</label>
                    <input 
                      type="text" 
                      value={idGame}
                      onChange={(e) => setIdGame(e.target.value)}
                      placeholder="Masukkan Nickname Roblox" 
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 rounded-2xl p-4 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">WhatsApp (Opsional)</label>
                    <input 
                      type="text" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Contoh: 0851xxx" 
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 rounded-2xl p-4 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/95">
              <button 
                onClick={handleConfirm}
                disabled={isLogging}
                className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl transition-all shadow-xl active:scale-[0.98] text-sm uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isLogging && <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>}
                {isLogging ? 'MENCATAT TRANSAKSI...' : 'SAYA SUDAH BAYAR'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 max-h-[95vh] overflow-y-auto hide-scrollbar">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-xl font-outfit font-black text-white uppercase tracking-tight mb-2">Konfirmasi Berhasil!</h2>
              
              <p className="text-slate-300 text-[11px] mb-6 px-6 leading-relaxed">
                Pembayaran Anda Sedang kami Proses. Harap Menunggu <span className="text-emerald-400 font-bold">3-5 Menit</span>, Dimohon untuk Masuk ke dalam Private Server dibawah ya
              </p>

              <div className="w-full grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={sendNotificationToAdmin}
                  className="flex flex-col items-center justify-center p-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 group border border-emerald-400/20"
                >
                  <svg className="w-6 h-6 text-white mb-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.437h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">Remind WA</span>
                </button>

                <a 
                  href={privateServerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 group border border-blue-400/20"
                >
                  <svg className="w-6 h-6 text-white mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">Join Server</span>
                </a>
              </div>

              <div className="w-full bg-slate-950/60 border border-slate-800 rounded-3xl p-5 text-left relative overflow-hidden mb-4 shadow-xl">
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Item Dibeli</p>
                      <p className="text-white font-bold text-sm">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Total Bayar</p>
                      <p className="text-white font-black text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-800 w-full"></div>

                  <div className="grid grid-cols-2 gap-y-3 text-[10px]">
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-tighter mb-0.5">ID Game</p>
                      <p className="text-slate-200 font-bold">{idGame}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-tighter mb-0.5">Status</p>
                      <p className="text-emerald-400 font-black uppercase tracking-widest">Tercatat</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-tighter mb-0.5">Tanggal</p>
                      <p className="text-slate-200 font-bold">{displayDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-tighter mb-0.5">Waktu</p>
                      <p className="text-slate-200 font-bold">{displayTime}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 mt-2">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">ID Transaksi Unik</p>
                    <p className="text-cyan-400 font-mono font-black tracking-[0.15em] text-sm md:text-base">
                      {transactionId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3">
                <button onClick={onClose} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase rounded-xl transition-all">
                  Kembali ke Toko
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
