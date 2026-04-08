import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { getMenuGallery, addMenuGalleryImage, deleteMenuGalleryImage, type MenuGalleryImage } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function MenuGallery() {
  const [gallery, setGallery] = useState<MenuGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    fetchGallery();
  }, [navigate]);

  const fetchGallery = async () => {
    const images = await getMenuGallery();
    setGallery(images);
    setLoading(false);
  };

  // Preview image with debounce
  useEffect(() => {
    if (!imageUrl.trim()) {
      setPreviewUrl("");
      setPreviewError(false);
      return;
    }

    const timer = setTimeout(() => {
      setPreviewUrl(imageUrl);
      setPreviewError(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [imageUrl]);

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;
    await addMenuGalleryImage(imageUrl.trim(), caption.trim());
    setImageUrl("");
    setCaption("");
    setPreviewUrl("");
    fetchGallery();
  };

  const handleDeleteImage = async (id: string) => {
    await deleteMenuGalleryImage(id);
    setDeleteConfirm(null);
    fetchGallery();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar active="menu-gallery" />

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-3xl text-text-primary">Menu Gallery</h1>
          <span className="bg-surface border border-stroke rounded-full px-3 py-1 font-body text-xs text-muted">
            {gallery.length} {gallery.length === 1 ? "image" : "images"}
          </span>
        </div>

        {/* Add Image Form */}
        <div className="bg-surface border border-stroke rounded-2xl p-6 mb-8 max-w-2xl">
          <h2 className="font-display italic text-xl text-text-primary mb-5">Add New Menu Image</h2>

          <div className="space-y-4">
            {/* Image URL */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption (optional)"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                  Preview
                </label>
                {previewError ? (
                  <div className="w-full aspect-video rounded-xl border border-accent/50 bg-accent/5 flex items-center justify-center">
                    <p className="font-body text-sm text-accent">Invalid image URL</p>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    onError={() => setPreviewError(true)}
                    className="w-full aspect-video rounded-xl object-cover border border-stroke"
                  />
                )}
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddImage}
              disabled={!imageUrl.trim() || previewError}
              className="accent-gradient rounded-xl px-6 py-3 font-body font-medium text-sm text-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Gallery
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {gallery.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-stroke rounded-2xl max-w-2xl">
            <Camera className="w-12 h-12 text-muted/40 mx-auto mb-4" />
            <p className="font-display italic text-xl text-muted">No images yet</p>
            <p className="font-body text-sm text-muted/60 mt-2">
              Add your first menu photo above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {gallery.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-2xl overflow-hidden aspect-square border border-stroke"
              >
                <img
                  src={image.url}
                  alt={image.caption || "Menu item"}
                  className="w-full h-full object-cover"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  {image.caption && (
                    <p className="font-body text-xs text-text-primary/80 text-center px-3">
                      {image.caption}
                    </p>
                  )}

                  {/* Delete Button */}
                  {deleteConfirm === image.id ? (
                    <div className="flex flex-col gap-2">
                      <p className="font-body text-xs text-text-primary text-center">
                        Delete this image?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="rounded-full border border-accent/50 text-accent font-body text-xs px-4 py-2 hover:bg-accent/10 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-full border border-stroke text-muted font-body text-xs px-4 py-2 hover:text-text-primary transition-colors"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(image.id)}
                      className="rounded-full border border-accent/50 text-accent font-body text-xs px-4 py-2 hover:bg-accent/10 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
