'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore();
  const subtotal = total();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link href="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, qty }) => (
            <div key={product._id} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative w-20 h-20 bg-gray-50 rounded-lg shrink-0">
                <Image src={product.images[0] || '/placeholder.png'} alt={product.name} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.slug}`} className="font-medium text-gray-900 hover:text-accent-500 line-clamp-2 text-sm">
                  {product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateQty(product._id, qty - 1)} className="p-1.5 hover:bg-gray-50"><Minus size={14} /></button>
                    <span className="px-3 text-sm font-medium">{qty}</span>
                    <button onClick={() => updateQty(product._id, qty + 1)} className="p-1.5 hover:bg-gray-50"><Plus size={14} /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{formatPrice(product.price * qty)}</span>
                    <button onClick={() => removeItem(product._id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>{formatPrice(subtotal + shipping + tax)}</span>
            </div>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-gray-500 mt-3">Add {formatPrice(100 - subtotal)} more for free shipping</p>
          )}
          <Link href="/checkout" className="block mt-6">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
          <Link href="/products" className="block mt-3">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
