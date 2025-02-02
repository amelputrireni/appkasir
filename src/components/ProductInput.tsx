import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { Product } from '../types';

const ProductInput = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [satuan, setSatuan] = useState('');
  const [panjang, setPanjang] = useState('');
  const [lebar, setLebar] = useState('');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const calculatePrice = () => {
    const satuanValue = parseFloat(satuan) || 0;
    const panjangValue = parseFloat(panjang) || 0;
    const lebarValue = parseFloat(lebar) || 0;

    if (satuanValue && panjangValue && lebarValue) {
      const calculatedPrice = satuanValue * panjangValue * lebarValue;
      setPrice(calculatedPrice.toString());
    } else {
      alert('Mohon isi nilai Satuan, Panjang, dan Lebar terlebih dahulu');
    }
  };

  const handleAddProduct = () => {
    if (!name || !price || !stock) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      satuan: satuan,
      panjang: parseFloat(panjang) || 0,
      lebar: parseFloat(lebar) || 0,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Reset form
    setName('');
    setPrice('');
    setStock('');
    setSatuan('');
    setPanjang('');
    setLebar('');
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Input Produk Baru</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Produk"
            className="p-2 border rounded"
          />
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Harga"
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stok"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            placeholder="Satuan"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={panjang}
            onChange={(e) => setPanjang(e.target.value)}
            placeholder="Panjang"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={lebar}
            onChange={(e) => setLebar(e.target.value)}
            placeholder="Lebar"
            className="p-2 border rounded"
          />
          <button
            onClick={calculatePrice}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Hitung Harga
          </button>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 md:col-span-2"
          >
            <Plus size={20} />
            Tambah
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left">Harga</th>
                <th className="p-2 text-left">Stok</th>
                <th className="p-2 text-left">Satuan</th>
                <th className="p-2 text-left">Panjang</th>
                <th className="p-2 text-left">Lebar</th>
                <th className="p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">Rp {product.price.toLocaleString()}</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2">{product.satuan}</td>
                  <td className="p-2">{product.panjang || '-'}</td>
                  <td className="p-2">{product.lebar || '-'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductInput;
