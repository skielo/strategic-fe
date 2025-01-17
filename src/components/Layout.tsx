"use client"
import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, logout } from '../utils/auth';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated && pathname !== '/login') {
        router.push('/login');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex-grow">
            <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
              <li><Link href="/" className="text-blue-500 hover:underline px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-100 rounded">Home</Link></li>
              <li><Link href="/themes" className="text-blue-500 hover:underline px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-100 rounded">Themes</Link></li>
              <li><Link href="/objectives" className="text-blue-500 hover:underline px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-100 rounded">Objectives</Link></li>
              <li><Link href="/key-results" className="text-blue-500 hover:underline px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-100 rounded">Key Results</Link></li>
              <li><Link href="/goals" className="text-blue-500 hover:underline px-2 py-1 transition duration-300 ease-in-out hover:bg-blue-100 rounded">Goals</Link></li>
              <li><button onClick={logout} className="text-red-500 hover:underline px-2 py-1 transition duration-300 ease-in-out hover:bg-red-100 rounded">Logout</button></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          &copy; 2024 Strategic Management Dashboard
        </div>
      </footer>
    </div>
  );
};

export default Layout;