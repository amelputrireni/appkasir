import { useState, useRef } from 'react';
import { ShoppingCart, Printer, Edit2, X, Search } from 'lucide-react';
import { Product, SaleItem, Transaction } from '../types';
import { useReactToPrint } from 'react-to-print';
import Receipt from './Receipt';

const Home = () => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [payment, setPayment] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [status, setStatus] = useState<string>('Lunas');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editSatuan, setEditSatuan] = useState('');
  const [editPanjang, setEditPanjang] = useState('');
  const [editLebar, setEditLebar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: 'Struk Pembayaran',
    removeAfterPrint: true,
    copyStyles: true,
    pageStyle: '@page { size: 80mm 297mm }',
  });

  const getProducts = (): Product[] => {
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    if (searchQuery) {
      return products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return products;
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
    setEditSatuan(product.satuan);
    setEditPanjang(product.panjang.toString());
    setEditLebar(product.lebar.toString());
    setShowEditModal(true);
  };

  const calculateEditPrice = () => {
    const satuanValue = parseFloat(editSatuan) || 0;
    const panjangValue = parseFloat(editPanjang) || 0;
    const lebarValue = parseFloat(editLebar) || 0;

    if (satuanValue && panjangValue && lebarValue) {
      const calculatedPrice = satuanValue * panjangValue * lebarValue;
      setEditPrice(calculatedPrice.toString());
    } else {
      alert('Mohon isi nilai Satuan, Panjang, dan Lebar terlebih dahulu');
    }
  };

  const handleSaveEdit = () => {
    if (!editingProduct || !editName || !editPrice || !editStock) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: editName,
      price: parseFloat(editPrice),
      stock: parseInt(editStock),
      satuan: editSatuan,
      panjang: parseFloat(editPanjang) || 0,
      lebar: parseFloat(editLebar) || 0,
    };

    const products = getProducts();
    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id ? updatedProduct : p
    );

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          subtotal: product.price,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getChange = () => {
    const total = getTotal();
    const paid = parseFloat(payment) || 0;
    return paid - total;
  };

  const handleTransaction = () => {
    const total = getTotal();
    const paid = parseFloat(payment);
    const change = getChange();

    if (paid < total) {
      alert('Pembayaran kurang!');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart],
      total,
      paid,
      change,
      customerName,
      status,
    };

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    localStorage.setItem('transactions', JSON.stringify([...transactions, transaction]));

    setCurrentTransaction(transaction);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCart([]);
    setPayment('');
    setCustomerName('');
    setStatus('Lunas');
    setCurrentTransaction(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Produk Tersedia</h2>
        <div className="mb-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="space-y-2">
          {getProducts().map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-gray-600">
                  Rp {product.price.toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  + Keranjang
                </button>
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-sm hover:bg-gray-700"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Keranjang</h2>
        <div className="space-y-2 mb-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <div>
                <div className="font-semibold">{item.productName}</div>
                <div className="text-sm text-gray-600">
                  {item.quantity} x Rp {item.price.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>Rp {item.subtotal.toLocaleString()}</div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold mb-2">
            <span>Total:</span>
            <span>Rp {getTotal().toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder="Jumlah Pembayaran"
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-between text-lg">
              <span>Kembalian:</span>
              <span className={getChange() < 0 ? 'text-red-500' : 'text-green-500'}>
                Rp {getChange().toLocaleString()}
              </span>
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Pelanggan"
              className="w-full p-2 border rounded"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Lunas">Lunas</option>
              <option value="Cicilan">Cicilan</option>
              <option value="Pending">Pending</option>
            </select>
            <button
              onClick={handleTransaction}
              disabled={cart.length === 0 || !payment || getChange() < 0 || !customerName}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Proses Transaksi
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Produk</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nama Produk"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Harga"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                placeholder="Stok"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={editSatuan}
                onChange={(e) => setEditSatuan(e.target.value)}
                placeholder="Satuan"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={editPanjang}
                onChange={(e) => setEditPanjang(e.target.value)}
                placeholder="Panjang"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={editLebar}
                onChange={(e) => setEditLebar(e.target.value)}
                placeholder="Lebar"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={calculateEditPrice}
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                Hitung Harga
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && currentTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-4 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleCloseReceipt}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <Receipt ref={receiptRef} transaction={currentTransaction} />
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Printer size={20} />
                Cetak Struk
              </button>
              <button
                onClick={handleCloseReceipt}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
