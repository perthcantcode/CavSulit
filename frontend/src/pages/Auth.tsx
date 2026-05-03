import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../utils/helpers';

function AuthLayout({ title, sub, children }: { title:string; sub:string; children:React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-gradient-to-br from-cav-green-dark to-cav-green p-10 text-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ShoppingBag size={18}/>
          </div>
          <span className="font-display font-bold text-lg">CavSulit</span>
        </div>
        <div>
          <div className="text-3xl font-display font-bold leading-tight mb-4">
            "Your hustle deserves to be seen."
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            CavSulit is a free campus marketplace for students, instructors, and every member of the CvSU community.
          </p>
        </div>
        <div className="text-white/40 text-xs">© 2026 CavSulit · ITEC Group 3</div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-cav-green flex items-center justify-center"><ShoppingBag size={16} className="text-white"/></div>
            <span className="font-display font-bold text-cav-green-dark">CavSulit</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-cav-green-dark mb-1">{title}</h1>
          <p className="text-sm text-cav-text-muted mb-8">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err:any) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" sub="Sign in to your CavSulit account">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-cav-green-dark mb-1">Email</label>
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            type="email" required placeholder="your@email.com" className="input"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-cav-green-dark mb-1">Password</label>
          <div className="relative">
            <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
              type={showPw?'text':'password'} required placeholder="••••••••" className="input pr-10"/>
            <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading?'Signing in...':'Sign In'}
        </button>
      </form>
      <p className="text-sm text-center mt-6 text-cav-text-muted">
        Don't have an account? <Link to="/register" className="text-cav-green font-semibold hover:underline">Sign Up</Link>
      </p>
    </AuthLayout>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ fullName:'', email:'', password:'', studentId:'', department:'OTHER', contactNumber:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/'); }
    catch (err:any) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const isCvsu = form.email.endsWith('@cvsu.edu.ph');

  return (
    <AuthLayout title="Create account" sub="Join the CavSulit campus community">
      {isCvsu && form.studentId && (
        <div className="bg-cav-green-accent/15 border border-cav-green-accent/30 text-cav-green text-xs rounded-xl px-4 py-3 mb-4 font-semibold">
          ✅ CvSU email detected — you'll get the CvSU Verified badge automatically!
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Full Name *</label>
            <input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}
              required placeholder="Juan dela Cruz" className="input"/>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Email *</label>
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
              type="email" required placeholder="Use @cvsu.edu.ph for verification" className="input"/>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Password *</label>
            <div className="relative">
              <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                type={showPw?'text':'password'} required placeholder="Min. 6 characters" className="input pr-10"/>
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
          </div>
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Student ID</label>
          <div>
            <input value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})}
              placeholder="251XXXXXX" className="input"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Department</label>
            <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} className="input">
              {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Contact Number</label>
            <input value={form.contactNumber} onChange={e=>setForm({...form,contactNumber:e.target.value})}
              placeholder="09XX XXX XXXX" className="input"/>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading?'Creating account...':'Create Account'}
        </button>
      </form>
      <p className="text-sm text-center mt-6 text-cav-text-muted">
        Already have an account? <Link to="/login" className="text-cav-green font-semibold hover:underline">Sign In</Link>
      </p>
    </AuthLayout>
  );
}
