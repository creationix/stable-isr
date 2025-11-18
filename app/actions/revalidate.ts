"use server";

import { revalidateTag, revalidatePath, updateTag } from "next/cache";
import { updateProduct } from "@/lib/data";

export async function revalidateProducts() {
  revalidateTag("products", "max");
}

export async function revalidateProductById(id: string) {
  revalidateTag(`product-${id}`, "max");
}

export async function revalidateProductsPath() {
  revalidatePath("/products");
}

export async function updateProductStock(id: string, newStock: number) {
  const updated = await updateProduct(id, { stock: newStock });
  if (updated) {
    // Use revalidateTag for eventual consistency
    revalidateTag(`product-${id}`, "max");
    revalidateTag("products", "max");
  }
}

// Hard revalidation actions - immediately expires cache, forcing blocking reload
// Uses updateTag which can only be called in Server Actions (not Route Handlers)
export async function revalidateProductsHard() {
  updateTag("products");
}

export async function revalidateProductByIdHard(id: string) {
  updateTag(`product-${id}`);
}

export async function revalidateProductsPathHard() {
  // For path-based, we use revalidatePath which always does immediate expiration
  revalidatePath("/products", "page");
}
