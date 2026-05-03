import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout }       from './components/Layout';
import { Landing }      from './pages/Landing';
import { Browse }       from './pages/Browse';
import { ShopDetails }  from './pages/ShopDetails';
import { PostShop }     from './pages/PostShop';
import { MyShop }       from './pages/MyShop';
import { Messages }     from './pages/Messages';
import { Wishlist }     from './pages/Wishlist';
import { VerifiedBadge }from './pages/VerifiedBadge';
import { Login, Register } from './pages/Auth';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages — no layout */}
          <Route path="/login"    element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          {/* Main app with navbar/footer layout */}
          <Route path="/" element={<Layout/>}>
            <Route index           element={<Landing/>}/>
            <Route path="browse"   element={<Browse/>}/>
            <Route path="shop/:id" element={<ShopDetails/>}/>
            <Route path="post-shop"element={<PostShop/>}/>
            <Route path="my-shop"  element={<MyShop/>}/>
            <Route path="messages" element={<Messages/>}/>
            <Route path="wishlist" element={<Wishlist/>}/>
            <Route path="verified" element={<VerifiedBadge/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
