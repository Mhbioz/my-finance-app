import React, { useState, useEffect } from 'react';
import { Eye, ShieldCheck, Save, Upload, BarChart3, Wallet, PiggyBank, TrendingUp, Calculator, Settings, Plus, Trash2, ArrowUpRight, ArrowDownRight, Layers, Pencil, X } from 'lucide-react';

export default function InvestmentApp() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [savings, setSavings] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [prices, setPrices] = useState({ tasi: 0, aramco: 0, rajhi: 0, sabic: 0, stc: 0, lastUpdated: '' });

  // --- المزامنة والنسخ الاحتياطي ---
  const exportBackup = () => {
    const data = { portfolio, savings, wallets, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Mhbioz_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.portfolio) setPortfolio(data.portfolio);
        if (data.savings) setSavings(data.savings);
        if (data.wallets) setWallets(data.wallets);
        alert("✅ تمت استعادة البيانات بنجاح!");
      } catch (err) { alert("❌ ملف غير صالح"); }
    };
    reader.readAsText(file);
  };

  // --- بصمة الوجه ---
  const handleAuth = () => {
    if (window.confirm("استخدام FaceID للوصول للمحفظة؟")) setIsLocked(false);
  };

  // --- ياهو فاينانس ---
  const fetchPrices = async () => {
    try {
      setLoading(true);
      const symbols = ['^TASI.SR', '2222.SR', '1120.SR', '2010.SR', '7010.SR'];
      const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`)}`);
      const json = await res.json();
      const r = json.quoteResponse.result;
      const f = (s) => r.find(x => x.symbol === s)?.regularMarketPrice || 0;
      setPrices({
        tasi: f('^TASI.SR'), aramco: f('2222.SR'), rajhi: f('1120.SR'), 
        sabic: f('2010.SR'), stc: f('7010.SR'), lastUpdated: new Date().toLocaleTimeString('ar-SA')
      });
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  useEffect(() => { fetchPrices(); }, []);

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="w-20 h-20 rounded-2xl bg-[#d4af37] flex items-center justify-center mb-6 shadow-lg shadow-[#d4af37]/20">
          <ShieldCheck size={40} color="#0a0a0b" />
        </div>
        <h1 className="text-xl font-bold text-white mb-8">الخزينة الذكية - Mhbioz</h1>
        <button onClick={handleAuth} className="bg-[#d4af37] text-[#0a0a0b] px-8 py-3 rounded-xl font-bold">فتح بالبصمة</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-4" dir="rtl">
      {/* واجهة التطبيق البسيطة */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold gold-text">لوحة التحكم</h2>
        <button onClick={() => setIsLocked(true)}><Settings size={20} /></button>
      </div>
      
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6">
        <p className="text-gray-400 text-xs mb-1">صافي الثروة</p>
        <h3 className="text-3xl font-bold text-[#d4af37]">{prices.tasi.toLocaleString()} <span className="text-sm">نقطة</span></h3>
        <p className="text-[10px] text-gray-500 mt-2">تحديث: {prices.lastUpdated}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={exportBackup} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-2 text-xs"><Save size={14}/> نسخة iCloud</button>
        <label className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-2 text-xs cursor-pointer"><Upload size={14}/> استيراد <input type="file" onChange={importBackup} className="hidden" /></label>
      </div>
    </div>
  );
}