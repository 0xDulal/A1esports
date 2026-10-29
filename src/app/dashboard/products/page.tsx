"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/data/shop";
import { getProductsFromSupabase } from "@/lib/supabase/db";
import { sbDelete } from "@/lib/supabase/rest";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  Eye,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProductsFromSupabase();
    setProducts(data || []);
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(targetId)));
    await sbDelete("products", targetId);
    toast.success("Product deleted successfully");
  };

  const MobileProductCard = ({ product }: { product: Product }) => {
    const [offset, setOffset] = useState(0);
    const [startX, setStartX] = useState<number | null>(null);
    const open = offset < -40;

    const snap = (x: number) => {
      setOffset(x);
      setStartX(null);
    };

    return (
      <div className="relative overflow-hidden rounded-sm bg-[#0a0a0a] border border-white/10">
        {/* Swipe-revealed actions (behind the card) */}
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
          <Link
            href={`/shop/${product.slug}`}
            target="_blank"
            className="p-3 bg-neutral-800 text-white rounded-sm"
            title="View on Storefront"
          >
            <Eye size={18} />
          </Link>
          <Link
            href={`/dashboard/products/${encodeURIComponent(product.id)}`}
            className="p-3 bg-primary text-black rounded-sm"
            title="Edit Product"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => setDeleteId(product.id)}
            className="p-3 bg-red-600 text-white rounded-sm"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Card face that slides left on swipe */}
        <div
          className="relative bg-[#0a0a0a] transition-transform"
          style={{ transform: `translateX(${offset}px)` }}
          onTouchStart={(e) => setStartX(e.touches[0].clientX)}
          onTouchMove={(e) => {
            if (startX === null) return;
            setOffset(Math.min(0, Math.max(-156, e.touches[0].clientX - startX)));
          }}
          onTouchEnd={() => snap(open ? -156 : 0)}
          onClick={() => {
            if (open) {
              snap(0);
            } else {
              router.push(`/dashboard/products/${encodeURIComponent(product.id)}`);
            }
          }}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="relative h-12 w-12 rounded-sm overflow-hidden bg-neutral-800 shrink-0">
              <Image src={product.image || "/A1esports_logo_white.svg"} alt={product.title} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-white block truncate group-hover:text-primary transition-colors">{product.title}</span>
              <span className="text-xs text-neutral-500 truncate block">{product.slug}</span>
            </div>
            {product.isSoldOut && (
              <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-[10px] font-bold shrink-0">Sold Out</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-michroma uppercase mb-2">Products Management</h1>
          <p className="text-neutral-400">
            Manage your official store inventory & product gallery images ({products.length} products)
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-primary text-black font-mono font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Loading store inventory...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-16 text-center flex flex-col items-center gap-3">
          <Package size={44} className="text-neutral-700" />
          <p className="font-michroma text-base uppercase text-white">No Products Found</p>
          <p className="text-xs text-neutral-500">Add your first merchandise product to the storefront.</p>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-sm bg-primary text-black font-mono font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} /> Add Product
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: swipeable cards */}
          <div className="sm:hidden space-y-2">
            {products.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Product</th>
                  <th className="hidden sm:table-cell text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Gallery</th>
                  <th className="hidden sm:table-cell text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Price</th>
                  <th className="hidden sm:table-cell text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Category</th>
                  <th className="hidden sm:table-cell text-left p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center p-4 font-bold text-neutral-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => router.push(`/dashboard/products/${encodeURIComponent(product.id)}`)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
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
                          <span className="font-bold text-white block group-hover:text-primary transition-colors">{product.title}</span>
                          <span className="text-xs text-neutral-500">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-4">
                      <div className="flex items-center gap-1">
                        <ImageIcon size={14} className="text-primary" />
                        <span className="text-xs font-bold text-white">
                          {(product.images || []).length || 1} images
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-4 font-bold text-white font-mono text-sm">
                      ৳{product.halfSleevePrice || product.price}
                    </td>
                    <td className="hidden sm:table-cell p-4">
                      <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell p-4">
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
                    <td className="hidden sm:table-cell p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/shop/${product.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-white/10 text-neutral-300 hover:text-white rounded-sm transition-colors"
                          title="View on Storefront"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/dashboard/products/${encodeURIComponent(product.id)}`}
                          className="p-2 hover:bg-white/10 text-white rounded-sm transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </Link>
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
        </>
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