import React, { useState, useEffect } from "react";
import { BucketItem, Achievement, SummerQuote } from "./types";
import { INITIAL_ITEMS, SUMMER_QUOTES, INITIAL_ACHIEVEMENTS } from "./data/scrapbookData";
import { BucketCard } from "./components/BucketCard";
import { 
  SunDoodle, 
  CloudDoodle,
  WatermelonDoodle, 
  FlowerDoodle, 
  HeartDoodle, 
  SparkleDoodle, 
  PinDoodle,
  getCategoryIcon
} from "./components/DoodleAssets";
import { playPopSound, playChimeSound } from "./utils/audio";
import { 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Plus, 
  Search, 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  CheckCircle,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // STATE DEFINITIONS
  const [items, setItems] = useState<BucketItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Completed" | "Uncompleted">("All");

  // New item creation state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Adventure");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Lightbox View State
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string | null>(null);

  // Daily Quote State
  const [dailyQuote, setDailyQuote] = useState<SummerQuote>({ quote: "", author: "" });

  // Milestone Showcase Overlay
  const [unlockedMilestone, setUnlockedMilestone] = useState<{
    title: string;
    description: string;
    icon: string;
  } | null>(null);

  // 1. CHOOSE DAILY QUOTE & LOAD PERSIDERED LOCAL STORAGE STATE
  useEffect(() => {
    // Determine daily quote using current day index
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % SUMMER_QUOTES.length;
    setDailyQuote(SUMMER_QUOTES[quoteIndex]);

    // Read stored items
    try {
      const storedItems = localStorage.getItem("calebs_summer_bucket_list_2026_items");
      const storedSound = localStorage.getItem("calebs_summer_bucket_list_2026_sound");
      const storedTheme = localStorage.getItem("calebs_summer_bucket_list_2026_theme");

      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        // First load: initialize with our beautiful list, assigning random slant angles
        const prep = INITIAL_ITEMS.map(it => ({
          ...it,
          images: [],
          angle: Number((Math.random() * 3 - 1.5).toFixed(1)) // rotation from -1.5 to 1.5 deg
        }));
        setItems(prep);
        localStorage.setItem("calebs_summer_bucket_list_2026_items", JSON.stringify(prep));
      }

      if (storedSound !== null) setSoundEnabled(storedSound === "true");
      if (storedTheme !== null) setDarkMode(storedTheme === "true");
    } catch (e) {
      console.warn("Storage reading failed, falling back", e);
    }

    // Fast loading scrapbook screen delay for high polish enter effect
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(loadTimer);
  }, []);

  // Sync state helpers to localStorage
  const saveItemsToDisk = (newItems: BucketItem[]) => {
    setItems(newItems);
    localStorage.setItem("calebs_summer_bucket_list_2026_items", JSON.stringify(newItems));
  };

  const toggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    localStorage.setItem("calebs_summer_bucket_list_2026_sound", String(nextSound));
  };

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem("calebs_summer_bucket_list_2026_theme", String(nextTheme));
  };

  // CHECK / UNCHECK BUCKET ITEM & COMMENCE CELEBRATIONS
  const handleToggleComplete = (id: string) => {
    const previousCompletedCount = items.filter(i => i.completed).length;
    const totalCount = items.length;

    const updated = items.map(item => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        const completeDateString = nextCompleted 
          ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : undefined;

        if (nextCompleted) {
          // Play acoustic pop
          if (soundEnabled) playPopSound();
          
          // Trigger crisp checkoff confetti
          confetti({
            particleCount: 80,
            spread: 50,
            origin: { y: 0.8 },
            colors: ["#f97316", "#38bdf8", "#fbbf24", "#f472b6", "#34d399"]
          });
        }

        return {
          ...item,
          completed: nextCompleted,
          dateCompleted: completeDateString
        };
      }
      return item;
    });

    saveItemsToDisk(updated);

    // Dynamic Milestone triggers Check!
    const updatedCompletedCount = updated.filter(i => i.completed).length;
    
    // Check if new milestone was achieved in this moment
    checkNewMilestones(previousCompletedCount, updatedCompletedCount, totalCount);
  };

  // MILESTONE CHECKS
  const checkNewMilestones = (prevCount: number, newCount: number, total: number) => {
    if (newCount > prevCount) {
      const prevPercent = (prevCount / total) * 100;
      const newPercent = (newCount / total) * 100;

      let milestoneUnlocked: any = null;

      if (prevPercent < 25 && newPercent >= 25) {
        milestoneUnlocked = {
          title: "Quarterway Explorer ☀️",
          description: "Look at you go! 25% of Caleb's Summer Bucket list complete. 2026 is heating up!",
          icon: "🧭"
        };
      } else if (prevPercent < 50 && newPercent >= 50) {
        milestoneUnlocked = {
          title: "Halfway Holidaymaker 🌊",
          description: "50% Completed! Halfway through Caleb's bucket list. So many beautiful summer memories saved!",
          icon: "😎"
        };
      } else if (prevPercent < 75 && newPercent >= 75) {
        milestoneUnlocked = {
          title: "Summer Aficionado 🍇",
          description: "75% Completed! Three-quarters of the way to achieving pure summer legendary status!",
          icon: "🍓"
        };
      } else if (prevPercent < 100 && newPercent >= 100) {
        milestoneUnlocked = {
          title: "🎉 Summer Legend Complete! 🎉",
          description: "100% SUCCESS! You have completed every single adventure. Caleb's Summer 2026 is officially legendary!",
          icon: "👑"
        };
      } else if (prevCount === 0 && newCount === 1) {
        // Special First Adventure trigger
        milestoneUnlocked = {
          title: "First Step to Sunshine! ⛺",
          description: "You completed your very first adventure! This is the start of a beautiful journal.",
          icon: "🍉"
        };
      }

      if (milestoneUnlocked) {
        setTimeout(() => {
          triggerMilestoneCelebration(milestoneUnlocked);
        }, 600);
      }
    }
  };

  const triggerMilestoneCelebration = (milestone: { title: string; description: string; icon: string }) => {
    if (soundEnabled) playChimeSound();
    setUnlockedMilestone(milestone);

    // Fireworks cascade confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Spark cannons from left/right sides
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // UPDATE NOTES IN BUCKET ITEM
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    });
    saveItemsToDisk(updated);
  };

  // ADD NEW MEMORIES IMAGES
  const handleAddImages = (id: string, newImages: string[]) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          images: [...(item.images || []), ...newImages]
        };
      }
      return item;
    });
    saveItemsToDisk(updated);
  };

  // DELETE SINGLE IMAGE
  const handleDeleteImage = (id: string, imgIndex: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const kept = [...item.images];
        kept.splice(imgIndex, 1);
        return { ...item, images: kept };
      }
      return item;
    });
    saveItemsToDisk(updated);
  };

  // DELETE AN ENTIRE ACTIVITY CARD
  const handleDeleteActivity = (id: string) => {
    const matched = items.find(i => i.id === id);
    const confirmed = window.confirm(`Are you sure you want to rip "${matched?.title || "this activity"}" out of Caleb's Scrapbook?`);
    if (confirmed) {
      const updated = items.filter(item => item.id !== id);
      saveItemsToDisk(updated);
      if (soundEnabled) playPopSound();
    }
  };

  // CREATING A BRAND NEW ADVENTURE
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BucketItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      completed: false,
      category: newCategory,
      stickerType: getStickerTypeForCategory(newCategory),
      images: [],
      angle: Number((Math.random() * 3 - 1.5).toFixed(1))
    };

    saveItemsToDisk([newItem, ...items]);
    setNewTitle("");
    setIsAddFormOpen(false);
    
    if (soundEnabled) playPopSound();

    // Trigger little toast/celebration for customized scrapbooking
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 40,
      origin: { y: 0.8 },
      colors: ["#38bdf8", "#fbbf24"]
    });
  };

  const getStickerTypeForCategory = (cat: string) => {
    switch (cat) {
      case "Food & Drink": return "pizza";
      case "Nature": return "flower";
      case "Chill": return "hammock";
      case "Adventure": return "trail";
      case "Travel": return "palm";
      default: return "sun";
    }
  };

  // CALCULATE STATS
  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // DYNAMIC BADGE COMPUTATIONS
  const badges = INITIAL_ACHIEVEMENTS.map(badge => {
    let unlocked = false;
    switch (badge.id) {
      case "first_adventure":
        unlocked = completedCount >= 1;
        break;
      case "five_adventures":
        unlocked = completedCount >= 5;
        break;
      case "ten_adventures":
        unlocked = completedCount >= 10;
        break;
      case "halfway":
        unlocked = completionPercentage >= 50 && totalCount > 0;
        break;
      case "summer_legend":
        unlocked = completedCount === totalCount && totalCount > 0;
        break;
    }
    return { ...badge, unlocked };
  });

  // COLLAGE PHOTOS IN COMPLETED ACTIVITIES (Memory Wall)
  const allMemoryWallPhotos: { imgSrc: string; title: string; date: string; id: string }[] = [];
  items.forEach(item => {
    if (item.completed && item.images && item.images.length > 0) {
      item.images.forEach(img => {
        allMemoryWallPhotos.push({
          imgSrc: img,
          title: item.title,
          date: item.dateCompleted || "Summer 2026",
          id: item.id
        });
      });
    }
  });

  // FILTER & SEARCH LOGIC
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === "Completed") matchesStatus = item.completed;
    if (selectedStatus === "Uncompleted") matchesStatus = !item.completed;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleLightboxClick = (imgSrc: string, title: string) => {
    setLightboxImg(imgSrc);
    setLightboxTitle(title);
  };

  // STYLISH INTRO LOADING SCREEN
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#f7f3e9] flex flex-col items-center justify-center z-50 p-6 text-center select-none scrapbook-grid">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-150 opacity-15">
          <SunDoodle className="w-96 h-96 text-amber-500" />
        </div>
        
        <div className="relative p-8 rounded-3xl bg-white border border-amber-200/50 shadow-xl max-w-sm rotate-[-1deg]">
          {/* Lined paper top styling */}
          <div className="w-12 h-12 absolute -top-6 left-1/2 -translate-x-1/2 z-20">
            <PinDoodle color="bg-rose-500" />
          </div>
          
          <div className="w-full flex justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="text-amber-500 text-5xl"
            >
              ☀️
            </motion.div>
          </div>
          
          <h2 className="font-journal text-2xl font-bold text-slate-800 mb-2">Caleb's Journal</h2>
          <p className="font-handwritten text-xl text-slate-500 font-semibold italic">"Opening the scrapbook of memories..."</p>
          
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
            <motion.div 
              initial={{ width: "0%" }} 
              animate={{ width: "100%" }} 
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="bg-amber-400 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${
      darkMode ? "bg-[#1c1813] text-amber-50" : "bg-[#FDF5E6] text-[#4A4A4A]"
    } ${darkMode ? "scrapbook-grid-dark" : "scrapbook-grid"}`}>

      {/* Decorative Floating Sparkles & Suns in Main Background */}
      <div className="absolute top-12 left-10 pointer-events-none opacity-25 hidden xl:block select-none">
        <SunDoodle className="w-24 h-24 stroke-[#FF9E64]" />
        <span className="font-serif italic text-sm text-[#FF6321] font-bold block rotate-6 mt-1">Hello Summer!</span>
      </div>
      <div className="absolute top-48 right-12 pointer-events-none opacity-20 hidden lg:block select-none">
        <CloudDoodle className="w-32 h-24" />
      </div>
      <div className="absolute bottom-96 left-8 pointer-events-none opacity-20 hidden xl:block select-none">
        <WatermelonDoodle className="w-24 h-24" />
      </div>
      <div className="absolute bottom-24 right-10 pointer-events-none opacity-20 hidden lg:block select-none">
        <FlowerDoodle className="w-24 h-24" />
      </div>

      {/* FLOATING TOP BAR FOR CONTROLS */}
      <header className="sticky top-0 z-30 w-full bg-[#FFFBF2]/90 dark:bg-[#1c1813]/95 backdrop-blur-md border-b border-[#E8E1D1]/60 py-2 sm:py-3 px-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-xl sm:text-2xl font-bold animate-pulse">☀️</span>
            <span className="font-serif italic text-base sm:text-lg font-bold text-[#4A4A4A] dark:text-amber-200 leading-none">Caleb's Scrapbook</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                soundEnabled 
                  ? "bg-[#FFFBF2] hover:bg-[#FDF5E6] text-[#4A4A4A] border-[#D2B48C]/60 shadow-xs" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
              }`}
              title={soundEnabled ? "Mute sounds" : "Enable acoustic pop effects"}
              id="sound-toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6321]" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                darkMode 
                  ? "bg-stone-800 border-stone-700 text-yellow-300 hover:bg-stone-700" 
                  : "bg-[#FFFBF2] border-[#D2B48C]/60 text-stone-800 hover:bg-[#FDF5E6]"
              }`}
              title={darkMode ? "Switch to Sunny Light mode" : "Switch to Cozy Twilight mode"}
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF9E64]" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6321]" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10 pb-20 relative z-10">
        
        {/* SCRAPBOOK PAGE BINDER WRAPPER */}
        <div className="rounded-[2.5rem] bg-[#fffbf6] dark:bg-[#221e1a] border-8 border-white shadow-2xl overflow-hidden p-4 sm:p-8 md:p-10 relative">
          
          {/* Notebook Spiral Edge Ring Holes (Simulated Journal spiral binder) */}
          <div className="absolute top-0 bottom-0 left-3 w-4 flex flex-col justify-around pointer-events-none select-none z-10 hidden md:flex">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#E8E1D1] dark:bg-stone-800 border border-[#D2B48C]/30 shadow-inner"></div>
                <div className="w-6 h-1.5 bg-neutral-400/40 rounded-full -ml-1"></div>
              </div>
            ))}
          </div>

          <div className="md:pl-10">
            {/* HERO TITLE SECTION */}
            <div className="text-center mb-8 relative select-none">
              {/* Cute flower sticker pin */}
              <div className="absolute left-4 top-2 rotate-[-5deg] scale-75 cursor-pointer hidden sm:block">
                <WatermelonDoodle className="w-16 h-16" />
              </div>
              <div className="absolute right-4 top-1 rotate-[8deg] scale-75 cursor-pointer hidden sm:block">
                <FlowerDoodle className="w-16 h-16" />
              </div>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block bg-[#FF9E64] text-white px-4 py-1 text-xs font-bold uppercase tracking-widest mb-3 rotate-[-1deg]"
              >
                Caleb's Summer 2026 Journal
              </motion.div>
              
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-[#4A4A4A] dark:text-amber-100 tracking-tight leading-tight">
                ☀️ Caleb's Summer Bucket List <span className="text-[#FF6321] italic">2026</span> ☀️
              </h1>
              
              <p className="font-serif italic text-lg sm:text-2xl text-[#8B7E66] dark:text-amber-200 mt-2 font-medium">
                "Making memories one adventure at a time."
              </p>

              {/* Dynamic Daily Quote Pin board */}
              {dailyQuote.quote && (
                <div className="max-w-xl mx-auto mt-6 p-4 rounded-xl bg-white/70 dark:bg-[#2d2621] border border-[#D2B48C]/40 text-center relative rotate-[-0.5deg] shadow-xs">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <PinDoodle color="bg-[#FF9E64]" />
                  </div>
                  <p className="font-serif italic text-sm sm:text-base text-slate-600 dark:text-amber-100 italic leading-snug">
                    "{dailyQuote.quote}"
                  </p>
                  <p className="font-serif text-xs font-bold text-[#FF6321] dark:text-amber-450 mt-1.5">
                    — {dailyQuote.author}
                  </p>
                </div>
              )}
            </div>

            {/* DYNAMIC PROGRESS CARD */}
            <section className="bg-white/40 dark:bg-[#2d2621] border border-[#D2B48C]/60 dark:border-amber-900/60 p-5 sm:p-6 rounded-2xl mb-8 relative shadow-xs">
              <div className="absolute -right-3 -top-3 w-14 h-14 opacity-25 hover:opacity-100 transition-opacity">
                <SunDoodle />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 select-none">
                <div className="text-center sm:text-left">
                  <span className="font-serif italic text-xs text-[#8B7E66] dark:text-[#B2AC88] uppercase tracking-widest font-bold">2026 SUNSHINE SCALE</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A4A4A] dark:text-amber-50">
                    Your Summer Progress
                  </h2>
                </div>
                
                <div className="flex items-center gap-4 px-4 py-2 bg-[#FFFBF2]/90 border border-[#D2B48C]/70 rounded-full dark:bg-stone-800/90 dark:border-stone-700 shadow-xs">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-[#8B7E66] dark:text-[#B2AC88]">Progress</div>
                    <div className="text-sm font-black text-[#4A4A4A] dark:text-amber-50">
                      {completedCount} <span className="text-[10px] font-normal text-[#8B7E66]">/ {totalCount} Items</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-full border-3 border-[#FF9E64] flex items-center justify-center font-bold text-xs text-[#FF9E64] dark:text-amber-305 bg-white dark:bg-stone-900 shrink-0">
                    {completionPercentage}%
                  </div>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="relative w-full bg-slate-200/70 dark:bg-stone-800 h-6 rounded-full overflow-hidden p-1 shadow-inner">
                {/* Checkpoint indicators directly on research line */}
                <div className="absolute inset-0 flex justify-between px-6 items-center pointer-events-none z-10 text-[10px] font-mono font-bold text-slate-500">
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                </div>
                
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-gradient-to-r from-[#FF9E64] via-[#FF6321] to-[#F27D26] h-full rounded-full flex items-center justify-end px-2"
                >
                  {completionPercentage > 8 && (
                    <span className="text-[10px] text-white font-black select-none">☀️</span>
                  )}
                </motion.div>
              </div>

              {/* Milestone Celebrations Message */}
              <AnimatePresence mode="wait">
                {completionPercentage === 100 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-4 p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-center font-journal text-lg sm:text-xl font-bold shadow-xs flex items-center justify-center gap-2 select-none"
                  >
                    <span>🎉 Summer Bucket List Complete! 🎉</span>
                  </motion.div>
                ) : (
                  <div className="mt-2 text-center text-xs font-handwritten font-bold text-slate-400 select-none">
                    {completionPercentage >= 75 ? "So incredibly close! Caleb, you are a Summer Legend!" :
                     completionPercentage >= 50 ? "Over halfway! Keep capturing these magical moments!" :
                     completionPercentage >= 25 ? "Quarter way through the scrapbook! Great work!" :
                     "Pick an adventure below and let's go!"}
                  </div>
                )}
              </AnimatePresence>
            </section>

            {/* BADGES SECTION */}
            <section className="mb-10 select-none">
              <div className="flex items-center gap-2 mb-4 border-b border-dashed border-[#D2B48C]/50 pb-2">
                <Award className="w-5 h-5 text-[#FF6321]" />
                <h3 className="font-serif italic text-lg sm:text-xl font-bold text-[#4A4A4A] dark:text-amber-100">
                  Caleb's Earned Achievement Stickers
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center shadow-xs overflow-hidden ${
                      badge.unlocked 
                        ? "bg-[#FFFBF2] border-[#D2B48C] dark:bg-stone-850 dark:border-amber-900/40" 
                        : "bg-stone-50/30 border-[#E8E1D1] text-stone-400 dark:bg-[#1c1813] dark:border-stone-800 dark:text-stone-600"
                    }`}
                  >
                    {/* Retro physical stamp ring outline */}
                    <div className="absolute inset-1 border border-dashed border-black/5 rounded-lg pointer-events-none"></div>

                    {/* Badge Stamp Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 shadow-xs border transition-transform ${
                      badge.unlocked 
                        ? `bg-[#B2AC88]/20 border-transparent scale-102 hover:rotate-12` 
                        : "bg-slate-200 border-[#E8E1D1] text-slate-400 grayscale dark:bg-stone-800 dark:border-stone-700"
                    }`}
                    style={{ borderRadius: "45% 55% 50% 50%" }}
                    >
                      {badge.icon}
                    </div>

                    <h4 className={`text-xs font-bold leading-tight ${badge.unlocked ? "text-[#4A4A4A] dark:text-amber-100 font-serif" : "text-slate-400 dark:text-stone-600"}`}>
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-[#8B7E66] dark:text-stone-400 mt-1 leading-snug">
                      {badge.description}
                    </p>

                    {/* Unlocked stamp indicator */}
                    {badge.unlocked && (
                      <span className="absolute top-1.5 right-1.5 bg-[#FF6321] text-white text-[7px] font-sans font-bold px-1 rounded uppercase tracking-wider scale-90">
                        Pasted!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* DASHBOARD GRID CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: ACTIVE BUCKET LIST CARDS */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* FILTERS & SEARCH ROW */}
                <div className="bg-[#FFFBF2] dark:bg-stone-900/60 border border-[#E8E1D1] dark:border-stone-800 p-4 rounded-xl shadow-xs">
                  <div className="flex flex-col gap-3">
                    
                    {/* Search Field */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for an adventure or keywords in notes..."
                        className="w-full bg-white dark:bg-stone-850 border border-[#E8E1D1] dark:border-stone-700 rounded-xl py-2 pl-10 pr-4 text-sm font-sans focus:outline-hidden focus:ring-1 focus:ring-[#FF9E64] dark:text-neutral-100"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-405 hover:text-stone-605"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick Filters category row */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] tracking-wider font-bold text-stone-400 mr-1 select-none font-sans">CATEGORY:</span>
                      {["All", "Adventure", "Chill", "Food & Drink", "Nature", "Travel"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-all ${
                            selectedCategory === cat
                              ? "bg-[#FF6321] border-[#FF6321] text-white"
                              : "bg-[#FFFBF2] hover:bg-[#FDF5E6]/80 border-[#E8E1D1] text-[#8B7E66] dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-slate-300"
                          }`}
                          id={`cat-${cat}`}
                        >
                          {cat !== "All" && <span className="mr-1">{getCategoryIcon(cat)}</span>}
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Status Filters Card */}
                    <div className="flex flex-wrap gap-1.5 items-center border-t border-[#E8E1D1]/60 dark:border-stone-800/60 pt-2.5">
                      <span className="text-[10px] tracking-wider font-bold text-stone-400 mr-1 select-none font-sans">STATUS:</span>
                      {(["All", "Completed", "Uncompleted"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-all ${
                            selectedStatus === status
                              ? "bg-[#4A4A4A] dark:bg-[#B2AC88] border-[#4A4A4A] dark:border-[#B2AC88] text-white"
                              : "bg-[#FFFBF2] hover:bg-[#FDF5E6]/80 border-[#E8E1D1] text-[#8B7E66] dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-slate-300"
                          }`}
                          id={`status-${status}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                {/* ADD NEW ADVENTURE FORM / SECTION */}
                <div className="bg-[#FFFBF2] dark:bg-stone-900/45 border-2 border-dashed border-[#D2B48C]/60 rounded-xl p-5 shadow-xs">
                  <button 
                    onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                    className="w-full flex items-center justify-between font-serif text-lg font-bold text-[#4A4A4A] dark:text-[#B2AC88] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      🎒 Add New Summer Adventure
                    </span>
                    <span className={`transform transition-transform duration-200 ${isAddFormOpen ? "rotate-45 text-rose-500" : "text-[#FF6321]"}`}>
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isAddFormOpen && (
                      <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleCreateActivity} 
                        className="overflow-hidden mt-4 pt-4 border-t border-dashed border-[#D2B48C]"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Title Input */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] tracking-wider font-bold text-stone-500 dark:text-amber-300">ADVENTURE TITLE:</label>
                            <input 
                              type="text"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="e.g. Midnight bonfire on the beach"
                              className="w-full bg-white dark:bg-stone-800 border border-[#E8E1D1] focus:outline-hidden focus:border-[#FF9E64] text-sm font-sans p-2 rounded-lg text-slate-800 dark:text-amber-50"
                              id="new-adventure-title"
                            />
                          </div>

                          {/* Category input */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] tracking-wider font-bold text-stone-500 dark:text-amber-300">CATEGORY:</label>
                            <select 
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              className="w-full bg-white dark:bg-stone-800 border border-[#E8E1D1] focus:outline-hidden focus:border-[#FF9E64] text-sm font-sans p-2 rounded-lg text-slate-800 dark:text-amber-50"
                              id="new-adventure-category"
                            >
                              <option value="Adventure">Adventure 🏕️</option>
                              <option value="Chill">Chill 🧘</option>
                              <option value="Food & Drink">Food & Drink 🍹</option>
                              <option value="Nature">Nature 🌸</option>
                              <option value="Travel">Travel 🌴</option>
                            </select>
                          </div>

                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex justify-end">
                          <button
                            type="submit"
                            disabled={!newTitle.trim()}
                            className={`px-5 py-2 rounded-full font-serif text-sm font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              newTitle.trim() 
                                ? "bg-[#FF6321] hover:bg-[#F27D26] text-white shadow-md active:scale-95" 
                                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                            }`}
                            id="add-btn-submit"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Paste into Scrapbook</span>
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* ACTIVITIES LIST STREAM */}
                <div className="flex flex-col gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <BucketCard
                          key={item.id}
                          item={item}
                          soundEnabled={soundEnabled}
                          onToggleComplete={handleToggleComplete}
                          onUpdateNotes={handleUpdateNotes}
                          onAddImages={handleAddImages}
                          onDeleteImage={handleDeleteImage}
                          onDeleteActivity={handleDeleteActivity}
                          onImageClick={handleLightboxClick}
                        />
                      ))
                    ) : (
                      // EMPTY STATE NOTE
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-12 bg-white dark:bg-stone-900/20 border-2 border-dashed border-slate-200 dark:border-stone-800 rounded-3xl"
                      >
                        <Compass className="w-12 h-12 text-slate-300 dark:text-stone-700 mx-auto mb-3" />
                        <h4 className="font-journal text-lg font-bold text-slate-600 dark:text-amber-200">No Journal Pages Found</h4>
                        <p className="font-handwritten text-base text-slate-400 font-semibold mt-1">
                          "Try adjusting your custom filter settings or write a new adventure page above!"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT COLUMN: COLLAGE MEMORY WALL & DOODLES */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* 📸 MEMORY COLLAGE WALL */}
                <section className="bg-[#FFFBF2] dark:bg-stone-900/60 border border-[#E8E1D1] dark:border-stone-800 p-6 rounded-xl shadow-xs relative">
                  
                  {/* Heart sticker Pin */}
                  <div className="absolute right-4 top-3 z-10 w-8 h-8">
                    <HeartDoodle colorClass="fill-[#FF6321]/30 stroke-[#FF6321] animate-pulse" />
                  </div>

                  <h3 className="font-serif italic text-2xl font-bold text-[#4A4A4A] dark:text-amber-100 flex items-center gap-1.5 border-b border-dashed border-[#D2B48C]/50 pb-3 mb-4 select-none">
                    📸 Summer Memory Wall
                  </h3>

                  {/* Collage layout */}
                  {allMemoryWallPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {allMemoryWallPhotos.map((photo, i) => {
                        // Assign randomized slants specifically for collage paper feel
                        const rotations = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-5deg]", "rotate-[4deg]", "rotate-[-2deg]", "rotate-[3deg]"];
                        const tilt = rotations[i % rotations.length];
                        
                        return (
                          <motion.div
                            key={`${photo.id}-${i}`}
                            whileHover={{ scale: 1.05, zIndex: 10, rotate: 0 }}
                            onClick={() => handleLightboxClick(photo.imgSrc, photo.title)}
                            className={`bg-white dark:bg-[#FFFBF2] p-2 pb-5 border border-slate-200 shadow-md transform hover:shadow-xl cursor-all-scroll transition-shadow duration-300 ${tilt} rounded-xs`}
                          >
                            <div className="w-full aspect-square bg-[#eceae1] overflow-hidden rounded-xs relative">
                              <img 
                                src={photo.imgSrc} 
                                alt={photo.title}
                                className="w-full h-full object-cover select-none pointer-events-none" 
                              />
                            </div>
                            
                            <div className="mt-2 text-center select-none overflow-hidden text-ellipsis line-clamp-1 leading-none-all">
                              <span className="font-handwritten text-xs font-bold text-slate-700 block whitespace-nowrap overflow-hidden text-ellipsis">
                                {photo.title}
                              </span>
                              <span className="font-sans text-[8px] font-semibold text-slate-400 block mt-0.5">
                                {photo.date}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    // empty memory collage wall state helper
                    <div className="text-center py-10 px-4 border-2 border-dashed border-[#E8E1D1] dark:border-stone-800 rounded-xl select-none">
                      <p className="font-serif text-sm text-[#8B7E66] font-medium">Memory Wall Empty</p>
                      <p className="font-serif italic text-xs text-stone-400 mt-2">
                        "Preload photos on your checked activities to build Caleb's beautiful wall collage!"
                      </p>
                    </div>
                  )}
                </section>

                {/* DOODLE STAMP COLLECTION BLOCK */}
                <section className="bg-[#B2AC88]/10 dark:bg-[#25211d] p-6 rounded-xl border border-[#D2B48C]/40 select-none relative">
                  <div className="absolute right-4 -top-3">
                    <PinDoodle color="bg-[#FF6321]" />
                  </div>
                  
                  <h3 className="font-serif italic text-lg font-bold text-[#4A4A4A] dark:text-[#B2AC88] mb-3 block">
                    🌟 Caleb's Scrapbook Stickers
                  </h3>
                  <p className="font-sans text-xs text-stone-500 dark:text-stone-405 mb-4 leading-relaxed">
                    Custom doodles handplaced onto Caleb's summer canvas. Click/hover to wiggle them!
                  </p>

                  <div className="grid grid-cols-3 gap-4 justify-items-center">
                    <div className="flex flex-col items-center">
                      <SunDoodle className="w-12 h-12 stroke-[#FF9E64]" />
                      <span className="font-handwritten text-xs font-bold mt-1 text-slate-600 dark:text-amber-100">Sunny</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <WatermelonDoodle className="w-12 h-12" />
                      <span className="font-handwritten text-xs font-bold mt-1 text-slate-600 dark:text-amber-100">Slice</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <FlowerDoodle className="w-12 h-12" />
                      <span className="font-handwritten text-xs font-bold mt-1 text-slate-600 dark:text-amber-100">Bloom</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <HeartDoodle className="w-12 h-12 colorClass='fill-rose-300 stroke-rose-450'" />
                      <span className="font-handwritten text-xs font-bold mt-1 text-slate-600 dark:text-amber-100">Adore</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <SparkleDoodle className="w-12 h-12" />
                      <span className="font-handwritten text-xs font-bold mt-1 text-slate-600 dark:text-amber-100">Spark</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <Compass className="w-8 h-8 text-[#B2AC88] stroke-[2] scale-110 rotate-12" />
                      <span className="font-handwritten text-xs font-bold mt-3 text-slate-600 dark:text-amber-100">Compass</span>
                    </div>
                  </div>
                </section>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ⚠️ LIGHTBOX COMPONENT POPUP */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => { setLightboxImg(null); setLightboxTitle(null); }}
          >
            <button 
              onClick={() => { setLightboxImg(null); setLightboxTitle(null); }}
              className="absolute top-6 right-6 text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-full p-2.5 transition-transform hover:scale-105 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              layoutId="lightbox-zoom"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Outer polaroid frame style */}
              <div className="bg-white p-4 pb-8 shadow-2xl rounded-xs flex flex-col items-center max-w-full">
                <div className="overflow-hidden bg-[#eceae1] rounded-xs max-h-[65vh]">
                  <img 
                    src={lightboxImg} 
                    alt={lightboxTitle || "Enlarged Memory"} 
                    className="object-contain max-h-[65vh] max-w-full rounded-xs select-none"
                  />
                </div>
                {lightboxTitle && (
                  <p className="font-handwritten text-2xl text-slate-800 mt-4 font-bold select-none text-center">
                    ☀️ {lightboxTitle} ☀️
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏅 UNLOCKED MILESTONE POPUP COMPONENT OVERLAY */}
      <AnimatePresence>
        {unlockedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-amber-50 border-4 border-amber-300 p-8 rounded-3xl max-w-sm text-center relative shadow-2xl rotate-[-1deg]"
            >
              {/* Journal binder spiral ring */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <PinDoodle color="bg-rose-500" />
              </div>
              
              <div className="text-6xl mb-4 select-none animate-bounce">{unlockedMilestone.icon}</div>
              
              <h2 className="font-handwritten text-3xl font-black text-amber-900 mb-2">
                {unlockedMilestone.title}
              </h2>
              
              <p className="font-journal text-base text-slate-700 leading-relaxed mb-6">
                "{unlockedMilestone.description}"
              </p>

              <button
                onClick={() => setUnlockedMilestone(null)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold py-2.5 rounded-full select-none cursor-pointer transition-colors shadow-md active:scale-95"
                id="milestone-unlocked-close"
              >
                Super Cool! ☀️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
