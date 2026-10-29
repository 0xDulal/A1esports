"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import { sbInsert, sbUpdate } from "@/lib/supabase/rest";
import { uploadImageToSupabase } from "@/lib/supabase/client";
import Image from "next/image";
import {
  ArrowLeft,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  Shirt,
  DollarSign,
  Layers,
  Plus,
} from "lucide-react";
import { MediaPicker } from "@/components/dashboard/MediaPicker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [productId, setProductId] = useState<string | null>(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const dragIndex = useRef<number | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
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
    specs: [],
  });

  useEffect(() => {
    (async () => {
      const data = await getProductsFromSupabase();
      if (productId && productId !== "new") {
        const found = data.find((p) => String(p.id) === String(productId));
        if (found) {
          setFormData({
            ...found,
            images: found.images && found.images.length > 0 ? found.images : [found.image],
          });
        } else {
          toast.error("Product not found");
          router.replace("/dashboard/products");
          return;
        }
      }
      setLoading(false);
    })();
  }, [productId, router]);

  const isEditing = Boolean(productId && productId !== "new");

  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: !isEditing ? autoSlug : prev.slug || autoSlug,
    }));
  };

  const handleCategoryChange = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      canCustomise: cat === "JERSEYS" ? true : prev.canCustomise,
    }));
  };

  const handleBasePriceChange = (value: string) => {
    const num = value === "" ? undefined : Number(value);
    setFormData((prev) => {
      const updated: Partial<Product> = { ...prev, price: num as any };
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
      return { ...prev, images: Array.from(new Set([...current, ...valid])) };
    });
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleGalleryDrop = (targetIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;
    setFormData((prev) => {
      const images = [...(prev.images || [])];
      const [moved] = images.splice(from, 1);
      images.splice(targetIndex > from ? targetIndex - 1 : targetIndex, 0, moved);
      return { ...prev, images };
    });
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
        specs: formData.specs || [],
      };

      if (isEditing && productId) {
        await sbUpdate("products", productId, dbPayload);
        toast.success("Product updated successfully");
      } else {
        const id = `prod-${Date.now()}`;
        await sbInsert("products", { id, ...dbPayload });
        toast.success("Product added to inventory");
      }

      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-400">
        <Loader2 size={28} className="animate-spin text-primary" />
        <p className="text-xs font-mono uppercase tracking-widest">Loading product form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <Button asChild variant="outline" size="xs">
            <Link href="/dashboard/products" className="gap-2 text-neutral-400 hover:text-white">
              <ArrowLeft size={12} />
              <span>BACK TO PRODUCTS</span>
            </Link>
          </Button>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-3xl font-michroma uppercase tracking-tight text-white">
              {isEditing ? "Edit Product" : "Add Product"}
            </h1>
            {isEditing && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
                #{String(productId).slice(-6)}
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          form="product-form"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-black font-mono font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Info & Pricing */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0a0a0a] border border-white/10 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Shirt size={13} /> Product Information
              </span>
            </div>

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Storefront URL Slug</label>
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

            <div>
              <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase mb-2">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

          <div className="bg-[#0a0a0a] border border-white/10 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <DollarSign size={13} /> Pricing & Variants (BDT)
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-neutral-300 uppercase mb-1.5">
                Base Price (BDT) <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.price ?? ""}
                onChange={(e) => handleBasePriceChange(e.target.value)}
                placeholder="e.g. 650"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-primary px-3.5 pr-4 py-2.5 text-sm font-mono text-white placeholder:text-neutral-600 outline-none font-bold"
              />
            </div>

            {formData.category === "JERSEYS" && (
              <div className="border-t border-white/10 pt-3 space-y-3">
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
                    <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Half Sleeve (BDT)</label>
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
                    <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Full Sleeve (BDT)</label>
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

          <div className="bg-[#0a0a0a] border border-white/10 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Layers size={13} /> Product Specifications
              </span>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, specs: [...(prev.specs || []), { name: "", value: "" }] }))}
                className="text-[10px] font-mono text-primary hover:underline uppercase font-bold flex items-center gap-1"
              >
                <Plus size={12} /> Add Spec
              </button>
            </div>

            {(!formData.specs || formData.specs.length === 0) ? (
              <div className="text-center p-4 border border-dashed border-neutral-800 text-neutral-500 text-xs font-mono">
                No specifications added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={spec.name}
                        onChange={(e) => {
                          const newSpecs = [...(formData.specs || [])];
                          newSpecs[idx].name = e.target.value;
                          setFormData({ ...formData, specs: newSpecs });
                        }}
                        placeholder="Spec Name (e.g. Fit Architecture)"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => {
                          const newSpecs = [...(formData.specs || [])];
                          newSpecs[idx].value = e.target.value;
                          setFormData({ ...formData, specs: newSpecs });
                        }}
                        placeholder="Spec Value (e.g. Pro Esports Performance)"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSpecs = [...(formData.specs || [])];
                        newSpecs.splice(idx, 1);
                        setFormData({ ...formData, specs: newSpecs });
                      }}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-transparent"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-4 space-y-3">
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary border-b border-white/10 pb-2">
              Storefront Settings
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Fans can enter custom Gamertag & back number</div>
                </div>
              </div>

              <div
                onClick={() => setFormData((prev) => ({ ...prev, isSoldOut: !prev.isSoldOut }))}
                className={`p-3 border cursor-pointer select-none transition-all flex items-center justify-between gap-3 ${
                  formData.isSoldOut
                    ? "bg-red-500/10 border-red-500/50 text-white"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="text-xs font-mono font-bold uppercase">Out of Stock</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {formData.isSoldOut ? "Hidden from purchase" : "Visible for purchase"}
                  </div>
                </div>
                <div
                  className={`relative w-10 h-5 shrink-0 transition-colors ${
                    formData.isSoldOut ? "bg-red-500" : "bg-neutral-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 size-4 bg-white transition-all ${
                      formData.isSoldOut ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Assets & Gallery */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0a0a0a] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <ImageIcon size={13} /> Main Cover Image <span className="text-primary">*</span>
              </span>
              {formData.image && (
                <span className="text-[10px] font-mono text-green-400 font-bold uppercase flex items-center gap-1">
                  <Check size={11} /> Selected
                </span>
              )}
            </div>

            <div className="relative h-64 aspect-square mx-auto bg-neutral-950 border border-neutral-800 flex items-center justify-center overflow-hidden group">
              {formData.image ? (
                <>
                  <Image src={formData.image} alt="Product cover preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <Button type="button" variant="outline" size="xs" onClick={() => setIsMediaPickerOpen(true)}>
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

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 py-2 px-3 border border-neutral-700 bg-neutral-900 hover:border-primary text-white text-xs font-mono font-bold uppercase cursor-pointer transition-colors text-center">
                <Upload size={13} />
                <span>{uploadingCover ? "Uploading..." : "Upload File"}</span>
                <input type="file" accept="image/*" disabled={uploadingCover} onChange={handleUploadCoverFile} className="hidden" />
              </label>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsMediaPickerOpen(true)} className="w-full">
                <ImageIcon size={13} /> Library
              </Button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Layers size={13} /> Additional Gallery Shots
              </span>
              <span className="text-[10px] font-mono text-neutral-400">{(formData.images || []).length} images</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-h-[80px]">
              {(formData.images || []).map((imgUrl, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => { dragIndex.current = idx; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleGalleryDrop(idx); }}
                  onDragEnd={() => { dragIndex.current = null; }}
                  className={`relative aspect-square border bg-neutral-950 overflow-hidden group transition-colors ${
                    dragIndex.current === idx ? "opacity-40 border-primary" : "border-neutral-800"
                  }`}
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
                  <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] font-mono text-neutral-500 group-hover:text-neutral-300 bg-black/50 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Drag to reorder
                  </div>
                </div>
              ))}

              <label className="border border-dashed border-neutral-700 hover:border-primary aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950/60 p-2 text-center group">
                {uploadingGallery ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-primary mb-1" />
                    <span className="text-[8px] font-mono uppercase text-neutral-400">Uploading</span>
                  </div>
                ) : (
                  <>
                    <Plus size={16} className="text-neutral-500 group-hover:text-primary transition-colors mb-1" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white">Upload</span>
                    <span className="text-[8px] font-mono text-neutral-600">Multi</span>
                  </>
                )}
                <input type="file" accept="image/*" multiple disabled={uploadingGallery} onChange={handleUploadGalleryFiles} className="hidden" />
              </label>
            </div>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 py-1.5 px-3 border border-neutral-700 bg-neutral-900 hover:border-primary text-white text-xs font-mono font-bold uppercase cursor-pointer transition-colors text-center">
                <Upload size={12} />
                <span>{uploadingGallery ? "Uploading..." : "Upload Multi"}</span>
                <input type="file" accept="image/*" multiple disabled={uploadingGallery} onChange={handleUploadGalleryFiles} className="hidden" />
              </label>
              <Button type="button" variant="outline" size="xs" onClick={() => setIsGalleryPickerOpen(true)} className="w-full">
                <ImageIcon size={12} /> Import Library
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Media Pickers */}
      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(url) =>
          setFormData((prev) => ({
            ...prev,
            image: url,
            images: Array.from(new Set([url, ...(prev.images || [])])),
          }))
        }
      />
      <MediaPicker
        open={isGalleryPickerOpen}
        onOpenChange={setIsGalleryPickerOpen}
        multiple={true}
        onSelectMultiple={(urls) => addGalleryImages(urls)}
      />
    </div>
  );
}