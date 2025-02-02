import { forwardRef, useEffect, useState } from 'react';
import { Transaction } from '../types';

interface ReceiptProps {
  transaction: Transaction;
}

interface StoreData {
  name: string;
  phone: string;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ transaction }, ref) => {
    const [storeData, setStoreData] = useState<StoreData>({ name: '', phone: '' });

    useEffect(() => {
      const storedData = localStorage.getItem('storeData');
      if (storedData) {
        setStoreData(JSON.parse(storedData));
      }
    }, []);

    return (
      <div ref={ref} className="p-8 bg-white max-w-md mx-auto">
        {/* Header - Store Info */}
        <div className="text-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold mb-2">{storeData.name || 'Struk Pembayaran'}</h2>
          {storeData.phone && (
            <p className="text-gray-600">Telp: {storeData.phone}</p>
          )}
          <p className="text-gray-600 mt-2">
            {new Date(transaction.date).toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </p>
        </div>

        {/* Customer Info */}
        <div className="mb-4 border-b pb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold">Pelanggan:</div>
            <div className="text-right">{transaction.customerName}</div>
            <div className="font-semibold">Status Pembayaran:</div>
            <div className="text-right font-medium">
              <span className={
                transaction.status === 'Lunas' 
                  ? 'text-green-600'
                  : transaction.status === 'Cicilan'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }>
                {transaction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Daftar Pembelian:</h3>
          {transaction.items.map((item, index) => (
            <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
              <div className="font-medium">{item.productName}</div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{item.quantity} x Rp {item.price.toLocaleString()}</span>
                <span>Rp {item.subtotal.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Details */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rp {transaction.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tunai</span>
              <span>Rp {transaction.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Kembalian</span>
              <span>Rp {transaction.change.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t">
          <p className="text-gray-600">Terima kasih atas kunjungan Anda!</p>
          <p className="text-sm text-gray-500 mt-1">Simpan struk ini sebagai bukti pembayaran</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';

export default Receipt;
