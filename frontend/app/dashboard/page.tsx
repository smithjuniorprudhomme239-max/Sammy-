'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import api from '@/lib/api';
import { formatPrice, formatDate, statusColors } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Order } from '@/types';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my-orders').then((r) => r.data),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { href: '/dashboard', icon: Package, label: 'My Orders' },
                { href: '/dashboard/profile', icon: User, label: 'Profile' },
                { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Icon size={16} /> {label}
                </Link>
              ))}
              <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Orders */}
        <div className="md:col-span-3">
          <h1 className="text-xl font-bold text-gray-900 mb-5">My Orders</h1>
          {isLoading && <div className="text-gray-500">Loading orders...</div>}
          {orders?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No orders yet</p>
              <Link href="/products" className="text-accent-500 text-sm mt-2 inline-block">Start shopping</Link>
            </div>
          )}
          <div className="space-y-4">
            {orders?.map((order: Order) => (
              <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={statusColors[order.status]}>{order.status}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} · {formatPrice(order.totalPrice)}
                </div>
                <Link href={`/dashboard/orders/${order._id}`} className="text-sm text-accent-500 hover:text-accent-600 font-medium">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
