import { supabase } from './supabase';

// ── Vedic Calendar Data ────────────────────────────────────────
const VEDIC_CALENDAR = {
  tithis: {
    ekadashi: {
      name: 'Ekadashi',
      recommended: ['Satyanarayan Katha', 'Vishnu Sahasranaam', 'Ekadashi Vrat Pooja'],
      message: 'Today is Ekadashi — most auspicious day for Vishnu worship',
      icon: '🌙',
      muhurat: ['6:00 AM', '12:00 PM', '6:00 PM'],
    },
    purnima: {
      name: 'Purnima',
      recommended: ['Satyanarayan Katha', 'Laxmi Pooja', 'Hanuman Chalisa Path'],
      message: 'Purnima today — ideal for Satyanarayan Katha and Laxmi Pooja',
      icon: '🌕',
      muhurat: ['5:30 AM', '7:00 AM', '5:00 PM'],
    },
    amavasya: {
      name: 'Amavasya',
      recommended: ['Pitra Tarpan', 'Kali Pooja', 'Navgrah Shanti'],
      message: 'Amavasya — perform Pitra Tarpan and Navgrah Shanti today',
      icon: '🌑',
      muhurat: ['6:00 AM', '12:00 PM'],
    },
    pradosh: {
      name: 'Pradosh',
      recommended: ['Rudrabhishek', 'Shiva Pooja', 'Maha Mrityunjaya Jaap'],
      message: "Pradosh Vrat today — Rudrabhishek brings Shiva's blessings",
      icon: '🔱',
      muhurat: ['5:00 PM', '6:00 PM', '7:00 PM'],
    },
    chaturthi: {
      name: 'Chaturthi',
      recommended: ['Ganesh Pooja', 'Ganesh Chaturthi Puja', 'Ganesh Sahasranaam'],
      message: 'Chaturthi — most auspicious day to worship Ganesha',
      icon: '🐘',
      muhurat: ['8:00 AM', '10:00 AM', '12:00 PM'],
    },
    navami: {
      name: 'Navami',
      recommended: ['Ram Navami Pooja', 'Durga Pooja', 'Sunderkand Path'],
      message: 'Navami — worship Maa Durga and Lord Ram today',
      icon: '🏹',
      muhurat: ['6:00 AM', '9:00 AM', '12:00 PM'],
    },
  },
  weekdays: {
    0: { deity: 'Sun', recommended: ['Surya Pooja', 'Aditya Hridayam', 'Surya Namaskar Pooja'], message: 'Sunday — auspicious for Surya Pooja and health rituals', icon: '☀️' },
    1: { deity: 'Moon', recommended: ['Shiva Pooja', 'Rudrabhishek', 'Shiv Lingam Abhishek'], message: "Monday — Lord Shiva's day, ideal for Rudrabhishek", icon: '🔱' },
    2: { deity: 'Mars', recommended: ['Hanuman Pooja', 'Hanuman Chalisa', 'Bajrang Baan Path'], message: "Tuesday — Hanuman Ji's day, perfect for obstacle removal", icon: '🙏' },
    3: { deity: 'Mercury', recommended: ['Vishnu Pooja', 'Satyanarayan Katha', 'Vishnu Sahasranaam'], message: "Wednesday — Lord Vishnu's day for prosperity", icon: '🌟' },
    4: { deity: 'Jupiter', recommended: ['Brihaspati Pooja', 'Vishnu Pooja', 'Navgrah Shanti'], message: "Thursday — Guru's day, auspicious for education & wisdom", icon: '⭐' },
    5: { deity: 'Venus', recommended: ['Laxmi Pooja', 'Vaibhav Laxmi Vrat', 'Shukra Pooja'], message: "Friday — Maa Laxmi's day for wealth and prosperity", icon: '🪷' },
    6: { deity: 'Saturn', recommended: ['Shani Pooja', 'Hanuman Pooja', 'Kaal Sarp Dosh Nivaran'], message: "Saturday — Shani Dev's day, powerful for dosh removal", icon: '🌑' },
  },
  festivals: [
    { month: 3, day: 14, name: 'Holi', recommended: ['Holika Dahan Pooja', 'Laxmi Pooja'], message: 'Holi approaching — book Holika Dahan Pooja now', icon: '🎨' },
    { month: 4, day: 6, name: 'Ram Navami', recommended: ['Ram Navami Pooja', 'Sunderkand Path'], message: 'Ram Navami approaching — book your pooja now', icon: '🏹' },
    { month: 4, day: 14, name: 'Baisakhi', recommended: ['Vishnu Pooja', 'Satyanarayan Katha'], message: 'Baisakhi approaching — celebrate with a special pooja', icon: '🌾' },
    { month: 9, day: 22, name: 'Navratri', recommended: ['Navratri Pooja', 'Durga Pooja', 'Kanya Pooja'], message: 'Navratri coming — book your 9-day Durga Pooja package', icon: '🌺' },
    { month: 11, day: 8, name: 'Diwali', recommended: ['Laxmi Pooja', 'Diwali Pooja', 'Kali Pooja'], message: 'Diwali approaching — book Laxmi Pooja with verified pandit', icon: '🪔' },
  ],
};

// ── Muhurat Engine ─────────────────────────────────────────────
export function getTodaysMuhurat() {
  const now = new Date();
  const hour = now.getHours();
  const muhurats = [
    { time: '6:00 AM', hour: 6, name: 'Brahma Muhurat', quality: 'Most Auspicious', desc: 'Best time for spiritual practices and new beginnings' },
    { time: '7:30 AM', hour: 7, name: 'Abhijit Muhurat', quality: 'Auspicious', desc: 'Favorable for important tasks and ceremonies' },
    { time: '12:00 PM', hour: 12, name: 'Madhyahna', quality: 'Good', desc: 'Good for Satyanarayan and prosperity rituals' },
    { time: '4:00 PM', hour: 16, name: 'Pradosh Kaal', quality: 'Auspicious', desc: 'Powerful time for Shiva worship' },
    { time: '6:30 PM', hour: 18, name: 'Sandhya Kaal', quality: 'Sacred', desc: 'Ideal for evening prayers and aarti' },
    { time: '8:00 PM', hour: 20, name: 'Nishita Kaal', quality: 'Powerful', desc: 'Best for Kali and Navdurga worship' },
  ];
  return muhurats.map(m => ({ ...m, isPast: hour > m.hour, isCurrent: hour === m.hour, isNext: hour < m.hour }));
}

export function getNextShubhMuhurat() {
  const muhurats = getTodaysMuhurat();
  return muhurats.find(m => m.isNext || m.isCurrent) || muhurats[0];
}

// ── Tithi Calculator (approximate) ────────────────────────────
export function getTodaysTithi() {
  const now = new Date();
  const day = now.getDate();
  const weekday = now.getDay();
  const tithiCycle = ['pratipada','dwitiya','tritiya','chaturthi','panchami','shashthi','saptami','ashtami','navami','dashami','ekadashi','dwadashi','trayodashi','chaturdashi','purnima'];
  const tithiIndex = (day - 1) % 15;
  const tithiName = tithiCycle[tithiIndex];
  const weekdayInfo = VEDIC_CALENDAR.weekdays[weekday];
  const tithiInfo = VEDIC_CALENDAR.tithis[tithiName] || null;
  return { tithi: tithiName, tithiInfo, weekday, weekdayInfo };
}

// ── Upcoming Festivals ─────────────────────────────────────────
export function getUpcomingFestivals(daysAhead = 7) {
  const now = new Date();
  return VEDIC_CALENDAR.festivals
    .map(f => {
      let nextDate = new Date(now.getFullYear(), f.month - 1, f.day);
      if (nextDate < now) {
        nextDate = new Date(now.getFullYear() + 1, f.month - 1, f.day);
      }

      const diff = (nextDate - now) / (1000 * 60 * 60 * 24);
      return { ...f, date: nextDate.toISOString().split('T')[0], daysAway: Math.ceil(diff) };
    })
    .filter(f => f.daysAway >= 0 && f.daysAway <= daysAhead)
    .sort((a, b) => a.daysAway - b.daysAway);
}

// ── Smart Recommendation Engine ────────────────────────────────
export function getSmartRecommendations(userSearchHistory = [], userBookingHistory = []) {
  const { tithi, tithiInfo, weekdayInfo } = getTodaysTithi();
  const recommendations = [];

  if (tithiInfo) {
    recommendations.push({
      id: `tithi_${tithi}`,
      type: 'tithi',
      priority: 1,
      title: `${tithiInfo.icon} ${tithiInfo.name} Today`,
      message: tithiInfo.message,
      rituals: tithiInfo.recommended,
      muhurat: tithiInfo.muhurat,
      cta: 'Book Now — Auspicious Day',
      urgency: 'high',
    });
  }

  if (weekdayInfo) {
    recommendations.push({
      id: `weekday_${new Date().getDay()}`,
      type: 'weekday',
      priority: 2,
      title: `${weekdayInfo.icon} ${weekdayInfo.deity}'s Day`,
      message: weekdayInfo.message,
      rituals: weekdayInfo.recommended,
      cta: 'Book Pooja',
      urgency: 'medium',
    });
  }

  userSearchHistory.forEach((search, i) => {
    const nextMuhurat = getNextShubhMuhurat();
    recommendations.push({
      id: `search_${i}`,
      type: 'search_reminder',
      priority: 3,
      title: `⏰ Shubh Muhurat for ${search}`,
      message: `Next auspicious time for ${search} is at ${nextMuhurat.time} — ${nextMuhurat.name}`,
      rituals: [search],
      muhurat: [nextMuhurat.time],
      cta: `Book for ${nextMuhurat.time}`,
      urgency: 'high',
    });
  });

  const festivals = getUpcomingFestivals(7);
  festivals.forEach(f => {
    recommendations.push({
      id: `festival_${f.name}`,
      type: 'festival',
      priority: 2,
      title: `${f.icon} ${f.name} Approaching`,
      message: f.message,
      rituals: f.recommended,
      cta: 'Book Festival Pooja',
      urgency: 'high',
    });
  });

  userBookingHistory.forEach((booking, i) => {
    const rName = booking.ritual || booking.ritual_name;
    if (rName) {
      recommendations.push({
        id: `rebooking_${i}`,
        type: 'rebooking',
        priority: 4,
        title: `🔄 Repeat ${rName}`,
        message: `You booked ${rName} before. Book it again on this auspicious ${getTodaysTithi().tithiInfo?.name || 'day'}.`,
        rituals: [rName],
        cta: 'Book Again',
        urgency: 'low',
      });
    }
  });

  return recommendations.sort((a, b) => a.priority - b.priority);
}

// ── Browser Push Notification System ──────────────────────────
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function sendBrowserNotification(title, body, options = {}) {
  if (Notification.permission !== 'granted') return;
  const notification = new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: options.tag || 'devsetu',
    requireInteraction: options.urgent || false,
    data: options.data || {},
  });
  notification.onclick = () => {
    window.focus();
    if (options.url) window.location.href = options.url;
    notification.close();
  };
  return notification;
}

// ── In-App Notification Store ──────────────────────────────────
class NotificationStore {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem('ds_notifications') || '[]');
    this.listeners = [];
    this.searchHistory = JSON.parse(localStorage.getItem('ds_search_history') || '[]');
  }
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }
  notify() {
    this.listeners.forEach(fn => fn([...this.notifications]));
  }
  add(notification) {
    const n = {
      id: Date.now() + Math.random(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    this.notifications = [n, ...this.notifications].slice(0, 50);
    localStorage.setItem('ds_notifications', JSON.stringify(this.notifications));
    this.notify();
    return n;
  }
  markRead(id) {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('ds_notifications', JSON.stringify(this.notifications));
    this.notify();
  }
  markAllRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('ds_notifications', JSON.stringify(this.notifications));
    this.notify();
  }
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
  recordSearch(query) {
    if (!query || query.length < 3) return;
    this.searchHistory = [query, ...this.searchHistory.filter(s => s !== query)].slice(0, 10);
    localStorage.setItem('ds_search_history', JSON.stringify(this.searchHistory));
  }
  getSearchHistory() {
    return this.searchHistory;
  }
  clearSearch() {
    this.searchHistory = [];
    localStorage.removeItem('ds_search_history');
  }
}

export const notificationStore = new NotificationStore();

// Legacy alias for backward compat with Dashboard
export const notificationService = {
  notifyDevoteeOfAcceptance: () => {},
  notifyPanditOfNewBooking: () => {},
  send: async () => {},
};

// ── Notification Scheduler ─────────────────────────────────────
export function startNotificationScheduler(devoteeId = null) {
  runDailyNotifications(devoteeId);
  const interval = setInterval(() => runMuhuratNotifications(devoteeId), 30 * 60 * 1000);
  scheduleDaily6AM(() => runDailyNotifications(devoteeId));
  return () => clearInterval(interval);
}

function scheduleDaily6AM(fn) {
  const now = new Date();
  const next6AM = new Date(now);
  next6AM.setHours(6, 0, 0, 0);
  if (now >= next6AM) next6AM.setDate(next6AM.getDate() + 1);
  const msUntil6AM = next6AM - now;
  setTimeout(() => { fn(); setInterval(fn, 24 * 60 * 60 * 1000); }, msUntil6AM);
}

async function runDailyNotifications(devoteeId) {
  const { tithiInfo, weekdayInfo } = getTodaysTithi();
  const nextMuhurat = getNextShubhMuhurat();

  if (tithiInfo) {
    notificationStore.add({
      type: 'tithi', icon: tithiInfo.icon, title: `${tithiInfo.name} Today`,
      message: tithiInfo.message, rituals: tithiInfo.recommended,
      muhurat: tithiInfo.muhurat, cta: 'Book Recommended Pooja', url: '/user/booking', urgency: 'high',
    });
    sendBrowserNotification(
      `🕉️ ${tithiInfo.name} Today — DevSetu`,
      `${tithiInfo.message}. Next muhurat: ${nextMuhurat.time}`,
      { tag: 'tithi', urgent: true, url: '/user/booking' }
    );
  }

  if (weekdayInfo) {
    notificationStore.add({
      type: 'weekday', icon: weekdayInfo.icon, title: `${weekdayInfo.deity}'s Day`,
      message: weekdayInfo.message, rituals: weekdayInfo.recommended,
      cta: "Book Today's Pooja", url: '/user/booking', urgency: 'medium',
    });
  }

  const festivals = getUpcomingFestivals(7);
  festivals.forEach(f => {
    notificationStore.add({
      type: 'festival', icon: f.icon, title: `${f.name} Approaching`,
      message: f.message, rituals: f.recommended,
      cta: 'Book Festival Pooja', url: '/user/booking', urgency: 'high',
    });
  });

  if (devoteeId) {
    try {
      const { data: bookings } = await supabase
        .from('bookings').select('ritual, ritual_name, booking_date')
        .eq('devotee_id', devoteeId)
        .order('created_at', { ascending: false }).limit(3);
      if (bookings?.length) {
        bookings.forEach(b => {
          const rName = b.ritual || b.ritual_name;
          if (rName) {
            notificationStore.add({
              type: 'rebooking', icon: '🔄', title: `Book ${rName} Again`,
              message: `Today is auspicious for ${rName}. Book with your preferred pandit.`,
              rituals: [rName], cta: 'Book Again', url: '/user/booking', urgency: 'low',
            });
          }
        });
      }
    } catch (e) { console.log('notification booking fetch error', e); }
  }
}

async function runMuhuratNotifications() {
  const searchHistory = notificationStore.getSearchHistory();
  if (!searchHistory.length) return;
  const nextMuhurat = getNextShubhMuhurat();
  if (!nextMuhurat || nextMuhurat.isPast) return;
  searchHistory.slice(0, 3).forEach(search => {
    notificationStore.add({
      type: 'muhurat_reminder', icon: '⏰', title: `Shubh Muhurat for ${search}`,
      message: `${nextMuhurat.name} at ${nextMuhurat.time} — perfect for ${search}. ${nextMuhurat.desc}`,
      rituals: [search], muhurat: [nextMuhurat.time],
      cta: `Book for ${nextMuhurat.time}`, url: '/user/booking', urgency: 'high',
    });
    sendBrowserNotification(
      `⏰ Shubh Muhurat for ${search}`,
      `${nextMuhurat.name} at ${nextMuhurat.time} — ${nextMuhurat.desc}`,
      { tag: `muhurat_${search}`, url: '/user/booking' }
    );
  });
}

// ── Seed initial notifications on app start ────────────────────
export function initNotifications(devoteeId = null) {
  const { tithiInfo, weekdayInfo } = getTodaysTithi();
  const nextMuhurat = getNextShubhMuhurat();

  if (tithiInfo) {
    notificationStore.add({
      type: 'tithi', icon: tithiInfo.icon, title: `${tithiInfo.name} Today — Book Now`,
      message: tithiInfo.message, rituals: tithiInfo.recommended,
      muhurat: tithiInfo.muhurat, cta: 'Book Recommended Pooja', url: '/user/booking', urgency: 'high',
    });
  }
  notificationStore.add({
    type: 'muhurat', icon: '🕐', title: `Next Shubh Muhurat: ${nextMuhurat.time}`,
    message: `${nextMuhurat.name} — ${nextMuhurat.desc}`,
    cta: 'Book Now', url: '/user/booking',
    urgency: nextMuhurat.isCurrent ? 'high' : 'medium',
  });
  if (weekdayInfo) {
    notificationStore.add({
      type: 'weekday', icon: weekdayInfo.icon, title: `${weekdayInfo.deity}'s Day`,
      message: weekdayInfo.message, rituals: weekdayInfo.recommended,
      cta: "Book Today's Pooja", url: '/user/booking', urgency: 'medium',
    });
  }
  startNotificationScheduler(devoteeId);
}

export default notificationStore;
