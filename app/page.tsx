import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getVerifiedFarmers } from "@/lib/data/farmers";
import { getPlatformStats } from "@/lib/data/analytics";
import { getSession } from "@/lib/auth/session";
import { CartProvider } from "@/lib/cart/CartProvider";
import { cookies } from "next/headers";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsSearch, BsCart4, BsTruck } from "react-icons/bs";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

/* ─── Image URLs ─── */
const HERO_BG = "image_750x_687a56f8c4ff1.jpg";

const CATEGORIES = [
  {
    name: "Vegetables",
    href: "/products?category=vegetables",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfErvLblMXWmNJdHyUXtsEEzRNTV8aYXJBFE2pYL3Koe-fRZ-UOHpsqbdpdT2AQ2yRPI9wpHugugGxlIA1B0DB438nUvMsLgFLmUuyin0QwWTVOC9o3wWniVdpeo4nFkZPJa940f24lfZiB2A7fLmuJSTC0hRwS6G3PWPTCqgsqKqzakoTOywOfB30aDWmpAY1LxAu9rvr_rAKTiQZO77Abj5x8kadNZ24K2dW0vloQfKh78tAatXpLM-OQWeq-jsAC-2yEfWSXDTy",
  },
  {
    name: "Fruits",
    href: "/products?category=fruits",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv1pwtb5_wqXh_gkTgNvfxV6HsH-864XqxvtDjkPzIEp-FaqzBrHz1aq1qccGVx15T1dzwIpcyV8LWV7LN5nIfwXhUxntdDwgnqfDWEHghWcPYS22AaXNIgEoPW_mqBExJTGrmce2Bzv8k97I55RMuyUWmAXRZfC08MH_FWDXkvtZJUb0dgL-IJjw91stNAdx9TOyXnni0hefxfbdv0GvmPXiXLSzU_8R8rfbaxcKiDQNhjqFY-SkuXwfmepS7EOwcz3JLdnity196",
  },
  {
    name: "Dairy",
    href: "/products?category=dairy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmf_rMpFrJH50EmULybPqQWCZRfBD5_4KFjXJkt89Eeoko0QA1JkuRWtwNn9Mbj8z4lg1HRE4xiH0xdaZQwXA6wq_g4Hem7K3_W0xDnPb1Y6-47zYae_Me9gBmyWhz5yM2DvbwJtH4OmXfEm0PlnAQf317xhqrPQ078uJ_PPYsgNyDBtvWOpsAEBC1V8yRL3kpNArSCPX7YnR5GyBWM2bXZ1OZ4shd_deBf5T2rC1Jnu3v6ywAn8ERmmIYFgj7XlPnflIX5CbRfgEG",
  },
  {
    name: "Grains",
    href: "/products?category=grains",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBu8mo5HAuHQ-NlFmM1UM_V7s9ulEiU_dUR75mV5BzNHoMJBqio6N5MLDVHYpXfkox434eG2BE0qmxoEXXhlB6j2tmgGuGNqLS4bcneT1nmvSeE849V2FqrG7-qEolw9BvaVSVPN98mGB1Q_sKlp_m3iCoBPm7NF8VB49--dHRP-4KZh1RvnnVeQyx-P9bRmxwPhRsH4SMVQYO4htKAKkYwzWQ79CoqPdmfE-8ppu50UCVV18WYPnsvZ2Njr26VD9XfnDE3NlAsvr0z",
  },
  {
    name: "Herbs",
    href: "/products?category=herbs",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyOb3m0KNMpkM_xN1h7Kv6NSFd2FjBrP4tFw8TF3txVOUX9ApYbn3syf1xqycCLMpkreePOD_gsPjzPI0uLbpuIOsPBceeuvTDbQdTXiOHKFOtPaM0Q6oKbbymz3D5gOl57IuVmkK8HrZVfHPhw5Bgb694fqGX22wf3Hy7elbNmyuf6LAXU3uUhJRLakYLWXgE8AhA-sqeEo-6h3pXBiHQfzI-ZrmeQzSL3vF8WfP4z-uZa_pLYUN9iUZqdWlnd1IsGSXHMx9nddCT",
  },
];

const FARMERS = [
  {
    name: "Julian Thorne",
    location: "Sonoma Valley, CA",
    bio: "Specializing in organic heirloom vegetables and cold-pressed oils.",
    tags: ["Heirlooms", "Organic"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIE4dTewGq88dPU09wa-PjvFxJdRVIQ7wNDj1GY9Evpwx9j8FFCOwme1es5PX2vwLD7jv9HUXWc8ykrGLlOPxZR1sJslhPaf4x_9RyxA3UvhoctxuZbkiC7oP2i4PCqC0c25CoTRK4qmFG-M5fWr9Vcu40pbXLcRLAasujpTXyEQfVKpI1kr0oLKJIRnJ3Fq2SUqCvjYlAnTn99TO055SvoQFdmMIiX-DsmkObsUxHnSU6yR8GYbrho4oJMrvpcJQ2UkRPgBFo5wPf",
  },
  {
    name: "Elena Rossi",
    location: "Tuscany Ridge, OR",
    bio: "Crafting award-winning artisanal goat cheese and pasture-raised dairy.",
    tags: ["Dairy", "Artisanal"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-4C93kzMU760w3KKWeeg2HmRnqFHvgXeQKICMCc8QR1JoloCSFIf8OsCutYADtVvamibWSLhnd7vp26b1JriiQPtmxtAlpzQC50iAMEFEz-D1NXSZBFefvo2GpXIucCcqOAbY1drlYxxCVWdYnhKpy4l-SAkYIoQDpebr0uBGbjsDeZuRdeBMf-k_PLnDBjDtgezcJhnoLK1JG4fk4VaVny2P3SC41WTgHcNbqp7OnbkQkHjytA1oREDhG9KxR-03boEHnLNY976",
  },
  {
    name: "Marcus Wei",
    location: "Hudson Valley, NY",
    bio: "Leader in regenerative hydroponic berries and medicinal herbs.",
    tags: ["Berries", "Hydroponic"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVFprT3g-DZOeEPTFEaHmAVxVjyVrTnte2RmwBZrguiGp-hP2GoWUdsO5V_GrnGkwkXSW_GWfCOBCyUgkgaIBOM_xcRiIB7HgX_LR4lSpdle_3BzpOCTN1v1jrD_aVLMrqu3yFaT3HKjDCWoKXbIVfWKUDxG8jvOHXlSJMMpS94hVvvbF1QMyXpCNcIvJpvjknNC7uPCVOG8brZaOQphCYtpAohSlUfnraqfn3ZgO8FwUaPPVjGj75xpgzYQOg1C-Jj005KBXboOjD",
  },
];

const CTA_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDOxDaA92Wb1aI2ki5aoaOyfpHZb06wlp43uqyIcm6bol0kv4-bPxvHXRc2AoHbJWG8BWEo92s3PQI-msoKUlztttL50MqRcuNXMicUae_tUL57alKqdoFgs7g4lFG3JuneXgbVnYcDxgE5cmWj-Lj3W7EfnZ0ml8a6AIPD0qnPrJspGBj8bg2ztVkRfIpo0DTMo7qARBPnStkclykuujs_bDTfPR4HbIcL4AuKI4WKHNrGETBSG7waB-t_vtevepX4vF1ltW0Rks02";

const CTA_TABLET =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMpqaisOuPD8uyIPJArpjKxbT4ivLUDsnYeE4TySy8zodu4ZK1PiyRhoJKfViZgsLGINEoh-AbFtFpIILr2aEJHoYzPVtOKINeTAng6Do7BRAGy8LDySzm2m_iATDDxSbi2j-ZS0F0A4g5GagBGQIF_mtvoNrqpUZsMFB1EJg7r51YYcGgQ8IesjV_YeuGE8ex1JbTmamgC4OEGVWVobVG-zXU_gicpkpxKwTyYYvTIPkvF70ATcF5OXnvii3j40lpqvztQGskZB2M";

const TESTIMONIALS = [
  {
    quote:
      "The quality of the dairy and vegetables from FarmFresh is incomparable. As a chef, knowing exactly where my ingredients come from is non-negotiable.",
    name: "Sarah Jenkins",
    role: "Executive Chef, The Hearth",
  },
  {
    quote:
      "Selling through FarmFresh has allowed me to focus on my crops rather than logistics. The platform is intuitive and the community is supportive.",
    name: "David Miller",
    role: "Thistle Creek Farms",
  },
  {
    quote:
      "Our family has switched completely to sourcing our weekly staples here. You can taste the sunshine in the produce. It's truly a game changer.",
    name: "Michael Song",
    role: "Home Enthusiast",
  },
];

/* ─── Page ─── */
export default async function Home() {
  await cookies();
  const session = await getSession();
  const farmers = await getVerifiedFarmers();
  const stats = await getPlatformStats();

  return (
    <CartProvider>
      <Navbar session={session} />

      <main className="pt-20">
        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_BG}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-4 md:px-[40px] max-w-[1280px] mx-auto w-full py-12">
            <div className="max-w-2xl animate-fade-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-sm font-semibold mb-6">
                DIRECT FARM-TO-TABLE
              </span>

              <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-primary mb-6 leading-tight tracking-tight">
                Fresh From Farm
                <br />
                To Your Table
              </h1>

              <p className="text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                Experience the peak of seasonal flavor. We connect you directly
                with local farmers growing premium, organic produce with
                integrity and care.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-primary text-on-primary rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95 organic-shadow flex items-center gap-2"
                >
                  Shop Now
                  <span className="material-symbols-outlined text-sm">
                    <FaArrowRightLong />
                  </span>
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 border-2 border-primary text-primary bg-white/20 backdrop-blur-md rounded-lg text-sm font-semibold transition-all hover:bg-white/30 active:scale-95"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-20 bg-surface">
          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Sourcing Made Simple
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Three elegant steps to bring the finest agricultural products to
              your kitchen.
            </p>
          </div>

          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <BsSearch />,
                title: "Browse",
                description:
                  "Explore seasonal harvests from our curated list of boutique local farms.",
                color: "bg-secondary-container text-on-secondary-container",
                delay: "100ms",
              },
              {
                icon: <BsCart4 />,
                title: "Order",
                description:
                  "Select your favorites and pay securely through our transparent marketplace.",
                color: "bg-tertiary-fixed text-on-tertiary-fixed",
                delay: "300ms",
              },
              {
                icon: <BsTruck />,
                title: "Receive",
                description:
                  "Get farm-fresh produce delivered directly to your doorstep within 24 hours.",
                color: "bg-primary-fixed text-on-primary-fixed",
                delay: "500ms",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center animate-fade-up"
                style={{ animationDelay: step.delay }}
              >
                <div
                  className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mb-6 organic-shadow`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Categories ── */}
        <section className="py-20">
          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto mb-14 flex justify-between items-end">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
                The Seasonal Edit
              </h2>
              <p className="text-on-surface-variant mt-1">
                Discover what&apos;s flourishing right now.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex text-primary text-sm font-semibold items-center gap-1 hover:underline"
            >
              View All Categories{" "}
              <span className="material-symbols-outlined text-sm">
                <FaArrowRightLong />
              </span>
            </Link>
          </div>

          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group cursor-pointer block"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 organic-shadow relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 glass-card mx-3 mb-3 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-on-surface text-xs font-semibold">
                      Explore
                    </span>
                  </div>
                </div>
                <h4 className="font-heading text-lg font-bold text-on-surface text-center">
                  {cat.name}
                </h4>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Impact Stats ── */}
        <section className="py-24 bg-primary text-on-primary overflow-hidden relative">
          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto relative z-10">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="font-heading text-6xl font-extrabold mb-2">
                  {stats.totalFarmers}
                </div>
                <div className="text-sm text-primary-fixed-dim uppercase tracking-wider font-semibold">
                  Farmers Onboarded
                </div>
              </div>
              <div>
                <div className="font-heading text-6xl font-extrabold mb-2">
                  {stats.totalOrders}
                </div>
                <div className="text-sm text-primary-fixed-dim uppercase tracking-wider font-semibold">
                  Orders Fulfilled
                </div>
              </div>
              <div>
                <div className="font-heading text-6xl font-extrabold mb-2">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-primary-fixed-dim uppercase tracking-wider font-semibold">
                  Marketplace Value
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Farmers ── */}
        <section className="py-20 bg-surface-container-low">
          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto mb-14 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Meet the Producers
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              The hands behind your food. We vet every producer to ensure the
              highest standards of sustainability and quality.
            </p>
          </div>

          <div className="px-4 md:px-[40px] max-w-[1280px] mx-auto grid md:grid-cols-3 gap-6">
            {farmers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-on-surface-variant">
                <p className="font-heading font-bold text-lg text-primary mb-1">
                  No verified farmers listed yet.
                </p>
                <p className="text-sm">
                  Register as a seller to feature your farm on FarmFresh!
                </p>
              </div>
            ) : (
              farmers.map((farmer) => (
                <div
                  key={farmer.userId}
                  className="bg-surface rounded-2xl p-6 organic-shadow group transition-all hover:-translate-y-2"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-primary/10 flex items-center justify-center">
                    {farmer.farmImage ? (
                      <img
                        src={farmer.farmImage}
                        alt={farmer.farmName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-heading font-bold text-4xl text-primary">
                        {farmer.farmName.charAt(0)}
                      </span>
                    )}
                    <div className="absolute top-4 right-4 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        verified
                      </span>{" "}
                      Verified
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-bold text-primary">
                      {farmer.farmName}
                    </h3>
                    <div className="flex items-center text-on-surface-variant gap-1 text-sm">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>{" "}
                      {farmer.farmLocation}, {farmer.state}
                    </div>
                    <p className="text-on-surface-variant text-sm pt-2 line-clamp-3">
                      {farmer.description}
                    </p>
                    <div className="pt-4 flex gap-2 flex-wrap">
                      {farmer.cropTypes.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 rounded-full bg-surface-container-highest text-on-tertiary-fixed-variant text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-stack-lg overflow-hidden">
          <div className="px-margin-desktop max-w-container-max mx-auto text-center mb-stack-lg">
            <h2 className="font-headline-md text-headline-md text-primary">
              Voices of the Harvest
            </h2>
          </div>

          <div className="flex flex-nowrap gap-gutter px-margin-desktop animate-fade-up">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="min-w-[320px] md:min-w-100 p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 organic-shadow"
              >
                {/* Stars */}
                <div className="flex gap-1 text-secondary mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      <MdOutlineStarPurple500 />
                    </span>
                  ))}
                </div>
                <p className="font-body-lg text-on-surface mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-variant" />
                  <div>
                    <div className="font-label-md text-on-surface">
                      {t.name}
                    </div>
                    <div className="text-label-sm text-on-surface-variant">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-4 md:px-[40px] py-20 max-w-[1280px] mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-primary p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
              <div
                className="w-full h-full bg-cover bg-center mix-blend-overlay"
                style={{ backgroundImage: `url('${CTA_BG}')` }}
              />
            </div>

            {/* Copy */}
            <div className="relative z-10 max-w-xl">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-on-primary mb-6">
                Empowering the Modern Farmer
              </h2>
              <p className="text-primary-fixed-dim mb-10 leading-relaxed">
                Join our growing ecosystem and gain access to a dedicated market
                of quality-seekers. We provide the tools, you provide the
                harvest.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "0% Listing Fees for the first 3 months",
                  "Advanced cold-chain logistics support",
                  "Direct customer feedback & analytics",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-on-primary"
                  >
                    <span className="material-symbols-outlined text-secondary-fixed">
                      <IoMdCheckmarkCircleOutline />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-secondary-fixed text-on-secondary-fixed rounded-xl text-sm font-semibold hover:scale-105 transition-transform active:scale-95 organic-shadow"
              >
                Join as a Farmer
              </Link>
            </div>

            {/* Tablet Image */}
            <div className="relative z-10 hidden lg:block w-96 h-96 rounded-3xl overflow-hidden organic-shadow rotate-3 shrink-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${CTA_TABLET}')` }}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </CartProvider>
  );
}
