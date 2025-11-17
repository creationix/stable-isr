export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  lastUpdated: string;
}

// Simulated database with products
const productsDB: Product[] = [
  {
    id: "1",
    name: "Ergonomic Keyboard",
    description: "A comfortable keyboard designed for long typing sessions with split layout.",
    price: 129.99,
    stock: 15,
    category: "Electronics",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Wireless Mouse",
    description: "Precision wireless mouse with customizable buttons and long battery life.",
    price: 49.99,
    stock: 32,
    category: "Electronics",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more.",
    price: 59.99,
    stock: 8,
    category: "Accessories",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand for better posture and cooling.",
    price: 39.99,
    stock: 24,
    category: "Accessories",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation.",
    price: 299.99,
    stock: 12,
    category: "Audio",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Webcam HD",
    description: "1080p webcam with auto-focus and built-in microphone.",
    price: 79.99,
    stock: 18,
    category: "Electronics",
    lastUpdated: new Date().toISOString(),
  },
];

// Simulate data fetching delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllProducts(): Promise<Product[]> {
  await delay(100); // Simulate network delay
  // Update timestamps to show when data was fetched
  return productsDB.map((product) => ({
    ...product,
    lastUpdated: new Date().toISOString(),
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(50); // Simulate network delay
  const product = productsDB.find((p) => p.id === id);
  if (!product) return null;

  return {
    ...product,
    lastUpdated: new Date().toISOString(),
  };
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await delay(100); // Simulate network delay
  return productsDB
    .filter((p) => p.category === category)
    .map((product) => ({
      ...product,
      lastUpdated: new Date().toISOString(),
    }));
}

export function getCategories(): string[] {
  return Array.from(new Set(productsDB.map((p) => p.category)));
}

// Simulate updating a product (for testing cache invalidation)
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  await delay(50);
  const index = productsDB.findIndex((p) => p.id === id);
  if (index === -1) return null;

  productsDB[index] = {
    ...productsDB[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  return productsDB[index];
}
