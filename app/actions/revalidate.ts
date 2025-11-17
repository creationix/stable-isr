"use server";

import { revalidateTag, revalidatePath } from "next/cache";
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
