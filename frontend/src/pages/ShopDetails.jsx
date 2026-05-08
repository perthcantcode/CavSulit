import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, MessageCircle, Heart, ShoppingBag, Calendar, ArrowLeft, Send } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { badgeLabel, photoUrl, stars, CAT_ICONS } from '../utils/helpers';

export function ShopDetails() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [shop,    setShop]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved,   setSaved]   = useState(false);
  const [tab,     setTab]     = useState('info');
  const [reviewStars,   setReviewStars]   = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [preItems,      setPreItems]      = useState('');
  const [preTime,       setPreTime]       = useState('');
  const [preLocation,   setPreLocation]   = useState('');
  const [preSuccess,    setPreSuccess]    = useState(false);

  useEffect(() => {
    api.get(`/shops/${id}`).then(({ data }) => setShop(data)).finally(() => setLoading(false));
    if (user) api.get(`/wishlist/check/${id}`).then(({ data }) => setSaved(data.saved)).catch(() => {});
  }, [id]);

  const toggleSave = async () => {
    if (!user) return navigate('/login');
    const { data } = await api.post(`/wishlist/${id}`);
    setSaved(data.saved);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      const { data } = await api.post('/reviews', { shopId: id, stars: reviewStars, comment: reviewComment });
      setShop(s => ({ ...s, reviews: [data, ...(s.reviews || [])] }));
      setReviewComment('');
      setTab('reviews');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const submitPreorder = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await api.post('/preorders', { shopId: id, items: [{ name: preItems, qty: 1 }], pickupTime: preTime, locationNote: preLocation });
      setPreSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const messageShop = () => {
    if (!user) return navigate('/login');
    navigate(`/messages?to=${shop.seller?.id}&shopId=${id}`);
  };

  if (loading) return <div className="page-container"><div className="h-96 bg-gray-100 rounded-2xl animate-pulse"/></div>;
  if (!shop) return <div className="page-container text-center py-20 text-cav-text-muted">Shop not found.</div>;

  const badge = badgeLabel(shop.seller?.badgeLevel);
  const imgs  = shop.photos?.map(p => photoUrl(p)).filter(Boolean);

  const TABS = ['info', 'reviews', 'preorder'];

  return (
    <div className="page-container">
      <Link to="/browse" className="btn-ghost mb-6 inline-flex"><ArrowLeft size={16}/>Back to Browse</Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2 space-y-4">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-cav-green-accent/20 to-cav-green-accent/5 flex items-center justify-center">
            {imgs?.[0]
              ? <img src={imgs[0]} alt={shop.name} className="w-full h-full object-cover"/>
              : <span className="text-7xl">{CAT_ICONS[shop.category] || '🛒'}</span>
            }
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${tab === t ? 'bg-white text-cav-green shadow-sm' : 'text-cav-text-muted'}`}>
                {t === 'preorder' ? 'Pre-Order' : t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && shop.reviews?.length ? ` (${shop.reviews.length})` : ''}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'info' && (
            <div className="card p-5 space-y-4">
              <p className="text-sm text-cav-text-muted leading-relaxed">{shop.description || 'No description provided.'}</p>
              {shop.products?.length > 0 && (
                <div>
                  <div className="font-display font-bold text-sm text-cav-green-dark mb-3">Products & Prices</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {shop.products.map(p => (
                      <div key={p.id} className="border border-cav-green-accent/20 rounded-xl p-3 text-center">
                        {p.image && <img src={photoUrl(p.image) || ''} alt={p.name} className="w-full h-16 object-cover rounded-lg mb-2"/>}
                        <div className="text-xs font-bold text-cav-green-dark line-clamp-1">{p.name}</div>
                        <div className="text-sm font-bold text-cav-green mt-1">₱{parseFloat(p.price).toFixed(2)}</div>
                        {!p.isAvailable && <div className="text-xs text-red-400 mt-1">Unavailable</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {user && (
                <div className="card p-5">
                  <div className="font-display font-bold text-sm text-cav-green-dark mb-3">Leave a Review</div>
                  <form onSubmit={submitReview} className="space-y-3">
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewStars(n)}
                          className={`text-2xl transition-transform hover:scale-110 ${n <= reviewStars ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                      ))}
                    </div>
                    <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                      placeholder="Share your experience..." rows={3} className="input resize-none"/>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      <Send size={14}/>{submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
              {shop.reviews?.length === 0
                ? <div className="text-center py-8 text-cav-text-muted text-sm">No reviews yet. Be the first!</div>
                : shop.reviews?.map(r => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-cav-green flex items-center justify-center text-white text-xs font-bold">
                        {r.reviewer?.fullName?.[0] || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{r.reviewer?.fullName}</div>
                        <div className="text-xs text-cav-text-muted">{r.reviewer?.department}</div>
                      </div>
                      <div className="ml-auto text-yellow-400 text-sm">{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
                    </div>
                    <p className="text-sm text-cav-text-muted">{r.comment}</p>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'preorder' && (
            <div className="card p-5">
              <div className="font-display font-bold text-sm text-cav-green-dark mb-4">📋 Pre-Order Request</div>
              {preSuccess ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <div className="font-bold text-cav-green-dark">Pre-order sent!</div>
                  <div className="text-sm text-cav-text-muted mt-1">The seller will confirm via Messages.</div>
                  <button onClick={() => setPreSuccess(false)} className="btn-secondary mt-4">New Pre-Order</button>
                </div>
              ) : (
                <form onSubmit={submitPreorder} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-cav-green-dark mb-1">Item / Order Details *</label>
                    <textarea value={preItems} onChange={e => setPreItems(e.target.value)} required
                      placeholder="e.g. Brown Sugar Milk Tea x2, Taro x1..." rows={3} className="input resize-none"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cav-green-dark mb-1">Pickup Date & Time</label>
                    <input type="datetime-local" value={preTime} onChange={e => setPreTime(e.target.value)} className="input"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cav-green-dark mb-1">Pickup Location Note</label>
                    <input value={preLocation} onChange={e => setPreLocation(e.target.value)}
                      placeholder="e.g. CEIT Lobby, near door 1" className="input"/>
                  </div>
                  <button type="submit" disabled={submitting || !user} className="btn-primary w-full justify-center">
                    {!user ? <Link to="/login">Login to Pre-Order</Link> : <>{submitting ? 'Sending...' : 'Send Pre-Order'}</>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h1 className="font-display font-bold text-xl text-cav-green-dark">{shop.name}</h1>
              <button onClick={toggleSave} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors flex-shrink-0">
                <Heart size={16} className={saved ? 'text-red-500 fill-red-500' : 'text-gray-400'}/>
              </button>
            </div>

            {badge && <div className="mb-2"><span className={badge.cls}>{badge.label}</span></div>}

            {shop.avgRating && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400">{stars(parseFloat(shop.avgRating))}</span>
                <span className="font-bold text-sm">{shop.avgRating}</span>
                <span className="text-xs text-cav-text-muted">({shop.reviewCount} reviews)</span>
              </div>
            )}

            <div className="space-y-2 text-sm text-cav-text-muted">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-cav-green flex-shrink-0"/>{shop.locationDesc || shop.college}</div>
              <div className="flex items-center gap-2"><Eye size={14} className="text-cav-green flex-shrink-0"/>{shop.views} views</div>
              {shop.availableDate && <div className="flex items-center gap-2"><Calendar size={14} className="text-cav-green flex-shrink-0"/>{shop.availableDate}</div>}
              <div className="flex items-center gap-2">
                <span className="text-base">{CAT_ICONS[shop.category]}</span>
                <span className="capitalize">{shop.category?.replace('_',' ')}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button onClick={messageShop} className="btn-primary w-full justify-center"><MessageCircle size={16}/>Message Seller</button>
              <button onClick={() => setTab('preorder')} className="btn-secondary w-full justify-center"><ShoppingBag size={16}/>Pre-Order</button>
            </div>
          </div>

          {shop.seller && (
            <div className="card p-5">
              <div className="font-display font-bold text-sm text-cav-green-dark mb-3">Seller</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cav-green flex items-center justify-center text-white font-bold">
                  {shop.seller.fullName?.[0] || 'S'}
                </div>
                <div>
                  <div className="font-semibold text-sm">{shop.seller.fullName}</div>
                  <div className="text-xs text-cav-text-muted">{shop.seller.department}</div>
                </div>
              </div>
              {shop.seller.contactNumber && (
                <div className="mt-2 text-xs text-cav-text-muted">📞 {shop.seller.contactNumber}</div>
              )}
            </div>
          )}

          {(shop.lat && shop.lng) && (
            <div className="card p-5">
              <div className="font-display font-bold text-sm text-cav-green-dark mb-3">Location</div>
              <div className="bg-cav-green-accent/10 rounded-xl h-32 flex flex-col items-center justify-center gap-2 text-cav-green">
                <MapPin size={24}/>
                <div className="text-xs font-semibold">{shop.locationDesc || shop.college}</div>
                <a href={`https://www.google.com/maps?q=${shop.lat},${shop.lng}`} target="_blank" rel="noreferrer"
                  className="text-xs underline">Open in Maps</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
