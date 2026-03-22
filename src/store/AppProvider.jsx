import React, { useState, useEffect } from 'react';
import { AppCtx } from './AppCtx';
import { db, genId } from '../services/supabase';
import { MUHURTAS, SEVA_OPTIONS } from '../api/constants';

export function AppProvider({ children }) {
  // Global State
  const [activeApp, setActiveApp] = useState(null); // 'user', 'pandit', 'admin'
  const [activePage, setActivePage] = useState("home");
  const [devoteeId, setDevoteeId] = useState(null);
  const [devoteeName, setDevoteeName] = useState("Guest");
  const [devoteeCity, setDevoteeCity] = useState("Not Specified");
  const [panditId, setPanditId] = useState(null);
  const [panditOnline, setPanditOnline] = useState(false);
  const [adminRole, setAdminRole] = useState("superadmin");

  // Cart & UI State
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUserOnboarding, setShowUserOnboarding] = useState(false);
  const [showPanditOnboarding, setShowPanditOnboarding] = useState(false);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [viewPandit, setViewPandit] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("devsetu_user");
    if (saved) {
      const u = JSON.parse(saved);
      setDevoteeId(u.id);
      setDevoteeName(u.name);
      setDevoteeCity(u.city || "Not Specified");
    }
    const ps = localStorage.getItem("devsetu_pandit");
    if (ps) {
      const p = JSON.parse(ps);
      setPanditId(p.id);
      setPanditOnline(p.status === "available");
    }
  }, []);

  const toast = (msg, icon = "🕉️") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, icon }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3000);
  };

  const addToCart = (item) => {
    if (!devoteeId) {
      setShowLogin(true);
      return;
    }
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

  const handleLogin = (phone, name, city) => {
    const id = genId("DEV");
    setDevoteeId(id);
    setDevoteeName(name || "New User");
    setDevoteeCity(city || "Not Specified");
    localStorage.setItem("devsetu_user", JSON.stringify({ id, name, city }));
    setShowLogin(false);
    setShowUserOnboarding(true);
    toast(`Welcome, ${name}! 🙏`);
  };

  const logout = () => {
    setDevoteeId(null);
    setDevoteeName("Guest");
    localStorage.removeItem("devsetu_user");
    setActiveApp(null);
    toast("Logged out successfully");
  };

  const confirmBooking = async () => {
    if (!bookingDraft) return;
    setLoading(true);
    const { data, error } = await db.bookings().insert({
      devotee_id: devoteeId, devotee_name: devoteeName, devotee_emoji: "👤",
      pandit_id: bookingDraft.panditId, pandit_name: bookingDraft.panditName,
      ritual: bookingDraft.ritual, ritual_icon: bookingDraft.ritualIcon,
      amount: bookingDraft.amount, booking_date: bookingDraft.date, booking_time: bookingDraft.time,
      location: bookingDraft.location, address: bookingDraft.address, notes: bookingDraft.notes
    }).select().single();

    if (!error) {
      toast("Booking Confirmed! 🙏");
      setShowConfirm(false);
      setBookingDraft(null);
      setActivePage("history");
    } else {
      toast("Error recording booking", "❌");
    }
    setLoading(false);
  };

  const value = {
    db, activeApp, setActiveApp, activePage, setActivePage,
    devoteeId, devoteeName, devoteeCity, panditId, panditOnline, setPanditOnline,
    adminRole, setAdminRole, cart, addToCart, updateCartQty, cartCount: cart.length,
    showCart, setShowCart, showLogin, setShowLogin, showConfirm, setShowConfirm,
    showUserOnboarding, setShowUserOnboarding, showPanditOnboarding, setShowPanditOnboarding,
    bookingDraft, setBookingDraft, viewPandit, setViewPandit, toasts, toast, handleLogin, logout,
    confirmBooking, loading, MUHURTAS, SEVA_OPTIONS
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
