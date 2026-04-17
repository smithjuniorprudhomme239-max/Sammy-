'use client';
import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Footer() {
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsAppInstalled(isStandalone);
    };

    checkIfInstalled();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsAppInstalled(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
        deferredPrompt.current = null;
      }
    }
  };

  return (
    <footer className="bg-primary-500 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
          <div className="col-span-3 md:col-span-1">
            <Link href="/" className="flex items-center text-white font-bold text-lg mb-3">
              UNIDEV
            </Link>
            <p className="text-sm font-semibold text-accent-500 mb-2">Next-Gen Tech, by UNIDEV</p>
            <p className="text-sm">Your one-stop shop for the latest electronics and gadgets.</p>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-white transition-colors"><Icon size={18} /></a>
              ))}
            </div>
          </div>
          {
            [
              { title: 'Shop', links: [['Products', '/products']] },
              { title: 'Account', links: [['Sign In', '/login'], ['Register', '/register'], ['Dashboard', '/dashboard'], ['Orders', '/dashboard/orders']] },
              { title: 'Support', links: [['Contact Us', '/contact'], ['FAQ', '/faq'], ['Shipping Policy', '/shipping'], ['Returns', '/returns']] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-white font-semibold mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))
          }
        </div>
        {!isAppInstalled && canInstall && (
          <div className="md:hidden mt-8 pt-6">
            <button 
              onClick={handleInstall}
              className="w-full bg-white text-primary-500 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Install App
            </button>
          </div>
        )}
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          © {new Date().getFullYear()} UNIDEV. All rights reserved.
        </div>
      </div>
    </footer>
  );
}