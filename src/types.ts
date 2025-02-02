export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  satuan: string;
  panjang: number;
  lebar: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
  paid: number;
  change: number;
  customerName: string;
  status: string;
}
