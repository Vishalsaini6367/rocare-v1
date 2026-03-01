import { Navbar } from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { ShoppingBag, Star, ShieldCheck, HeartPulse, Sparkles, Filter, ChevronRight, Droplet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

async function getProducts() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Search & Hero Container */}
            <section className="bg-white border-b border-slate-100 py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center animate-fade-in text-center">
                    <h1 className="mb-6">
                        Explore Pure Water <br />
                        <span className="text-blue-600">Solutions for Every Home</span>
                    </h1>
                    <p className="max-w-2xl mx-auto italic mb-10">
                        Multi-stage filtration, smart monitoring, and the ultimate peace of mind.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-4 md:py-5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium pr-16"
                            />
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                                <Filter className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-4 bg-white md:bg-slate-50 md:rounded-3xl font-bold text-slate-400 text-[10px] md:text-sm">
                            <span className="px-3 py-1 bg-slate-50 rounded-full hover:text-blue-600 cursor-pointer">Best Sellers</span>
                            <span className="px-3 py-1 bg-slate-50 rounded-full hover:text-blue-600 cursor-pointer">Under ₹25k</span>
                            <span className="px-3 py-1 bg-slate-50 rounded-full hover:text-blue-600 cursor-pointer">Commercial</span>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
                    {products.map((product: any) => (
                        <div key={product._id} className="group flex flex-col items-center bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-500/10 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 md:p-8">
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">In Stock</span>
                            </div>

                            {/* Image Placeholder */}
                            <div className="relative w-full aspect-square bg-slate-50 rounded-3xl md:rounded-[2rem] mb-8 md:mb-12 flex items-center justify-center p-8 md:p-12 overflow-hidden shadow-inner border border-slate-100 group-hover:bg-blue-50 transition duration-300 transform group-hover:-translate-y-2">
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/30 to-transparent"></div>
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                ) : (
                                    <Droplet className="w-16 h-16 md:w-24 md:h-24 text-blue-200 animate-pulse" />
                                )}
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition duration-300"></div>
                            </div>

                            <div className="w-full text-center mb-8">
                                <div className="flex items-center justify-center space-x-1 text-amber-400 mb-3 md:mb-4">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}
                                    <span className="ml-2 text-[10px] md:text-xs font-bold text-slate-500">4.9 (124)</span>
                                </div>
                                <h3 className="mb-4 text-slate-900 group-hover:text-blue-600 transition truncate w-full">{product.name}</h3>
                                <p className="text-sm md:text-base italic mb-6 line-clamp-2 md:line-clamp-3">
                                    {product.description}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-4">
                                    <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> 1Y Warranty</span>
                                    <span className="flex items-center"><HeartPulse className="w-3 h-3 mr-1 text-blue-500" /> RO + UV + UF</span>
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 font-bold line-through text-xs md:text-sm leading-none mb-1">₹{(product.price * 1.2).toFixed(0)}</span>
                                    <span className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tighter">₹{product.price}</span>
                                </div>
                                <Link
                                    href={`/products/${product._id}`}
                                    className="bg-blue-600 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center space-x-2 transform active:scale-95 group-hover:scale-105"
                                >
                                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                                    <span className="font-bold text-sm md:text-lg px-1 md:px-2 whitespace-nowrap">Order</span>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-10">
                                <ShoppingBag className="w-10 h-10 text-slate-400" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Our inventory is being updated</h2>
                            <p className="text-lg text-slate-500 font-medium italic">Please check back in a few hours for the new collection.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
