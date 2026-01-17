import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm"
      >
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">This page doesn't exist.</p>
        <p className="text-muted-foreground mb-8">
          Maybe you took a wrong turn somewhere?
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
