import { useQuery } from '@tanstack/react-query';
import { CATEGORIES, PRODUCTS } from '@/api/_seed';
import { useOrderStore } from '@/store/orderStore';
import type { Category, Product } from '@/types';

/* Every hook here reads _seed.ts and returns the same { data, isLoading,
   isError } surface the live endpoints will. */

export function useGetCategories() {
  // TODO[part-2]: replace stub data with real GET /categories call
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => CATEGORIES,
  });
}

export function useGetProducts() {
  // TODO[part-2]: replace stub data with real GET /products call
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => PRODUCTS,
  });
}

export function useGetProduct(id: string | undefined) {
  // TODO[part-2]: replace stub data with real GET /products/:id call
  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => PRODUCTS.find((p) => p.id === id) ?? null,
    enabled: !!id,
  });
}

/** Buy-again rail: real order history when there is any, else the demo seed —
    exactly the prototype's buyAgainItems(). */
export function useBuyAgain(): Product[] {
  const orders = useOrderStore((s) => s.orders);
  if (orders.length) {
    const ids = [...new Set(orders.flatMap((o) => o.items.map((i) => i.id)))].slice(0, 6);
    return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => !!p);
  }
  return ['p5', 'p8', 'p15', 'p13', 'p20', 'p23']
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => !!p);
}

/** Synchronous catalog lookup for components that already hold an id. */
export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
