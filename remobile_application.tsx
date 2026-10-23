import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Moon, Sun, ShieldCheck, Wrench, BatteryCharging, 
  MapPin, ChevronRight, CheckCircle2, ChevronDown, Info, Smartphone, Recycle 
} from 'lucide-react';

// --- CONFIGURATION & DONNÉES ---

const COLORS = {
  primary: '#0F2F33',
  secondary: '#0B7A5A',
  darkCta: '#3DDBA4',
  darkBg: '#0B1416',
  darkSurface: '#132023',
  lightBg: '#F7F7F4',
  mint: '#EEF4F1',
  success: '#187A45',
  error: '#B3261E',
  amber: '#F2B134',
};

const BEST_SELLERS = [
  { id: 1, name: "iPhone 13", price: 379, oldPrice: 709, grade: "PARFAIT ÉTAT" },
  { id: 2, name: "Samsung Galaxy S23", price: 359, oldPrice: 859, grade: "TRÈS BON ÉTAT" },
  { id: 3, name: "Google Pixel 8", price: 329, oldPrice: 799, grade: "ÉTAT CORRECT" },
  { id: 4, name: "iPhone 12", price: 259, oldPrice: 659, grade: "PARFAIT ÉTAT" }
];

// --- COMPOSANTS UI PARTAGÉS ---

const Button = ({ children, variant = 'primary', onClick, className = '', isDark }) => {
  let baseStyle = "font-semibold rounded-lg px-6 py-3 transition-colors duration-200 flex items-center justify-center text-center";
  let variantStyle = "";

  if (variant === 'primary') {
    variantStyle = "bg-[#0B7A5A] text-white hover:bg-[#0F2F33] dark:bg-[#3DDBA4] dark:text-[#0B1416] dark:hover:bg-white";
  } else if (variant === 'secondary') {
    variantStyle = "border-2 border-[#0B7A5A] text-[#0B7A5A] hover:bg-[#EEF4F1] dark:border-[#3DDBA4] dark:text-[#3DDBA4] dark:hover:bg-[#132023]";
  } else if (variant === 'ghost') {
    variantStyle = "text-[#0F2F33] hover:bg-[#EEF4F1] dark:text-white dark:hover:bg-[#132023]";
  }

  return (
    <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ text, type = 'default' }) => {
  let styles = "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider";
  if (type === 'success') styles += " bg-[#EEF4F1] text-[#187A45] dark:bg-[#132023] dark:text-[#3DDBA4]";
  else if (type === 'amber') styles += " bg-yellow-100 text-[#F2B134] dark:bg-yellow-900/30 dark:text-yellow-400";
  else styles += " bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  
  return <span className={styles}>{text}</span>;
};

// --- COMPOSANTS DE VUE ---

const Header = ({ setView, cartCount, isDark, toggleTheme }) => (
  <header className="sticky top-0 z-50 w-full bg-[#F7F7F4] dark:bg-[#0B1416] border-b border-gray-200 dark:border-gray-800">
    {/* Top bar */}
    <div className="bg-[#0F2F33] text-white dark:bg-[#132023] py-2 text-xs md:text-sm text-center font-medium">
      Garantie 24 mois <span className="mx-2 opacity-50">|</span> 
      Livraison 24h <span className="mx-2 opacity-50">|</span> 
      Atelier à Lyon
    </div>
    
    {/* Main Header */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 rounded bg-[#0B7A5A] dark:bg-[#3DDBA4] flex items-center justify-center mr-2">
            <Recycle className="w-5 h-5 text-white dark:text-[#0B1416]" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#0F2F33] dark:text-white">
            Re<span className="text-[#0B7A5A] dark:text-[#3DDBA4]">Mobile</span>
          </span>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Rechercher un modèle, une marque..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#132023] focus:outline-none focus:border-[#0B7A5A] dark:focus:border-[#3DDBA4]"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" aria-label="Basculer le thème">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="ml-2 font-semibold hidden sm:block">Panier ({cartCount})</span>
            {cartCount > 0 && (
              <span className="sm:hidden absolute -top-1 -right-1 bg-[#B3261E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="hidden md:flex space-x-8 pb-4 text-sm font-bold text-[#0F2F33] dark:text-gray-300">
        <button onClick={() => setView('home')} className="hover:text-[#0B7A5A] dark:hover:text-[#3DDBA4]">Acheter</button>
        <button onClick={() => setView('tradein')} className="hover:text-[#0B7A5A] dark:hover:text-[#3DDBA4]">Reprise</button>
        <button className="hover:text-[#0B7A5A] dark:hover:text-[#3DDBA4]">Comparer</button>
        <button className="hover:text-[#0B7A5A] dark:hover:text-[#3DDBA4]">Impact</button>
        <button className="hover:text-[#0B7A5A] dark:hover:text-[#3DDBA4]">Aide</button>
      </nav>
    </div>
  </header>
);

const Home = ({ setView }) => (
  <main className="w-full">
    {/* Hero Section */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col-reverse md:flex-row items-center gap-12">
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0F2F33] dark:text-white">
          Le smartphone qu'il vous faut, <span className="text-[#0B7A5A] dark:text-[#3DDBA4]">garanti 24 mois.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
          Neufs et reconditionnés, contrôlés en 45 points dans notre atelier de Lyon. Transparent, du premier prix à la dernière rayure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={() => setView('pdp')}>Acheter un appareil</Button>
          <Button variant="secondary" onClick={() => setView('tradein')}>Estimer ma reprise</Button>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        {/* Placeholder Premium Image */}
        <div className="relative w-72 h-96 bg-gradient-to-tr from-gray-200 to-white dark:from-[#132023] dark:to-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 transform rotate-3">
          <Smartphone className="w-32 h-32 text-gray-300 dark:text-gray-600" />
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#132023] p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-3 transform -rotate-3">
            <Wrench className="w-8 h-8 text-[#0B7A5A] dark:text-[#3DDBA4]" />
            <div className="text-sm font-bold leading-tight">
              Certifié<br/>Atelier Lyon
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Express Selector */}
    <section className="bg-[#EEF4F1] dark:bg-[#132023] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-[#0B1416] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <span className="font-bold whitespace-nowrap text-lg">Trouvez vite :</span>
          <select className="flex-1 bg-gray-50 dark:bg-[#132023] border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-full outline-none focus:border-[#0B7A5A]">
            <option>Toutes les marques</option>
            <option>Apple</option>
            <option>Samsung</option>
          </select>
          <select className="flex-1 bg-gray-50 dark:bg-[#132023] border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-full outline-none focus:border-[#0B7A5A]">
            <option>Tous les modèles</option>
          </select>
          <select className="flex-1 bg-gray-50 dark:bg-[#132023] border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-full outline-none focus:border-[#0B7A5A]">
            <option>Budget max</option>
            <option>&lt; 300 €</option>
            <option>&lt; 500 €</option>
          </select>
          <Button className="w-full md:w-auto whitespace-nowrap" onClick={() => setView('pdp')}>Voir les offres</Button>
        </div>
      </div>
    </section>

    {/* 4 Pillars */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: ShieldCheck, title: "45 points de contrôle", desc: "Chaque appareil est testé en atelier." },
          { icon: ShieldCheck, title: "Garantie 24 mois", desc: "Incluse sur tout le catalogue." },
          { icon: BatteryCharging, title: "Batterie > 85%", desc: "Ou neuve certifiée en option (+39€)." },
          { icon: MapPin, title: "Atelier à Lyon", desc: "Techniciens et SAV en France." }
        ].map((pillar, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 bg-white dark:bg-[#132023] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-[#EEF4F1] dark:bg-[#0B1416] text-[#0B7A5A] dark:text-[#3DDBA4] rounded-full flex items-center justify-center mb-4">
              <pillar.icon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Best Sellers */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-extrabold text-[#0F2F33] dark:text-white">Les plus vendus</h2>
        <a href="#" className="text-[#0B7A5A] dark:text-[#3DDBA4] font-bold hover:underline hidden sm:block">Voir tout le catalogue</a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BEST_SELLERS.map((product) => (
          <div 
            key={product.id} 
            onClick={() => setView('pdp')}
            className="group bg-white dark:bg-[#132023] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <Badge text={product.grade} type={product.grade === 'PARFAIT ÉTAT' ? 'success' : 'default'} />
            </div>
            
            <div className="h-48 bg-gray-100 dark:bg-[#0B1416] rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Smartphone className="w-20 h-20 text-gray-300 dark:text-gray-700" />
            </div>
            
            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-black text-[#0F2F33] dark:text-white">{product.price} €</span>
              <span className="text-sm text-gray-400 line-through mb-1">Neuf : {product.oldPrice} €</span>
            </div>
            
            <div className="text-sm text-[#187A45] dark:text-[#3DDBA4] font-bold mb-4">
              Vous économisez {product.oldPrice - product.price} €
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Garantie 24 mois incluse
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* States Guide */}
    <section className="bg-[#0F2F33] dark:bg-[#132023] text-white py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold mb-4">Les états, expliqués en toute transparence</h2>
          <p className="text-gray-300">Découvrez comment nous classons nos appareils. Aucune mauvaise surprise à la réception.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Parfait état", desc: "Aucune trace visible à 20 cm. Écran immaculé.", color: "text-[#3DDBA4]" },
            { title: "Très bon état", desc: "Micro-rayures invisibles écran allumé.", color: "text-white" },
            { title: "État correct", desc: "Rayures légères visibles, 100% fonctionnel.", color: "text-gray-400" }
          ].map((state, i) => (
            <div key={i} className="bg-white/10 p-6 rounded-2xl border border-white/20">
              <h3 className={`text-xl font-bold mb-2 ${state.color}`}>{state.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{state.desc}</p>
              <div className="h-32 bg-black/30 rounded-lg flex items-center justify-center text-xs text-gray-400">
                [Vue macro interactive]
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const PDP = ({ setView, addToCart }) => {
  // States for configuration
  const [grade, setGrade] = useState('parfait');
  const [capacity, setCapacity] = useState(128);
  const [battery, setBattery] = useState('standard');

  // Pricing Logic
  const basePrice = 319; // Correct, 128Go base
  const gradeModifier = grade === 'parfait' ? 60 : (grade === 'tres_bon' ? 30 : 0);
  const capacityModifier = capacity === 256 ? 50 : 0;
  const batteryModifier = battery === 'neuve' ? 39 : 0;
  
  const currentPrice = basePrice + gradeModifier + capacityModifier + batteryModifier;
  const neuvePrice = 709;
  const savings = neuvePrice - currentPrice;
  const splitPay = (currentPrice / 4).toFixed(2);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex items-center space-x-2">
        <span className="cursor-pointer hover:text-[#0B7A5A]" onClick={() => setView('home')}>Accueil</span>
        <ChevronRight className="w-4 h-4" />
        <span>Smartphones</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold text-[#0F2F33] dark:text-white">iPhone 13</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4 sticky top-24 h-fit">
          <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-[#132023] rounded-3xl flex items-center justify-center border border-gray-200 dark:border-gray-800">
            <Smartphone className="w-48 h-48 text-gray-300 dark:text-gray-700" />
            <div className="absolute top-4 left-4">
              <Badge text={grade.replace('_', ' ')} type={grade === 'parfait' ? 'success' : 'default'} />
            </div>
          </div>
          <div className="flex gap-4">
             {/* Thumbnail placeholders */}
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="w-20 h-20 bg-gray-100 dark:bg-[#132023] rounded-xl border border-gray-200 dark:border-gray-800"></div>
             ))}
          </div>
        </div>

        {/* Right: Configuration & Price */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F2F33] dark:text-white mb-2">Apple iPhone 13</h1>
            <div className="flex items-center space-x-2">
              <div className="flex text-[#F2B134]">
                {[1,2,3,4].map(i => <Star key={i} filled />)}
                <Star half />
              </div>
              <span className="text-sm font-bold">4,7/5</span>
              <span className="text-sm text-gray-500 underline cursor-pointer">2 300+ avis vérifiés</span>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-800" />

          {/* Grade Selector */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Grade Cosmétique</h3>
              <button className="text-sm text-[#0B7A5A] dark:text-[#3DDBA4] flex items-center">
                <Info className="w-4 h-4 mr-1"/> Guide des états
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'parfait', label: 'Parfait état', price: '+60€' },
                { id: 'tres_bon', label: 'Très bon état', price: '+30€' },
                { id: 'correct', label: 'État correct', price: 'Base' },
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setGrade(opt.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                    grade === opt.id 
                      ? 'border-[#0B7A5A] bg-[#EEF4F1] dark:border-[#3DDBA4] dark:bg-[#132023]' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="font-bold text-sm mb-1">{opt.label}</span>
                  <span className="text-xs text-gray-500">{opt.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Selector */}
          <div>
            <h3 className="font-bold text-lg mb-3">Capacité</h3>
            <div className="flex gap-3">
              {[
                { id: 128, label: '128 Go' },
                { id: 256, label: '256 Go', price: '+50€' },
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setCapacity(opt.id)}
                  className={`px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    capacity === opt.id 
                      ? 'border-[#0B7A5A] bg-[#EEF4F1] dark:border-[#3DDBA4] dark:bg-[#132023]' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Battery Selector */}
          <div>
            <h3 className="font-bold text-lg mb-3">Batterie</h3>
            <div className="space-y-3">
              <div 
                onClick={() => setBattery('standard')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  battery === 'standard' ? 'border-[#0B7A5A] bg-[#EEF4F1] dark:border-[#3DDBA4] dark:bg-[#132023]' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center">
                    Testée à +85% <Badge text="Inclus" type="success" className="ml-2"/>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Garantie pour une journée complète.</div>
                </div>
                {battery === 'standard' && <CheckCircle2 className="text-[#0B7A5A] dark:text-[#3DDBA4]" />}
              </div>

              <div 
                onClick={() => setBattery('neuve')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  battery === 'neuve' ? 'border-[#0B7A5A] bg-[#EEF4F1] dark:border-[#3DDBA4] dark:bg-[#132023]' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div>
                  <div className="font-bold">100% Neuve Certifiée</div>
                  <div className="text-sm text-gray-500 mt-1">Batterie remplacée en atelier.</div>
                </div>
                <div className="font-bold text-lg">+39 €</div>
              </div>
            </div>
          </div>

          {/* Price Block & CTA */}
          <div className="bg-white dark:bg-[#132023] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg sticky bottom-4">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-sm text-gray-500 line-through">Neuf : {neuvePrice} €</div>
                <div className="text-4xl font-black text-[#0F2F33] dark:text-white">{currentPrice} €</div>
              </div>
              <div className="text-right">
                <div className="text-[#187A45] dark:text-[#3DDBA4] font-bold text-sm bg-[#EEF4F1] dark:bg-[#0B1416] px-3 py-1 rounded-full inline-block">
                  Économie : {savings} €
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
              Payez en 4x sans frais : <span className="font-bold text-[#0F2F33] dark:text-white">4x {splitPay} €</span>
            </div>

            <Button onClick={addToCart} className="w-full text-lg py-4 mb-4">Ajouter au panier</Button>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1"/> Garantie 24 mois</div>
              <div className="flex items-center"><Recycle className="w-4 h-4 mr-1"/> Retours 30 jours</div>
            </div>
          </div>

          {/* Cross-Sell */}
          <div 
            onClick={() => setView('tradein')}
            className="bg-gradient-to-r from-[#0F2F33] to-[#0B7A5A] text-white p-6 rounded-2xl cursor-pointer hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-lg mb-1">Financez cet achat par la reprise</h4>
              <p className="text-sm opacity-90">Revendez votre ancien téléphone en 2 minutes.</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

const TradeIn = ({ setView }) => {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#0F2F33] dark:text-white mb-2">Offre de Reprise</h1>
        <p className="text-gray-600 dark:text-gray-400">Étape 4/4 : Voici notre offre ferme pour votre appareil.</p>
        
        <div className="flex justify-center items-center mt-6 space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center text-sm font-bold text-gray-500"><CheckCircle2 className="w-5 h-5 text-[#0B7A5A]"/></div>
          <div className="h-1 w-8 bg-[#0B7A5A]"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center text-sm font-bold text-gray-500"><CheckCircle2 className="w-5 h-5 text-[#0B7A5A]"/></div>
          <div className="h-1 w-8 bg-[#0B7A5A]"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center text-sm font-bold text-gray-500"><CheckCircle2 className="w-5 h-5 text-[#0B7A5A]"/></div>
          <div className="h-1 w-8 bg-[#0B7A5A]"></div>
          <div className="w-8 h-8 rounded-full bg-[#0B7A5A] text-white flex justify-center items-center text-sm font-bold">4</div>
        </div>
      </div>

      {/* Recap */}
      <div className="bg-white dark:bg-[#132023] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Smartphone className="w-10 h-10 text-gray-400" />
          <div>
            <h3 className="font-bold text-lg">Apple iPhone 12 - 128 Go</h3>
            <p className="text-sm text-gray-500">Fonctionnel, écran rayé.</p>
          </div>
        </div>
        <button className="text-sm font-bold text-[#0B7A5A] dark:text-[#3DDBA4] underline">Modifier</button>
      </div>

      <h2 className="text-xl font-bold mb-6 text-center">Choisissez votre mode de paiement :</h2>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Bank Transfer Option */}
        <div className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#132023] flex flex-col justify-between hover:border-[#0B7A5A] dark:hover:border-[#3DDBA4] cursor-pointer transition-colors group">
          <div>
            <h3 className="font-bold text-lg mb-2">Virement Bancaire</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Recevez les fonds directement sur votre compte sous 5 jours ouvrés après réception en atelier.</p>
          </div>
          <div className="text-center pb-4">
            <div className="text-4xl font-black text-[#0F2F33] dark:text-white">214 €</div>
          </div>
          <Button variant="secondary" className="w-full mt-auto">Choisir cette option</Button>
        </div>

        {/* Voucher Option (Highlighted) */}
        <div className="relative p-6 rounded-2xl border-4 border-[#0B7A5A] dark:border-[#3DDBA4] bg-[#EEF4F1] dark:bg-[#132023] flex flex-col justify-between cursor-pointer shadow-lg transform md:-translate-y-2">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#F2B134] text-[#0F2F33] font-bold text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
            Notre recommandation (+15%)
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#0B7A5A] dark:text-[#3DDBA4]">Bon d'achat ReMobile</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">Valable immédiatement sur tout notre catalogue. Idéal pour financer votre prochain achat.</p>
          </div>
          <div className="text-center pb-4">
            <div className="text-4xl font-black text-[#0B7A5A] dark:text-[#3DDBA4]">246 €</div>
            <div className="text-sm text-gray-500 mt-1 line-through">214 €</div>
          </div>
          <Button variant="primary" className="w-full mt-auto">Accepter l'offre</Button>
        </div>

      </div>

      <div className="text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4"/> Étiquette d'envoi prépayée gratuite incluse.</p>
        <p>En validant, vous acceptez nos conditions générales de rachat.</p>
      </div>
    </main>
  );
};

// Utils
const Star = ({ filled, half }) => (
  <svg className="w-4 h-4 text-[#F2B134] fill-current" viewBox="0 0 24 24">
    {half ? (
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fillOpacity="0.5" />
    ) : (
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    )}
  </svg>
);


// --- APP CONTAINER ---

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'pdp', 'tradein'
  const [cartCount, setCartCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Set font in body dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className={`${isDark ? 'dark' : ''} font-['Manrope',sans-serif]`}>
      <div className="min-h-screen bg-[#F7F7F4] dark:bg-[#0B1416] text-[#0F2F33] dark:text-[#F7F7F4] transition-colors duration-300">
        <Header 
          setView={setCurrentView} 
          cartCount={cartCount} 
          isDark={isDark} 
          toggleTheme={() => setIsDark(!isDark)} 
        />
        
        {currentView === 'home' && <Home setView={setCurrentView} />}
        {currentView === 'pdp' && <PDP setView={setCurrentView} addToCart={handleAddToCart} />}
        {currentView === 'tradein' && <TradeIn setView={setCurrentView} />}
        
        {/* Simple Footer */}
        <footer className="bg-[#0F2F33] dark:bg-[#060b0c] text-white py-8 mt-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
            © 2026 ReMobile - Le reconditionné de confiance à Lyon.
          </div>
        </footer>
      </div>
    </div>
  );
}