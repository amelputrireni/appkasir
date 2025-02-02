import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface StoreData {
  name: string;
  phone: string;
}

const StoreSettings = () => {
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('storeData');
    if (storedData) {
      const data: StoreData = JSON.parse(storedData);
      setStoreName(data.name);
      setStorePhone(data.phone);
    }
  }, []);

  const handleUpdate = () => {
    const storeData: StoreData = {
      name: storeName,
      phone: storePhone,
    };
    localStorage.setItem('storeData', JSON.stringify(storeData));
    alert('Data toko berhasil diperbarui!');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Data Toko</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Toko
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Masukkan nama toko"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon
          </label>
          <input
            id="storePhone"
            type="tel"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
            placeholder="Masukkan nomor telepon"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default StoreSettings;
