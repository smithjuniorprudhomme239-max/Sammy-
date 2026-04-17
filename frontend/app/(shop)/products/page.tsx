'use client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import Button from '@/components/ui/Button';

const CATEGORIES = ['Tablets', 'Audio', 'Gaming'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const params = {
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
    page,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get('/products', { params }).then((r) => r.data),
  });

  const updateFilter = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    value ? sp.set(key, value) : sp.delete(key);
    router.push(`/products?${sp.toString()}`);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {params.category || 'All Products'}
          {data && <span className="text-sm font-normal text-gray-500 ml-2">({data.total} items)</span>}
        </h1>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={18} className="text-gray-500" />
          <select
            value={params.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!params.category ? 'bg-accent-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All Products
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${params.category === cat ? 'bg-accent-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <ProductGrid products={data?.products || []} loading={isLoading} />
          {data && data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {data.pages}</span>
              <Button variant="outline" disabled={page === data.pages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}