"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import { sbInsert, sbUpdate, sbDelete } from "@/lib/supabase/rest";
import { uploadImageToSupabase } from "@/lib/supabase/client";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  Shirt,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { MediaPicker } from "@/components/dashboard/MediaPicker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    slug: "",
    price: 0,
    halfSleevePrice: 0,
    fullSleevePrice: 0,
    category: "JERSEYS",
    description: "",
    image: "",
    images: [],
    isSoldOut: false,
    canCustomise: true,
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
      slug: "",
      price: undefined,
      halfSleevePrice: undefined,
      fullSleevePrice: undefined,
      category: "JERSEYS",
      description: "",
      image: "",
      images: [],
      isSoldOut: false,
      canCustomise: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
    });
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

  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Update slug automatically if creating new or if slug matches old title slug
      slug: !editingProduct ? autoSlug : prev.slug || autoSlug,
    }));
  };

  const handleCategoryChange = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      // If switching to JERSEYS, default customization to true, otherwise false
      canCustomise: cat === "JERSEYS" ? true : prev.canCustomise,
    }));
  };

  const handleBasePriceChange = (value: string) => {
    const num = value === "" ? undefined : Number(value);
    setFormData((prev) => {
      const updated: Partial<Product> = { ...prev, price: num as any };
      // Auto-suggest sleeve prices if they are not yet set
      if (prev.category === "JERSEYS") {
        if (!prev.halfSleevePrice) updated.halfSleevePrice = num;
        if (!prev.fullSleevePrice && num) updated.fullSleevePrice = num + 49;
      }
      return updated;
    });
  };

  const syncSleevePrices = () => {
    if (!formData.price) return;
    setFormData((prev) => ({
      ...prev,
      halfSleevePrice: prev.price,
      fullSleevePrice: prev.price ? Number(prev.price) + 49 : prev.price,
    }));
    toast.success("Sleeve prices synced with base price");
  };

  const handleUploadCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImageToSupabase(file, "images");
      setFormData((prev) => ({
        ...prev,
        image: url,
        images: Array.from(new Set([url, ...(prev.images || [])])),
      }));
      toast.success("Cover image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image file");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleUploadGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setUploadingGallery(true);
    const toastId = toast.loading(`Uploading ${files.length} gallery image${files.length > 1 ? "s" : ""}...`);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImageToSupabase(file, "images");
        if (url) uploadedUrls.push(url);
      }
      if (uploadedUrls.length > 0) {
        addGalleryImages(uploadedUrls);
        toast.success(`Uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""}`, { id: toastId });
      } else {
        toast.error("No images were uploaded", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload gallery images", { id: toastId });
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const addGalleryImages = (urls: string[]) => {
    const valid = urls.map((u) => u.trim()).filter(Boolean);
    if (valid.length === 0) return;
    setFormData((prev) => {
      const current = prev.images || [];
      const newImages = Array.from(new Set([...current, ...valid]));
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const addGalleryImage = (url: string) => addGalleryImages([url]);

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("Please enter a product title");
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid base price (greater than 0)");
      return;
    }

    if (!formData.image?.trim()) {
      toast.error("Please upload or select a main cover image");
      return;
    }

    setIsSaving(true);
    try {
      const title = formData.title.trim();
      const slug = (formData.slug?.trim() || title)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const mainImage = formData.image.trim();
      const galleryImages = formData.images && formData.images.length > 0 ? formData.images : [mainImage];
      const finalImages = Array.from(new Set([mainImage, ...galleryImages]));

      const dbPayload = {
        title,
        slug,
        price: priceNum,
        half_sleeve_price: Number(formData.halfSleevePrice) || priceNum,
        full_sleeve_price: Number(formData.fullSleevePrice) || priceNum,
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
                  price: priceNum,
                } as Product)
              : p
          )
        );
        toast.success("Product updated successfully");
      } else {
        const id = `prod-${Date.now()}`;
        const newProductItem: Product = {
          id,
          slug,
          title,
          price: priceNum,
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
        toast.success("Product added to inventory");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-michroma uppercase mb-2">Products Management</h1>
          <p className="text-neutral-400">
            Manage your official store inventory & product gallery images ({products.length} products)
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          variant="primary"
          size="md"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Loading store inventory...
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden">
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
                        <div className="relative h-12 w-12 rounded-sm overflow-hidden bg-neutral-800 shrink-0">
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
                          className="p-2 hover:bg-white/10 text-white rounded-sm transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-sm transition-colors"
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
          <DialogContent className="bg-[#0a0a0a] border border-neutral-800 text-white max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-none">
            {/* Modal Header */}
            <DialogHeader className="px-6 py-5 border-b border-neutral-800 bg-neutral-950 flex flex-row items-center justify-between space-y-0 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
                    {editingProduct ? `Inventory Item #${editingProduct.id.slice(-6)}` : "New Inventory SKU"}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {formData.category || "JERSEYS"}
                  </span>
                </div>
                <DialogTitle className="text-lg font-bold font-mono tracking-wider uppercase text-white m-0">
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Merchandise Product"}
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-400 font-mono mt-0.5">
                  Configure storefront display, pricing matrix, and media assets.
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Modal Body - 2 Columns Scrollable */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (7 cols): Core Info & Pricing */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Section: Product Info */}
                  <div className="bg-neutral-900/40 border border-neutral-800 p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Shirt size={13} /> Product Information
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-neutral-300 uppercase mb-1.5">
                        Product Title <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ""}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. A1 Pro Jersey 2026 Champion Edition"
                        className="w-full bg-neutral-950 border border-neutral-700 focus:border-primary px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-neutral-600 outline-none transition-colors"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">
                          Storefront URL Slug
                        </label>
                        <span className="text-[10px] font-mono text-neutral-500">Auto-generated</span>
                      </div>
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-400">
                        <span className="text-neutral-600 mr-1 select-none">/shop/</span>
                        <input
                          type="text"
                          value={formData.slug || ""}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="product-url-slug"
                          className="flex-1 bg-transparent text-white font-mono outline-none"
                        />
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase mb-2">
                        Category
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(["JERSEYS", "HOODIES", "LIFESTYLE", "ACCESSORIES"] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-2.5 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all text-center ${
                              formData.category === cat
                                ? "bg-primary text-black border-primary font-black shadow-[0_0_12px_rgba(255,0,102,0.35)]"
                                : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase mb-1.5">
                        Description & Specs
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Premium moisture-wicking polyester, reinforced athletic stitching, official team sponsor logos..."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary p-3 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 outline-none resize-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Section: Pricing Matrix */}
                  <div className="bg-neutral-900/40 border border-neutral-800 p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <DollarSign size={13} /> Pricing & Variants (BDT ৳)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-neutral-300 uppercase mb-1.5">
                        Base Price (৳ BDT) <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-neutral-500 font-bold">
                          ৳
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          required
                          value={formData.price ?? ""}
                          onChange={(e) => handleBasePriceChange(e.target.value)}
                          placeholder="e.g. 650"
                          className="w-full bg-neutral-950 border border-neutral-700 focus:border-primary pl-8 pr-4 py-2.5 text-sm font-mono text-white placeholder:text-neutral-600 outline-none font-bold"
                        />
                      </div>
                    </div>

                    {/* Sleeve Variants for Jerseys */}
                    {formData.category === "JERSEYS" && (
                      <div className="border-t border-neutral-800/80 pt-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                            Sleeve Option Pricing
                          </span>
                          <button
                            type="button"
                            onClick={syncSleevePrices}
                            className="text-[10px] font-mono text-primary hover:underline uppercase font-bold"
                          >
                            Copy Base Price
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">
                              Half Sleeve (৳)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.halfSleevePrice ?? ""}
                              onChange={(e) => setFormData({ ...formData, halfSleevePrice: Number(e.target.value) })}
                              placeholder="e.g. 650"
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary px-3 py-2 text-xs font-mono text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">
                              Full Sleeve (৳)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.fullSleevePrice ?? ""}
                              onChange={(e) => setFormData({ ...formData, fullSleevePrice: Number(e.target.value) })}
                              placeholder="e.g. 699"
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary px-3 py-2 text-xs font-mono text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section: Options & Toggles */}
                  <div className="bg-neutral-900/40 border border-neutral-800 p-4 space-y-3">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary border-b border-neutral-800/80 pb-2">
                      Storefront Settings
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Personalize Toggle Card */}
                      <div
                        onClick={() => setFormData((prev) => ({ ...prev, canCustomise: !prev.canCustomise }))}
                        className={`p-3 border cursor-pointer select-none transition-all flex items-start gap-3 ${
                          formData.canCustomise
                            ? "bg-primary/10 border-primary/50 text-white"
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div
                          className={`mt-0.5 size-4 rounded-none border flex items-center justify-center shrink-0 ${
                            formData.canCustomise ? "bg-primary border-primary text-black" : "border-neutral-600 bg-neutral-900"
                          }`}
                        >
                          {formData.canCustomise && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold uppercase">Customization Enabled</div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                            Fans can enter custom Gamertag & back number
                          </div>
                        </div>
                      </div>

                      {/* Stock Status Card */}
                      <div
                        onClick={() => setFormData((prev) => ({ ...prev, isSoldOut: !prev.isSoldOut }))}
                        className={`p-3 border cursor-pointer select-none transition-all flex items-start gap-3 ${
                          formData.isSoldOut
                            ? "bg-red-500/10 border-red-500/50 text-white"
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div
                          className={`mt-0.5 size-4 rounded-none border flex items-center justify-center shrink-0 ${
                            formData.isSoldOut ? "bg-red-500 border-red-500 text-white" : "border-neutral-600 bg-neutral-900"
                          }`}
                        >
                          {formData.isSoldOut && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold uppercase">
                            {formData.isSoldOut ? "Sold Out / Unavailable" : "In Stock / Available"}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                            {formData.isSoldOut ? "Hides Add to Cart button" : "Visible for purchase"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Visual Assets & Gallery */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Cover Image Box */}
                  <div className="bg-neutral-900/40 border border-neutral-800 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <ImageIcon size={13} /> Main Cover Image <span className="text-primary">*</span>
                      </span>
                      {formData.image && (
                        <span className="text-[10px] font-mono text-green-400 font-bold uppercase flex items-center gap-1">
                          <Check size={11} /> Selected
                        </span>
                      )}
                    </div>

                    {/* Preview Box */}
                    <div className="relative aspect-square w-full bg-neutral-950 border border-neutral-800 flex items-center justify-center overflow-hidden group">
                      {formData.image ? (
                        <>
                          <Image
                            src={formData.image}
                            alt="Product cover preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={() => setIsMediaPickerOpen(true)}
                            >
                              Replace
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="xs"
                              onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                            >
                              Clear
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 space-y-2">
                          <div className="size-12 rounded-none bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                            {uploadingCover ? <Loader2 size={20} className="animate-spin text-primary" /> : <Upload size={20} />}
                          </div>
                          <p className="text-xs font-mono font-bold uppercase text-neutral-400">No Cover Image Selected</p>
                          <p className="text-[10px] font-mono text-neutral-600">Upload a high-res image or pick from library</p>
                        </div>
                      )}
                    </div>

                    {/* Cover Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center justify-center gap-2 py-2 px-3 border border-neutral-700 bg-neutral-900 hover:border-primary text-white text-xs font-mono font-bold uppercase cursor-pointer transition-colors text-center">
                        <Upload size={13} />
                        <span>{uploadingCover ? "Uploading..." : "Upload File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingCover}
                          onChange={handleUploadCoverFile}
                          className="hidden"
                        />
                      </label>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="w-full"
                      >
                        <ImageIcon size={13} /> Library
                      </Button>
                    </div>
                  </div>

                  {/* Gallery Images Box */}
                  <div className="bg-neutral-900/40 border border-neutral-800 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Layers size={13} /> Additional Gallery Shots
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {(formData.images || []).length} images
                      </span>
                    </div>

                    {/* Gallery Thumbnails Grid */}
                    <div className="grid grid-cols-3 gap-2 min-h-[80px]">
                      {(formData.images || []).map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border border-neutral-800 bg-neutral-950 overflow-hidden group"
                        >
                          <Image src={imgUrl} alt={`gallery shot ${idx + 1}`} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, image: imgUrl }))}
                              className="text-[9px] font-mono uppercase bg-primary text-black font-bold px-1.5 py-0.5 hover:bg-primary/90"
                              title="Make Cover"
                            >
                              Cover
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="text-[9px] font-mono uppercase bg-red-600 text-white font-bold px-1.5 py-0.5 hover:bg-red-500"
                              title="Delete"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Gallery Tile */}
                      <label className="border border-dashed border-neutral-700 hover:border-primary aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950/60 p-2 text-center group">
                        {uploadingGallery ? (
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 size={16} className="animate-spin text-primary mb-1" />
                            <span className="text-[8px] font-mono uppercase text-neutral-400">Uploading</span>
                          </div>
                        ) : (
                          <>
                            <Plus size={16} className="text-neutral-500 group-hover:text-primary transition-colors mb-1" />
                            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white">
                              Upload
                            </span>
                            <span className="text-[8px] font-mono text-neutral-600">Multi</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingGallery}
                          onChange={handleUploadGalleryFiles}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Gallery Actions Toolbar */}
                    <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-2">
                      <label className="flex items-center justify-center gap-2 py-1.5 px-3 border border-neutral-700 bg-neutral-900 hover:border-primary text-white text-xs font-mono font-bold uppercase cursor-pointer transition-colors text-center">
                        <Upload size={12} />
                        <span>{uploadingGallery ? "Uploading..." : "Upload Multi"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingGallery}
                          onChange={handleUploadGalleryFiles}
                          className="hidden"
                        />
                      </label>

                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => setIsGalleryPickerOpen(true)}
                        className="w-full"
                      >
                        <ImageIcon size={12} /> Import Library
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Sticky action bar) */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950">
                <div className="text-xs font-mono text-neutral-500 hidden sm:block">
                  * Required fields must be completed before publishing.
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSaving}
                    className="min-w-[140px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin mr-1" />
                        Saving...
                      </>
                    ) : editingProduct ? (
                      "Update Product"
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {/* Media Pickers */}
      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(url) => setFormData((prev) => ({
          ...prev,
          image: url,
          images: Array.from(new Set([url, ...(prev.images || [])])),
        }))}
      />
      <MediaPicker
        open={isGalleryPickerOpen}
        onOpenChange={setIsGalleryPickerOpen}
        multiple={true}
        onSelectMultiple={(urls) => addGalleryImages(urls)}
      />

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
