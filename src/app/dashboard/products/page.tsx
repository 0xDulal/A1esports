"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import { sbInsert, sbUpdate, sbDelete } from "@/lib/supabase/rest";
import Image from "next/image";
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    price: 0,
    halfSleevePrice: 0,
    fullSleevePrice: 0,
    category: "JERSEYS",
    description: "",
    image: "",
    images: [],
    isSoldOut: false,
    canCustomise: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProductsFromSupabase();
    setProducts(data || []);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      price: 650,
      halfSleevePrice: 650,
      fullSleevePrice: 699,
      category: "JERSEYS",
      description: "",
      image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
      images: ["https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png"],
      isSoldOut: false,
      canCustomise: true,
    });
    setGalleryUrlInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
    });
    setGalleryUrlInput("");
    setIsModalOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(targetId)));
    await sbDelete("products", targetId);
    toast.success("Product deleted successfully");
  };

  const addGalleryImage = (url: string) => {
    if (!url.trim()) return;
    const current = formData.images || [];
    if (!current.includes(url.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url.trim()],
      }));
    }
    setGalleryUrlInput("");
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = formData.title || "New Product";
    const slug = (formData.slug || title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const mainImage = formData.image || "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png";
    const galleryImages = formData.images && formData.images.length > 0 ? formData.images : [mainImage];
    const finalImages = Array.from(new Set([mainImage, ...galleryImages]));

    const dbPayload = {
      title,
      slug,
      price: Number(formData.price) || 0,
      half_sleeve_price: Number(formData.halfSleevePrice) || Number(formData.price) || 0,
      full_sleeve_price: Number(formData.fullSleevePrice) || Number(formData.price) || 0,
      category: formData.category || "JERSEYS",
      description: formData.description || "",
      image: mainImage,
      images: finalImages,
      is_sold_out: formData.isSoldOut || false,
      can_customise: formData.canCustomise || false,
    };

    if (editingProduct) {
      await sbUpdate("products", editingProduct.id, dbPayload);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? ({
                ...p,
                ...formData,
                title,
                slug,
                image: mainImage,
                images: finalImages,
                price: Number(formData.price) || 0,
              } as Product)
            : p
        )
      );
    } else {
      const id = `prod-${Date.now()}`;
      const newProductItem: Product = {
        id,
        slug,
        title,
        price: Number(formData.price) || 0,
        halfSleevePrice: Number(formData.halfSleevePrice) || undefined,
        fullSleevePrice: Number(formData.fullSleevePrice) || undefined,
        image: dbPayload.image,
        images: dbPayload.images,
        category: dbPayload.category as any,
        isSoldOut: dbPayload.is_sold_out,
        description: dbPayload.description,
        canCustomise: dbPayload.can_customise,
      };

      await sbInsert("products", { id, ...dbPayload });
      setProducts((prev) => [newProductItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Management</h1>
          <p className="text-neutral-400">
            Manage your official store inventory & product gallery images ({products.length} products)
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,0,102,0.3)]"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Loading store inventory...
        </div>
      ) : (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-bold text-neutral-400">Product</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Gallery</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Price</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Category</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Status</th>
                  <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                          <Image
                            src={product.image || "/A1esports_logo_white.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{product.title}</span>
                          <span className="text-xs text-neutral-500">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <ImageIcon size={14} className="text-primary" />
                        <span className="text-xs font-bold text-white">
                          {(product.images || []).length || 1} images
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white">
                      ৳{product.halfSleevePrice || product.price}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.isSoldOut ? (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-xs font-bold">
                          Sold Out
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-bold">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. A1 Jersey Player Edition"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Base Price</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Half Sleeve</label>
                  <input
                    type="number"
                    value={formData.halfSleevePrice || 0}
                    onChange={(e) => setFormData({ ...formData, halfSleevePrice: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Full Sleeve</label>
                  <input
                    type="number"
                    value={formData.fullSleevePrice || 0}
                    onChange={(e) => setFormData({ ...formData, fullSleevePrice: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Category</label>
                <select
                  value={formData.category || "JERSEYS"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="JERSEYS">JERSEYS</option>
                  <option value="HOODIES">HOODIES</option>
                  <option value="LIFESTYLE">LIFESTYLE</option>
                  <option value="ACCESSORIES">ACCESSORIES</option>
                </select>
              </div>

              {/* Main Cover Image */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Main Cover Image</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingImage(true);
                        try {
                          const { uploadImageToSupabase } = await import("@/lib/supabase/client");
                          const url = await uploadImageToSupabase(file, "images");
                          setFormData((prev) => ({
                            ...prev,
                            image: url,
                            images: Array.from(new Set([url, ...(prev.images || [])])),
                          }));
                        } catch (err) {
                          alert("Upload note: Using URL fallback");
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-black hover:file:bg-primary/90 cursor-pointer"
                    />
                    {uploadingImage && <span className="text-xs text-primary animate-pulse">Uploading...</span>}
                  </div>

                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                        images: Array.from(new Set([e.target.value, ...(prev.images || [])])),
                      }))
                    }
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Gallery Images Uploader */}
              <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon size={14} /> Product Gallery Images (Multiple)
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    {(formData.images || []).length} images added
                  </span>
                </div>

                {/* Existing Gallery Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {(formData.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg border border-white/10 overflow-hidden bg-neutral-900 group">
                      <Image src={imgUrl} alt={`gallery ${idx}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Gallery Image via File or URL */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingGallery(true);
                        try {
                          const { uploadImageToSupabase } = await import("@/lib/supabase/client");
                          const url = await uploadImageToSupabase(file, "images");
                          addGalleryImage(url);
                        } catch (err) {
                          alert("Upload note: Using URL input");
                        } finally {
                          setUploadingGallery(false);
                        }
                      }}
                      className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                    />
                    {uploadingGallery && <span className="text-xs text-primary animate-pulse">Uploading...</span>}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste secondary image URL..."
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      className="flex-1 bg-neutral-800 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => addGalleryImage(galleryUrlInput)}
                      className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                  placeholder="Product description..."
                />
              </div>

              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canCustomise || false}
                    onChange={(e) => setFormData({ ...formData, canCustomise: e.target.checked })}
                    className="rounded bg-neutral-800 border-white/10"
                  />
                  <span>Can Personalize</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isSoldOut || false}
                    onChange={(e) => setFormData({ ...formData, isSoldOut: e.target.checked })}
                    className="rounded bg-neutral-800 border-white/10"
                  />
                  <span>Mark Sold Out</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this merchandise product from your shop inventory?"
      />
    </div>
  );
}
