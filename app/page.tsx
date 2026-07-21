import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock data as fallback if store doesn't exist yet
const mockProducts = [
  { id: '1', name: 'Organic Tomatoes', price: 60, farmerName: 'Green Acres', isOrganic: true, emoji: '🍅' },
  { id: '2', name: 'Fresh Carrots', price: 40, farmerName: 'Valley Farms', isOrganic: false, emoji: '🥕' },
  { id: '3', name: 'Sweet Corn', price: 30, farmerName: 'Sunshine Co.', isOrganic: true, emoji: '🌽' },
  { id: '4', name: 'Lettuce Heads', price: 50, farmerName: 'Green Acres', isOrganic: true, emoji: '🥬' },
];

const mockFarmers = [
  { id: 'f1', initials: 'GA', name: 'Green Acres', location: 'Punjab', method: 'organic', rating: 4.8, verified: true },
  { id: 'f2', initials: 'VF', name: 'Valley Farms', location: 'Haryana', method: 'mixed', rating: 4.5, verified: true },
  { id: 'f3', initials: 'SC', name: 'Sunshine Co.', location: 'Maharashtra', method: 'organic', rating: 4.9, verified: false },
];

const testimonials = [
  { id: 1, quote: "The freshest vegetables I've ever bought. Knowing it comes directly from the farmer makes it taste even better!", name: "Priya S.", rating: 5 },
  { id: 2, quote: "FarmFresh has completely changed how I shop for groceries. The quality is unmatched and delivery is always on time.", name: "Rahul M.", rating: 5 },
  { id: 3, quote: "As a farmer, this platform has given me direct access to consumers. My margins have improved significantly.", name: "Amit K.", rating: 4 },
];

export default function Home() {
  return (
    <>
      <Navbar session={null} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-brand-900/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-medium text-sm animate-fade-in">
                🌱 Direct from farm, straight to your kitchen
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold font-heading mb-6 tracking-tight animate-slide-up">
                Fresh From <br className="hidden md:block" />
                <span className="gradient-text">Farm to Your Table</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Connect directly with local farmers for fresh, organic produce. Better for them, better for you, better for the planet.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link href="/products" className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 transition-all hover:shadow-lg hover:-translate-y-1">
                  Shop Now
                </Link>
                <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 font-bold text-lg border-2 border-brand-200 dark:border-brand-800 hover:border-brand-600 dark:hover:border-brand-500 transition-all hover:shadow-lg hover:-translate-y-1">
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Emojis */}
          <div className="absolute top-20 left-10 text-5xl opacity-80 animate-float" style={{ animationDelay: "0s" }}>🍅</div>
          <div className="absolute top-40 right-20 text-6xl opacity-80 animate-float" style={{ animationDelay: "1s" }}>🥕</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-80 animate-float" style={{ animationDelay: "2s" }}>🌽</div>
          <div className="absolute bottom-10 right-1/4 text-6xl opacity-80 animate-float" style={{ animationDelay: "0.5s" }}>🥬</div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl mb-2">👨‍🌾</div>
                <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">500+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Farmers</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl mb-2">👨‍👩‍👧‍👦</div>
                <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">10,000+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Consumers</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl mb-2">📦</div>
                <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">50,000+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Orders</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl mb-2">💰</div>
                <div className="text-2xl font-bold font-heading text-gray-900 dark:text-white">₹2Cr+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Revenue</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-cream-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gray-900 dark:text-white">How It Works</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">A simple, transparent process that brings the farm to your doorstep.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting lines for desktop */}
              <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-brand-200 dark:bg-brand-800 z-0"></div>
              
              <div className="text-center relative z-10 group">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-md mb-6 border-4 border-brand-50 dark:border-gray-800 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                  🔍
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900 dark:text-white">1. Browse & Discover</h3>
                <p className="text-gray-600 dark:text-gray-400">Explore fresh produce from verified local farmers in your area.</p>
              </div>
              
              <div className="text-center relative z-10 group">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-md mb-6 border-4 border-brand-50 dark:border-gray-800 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                  🛒
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900 dark:text-white">2. Order & Pay</h3>
                <p className="text-gray-600 dark:text-gray-400">Add items to your cart and checkout with secure payment options.</p>
              </div>
              
              <div className="text-center relative z-10 group">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-md mb-6 border-4 border-brand-50 dark:border-gray-800 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                  🚚
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-gray-900 dark:text-white">3. Fresh Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400">Receive farm-fresh produce delivered right to your doorstep.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold font-heading mb-2 text-gray-900 dark:text-white">Shop by Category</h2>
                <p className="text-gray-600 dark:text-gray-400">Discover fresh produce sorted by category.</p>
              </div>
              <Link href="/products" className="hidden sm:inline-flex text-brand-600 font-medium hover:text-brand-700 items-center gap-1">
                View all <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {[
                { name: 'Vegetables', icon: '🥬', slug: 'vegetables', color: 'from-green-100 to-green-50' },
                { name: 'Fruits', icon: '🍎', slug: 'fruits', color: 'from-red-100 to-red-50' },
                { name: 'Dairy', icon: '🥛', slug: 'dairy', color: 'from-blue-100 to-blue-50' },
                { name: 'Grains', icon: '🌾', slug: 'grains', color: 'from-amber-100 to-amber-50' },
                { name: 'Herbs', icon: '🌿', slug: 'herbs', color: 'from-emerald-100 to-emerald-50' }
              ].map(cat => (
                <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="block group">
                  <div className={`aspect-square rounded-2xl bg-gradient-to-br ${cat.color} dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center p-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg border border-transparent dark:border-gray-700`}>
                    <span className="text-5xl md:text-6xl mb-4 transform transition-transform group-hover:scale-110">{cat.icon}</span>
                    <h3 className="font-bold font-heading text-gray-900 dark:text-white text-center">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white">Fresh Picks For You</h2>
              <Link href="/products" className="hidden sm:inline-flex text-brand-600 font-medium hover:text-brand-700 items-center gap-1">
                Explore more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center relative">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
                    {product.isOrganic && (
                      <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        ORGANIC
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white">{product.name}</h3>
                      <span className="font-bold text-brand-600 dark:text-brand-400">₹{product.price}<span className="text-xs text-gray-500 font-normal">/kg</span></span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1 mt-auto">
                      👨‍🌾 {product.farmerName}
                    </p>
                    <button className="w-full py-2.5 rounded-xl border border-brand-200 text-brand-600 dark:border-gray-600 dark:text-gray-300 font-medium hover:bg-brand-50 dark:hover:bg-gray-800 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Farmers */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-4 text-gray-900 dark:text-white">Meet Our Top Farmers</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Support local agriculture by buying directly from the people who grow your food.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockFarmers.map((farmer) => (
                <div key={farmer.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-gray-700 flex items-center justify-center text-accent-700 dark:text-accent-400 font-bold text-xl flex-shrink-0">
                      {farmer.initials}
                    </div>
                    <div>
                      <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white flex items-center gap-1">
                        {farmer.name}
                        {farmer.verified && <span className="text-brand-500" title="Verified Farmer">✓</span>}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        📍 {farmer.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <span className="text-accent-500">★</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{farmer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-brand-50 dark:bg-gray-700 text-brand-700 dark:text-brand-300 text-xs font-medium rounded-md capitalize">
                      {farmer.method} Farming
                    </span>
                  </div>
                  <Link href={`/farmers/${farmer.id}`} className="block w-full py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-800 dark:to-brand-950 z-0"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="bg-white/10 glass rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto border border-white/20">
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">Are You a Farmer? Join FarmFresh Today</h2>
              
              <p className="text-brand-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Connect directly with thousands of consumers. Get better prices for your produce while managing your sales easily through our platform.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full">
                  <span>✓</span> Direct Sales
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full">
                  <span>✓</span> Better Prices
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full">
                  <span>✓</span> Wider Reach
                </div>
              </div>
              
              <Link href="/register" className="inline-block px-10 py-4 rounded-full bg-accent-500 text-white font-bold text-lg hover:bg-accent-600 transition-all hover:shadow-xl hover:shadow-accent-500/20 transform hover:-translate-y-1">
                Register as Farmer
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
