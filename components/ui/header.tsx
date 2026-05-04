"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Import icons modern dari lucide-react
import {
  Home,
  Info,
  Bot,
  Phone,
  Newspaper,
  LogOut,
  LogIn,
  UserPlus,
  User,
  LayoutDashboard,
  Shield,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        if (!error) {
          setUserRole(profileData?.role || null);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setUserRole(profileData?.role || null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserRole(null);
      }
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Handle body overflow saat mobile menu terbuka
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setOpen(false);
    router.push("/");
  };

  const closeMenu = () => setOpen(false);
  const isActive = (path: string) => pathname === path;
  const isAdmin = userRole === "admin";

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="text-xl font-bold text-white">
            Archi<span className="text-appPrimary">Trade</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-black/95 md:backdrop-blur-md border-b border-gray-800"
            : "bg-black/80 md:backdrop-blur-sm border-b border-gray-800/50"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold tracking-tight text-white"
              onClick={closeMenu}
            >
              Archi<span className="text-appPrimary">Trade</span>
            </Link>

            {/* Desktop Navigation dengan Icon */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
              <Link
                href="/"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive("/")
                    ? "text-appPrimary"
                    : "text-gray-300 hover:text-appPrimary"
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive("/about")
                    ? "text-appPrimary"
                    : "text-gray-300 hover:text-appPrimary"
                }`}
              >
                <Info className="w-4 h-4" />
                About
              </Link>
              <Link
                href="/services"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive("/services")
                    ? "text-appPrimary"
                    : "text-gray-300 hover:text-appPrimary"
                }`}
              >
                <Bot className="w-4 h-4" />
                Services
              </Link>
              <Link
                href="/contact"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive("/contact")
                    ? "text-appPrimary"
                    : "text-gray-300 hover:text-appPrimary"
                }`}
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>
              <Link
                href="/blog"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive("/blog")
                    ? "text-appPrimary"
                    : "text-gray-300 hover:text-appPrimary"
                }`}
              >
                <Newspaper className="w-4 h-4" />
                Blog
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-gray-300 hover:text-appPrimary transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-1.5 px-4 py-2 bg-appPrimary/20 hover:bg-appPrimary/30 text-appPrimary rounded-lg text-sm font-medium transition"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-gray-300 hover:text-appPrimary transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-4 py-2 bg-appPrimary hover:bg-appPrimary/90 text-black rounded-lg text-sm font-medium transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition"
              aria-label={open ? "Tutup menu" : "Buka menu"}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black z-50 md:hidden pt-16">
          <div className="flex flex-col p-6 space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
            >
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
            >
              <Info className="w-5 h-5" /> About
            </Link>
            <Link
              href="/services"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
            >
              <Bot className="w-5 h-5" /> Services
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
            >
              <Phone className="w-5 h-5" /> Contact
            </Link>
            <Link
              href="/blog"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
            >
              <Newspaper className="w-5 h-5" /> Blog
            </Link>

            {user && (
              <>
                <div className="h-px bg-zinc-800 my-4" />
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
                >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg text-appPrimary"
                  >
                    <Shield className="w-5 h-5" /> Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg text-red-400 w-full text-left"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <div className="h-px bg-zinc-800 my-4" />
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 text-lg"
                >
                  <LogIn className="w-5 h-5" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-appPrimary text-black hover:bg-appPrimary/90 text-lg font-medium"
                >
                  <UserPlus className="w-5 h-5" /> Daftar Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
