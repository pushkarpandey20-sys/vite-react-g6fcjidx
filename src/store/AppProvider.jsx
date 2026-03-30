import React, { useState, useEffect, useCallback } from 'react';
import { AppCtx } from './AppCtx';
import { supabase, db, genId } from '../services/supabase';
import { MUHURTAS, SEVA_OPTIONS } from '../api/constants';

export function AppProvider({ children }) {
  // Identity
  const [devoteeId, setDevoteeId] = useState(null);
  const [devoteeName, setDevoteeName] = useState("Guest");
  const [devoteeCity, setDevoteeCity] = useState("Delhi");
  const [userPhone, setUserPhone] = useState(null);
  const [panditId, setPanditId] = useState(null);
  const [panditName, setPanditName] = useState(null);
  const [panditOnline, setPanditOnline] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeApp, setActiveApp] = useState(null);
  const [activePage, setActivePage] = useState("home");

  // Cart & UI
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [showUserOnboarding, setShowUserOnboarding] = useState(false);
  const [showPanditOnboarding, setShowPanditOnboarding] = useState(false);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [viewPandit, setViewPandit] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [festivals, setFestivals] = useState([]);
  const [userReferral, setUserReferral] = useState(null);

  const toast = useCallback((msg, icon = "🕉️") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, icon }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3500);
  }, []);

  // Load user profile after Supabase auth
  const loadUserProfile = useCallback(async (user) => {
    const phone = user.phone;
    if (!phone) return;
    setUserPhone(phone);
    localStorage.setItem('ds_session', JSON.stringify({ phone, userId: user.id }));

    // Check pandits first
    const { data: pandit } = await db.pandits().select('*').eq('phone', phone).maybeSingle();
    if (pandit) {
      setPanditId(pandit.id);
      setPanditName(pandit.name);
      setPanditOnline(pandit.is_online || false);
      localStorage.setItem("devsetu_pandit", JSON.stringify({ id: pandit.id, name: pandit.name }));
      return;
    }

    // Check devotees
    const { data: devotee } = await db.devotees().select('*').eq('phone', phone).maybeSingle();
    if (devotee) {
      setDevoteeId(devotee.id);
      setDevoteeName(devotee.name || 'Devotee');
      setDevoteeCity(devotee.city || 'Delhi');
      localStorage.setItem("devsetu_user", JSON.stringify({ id: devotee.id, name: devotee.name, city: devotee.city }));
    } else {
      // Create new devotee row
      const { data: nd } = await db.devotees().insert({ phone, name: 'New User', city: 'Delhi' }).select().single();
      if (nd) {
        setDevoteeId(nd.id);
        setDevoteeName('New User');
        setShowUserOnboarding(true);
        localStorage.setItem("devsetu_user", JSON.stringify({ id: nd.id, name: 'New User', city: 'Delhi' }));
      }
    }
  }, []);

  const clearUserState = useCallback(() => {
    setDevoteeId(null); setDevoteeName("Guest"); setUserPhone(null);
    setPanditId(null); setPanditName(null); setPanditOnline(false);
    localStorage.removeItem('ds_session');
    localStorage.removeItem('devsetu_user');
    localStorage.removeItem('devsetu_pandit');
  }, []);

  // Session restore on mount
  useEffect(() => {
    const restore = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          // Fallback: localStorage for offline/demo
          const saved = localStorage.getItem("devsetu_user");
          if (saved) {
            const u = JSON.parse(saved);
            setDevoteeId(u.id); setDevoteeName(u.name); setDevoteeCity(u.city || "Delhi");
          }
          const ps = localStorage.getItem("devsetu_pandit");
          if (ps) {
            const p = JSON.parse(ps);
            setPanditId(p.id); setPanditName(p.name);
          }
        }
        // Restore admin session
        const as = localStorage.getItem('ds_admin_session');
        if (as) { const { role } = JSON.parse(as); setAdminRole(role); }
      } finally {
        setAuthLoading(false);
      }
    };
    const loadFestivals = async () => {
      const { data } = await supabase.from('festivals').select('*').gte('festival_date', new Date().toISOString().split('T')[0]);
      setFestivals(data || []);
    };

    restore();
    loadFestivals();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) await loadUserProfile(session.user);
      else if (event === 'SIGNED_OUT') clearUserState();
    });
    return () => subscription.unsubscribe();
  }, [loadUserProfile, clearUserState]);

  // Kept for guest/demo flow
  const handleLogin = (phone, name, city) => {
    const id = genId("DEV");
    setDevoteeId(id); setDevoteeName(name || "New User"); setDevoteeCity(city || "Delhi");
    localStorage.setItem("devsetu_user", JSON.stringify({ id, name, city }));
    setShowLogin(false); setShowUserOnboarding(true);
    toast(`Welcome, ${name}! 🙏`);
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    clearUserState();
    setAdminRole(null);
    localStorage.removeItem('ds_admin_session');
    toast("Logged out successfully");
  };

  const loginAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: adminUser } = await supabase.from('admin_users').select('role').eq('user_id', data.user.id).maybeSingle();
    const role = adminUser?.role || 'manager';
    setAdminRole(role);
    localStorage.setItem('ds_admin_session', JSON.stringify({ role }));
    toast(`Welcome, Admin! 🛡️`);
    return role;
  };

  const loginAdminDemo = (role) => {
    setAdminRole(role);
    localStorage.setItem('ds_admin_session', JSON.stringify({ role }));
    toast(`Admin access granted (${role})`);
  };

  const addToCart = (item) => {
    if (!devoteeId) { setShowLogin(true); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    toast(`${item.name} added to cart!`, item.icon || "🛒");
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const confirmBooking = async (paymentDetails = null) => {
    if (!bookingDraft) return;
    setLoading(true);
    try {
      // 1. Create Booking Record
      const { data: booking, error: bErr } = await db.bookings().insert({
        devotee_id: devoteeId, 
        devotee_name: devoteeName, 
        devotee_emoji: "👤",
        pandit_id: bookingDraft.panditId, 
        pandit_name: bookingDraft.panditName,
        ritual: bookingDraft.ritual, 
        ritual_icon: bookingDraft.ritualIcon,
        ritual_id: bookingDraft.ritualId,
        amount: bookingDraft.amount, 
        booking_date: bookingDraft.date, 
        booking_time: bookingDraft.time,
        location: bookingDraft.location, 
        address: bookingDraft.address, 
        notes: bookingDraft.notes,
        samagri_required: bookingDraft.addSamagri || false,
        payment_status: paymentDetails ? 'paid' : 'pending',
        booking_status: 'booking_confirmed',
        payment_id: paymentDetails?.razorpay_payment_id,
        order_id: paymentDetails?.razorpay_order_id,
        signature: paymentDetails?.razorpay_signature,
        timeline: [{ status: 'booking_confirmed', time: new Date().toISOString(), label: 'Booking Confirmed' }]
      }).select().single();

      if (bErr) throw bErr;

      // 2. Store Sankalp if exists
      if (bookingDraft.sankalp) {
        await supabase.from('sankalp').insert({
          booking_id: booking.id,
          ...bookingDraft.sankalp
        });
      }

      // 3. Create Notification
      await supabase.from('notifications').insert({
        user_id: devoteeId,
        type: 'booking_confirmed',
        message: `Your booking for ${booking.ritual} is confirmed for ${booking.booking_date} at ${booking.booking_time}.`
      });

      // 4. Send Email/WhatsApp (Placeholders)
      console.log(`Sending Email to user for booking ${booking.id}`);
      console.log(`Sending WhatsApp to user for booking ${booking.id}`);

      toast("Booking Confirmed! 🙏"); 
      setLastBooking(booking);
      setShowConfirm(false); 
      setShowSuccess(true);
      setBookingDraft(null); 
    } catch (err) {
      console.error(err);
      toast("Error recording booking", "❌");
    }
    setLoading(false);
  };

  const submitReview = async (bookingId, panditId, rating, reviewText) => {
    try {
      const { error } = await supabase.from('reviews').insert({
        booking_id: bookingId,
        user_id: devoteeId,
        pandit_id: panditId,
        rating,
        review_text: reviewText
      });
      if (error) throw error;
      toast("Review submitted! Thank you. 🙏", "⭐");
    } catch (err) {
      console.error(err);
      toast("Error submitting review", "❌");
    }
  };

  const value = {
    db, supabase, activeApp, setActiveApp, activePage, setActivePage,
    devoteeId, devoteeName, devoteeCity, userPhone,
    panditId, panditName, panditOnline, setPanditOnline,
    adminRole, setAdminRole, loginAdmin, loginAdminDemo, authLoading,
    cart, addToCart, updateCartQty, cartCount: cart.length,
    showCart, setShowCart, showLogin, setShowLogin,
    showAdminLogin, setShowAdminLogin,
    showConfirm, setShowConfirm,
    showSuccess, setShowSuccess,
    lastBooking, setLastBooking,
    showUserOnboarding, setShowUserOnboarding,
    showPanditOnboarding, setShowPanditOnboarding,
    toasts, toast, handleLogin, logout, confirmBooking, submitReview, loading,
    festivals, userReferral, MUHURTAS, SEVA_OPTIONS,
    verifyPayment: async (res) => {
      // In a real app, this should be verified via a backend/Edge Function
      // and checking the signature using crypto.
      console.log("Verifying payment:", res);
      return true;
    }
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
