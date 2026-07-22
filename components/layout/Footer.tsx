import Link from "next/link";
import { GrLanguage } from "react-icons/gr";
import { IoShareSocialOutline } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-[40px] py-12 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="space-y-6">
          <Link href="/" className="font-heading text-xl font-bold text-primary">
            FarmFresh
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Cultivating trust and connecting high-integrity agriculture with the modern table since 2024.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary border border-outline-variant/20 hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-xl"><GrLanguage /></span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary border border-outline-variant/20 hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-xl"><IoShareSocialOutline /></span>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-6">Explore</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors hover:underline text-sm">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-on-surface-variant hover:text-primary transition-colors hover:underline text-sm">
                Join as Farmer
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors hover:underline text-sm">
                Marketplace
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-6">Support</h4>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors hover:underline text-sm">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors hover:underline text-sm">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors hover:underline text-sm">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-6">Stay Fresh</h4>
          <p className="text-on-surface-variant text-sm mb-4">
            Join our newsletter for seasonal harvest updates and recipes.
          </p>
          <div className="flex gap-2">
            <input
              className="bg-surface rounded-lg border border-outline-variant/30 text-sm py-2 px-4 focus:ring-primary w-full text-on-surface placeholder:text-on-surface-variant"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity active:scale-95">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-[40px] pt-8 mt-8 border-t border-outline-variant/10 text-center">
        <p className="text-xs text-on-surface-variant">
          © {new Date().getFullYear()} FarmFresh. Cultivating Trust, One Harvest at a Time.
        </p>
      </div>
    </footer>
  );
}
