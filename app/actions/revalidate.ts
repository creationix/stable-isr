"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { updateProduct } from "@/lib/data";

export async function revalidateProducts() {
  revalidateTag("products");
  return { success: true, message: "Products cache revalidated" };
}

export async function revalidateProductById(id: string) {
  revalidateTag(`product-${id}`);
  return { success: true, message: `Product ${id} cache revalidated` };
}

export async function revalidateProductsPath() {
  revalidatePath("/products");
  return { success: true, message: "Products path revalidated" };
}

export async function updateProductStock(id: string, newStock: number) {
  const updated = await updateProduct(id, { stock: newStock });
  if (updated) {
    // Use revalidateTag for eventual consistency
    revalidateTag(`product-${id}`);
    revalidateTag("products");
    return { success: true, message: `Product ${id} stock updated to ${newStock}` };
  }
  return { success: false, message: "Product not found" };
}
