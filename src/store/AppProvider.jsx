import React, { useState, useEffect, useCallback } from 'react';
import { AppCtx } from './AppCtx';
import { supabase, db, genId, toUUID } from '../services/supabase';
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

    const isValidUUID = (v) => v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

    // Check pandits first
    const { data: pandit } = await db.pandits().select('*').eq('phone', phone).maybeSingle();
    if (pandit) {
      // Only use pandit.id if it's a real UUID — skip seed/legacy rows
      const safePanditId = isValidUUID(pandit.id) ? pandit.id : null;
      setPanditId(safePanditId);
      setPanditName(pandit.name);
      setPanditOnline(pandit.is_online || false);
      localStorage.setItem("devsetu_pandit", JSON.stringify({ id: pandit.id, name: pandit.name }));
      // Redirect pandit to their portal after OTP login
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/pandit')) {
        window.location.href = '/pandit/dashboard';
      }
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
    // One-time cleanup of bad non-UUID IDs from localStorage
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    try {
      const stored = localStorage.getItem('devsetu_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id && !uuidRegex.test(parsed.id)) localStorage.removeItem('devsetu_user');
      }
    } catch(e) { localStorage.removeItem('devsetu_user'); }
    try {
      const stored = localStorage.getItem('devsetu_pandit');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id && !uuidRegex.test(parsed.id)) localStorage.removeItem('devsetu_pandit');
      }
    } catch(e) { localStorage.removeItem('devsetu_pandit'); }

    const restore = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          // Fallback: localStorage for offline/demo
          // Only restore IDs that are valid UUIDs — discard old DEVXXXXX format IDs
          const saved = localStorage.getItem("devsetu_user");
          if (saved) {
            const u = JSON.parse(saved);
            const safeId = toUUID(u.id) || genId();   // upgrade legacy IDs to real UUID
            if (safeId !== u.id) localStorage.setItem("devsetu_user", JSON.stringify({ ...u, id: safeId }));
            setDevoteeId(safeId); setDevoteeName(u.name); setDevoteeCity(u.city || "Delhi");
          }
          const ps = localStorage.getItem("devsetu_pandit");
          if (ps) {
            const p = JSON.parse(ps);
            const validPanditId = p.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id) ? p.id : null;
            setPanditId(validPanditId); setPanditName(p.name);
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
      const { data } = await supabase.from('festivals').select('*').gte('date', new Date().toISOString().split('T')[0]);
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

  // Kept for guest/demo flow — devoteeId stays null until Supabase auth creates a real UUID row
  const handleLogin = (phone, name, city) => {
    setDevoteeId(null); setDevoteeName(name || "New User"); setDevoteeCity(city || "Delhi");
    localStorage.setItem("devsetu_user", JSON.stringify({ id: null, name, city }));
    setShowLogin(false); setShowUserOnboarding(true);
    toast(`Welcome, ${name}! 🙏`);
  };

  // Testing bypass — sets a demo devotee session without OTP
  const loginDevoteeDemo = (name) => {
    const id = genId();
    const displayName = name || 'Demo Devotee';
    setDevoteeId(id);
    setDevoteeName(displayName);
    setDevoteeCity('Delhi');
    localStorage.setItem("devsetu_user", JSON.stringify({ id, name: displayName, city: 'Delhi' }));
    setShowLogin(false);
    toast(`Demo mode: logged in as ${displayName} 🙏`, "⚡");
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

  // Demo pandit login — full profile for end-to-end testing
  const DEMO_PANDIT_PROFILE = {
    id: 'demo-pandit-001',
    name: 'Pt. Ramesh Sharma',
    phone: '+91-9999888877',
    city: 'Delhi',
    experience_years: 22,
    years_of_experience: 22,
    rating: 4.9,
    review_count: 148,
    min_fee: 2100,
    max_fee: 8500,
    specializations: ['Griha Pravesh', 'Vivah', 'Satyanarayan Katha', 'Rudrabhishek', 'Navgrah Shanti'],
    specialization: ['Griha Pravesh', 'Vivah', 'Satyanarayan Katha'],
    languages: ['Hindi', 'Sanskrit', 'English'],
    bio: 'Third-generation Vedic scholar trained in Kashi Vidyapeeth. Expert in house warming, wedding ceremonies, and planetary rituals. Available across Delhi NCR with 22+ years of experience.',
    status: 'verified',
    verified_status: 'approved',
    is_online: true,
    intro_video_url: null,
    aadhar_verified: true,
    education: 'Shastri, Kashi Vidyapeeth',
    address: 'Laxmi Nagar, New Delhi - 110092',
  };

  const loginPanditDemo = (id, name) => {
    const pid = id || 'demo-pandit-001';
    const pName = name || 'Pt. Ramesh Sharma';
    setPanditId(pid);
    setPanditName(pName);
    localStorage.setItem('devsetu_pandit', JSON.stringify({ id: pid, name: pName, profile: DEMO_PANDIT_PROFILE }));
    toast(`Pandit portal unlocked — Namaste, ${pName} 🕉️`);
  };

  const addToCart = (item) => {
    // Allow guest cart for samagri browsing; only require login for actual booking checkout
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    toast(`${item.name} added to basket!`, item.icon || "🛒");
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
        devotee_id:   toUUID(devoteeId),
        devotee_name: devoteeName,
        pandit_id:    toUUID(bookingDraft.panditId),
        pandit_name:  bookingDraft.panditName,
        ritual: bookingDraft.ritual, 
        ritual_name: bookingDraft.ritual,
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
      }).select("id, ritual, booking_date, booking_time").single();

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
        user_id: toUUID(devoteeId),
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
        user_id:    toUUID(devoteeId),
        pandit_id:  toUUID(panditId),
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
    adminRole, setAdminRole, loginAdmin, loginAdminDemo, loginPanditDemo, loginDevoteeDemo, authLoading,
    cart, addToCart, updateCartQty, cartCount: cart.reduce((sum, i) => sum + (i.qty || 1), 0),
    showCart, setShowCart, showLogin, setShowLogin,
    showAdminLogin, setShowAdminLogin,
    showConfirm, setShowConfirm, bookingDraft, setBookingDraft,
    showSuccess, setShowSuccess,
    lastBooking, setLastBooking,
    showUserOnboarding, setShowUserOnboarding,
    showPanditOnboarding, setShowPanditOnboarding,
    toasts, toast, handleLogin, logout, confirmBooking, submitReview, loading,
    viewPandit, setViewPandit,
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
