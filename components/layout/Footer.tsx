import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-earth-700 to-brand-900 text-white pt-16 pb-8 border-t-4 border-accent-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <span className="text-2xl transition-transform group-hover:scale-110">🌱</span>
              <span className="text-xl md:text-2xl font-bold tracking-tight font-heading text-white">
                FarmFresh
              </span>
            </Link>
            <p className="text-brand-100 text-sm leading-relaxed mb-6">
              Connecting local farmers directly with consumers. 
              Enjoy farm-fresh, organic produce delivered straight 
              to your doorstep while supporting sustainable agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-accent-400">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-brand-100 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/products" className="text-brand-100 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link href="/farmers" className="text-brand-100 hover:text-white transition-colors text-sm">Our Farmers</Link></li>
              <li><Link href="/about" className="text-brand-100 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-brand-100 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-accent-400">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/products?category=vegetables" className="text-brand-100 hover:text-white transition-colors text-sm">🥬 Vegetables</Link></li>
              <li><Link href="/products?category=fruits" className="text-brand-100 hover:text-white transition-colors text-sm">🍎 Fruits</Link></li>
              <li><Link href="/products?category=dairy" className="text-brand-100 hover:text-white transition-colors text-sm">🥛 Dairy & Eggs</Link></li>
              <li><Link href="/products?category=grains" className="text-brand-100 hover:text-white transition-colors text-sm">🌾 Grains & Pulses</Link></li>
              <li><Link href="/products?category=herbs" className="text-brand-100 hover:text-white transition-colors text-sm">🌿 Herbs & Spices</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-accent-400">Contact Us</h3>
            <ul className="space-y-4 text-sm text-brand-100">
              <li className="flex items-start gap-3">
                <span className="text-lg">📧</span>
                <span>hello@farmfresh.example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <span>123 Agri Business Park,<br />Green Valley, India 100001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-200 text-center md:text-left">
            &copy; {new Date().getFullYear()} FarmFresh Marketplace. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Placeholders */}
            <a href="#" className="h-8 w-8 rounded-full bg-brand-800 flex items-center justify-center hover:bg-brand-700 transition-colors">
              <span className="text-xs">FB</span>
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-brand-800 flex items-center justify-center hover:bg-brand-700 transition-colors">
              <span className="text-xs">IG</span>
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-brand-800 flex items-center justify-center hover:bg-brand-700 transition-colors">
              <span className="text-xs">TW</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
