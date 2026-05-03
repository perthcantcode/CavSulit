import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api';
import { ShopCard } from '../components/ShopCard';
import { CATEGORIES, COLLEGES, CAT_ICONS } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export function Browse() {
  const [params]   = useSearchParams();
  const { user }   = useAuth();
  const [shops,    setShops]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saved,    setSaved]    = useState<Set<string>>(new Set());
  const [tab,      setTab]      = useState<'product'|'college'>('product');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [college,  setCollege]  = useState(params.get('college')  || 'all');
  const [search,   setSearch]   = useState(params.get('search')   || '');
  const [sort,     setSort]     = useState(params.get('sort')      || 'recent');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const LIMIT = 8;

  const load = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ category, college, search, sort, page: String(page), limit: String(LIMIT) });
      const { data } = await api.get(`/shops?${q}`);
      setShops(data.shops || []);
      setTotal(data.total || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category, college, search, sort, page]);
  useEffect(() => { setPage(1); }, [category, college, search, sort]);

  const handleSaveToggle = (id: string, isSaved: boolean) => {
    setSaved(prev => { const n = new Set(prev); isSaved ? n.add(id) : n.delete(id); return n; });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-cav-green-dark">Browse Shops</h1>
          <p className="text-sm text-cav-text-muted mt-0.5">{total} shop{total!==1?'s':''} found</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search shops..."
              className="input pl-8 w-48 sm:w-64"/>
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="input w-auto py-2.5 pr-8">
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-cav-green-accent/10 rounded-xl p-1 w-fit mb-4">
        {(['product','college'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t ? 'bg-white text-cav-green shadow-sm' : 'text-cav-text-muted hover:text-cav-green'}`}>
            By {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      {tab === 'product' ? (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={()=>setCategory('all')} className={`pill ${category==='all'?'pill-active':'pill-inactive'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={()=>setCategory(c)} className={`pill ${category===c?'pill-active':'pill-inactive'}`}>
              {CAT_ICONS[c]} {c.replace('_',' ')}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={()=>setCollege('all')} className={`pill ${college==='all'?'pill-active':'pill-inactive'}`}>All Colleges</button>
          {COLLEGES.map(c => (
            <button key={c} onClick={()=>setCollege(c)} className={`pill ${college===c?'pill-active':'pill-inactive'}`}>{c}</button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_,i)=><div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse"/>)}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 text-cav-text-muted">
          <div className="text-5xl mb-4">😕</div>
          <div className="font-semibold">No shops found</div>
          <div className="text-sm mt-1">Try a different filter or search term</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {shops.map(s => <ShopCard key={s.id} shop={s} saved={saved.has(s.id)} onSaveToggle={handleSaveToggle}/>)}
        </div>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            className="btn-secondary disabled:opacity-40">← Prev</button>
          <span className="text-sm text-cav-text-muted px-4">Page {page} of {Math.ceil(total/LIMIT)}</span>
          <button onClick={()=>setPage(p=>p+1)} disabled={page>=Math.ceil(total/LIMIT)}
            className="btn-secondary disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}
