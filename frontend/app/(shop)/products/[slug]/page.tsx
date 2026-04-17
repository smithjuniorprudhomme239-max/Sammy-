'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Minus, Plus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { StarRating, Badge } from '@/components/ui/Badge';
import { statusColors } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: () => api.get(`/products/${params.slug}`).then((r) => r.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: () => api.get(`/reviews/${product._id}`).then((r) => r.data),
    enabled: !!product?._id,
  });

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Product not found</div>;

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <Image src={product.images[activeImg] || '/placeholder.png'} alt={product.name} fill className="object-contain p-6" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-accent-500' : 'border-gray-200'}`}>
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-500">{product.numReviews} reviews</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice > product.price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className={product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-gray-50"><Minus size={16} /></button>
                <span className="px-4 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 hover:bg-gray-50"><Plus size={16} /></button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart size={18} /> Add to Cart
              </Button>
            </div>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <dl className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <dt className="text-xs text-gray-500">{k}</dt>
                    <dd className="text-sm font-medium text-gray-900">{v as string}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        {reviews?.length === 0 && <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
        <div className="space-y-4">
          {reviews?.map((review: any) => (
            <div key={review._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{review.user.name}</p>
                  <StarRating rating={review.rating} size={14} />
                </div>
                {review.isVerifiedPurchase && (
                  <Badge className="bg-green-100 text-green-700">Verified Purchase</Badge>
                )}
              </div>
              <p className="font-medium text-gray-800 mt-2">{review.title}</p>
              <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
