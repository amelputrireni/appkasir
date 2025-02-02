import { Link, useLocation } from 'react-router-dom';
import { Home, Package, FileText, Store, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true }); // Menambahkan replace: true untuk menghindari masalah navigasi di Vercel
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Kasir App</h1>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-blue-700 transition-colors ${isActive(
                '/'
              )}`}
            >
              <Home size={20} />
              <span>Beranda</span>
            </Link>
            <Link
              to="/products"
              className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-blue-700 transition-colors ${isActive(
                '/products'
              )}`}
            >
              <Package size={20} />
              <span>Produk</span>
            </Link>
            <Link
              to="/sales"
              className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-blue-700 transition-colors ${isActive(
                '/sales'
              )}`}
            >
              <FileText size={20} />
              <span>Penjualan</span>
            </Link>
            <Link
              to="/store"
              className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-blue-700 transition-colors ${isActive(
                '/store'
              )}`}
            >
              <Store size={20} />
              <span>Toko</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-red-200 hover:text-red-100"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
