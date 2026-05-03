import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Star, MessageCircle, Store, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { ShopCard } from '../components/ShopCard';

export function Landing() {
  const [recent,  setRecent]  = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/shops?sort=recent&limit=4'),
      api.get('/shops?sort=popular&limit=4'),
    ]).then(([r, p]) => {
      setRecent(r.data.shops || []);
      setPopular(p.data.shops || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/browse?search=${encodeURIComponent(search)}`;
  };

  const features = [
    { icon: <Search size={20}/>,        title: 'Discover Shops',   desc: 'Browse by category or college building to find exactly what you need on campus.' },
    { icon: <MapPin size={20}/>,        title: 'Locate Stalls',    desc: 'See the exact campus location of every stall and seller near you.' },
    { icon: <MessageCircle size={20}/>, title: 'Message & Order',  desc: 'Chat directly with sellers, pre-order food, and book freelance services.' },
    { icon: <Star size={20}/>,          title: 'Rate & Review',    desc: 'Leave ratings after buying to help trustworthy sellers grow and get discovered.' },
    { icon: <Store size={20}/>,         title: 'Post Your Shop',   desc: 'Set up your free shop in minutes — no fees, no middlemen, just your community.' },
    { icon: <ShieldCheck size={20}/>,   title: 'Verified Sellers', desc: 'CvSU Verified badges build trust between buyers and student entrepreneurs.' },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cav-green-dark via-cav-green to-cav-green-light py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize:'40px 40px'}}/>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            🎓 For every CvSU entrepreneur
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-800 text-white mb-4 leading-tight">
            You've got the hustle<br/><span className="text-cav-green-vibrant">we've got the platform</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            CavSulit is a free campus marketplace where students, instructors, and CvSU
            community members can promote their businesses, sidelines, and freelance services.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search shops, food, services..."
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"/>
            </div>
            <button type="submit" className="bg-cav-green-vibrant text-cav-green-dark font-bold px-5 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity">
              Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-8 text-white/80">
            {[['42+','Active Shops'],['300+','Community'],['Free','Always']].map(([n,l])=>(
              <div key={l} className="text-center">
                <div className="font-display font-bold text-2xl text-white">{n}</div>
                <div className="text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-tag">How it works</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cav-green-dark">Everything you need on one platform</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f,i) => (
              <div key={i} className="card p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-cav-green-accent/15 flex items-center justify-center text-cav-green">{f.icon}</div>
                <div>
                  <div className="font-display font-bold text-sm text-cav-green-dark mb-1">{f.title}</div>
                  <div className="text-xs text-cav-text-muted leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT SHOPS ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="section-tag">New</span>
              <h2 className="font-display font-bold text-xl text-cav-green-dark">Recently Added</h2>
            </div>
            <Link to="/browse" className="btn-ghost text-sm"><ArrowRight size={16}/>See all</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_,i)=><div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse"/>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recent.map(s => <ShopCard key={s.id} shop={s}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ── POPULAR ── */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="section-tag">Trending</span>
              <h2 className="font-display font-bold text-xl text-cav-green-dark">Popular Shops</h2>
            </div>
            <Link to="/browse?sort=popular" className="btn-ghost text-sm"><ArrowRight size={16}/>See all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popular.map(s => <ShopCard key={s.id} shop={s}/>)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-cav-green-dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
            Stop being the campus's best kept secret.
          </h2>
          <p className="text-white/70 mb-8">Post your shop for free — it takes less than 2 minutes.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/register" className="bg-cav-green-vibrant text-cav-green-dark font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Get Started Free
            </Link>
            <Link to="/browse" className="bg-white/10 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Browse Shops
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
