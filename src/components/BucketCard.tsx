import React, { useState, useRef } from "react";
import { BucketItem } from "../types";
import { Calendar, Camera, Trash2, Heart, ChevronLeft, ChevronRight, Maximize2, Plus, GripVertical } from "lucide-react";
import { WashiTape, PinDoodle, getCategoryColor, getCategoryIcon } from "./DoodleAssets";
import { compressImage } from "../utils/imageCompressor";
import { motion, AnimatePresence } from "motion/react";

interface BucketCardProps {
  item: BucketItem;
  soundEnabled: boolean;
  onToggleComplete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAddImages: (id: string, files: string[]) => void;
  onDeleteImage: (id: string, imgIndex: number) => void;
  onDeleteActivity: (id: string) => void;
  onImageClick: (imgSrc: string, title: string) => void;
}

export const BucketCard: React.FC<BucketCardProps> = ({
  item,
  soundEnabled,
  onToggleComplete,
  onUpdateNotes,
  onAddImages,
  onDeleteImage,
  onDeleteActivity,
  onImageClick,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isNotesFocused, setIsNotesFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate rotation for tape
  const tapeRotation = item.angle && item.angle < 0 ? "rotate-[4deg]" : "rotate-[-4deg]";
  const tapeColor = item.completed 
    ? "bg-[#B2AC88]/60 border-[#B2AC88]/30 text-stone-800/80" 
    : "bg-[#FF9E64]/60 border-[#FF9E64]/30 text-stone-800/80";

  // Handle Photo upload
  const handlePhotoUpload = async (filesList: FileList | null) => {
    if (!filesList) return;
    const base64Images: string[] = [];
    for (let i = 0; i < filesList.length; i++) {
      try {
        const compressed = await compressImage(filesList[i]);
        base64Images.push(compressed);
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
    if (base64Images.length > 0) {
      onAddImages(item.id, base64Images);
      setActivePhotoIdx(item.images.length); // jump to newly added
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handlePhotoUpload(e.dataTransfer.files);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotate: item.completed ? (item.angle || 1) * -1 : (item.angle || 0)
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative p-6 rounded-2xl transition-all duration-300 ${
        item.completed 
          ? "bg-[#FFFBF2] dark:bg-stone-900 border-2 border-[#B2AC88] shadow-md" 
          : "bg-[#FFFBF2] dark:bg-stone-900 border border-[#E8E1D1] shadow-xs hover:shadow-md"
      }`}
      id={`card-${item.id}`}
    >
      {/* Visual Tape Effect */}
      <WashiTape rotation={tapeRotation} color={tapeColor} className="left-1/2 -translate-x-1/2 -top-4" />

      {/* Pine or Thumbtack doodle */}
      <div className="absolute right-6 top-3 z-10">
        <PinDoodle color={item.completed ? "bg-[#B2AC88]" : "bg-[#FF6321]"} />
      </div>

      {/* Delete button (only for user-added / can be on all for complete control) */}
      <button 
        onClick={() => onDeleteActivity(item.id)}
        className="absolute left-4 top-4 text-stone-300 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-[#FDF5E6]"
        title="Remove activity"
        id={`delete-btn-${item.id}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="mt-4 flex flex-col md:flex-row gap-6">
        
        {/* POLAROID PHOTO ZONE */}
        <div className="w-full md:w-[190px] flex-shrink-0 flex flex-col items-center">
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`w-[180px] bg-white p-3 polaroid-frame transition-transform duration-300 relative ${
              item.completed ? "rotate-[-2deg]" : "rotate-[2deg]"
            } ${isDragOver ? "scale-105 border-2 border-dashed border-[#FF9E64]" : "border border-neutral-100"}`}
          >
            {/* Inner frame photo container */}
            <div className="w-[156px] h-[156px] bg-neutral-100 flex items-center justify-center overflow-hidden relative group">
              {item.images && item.images.length > 0 ? (
                <>
                  <img 
                    src={item.images[activePhotoIdx]} 
                    alt={item.title} 
                    className="w-full h-full object-cover select-none cursor-pointer hover:opacity-95"
                    onClick={() => onImageClick(item.images[activePhotoIdx], item.title)}
                  />
                  
                  {/* Photo details & utilities on hover */}
                  <div className="absolute bottom-1 right-2 left-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#4A4A4A]/80 text-white text-[10px] py-1 px-1.5 rounded backdrop-blur-xs select-none">
                    <span>{`${activePhotoIdx + 1}/${item.images.length}`}</span>
                    <button 
                      onClick={() => onImageClick(item.images[activePhotoIdx], item.title)}
                      className="hover:scale-110 p-0.5"
                    >
                      <Maximize2 className="w-3 h-3 text-white" />
                    </button>
                    <button 
                      onClick={() => onDeleteImage(item.id, activePhotoIdx)}
                      className="text-red-300 hover:text-red-500 hover:scale-110 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Left / Right photo selectors */}
                  {item.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActivePhotoIdx(prev => (prev === 0 ? item.images.length - 1 : prev - 1))}
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all text-[#4A4A4A]"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setActivePhotoIdx(prev => (prev === item.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all text-[#4A4A4A]"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                // Polaroid empty state doodle
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:text-[#FF6321] text-stone-400 group h-full"
                >
                  <Camera className="w-8 h-8 group-hover:scale-110 transition-transform text-stone-300 group-hover:text-[#FF6321] mb-1" />
                  <span className="text-[10px] font-medium leading-tight">Drag photo or Tap to load</span>
                </div>
              )}
            </div>

            {/* Polaroid bottom caption area */}
            <div className="pt-3 pb-1 text-center font-handwritten text-lg text-slate-700 select-none overflow-hidden h-[40px] flex items-center justify-center leading-none">
              {item.completed && item.dateCompleted ? (
                <div className="flex items-center gap-1 text-[13px] text-slate-500 font-sans tracking-wide">
                  <Calendar className="w-3 h-3 text-[#B2AC88]" />
                  <span>{item.dateCompleted}</span>
                </div>
              ) : (
                <span className="text-slate-400/90 text-sm tracking-wide">No Memory Yet</span>
              )}
            </div>

            {/* Quick mini plus sign on Polaroid to add more pics if already has some */}
            {item.images && item.images.length > 0 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute scroll-m-2 -bottom-2 -right-2 bg-[#FF6321] hover:bg-[#F27D26] text-white rounded-full p-1.5 shadow-md active:scale-95 transition-all z-20"
                title="Add photo"
                id={`add-photo-btn-${item.id}`}
              >
                <Plus className="w-3 h-3" style={{ strokeWidth: 3 }} />
              </button>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => handlePhotoUpload(e.target.files)} 
              multiple 
              accept="image/*"
              className="hidden" 
            />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Header / Checkbox row */}
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => onToggleComplete(item.id)}
                className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                  item.completed 
                    ? "bg-[#B2AC88] border-[#B2AC88] text-white scale-102 shadow-sm" 
                    : "border-[#E8E1D1] hover:border-[#FF9E64] hover:bg-[#FFFBF2] text-transparent"
                }`}
                style={{ borderRadius: "25% 45% 35% 55%" }} // Hand drawn look
                id={`check-${item.id}`}
              >
                <motion.svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  className="w-5 h-5"
                  initial={false}
                  animate={item.completed ? { scale: 1, pathLength: 1 } : { scale: 0, pathLength: 0 }}
                >
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>

              <div className="flex-1">
                {/* Title */}
                <h3 
                  onClick={() => onToggleComplete(item.id)}
                  className={`cursor-pointer font-serif text-xl md:text-2xl font-bold select-none leading-relaxed transition-all decoration-[#B2AC88] decoration-2 ${
                    item.completed 
                      ? "text-[#8B7E66] line-through italic" 
                      : "text-[#4A4A4A] dark:text-amber-50 hover:text-[#FF6321]"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Category Badge */}
                {item.category && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans border shadow-xs mt-1.5 ${getCategoryColor(item.category)}`}>
                    <span>{getCategoryIcon(item.category)}</span>
                    <span>{item.category}</span>
                  </span>
                )}
              </div>
            </div>

            {/* JOURNAL NOTEBOOK AREA */}
            <div className="relative mt-4">
              <div className="flex items-center gap-1 text-slate-400 text-xs font-handwritten font-bold mb-1 select-none">
                <span>✍️ Diary Notes</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E1D1] dark:border-stone-800">
                <textarea
                  value={item.notes || ""}
                  onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                  onFocus={() => setIsNotesFocused(true)}
                  onBlur={() => setIsNotesFocused(false)}
                  placeholder="Tell your summer diary about this adventure... who was there? What happened?"
                  className="w-full lined-paper text-slate-700 font-journal text-base p-4 focus:outline-hidden border-none resize-none min-h-[110px]"
                />
                
                {/* Visual lines overlay highlighter */}
                <div 
                  className={`absolute right-1 bottom-1 p-1 text-[11px] font-handwritten font-bold select-none transition-colors duration-200 pointer-events-none ${
                    isNotesFocused ? "text-[#FF6321]" : "text-slate-300"
                  }`}
                >
                  {item.notes ? "saved ☀️" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer Decorative Stickers */}
          {item.completed && (
            <div className="flex justify-end gap-1 items-center mt-3 text-[#B2AC88] font-handwritten text-sm font-bold rotate-[-1deg] select-none">
              <Heart className="w-3.5 h-3.5 fill-[#B2AC88]/20 animate-pulse" />
              <span>Checked Off! Summer Memories +1</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
