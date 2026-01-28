
import React, { useState } from 'react';
import { Product, CartItem, Category } from './types';
import { PRODUCTS } from './constants';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import WhatsAppButton from './components/WhatsAppButton';
import PaymentModal from './components/PaymentModal';
import AIAssistant from './components/AIAssistant';
import WelcomePopup from './components/WelcomePopup';

const SECTIONS: Category[] = ['Secret Fish', 'Gamepass', 'Skin Crates', 'Enchant Items', 'Bundle Pack'];

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setIsPaymentOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <WelcomePopup />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/10 border border-slate-800 overflow-hidden group-hover:scale-110 transition-transform duration-300">
              <img 
                src="https://i.ibb.co.com/Dx9zVZJ/1769599055539.png" 
                alt="Fish It Store Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-none">
                FISH IT STORE ID
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 mr-6">
              {SECTIONS.map(s => (
                <a 
                  key={s} 
                  href={`#${s.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-xs font-bold uppercase tracking-widest transition-colors text-slate-400 hover:text-cyan-400"
                >
                  {s}
                </a>
              ))}
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full pt-28 pb-20 px-6 flex-grow">
        <header className="mb-12 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-black font-outfit mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              Halo Sobat Talon!
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl">Kami Menyediakan berbagai kebutuhan FISHIT kamu disini!</p>
        </header>

        <div className="space-y-24">
          {SECTIONS.map((section) => (
            <section 
              key={section} 
              id={section.replace(/\s+/g, '-').toLowerCase()}
              className="scroll-mt-32"
            >
              <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-10 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                  <div>
                    <h3 className="text-2xl font-black font-outfit uppercase tracking-tight text-white">
                      {section}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {PRODUCTS.filter(p => p.category === section).length} Koleksi Tersedia
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {PRODUCTS.filter(p => p.category === section).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart} 
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
      
      <AIAssistant />
      <WhatsAppButton />
    </div>
  );
};

export default App;
