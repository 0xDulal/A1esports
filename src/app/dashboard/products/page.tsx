"use client";

import { shopProducts } from "@/lib/data/shop";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProducts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-neutral-400">Manage your store products</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-bold text-neutral-400">Product</th>
              <th className="text-left p-4 font-bold text-neutral-400">Price</th>
              <th className="text-left p-4 font-bold text-neutral-400">Category</th>
              <th className="text-left p-4 font-bold text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {shopProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/5">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-800">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{product.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  ৳{product.halfSleevePrice || product.price}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">
                    {product.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
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
  );
}
