import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { Edit2, Save, X } from 'lucide-react';

const SalesData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPayment, setEditPayment] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditCustomerName(transaction.customerName);
    setEditStatus(transaction.status);
    setEditPayment(transaction.paid.toString());
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    const paid = parseFloat(editPayment);
    const change = paid - editingTransaction.total;

    const updatedTransaction: Transaction = {
      ...editingTransaction,
      customerName: editCustomerName,
      status: editStatus,
      paid: paid,
      change: change,
    };

    const updatedTransactions = transactions.map((t) =>
      t.id === editingTransaction.id ? updatedTransaction : t
    );

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Data Penjualan</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Tanggal</th>
                <th className="p-2 text-left">Pelanggan</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Pembayaran</th>
                <th className="p-2 text-left">Kembalian</th>
                <th className="p-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="p-2">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-2">{transaction.customerName}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        transaction.status === 'Lunas'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'Cicilan'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-2">Rp {transaction.total.toLocaleString()}</td>
                  <td className="p-2">Rp {transaction.paid.toLocaleString()}</td>
                  <td className="p-2">Rp {transaction.change.toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEditClick(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Transaksi</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Pembayaran
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="Cicilan">Cicilan</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Pembayaran
                </label>
                <input
                  type="number"
                  value={editPayment}
                  onChange={(e) => setEditPayment(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="text-sm text-gray-600">
                <div>Total: Rp {editingTransaction.total.toLocaleString()}</div>
                <div>
                  Kembalian: Rp{' '}
                  {(parseFloat(editPayment) - editingTransaction.total).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
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
    </div>
  );
};

export default SalesData;
