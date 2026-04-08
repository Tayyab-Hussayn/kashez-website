import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X, UtensilsCrossed, Camera } from "lucide-react";
import { getMenuGallery, type MenuGalleryImage } from "@/lib/db";

export default function FloatingMenuButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryImages, setGalleryImages] = useState<MenuGalleryImage[]>([]);
  const [lightboxImage, setLightboxImage] = useState<MenuGalleryImage | null>(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (drawerOpen) {
      getMenuGallery().then(setGalleryImages);
    }
  }, [drawerOpen]);

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
              {galleryImages.length === 0 ? (
                <div className="text-center py-16">
                  <Camera className="w-12 h-12 text-muted/40 mx-auto mb-4" />
                  <p className="font-display italic text-xl text-muted">No menu images yet</p>
                  <p className="font-body text-sm text-muted/60 mt-2">
                    The restaurant will add menu photos soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setLightboxImage(image)}
                      className="rounded-2xl overflow-hidden aspect-square relative group cursor-pointer"
                    >
                      <img
                        src={image.url}
                        alt={image.caption || "Menu item"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg/80 to-transparent p-3 font-body text-xs text-text-primary/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[600] bg-bg/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
            <div className="max-w-4xl w-full">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.caption || "Menu item"}
                className="w-full h-auto rounded-2xl"
              />
              {lightboxImage.caption && (
                <p className="text-center font-body text-sm text-text-primary/80 mt-4">
                  {lightboxImage.caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
