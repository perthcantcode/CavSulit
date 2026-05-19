import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, Heart } from 'lucide-react';
import { badgeLabel, CAT_ICONS, photoUrl, stars } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export function ShopCard({ shop, saved = false, onSaveToggle }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const badge     = badgeLabel(shop.seller?.badgeLevel);
  const img       = shop.photos?.[0] ? photoUrl(shop.photos[0]) : null;

  // FIX: stopPropagation prevents the Link from firing when the heart is clicked.
  // We also redirect to login if not authenticated instead of silently failing.
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post(`/wishlist/${shop.id}`);
      onSaveToggle?.(shop.id, data.saved);
    } catch {}
  };

  return (
    <Link to={`/shop/${shop.id}`} className="card block group overflow-hidden">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-cav-green-accent/20 to-cav-green-accent/5 flex items-center justify-center overflow-hidden">
        {img
          ? <img src={img} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
          : <span className="text-5xl">{CAT_ICONS[shop.category] || '🛒'}</span>
        }
        {/* FIX: using onMouseDown instead of onClick as a secondary guard so the
            Link's onClick never fires first on fast taps */}
        <button
          onClick={handleSave}
          onMouseDown={e => e.stopPropagation()}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={14} className={saved ? 'text-red-500 fill-red-500' : 'text-gray-400'}/>
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
          <div className="text-white text-[10px] font-semibold flex items-center gap-1">
            <MapPin size={10}/>{shop.college}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="font-display font-bold text-sm text-cav-green-dark leading-tight line-clamp-1">{shop.name}</span>
          {badge && <span className={badge.cls} style={{fontSize:'9px',whiteSpace:'nowrap'}}>{badge.label}</span>}
        </div>

        {shop.avgRating && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-500 text-xs">{stars(parseFloat(shop.avgRating))}</span>
            <span className="text-xs text-cav-text-muted">{shop.avgRating} ({shop.reviewCount})</span>
          </div>
        )}

        {shop.products?.length > 0 && (
          <div className="text-xs font-bold text-cav-green mb-1">
            From ₱{Math.min(...shop.products.map(p => parseFloat(p.price)))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] bg-cav-green-accent/15 text-cav-green font-semibold px-2 py-0.5 rounded-full capitalize">
            {CAT_ICONS[shop.category]} {shop.category?.replace('_',' ')}
          </span>
          <span className="text-[10px] text-cav-text-muted flex items-center gap-0.5">
            <Eye size={10}/> {shop.views}
          </span>
        </div>
      </div>
    </Link>
  );
}