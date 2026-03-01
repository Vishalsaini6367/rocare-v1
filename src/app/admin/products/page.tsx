'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal, ShoppingBag, IndianRupee, Calendar, Eye, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (session && (session.user as any).role !== 'admin') {
            router.push('/dashboard');
        } else if (status === 'authenticated') {
            fetchProducts();
        }
    }, [status, session]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        try {
            toast.loading('Deleting system...', { id: 'del-prod' });
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted from catalog', { id: 'del-prod' });
            } else {
                const data = await response.json();
                toast.error(data.message || 'Deletion failed', { id: 'del-prod' });
            }
        } catch (error) {
            toast.error('Network error during deletion', { id: 'del-prod' });
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading || status === 'loading') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <span className="text-lg font-black text-slate-900 tracking-tight italic">Inventory Data Retrieval...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-8 animate-fade-in group">
                    <div>
                        <h1 className="mb-2 group-hover:text-blue-600 transition duration-300">Catalog Manager</h1>
                        <p className="italic">Configure your premium RO offerings for the digital storefront.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/admin/products/new"
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center space-x-3 transform active:scale-95"
                        >
                            <Plus className="w-6 h-6" />
                            <span>Add New System</span>
                        </Link>
                    </div>
                </div>

                {/* Filters/Actions Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                    <div className="relative w-full max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                            placeholder="Find systems by name or serial ID..."
                        />
                    </div>

                    <div className="flex items-center space-x-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 pr-4">
                        <button className="flex items-center space-x-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition whitespace-nowrap text-xs uppercase tracking-widest italic active:scale-95">
                            <Filter className="w-5 h-5" />
                            <span>Filter</span>
                        </button>
                        <button className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-100 transition active:scale-95">
                            <MoreHorizontal className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Table/Cards container */}
                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative group">
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 opacity-80 group-hover:h-3 transition-all duration-500"></div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">System Intelligence</th>
                                    <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Pricing Architecture</th>
                                    <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Lifecycle Log</th>
                                    <th className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {filteredProducts.map((product: any) => (
                                    <tr key={product._id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center space-x-6">
                                                <div className="flex-shrink-0 h-16 w-16 bg-white border border-slate-100 rounded-2xl p-2 shadow-sm flex items-center justify-center overflow-hidden">
                                                    {product.image ? (
                                                        <img className="h-full w-full object-contain mix-blend-multiply" src={product.image} alt="" />
                                                    ) : (
                                                        <ShoppingBag className="w-6 h-6 text-slate-200" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-2">{product.name}</p>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">REF: #{product._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center space-x-1 text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tighter">
                                                    <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                                    <span>{product.price.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 w-fit px-3 py-1.5 rounded-full border border-emerald-100 italic">
                                                    <Plus className="w-2.5 h-2.5 mr-1" />
                                                    <span>Premium Tier</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-sm font-bold">
                                            <div className="flex flex-col space-y-3">
                                                <div className="flex items-center space-x-2 text-slate-400 uppercase tracking-widest text-[10px]">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(product.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-slate-600 italic">
                                                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                                                    <span>Deployed by Root</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-4">
                                                <Link
                                                    href={`/admin/products/${product._id}/edit`}
                                                    className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition shadow-sm group/btn active:scale-90"
                                                >
                                                    <Edit className="w-5 h-5 group-hover/btn:scale-110 transition" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id, product.name)}
                                                    className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition shadow-sm group/btn active:scale-90"
                                                >
                                                    <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition" />
                                                </button>
                                                <Link
                                                    href={`/products/${product._id}`}
                                                    className="px-6 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition flex items-center space-x-2 overflow-hidden relative group/view active:scale-95"
                                                >
                                                    <span className="relative z-10 text-[10px] uppercase tracking-widest">Detail</span>
                                                    <Eye className="w-4 h-4 relative z-10" />
                                                    <div className="absolute inset-0 bg-blue-600 transform translate-y-full group-hover/view:translate-y-0 transition duration-500"></div>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-40 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                                <Activity className="w-10 h-10 text-slate-300 animate-pulse" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">No Systems Located</h3>
                                            <p className="text-lg text-slate-400 font-bold italic">Adjust your search logic or expand the catalog.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
