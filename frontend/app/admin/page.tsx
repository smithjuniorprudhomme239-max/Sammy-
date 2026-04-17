'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { formatPrice, formatDate, statusColors } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Order } from '@/types';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
    else if (user.role !== 'admin') router.push('/dashboard');
  }, [user, router]);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
    enabled: user?.role === 'admin',
  });

  if (!stats) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;

  const STAT_CARDS = [
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-100 text-purple-600' },
    { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/products" className="text-sm text-accent-500 hover:text-accent-600 font-medium">Manage Products</Link>
          <Link href="/admin/orders" className="text-sm text-accent-500 hover:text-accent-600 font-medium">Manage Orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order ID', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((order: Order & { user: { name: string; email: string } }) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-3">{order.user?.name}</td>
                  <td className="py-3 px-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-3 font-medium">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-3"><Badge className={statusColors[order.status]}>{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
