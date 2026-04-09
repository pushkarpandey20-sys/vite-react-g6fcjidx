export const RITUAL_CATEGORIES = [
  'All','Grih & Vastu','Marriage','Childhood Sanskars','Planetary & Dosh',
  'Shiva','Vishnu','Devi','Pitru Karma','Havan & Yagna',
  'Last Rites','Festival Puja'
];

export const ALL_RITUALS = [
  // GRIH & VASTU
  { id:'griha-pravesh',    name:'Griha Pravesh',             category:'Grih & Vastu',       icon:'🏡', price:2100, duration:'3-4 hrs',  popular:true,  desc:'Sacred home-entry ceremony. Vastu puja, Ganesh puja, havan and purification of all rooms.', samagriRequired:false },
  { id:'bhoomi-puja',      name:'Bhoomi Puja',               category:'Grih & Vastu',       icon:'🌍', price:1800, duration:'2 hrs',    popular:false, desc:'Ground-breaking ceremony before construction. Invokes blessings of Bhoomi Devi.', samagriRequired:false },
  { id:'vastu-shanti',     name:'Vastu Shanti',              category:'Grih & Vastu',       icon:'🏠', price:3500, duration:'3 hrs',    popular:false, desc:'Removes Vastu doshas from home or office. Room-by-room purification with havan and Navgrah puja.', samagriRequired:false },
  { id:'office-opening',   name:'Office / Shop Opening Puja',category:'Grih & Vastu',       icon:'🏢', price:2500, duration:'2-3 hrs', popular:false, desc:'Auspicious opening ceremony. Lakshmi puja, Ganesh puja, fire ritual and blessings.', samagriRequired:false },
  { id:'vehicle-puja',     name:'New Vehicle Puja',          category:'Grih & Vastu',       icon:'🚗', price:800,  duration:'45 min',  popular:false, desc:'Blessing for new vehicle with flowers, coconut, camphor and sacred thread.', samagriRequired:false },
  // MARRIAGE
  { id:'vivah',            name:'Vivah Ceremony',            category:'Marriage',            icon:'💍', price:8000, duration:'6-8 hrs', popular:true,  desc:'Complete Hindu wedding — 7 Saptapadi vows, Kanyadaan, Sindoor, Mangalsutra and sacred fire.', samagriRequired:true },
  { id:'engagement-puja',  name:'Sagai / Engagement Puja',  category:'Marriage',            icon:'💒', price:2500, duration:'2 hrs',   popular:false, desc:'Engagement ceremony with Ganesh puja, ring exchange and Vedic blessings.', samagriRequired:false },
  { id:'kundli-milan',     name:'Kundli Milan Puja',         category:'Marriage',            icon:'📿', price:1500, duration:'1.5 hrs', popular:false, desc:'Horoscope matching ritual. 36 guna verification, Mangal dosha check and remedial puja.', samagriRequired:false },
  { id:'saptapadi',        name:'Saptapadi (7 Vows)',        category:'Marriage',            icon:'🔥', price:3000, duration:'2 hrs',   popular:false, desc:'The seven sacred vows around the fire. Ideal for court marriages seeking Vedic completion.', samagriRequired:false },
  // CHILDHOOD
  { id:'namkaran',         name:'Namkaran Ceremony',         category:'Childhood Sanskars', icon:'🍼', price:1000, duration:'1 hr',    popular:true,  desc:'Baby naming ceremony. Auspicious name from birth nakshatra, gotra and family tradition.', samagriRequired:false },
  { id:'mundan',           name:'Mundan / Chudakarana',      category:'Childhood Sanskars', icon:'✂️', price:1200, duration:'1-2 hrs', popular:true,  desc:'First hair removal — important childhood sanskar. Head shaving, havan and puja.', samagriRequired:false },
  { id:'annaprashan',      name:'Annaprashan',               category:'Childhood Sanskars', icon:'🍚', price:1100, duration:'1 hr',    popular:false, desc:'First solid food ceremony at 6 months. Puja, kheer offering and family ritual.', samagriRequired:false },
  { id:'janeu',            name:'Janeu / Upanayana',         category:'Childhood Sanskars', icon:'🧵', price:3500, duration:'4 hrs',   popular:false, desc:'Sacred thread ceremony — coming-of-age for boys. Full Vedic ceremony with Gayatri initiation.', samagriRequired:true },
  { id:'birthday-puja',    name:'Birthday Puja',             category:'Childhood Sanskars', icon:'🎂', price:900,  duration:'1 hr',    popular:false, desc:'Vedic birthday puja with janam nakshatra puja, aayush havan and family blessings.', samagriRequired:false },
  { id:'nishkraman',       name:'Nishkraman Sanskar',        category:'Childhood Sanskars', icon:'🌞', price:800,  duration:'45 min',  popular:false, desc:'First outing for infant at 3-4 months. Baby shown sun and moon for the first time.', samagriRequired:false },
  // PLANETARY
  { id:'navgrah-shanti',   name:'Navgrah Shanti',            category:'Planetary & Dosh',   icon:'⭐', price:1800, duration:'2-3 hrs', popular:true,  desc:'Nine planet appeasement. Removes career, health and relationship obstacles caused by planets.', samagriRequired:false },
  { id:'kaal-sarp',        name:'Kaal Sarp Dosh Nivaran',   category:'Planetary & Dosh',   icon:'🐍', price:3500, duration:'3-4 hrs', popular:true,  desc:'Removes Kaal Sarp Dosh — all planets between Rahu-Ketu. Powerful remedial ritual.', samagriRequired:false },
  { id:'mangal-dosh',      name:'Mangal Dosh Puja',          category:'Planetary & Dosh',   icon:'🔴', price:2200, duration:'2 hrs',   popular:false, desc:'Removes Manglik dosha before marriage. Mangal Yantra, Hanuman puja and fire ritual.', samagriRequired:false },
  { id:'pitra-dosh',       name:'Pitra Dosh Nivaran',        category:'Planetary & Dosh',   icon:'🌊', price:2800, duration:'3 hrs',   popular:false, desc:'Removes ancestral curse. Tarpan, pind daan and havan for family peace.', samagriRequired:false },
  { id:'shani-puja',       name:'Shani Puja / Shani Shanti', category:'Planetary & Dosh',   icon:'⚫', price:1500, duration:'2 hrs',   popular:false, desc:'Saturn appeasement on Saturdays. Removes Sade Sati, Dhaiya and Saturn mahadasha effects.', samagriRequired:false },
  { id:'rahu-ketu-puja',   name:'Rahu Ketu Puja',            category:'Planetary & Dosh',   icon:'🌑', price:2000, duration:'2 hrs',   popular:false, desc:'Shadow planet ritual. Removes sudden obstacles, accidents and karmic debts.', samagriRequired:false },
  // SHIVA
  { id:'rudrabhishek',     name:'Rudrabhishek',              category:'Shiva',              icon:'🔱', price:2500, duration:'2 hrs',   popular:true,  desc:'Shivalinga abhishek with milk, honey, gangajal and bel patra. Rudrashtadhyayi chanting.', samagriRequired:true },
  { id:'maha-mrityunjaya', name:'Maha Mrityunjaya Jaap',     category:'Shiva',              icon:'🕉️', price:3000, duration:'3-4 hrs', popular:false, desc:'125,000 Maha Mrityunjaya chanting for health, long life and protection from untimely death.', samagriRequired:false },
  { id:'shivaratri-puja',  name:'Mahashivaratri Puja',       category:'Shiva',              icon:'🌙', price:2000, duration:'4 hrs',   popular:false, desc:'Four prahar Shiva puja through the night. Special abhishek on Mahashivaratri.', samagriRequired:true },
  // VISHNU
  { id:'satyanarayan',     name:'Satyanarayan Katha',        category:'Vishnu',             icon:'🌟', price:1500, duration:'2-3 hrs', popular:true,  desc:'Lord Vishnu puja for prosperity, well-being and obstacles removal. With prasad distribution.', samagriRequired:true },
  { id:'vishnu-puja',      name:'Vishnu Sahasranama Puja',   category:'Vishnu',             icon:'🪷', price:1800, duration:'2 hrs',   popular:false, desc:'1008 names of Lord Vishnu with pushparchana and Tulsi abhishek for prosperity and peace.', samagriRequired:false },
  { id:'ekadashi-puja',    name:'Ekadashi Puja',             category:'Vishnu',             icon:'🌊', price:1100, duration:'1.5 hrs', popular:false, desc:'Fasting day puja for Lord Vishnu. Includes Tulsi puja and Dwadashi parana ritual.', samagriRequired:false },
  // DEVI
  { id:'durga-puja',       name:'Durga Puja / Saptashati',  category:'Devi',               icon:'🦁', price:2500, duration:'3 hrs',   popular:false, desc:'700 verses of Durga Saptashati for protection, strength and removal of enemies.', samagriRequired:false },
  { id:'lakshmi-puja',     name:'Lakshmi Puja',              category:'Devi',               icon:'🪷', price:1500, duration:'2 hrs',   popular:true,  desc:'Maa Lakshmi puja for wealth, prosperity. Performed Fridays and Diwali with lotus.', samagriRequired:true },
  { id:'saraswati-puja',   name:'Saraswati Puja',            category:'Devi',               icon:'📚', price:1200, duration:'1.5 hrs', popular:false, desc:'Goddess of knowledge puja for academic success. Performed before exams and Vasant Panchami.', samagriRequired:false },
  { id:'navratri-puja',    name:'Navratri Puja (9 Days)',    category:'Devi',               icon:'🌺', price:5000, duration:'9 days',  popular:false, desc:'Nine days of Shakti worship — each day one form of Devi. Daily puja, garba and kanjak.', samagriRequired:true },
  // HAVAN & YAGNA
  { id:'ganesh-puja',      name:'Ganesh Puja',               category:'Havan & Yagna',      icon:'🐘', price:1200, duration:'1.5 hrs', popular:true,  desc:'Lord Ganesh puja before any auspicious work. Removes all obstacles. Always performed first.', samagriRequired:false },
  { id:'havan',            name:'Havan / Homam',             category:'Havan & Yagna',      icon:'🔥', price:2000, duration:'2-3 hrs', popular:true,  desc:'Sacred fire ritual with ghee, herbs and grains. Purifies home and fulfills specific wishes.', samagriRequired:true },
  { id:'sunderkand',       name:'Sunderkand Path',           category:'Havan & Yagna',      icon:'🐒', price:1800, duration:'3-4 hrs', popular:false, desc:'Fifth chapter of Ramcharitmanas — powerful for removing obstacles, fear and black magic.', samagriRequired:false },
  { id:'akhand-ramayan',   name:'Akhand Ramayan Path',       category:'Havan & Yagna',      icon:'📖', price:5000, duration:'24 hrs',  popular:false, desc:'Continuous uninterrupted Ramcharitmanas recitation. Brings peace and fulfills desires.', samagriRequired:false },
  { id:'bhagwat-katha',    name:'Bhagwat Katha (7 Days)',    category:'Havan & Yagna',      icon:'📿', price:15000,duration:'7 days',  popular:false, desc:'Seven-day Shrimad Bhagwat recitation. Spiritual merit equal to all pilgrimages.', samagriRequired:false },
  // PITRU KARMA
  { id:'shraddha',         name:'Shraddha / Pitru Tarpan',  category:'Pitru Karma',        icon:'💧', price:2500, duration:'3 hrs',   popular:false, desc:'Annual ritual for departed ancestors during Pitru Paksha. Tarpan and Brahmin feeding.', samagriRequired:false },
  { id:'narayan-bali',     name:'Narayan Bali',              category:'Pitru Karma',        icon:'🕊️', price:8000, duration:'2 days',  popular:false, desc:'Removes untimely death curse from lineage. Trimbakeshwar-style 2-day ceremony.', samagriRequired:false },
  // LAST RITES
  { id:'antyesti',         name:'Antyesti (Last Rites)',     category:'Last Rites',         icon:'🕯️', price:2000, duration:'3-4 hrs', popular:false, desc:'Complete Hindu last rites — all 16 stages from departure to 13th day with Vedic procedure.', samagriRequired:false },
  { id:'terahvin-puja',    name:'Terahvin / 13th Day Puja', category:'Last Rites',         icon:'🙏', price:3000, duration:'4-5 hrs', popular:false, desc:'13th day ceremony. Brahmin bhojan, Garuda Puran completion and final prayers.', samagriRequired:false },
  // FESTIVAL
  { id:'diwali-puja',      name:'Diwali Lakshmi-Ganesh Puja',category:'Festival Puja',     icon:'🪔', price:1800, duration:'2 hrs',   popular:true,  desc:'Auspicious Diwali puja. Full Lakshmi-Ganesh sthapana, 16-step puja and aarti.', samagriRequired:true },
  { id:'ganesh-chaturthi', name:'Ganesh Chaturthi Puja',     category:'Festival Puja',     icon:'🐘', price:2000, duration:'2.5 hrs', popular:false, desc:'Idol installation, 10-day puja arrangements and visarjan ceremony.', samagriRequired:true },
  { id:'chhath-puja',      name:'Chhath Puja',               category:'Festival Puja',     icon:'🌅', price:3000, duration:'4 days',  popular:false, desc:'Four-day sun worship — Nahay Khay, Kharna, Sandhya and Usha arghya at water body.', samagriRequired:false },
];

export const POPULAR_RITUALS = ALL_RITUALS.filter(r => r.popular);
