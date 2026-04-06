import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X, UtensilsCrossed } from "lucide-react";

export default function FloatingMenuButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleDragStart = () => {
    dragStartRef.current = { x: dragX.get(), y: dragY.get() };
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    const deltaX = Math.abs(dragX.get() - dragStartRef.current.x);
    const deltaY = Math.abs(dragY.get() - dragStartRef.current.y);

    if (deltaX > 5 || deltaY > 5) {
      setIsDragging(true);
    }
  };

  const handleClick = () => {
    if (!isDragging) {
      setDrawerOpen(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        drag
        dragConstraints={{ top: -400, bottom: 0, left: -200, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x: dragX, y: dragY }}
        className="fixed bottom-6 right-6 z-[100] group"
      >
        <button
          onClick={handleClick}
          className="w-14 h-14 rounded-full accent-gradient shadow-lg shadow-accent/20 flex items-center justify-center cursor-pointer animate-float"
        >
          <UtensilsCrossed className="w-6 h-6 text-bg" />
        </button>

        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-surface border border-stroke rounded-xl px-3 py-2 font-body text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          View Menu
        </div>
      </motion.div>

      {/* Menu Gallery Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-stroke z-[200] p-8 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-2xl text-text-primary">Menu Gallery</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((id) => (
                  <div
                    key={id}
                    className="bg-surface-2 border border-stroke rounded-2xl aspect-square flex items-center justify-center"
                  >
                    <span className="text-muted font-body text-xs">Menu image {id}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center font-body text-xs text-muted">
                Add menu images to display here
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
