"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroySession } from "@/lib/auth";
import {
  upsertSocialProfile,
  deleteSocialProfile,
} from "@/services/seo-service";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createPost,
  updatePost,
  deletePost,
  createCategory,
  updateCategory,
  deleteCategory,
  createBrand,
  updateBrand,
  deleteBrand,
  saveSettings,
} from "@/services/admin-service";

import { emptyState, type ActionState } from "./action-state";

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/* Social entity                                                        */
/* ------------------------------------------------------------------ */

const socialSchema = z.object({
  platform: z.string().trim().min(2).max(40),
  url: z.string().trim().url("URL không hợp lệ").max(400),
  handle: z.string().trim().max(120).optional().nullable(),
  isPrimary: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export async function saveSocialProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = socialSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
    handle: formData.get("handle") || null,
    isPrimary: formData.get("isPrimary") === "on",
    isActive: formData.get("isActive") !== "false",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Dữ liệu không hợp lệ.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    await upsertSocialProfile(parsed.data);
    revalidatePath("/admin/cai-dat");
    return { ok: true, message: "Đã lưu hồ sơ mạng xã hội." };
  } catch (err) {
    console.error("[seo] saveSocial:", err);
    return { ok: false, message: "Không thể lưu hồ sơ mạng xã hội." };
  }
}

export async function deleteSocialProfileAction(id: number): Promise<void> {
  await deleteSocialProfile(id);
  revalidatePath("/admin/cai-dat");
}

/* ------------------------------------------------------------------ */
/* Products CRUD                                                        */
/* ------------------------------------------------------------------ */

const specSchema = z.array(
  z.object({ label: z.string().trim().min(1), value: z.string().trim() }),
);

const faqSchema = z.array(
  z.object({
    question: z.string().trim().min(1),
    answer: z.string().trim().min(1),
  }),
);

const productSchema = z.object({
  name: z.string().trim().min(3, "Tên sản phẩm quá ngắn").max(220),
  slug: z.string().trim().max(240).optional(),
  sku: z.string().trim().min(2, "SKU là bắt buộc").max(60),
  shortDescription: z.string().trim().max(320).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  price: z.coerce.number().min(0, "Giá không hợp lệ"),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  costPrice: z.coerce.number().min(0).optional().nullable(),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  gallery: z.string().trim().optional().nullable(),
  categoryId: z.coerce.number().int().positive("Vui lòng chọn danh mục"),
  brandId: z.coerce.number().int().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Tồn kho không hợp lệ"),
  badge: z.string().trim().max(40).optional().nullable(),
  status: z.enum(["active", "hidden", "draft"]),
  specsJson: z.string().trim().optional().nullable(),
  faqJson: z.string().trim().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(320).optional().nullable(),
});

function parseJsonArray<T>(raw: string | null | undefined): T[] | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    sku: formData.get("sku"),
    shortDescription: formData.get("shortDescription") || null,
    description: formData.get("description") || null,
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || null,
    costPrice: formData.get("costPrice") || null,
    imageUrl: formData.get("imageUrl") || null,
    gallery: formData.get("gallery") || null,
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId") || null,
    stock: formData.get("stock"),
    badge: formData.get("badge") || null,
    status: formData.get("status"),
    specsJson: formData.get("specsJson") || null,
    faqJson: formData.get("faqJson") || null,
    isFeatured: formData.get("isFeatured") === "on",
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Dữ liệu không hợp lệ.",
      errors: fieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  const specs = parseJsonArray<{ label: string; value: string }>(d.specsJson);
  const faq = parseJsonArray<{ question: string; answer: string }>(d.faqJson);
  const gallery = (d.gallery ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  if (d.specsJson && !specs) {
    return {
      ok: false,
      message: "Thông số kỹ thuật phải là JSON hợp lệ.",
      errors: { specsJson: "JSON không hợp lệ" },
    };
  }
  if (d.faqJson && !faq) {
    return {
      ok: false,
      message: "FAQ phải là JSON hợp lệ.",
      errors: { faqJson: "JSON không hợp lệ" },
    };
  }

  const payload = {
    name: d.name,
    slug: d.slug,
    sku: d.sku,
    shortDescription: d.shortDescription,
    description: d.description,
    price: d.price,
    salePrice: d.salePrice,
    costPrice: d.costPrice,
    imageUrl: d.imageUrl,
    gallery,
    categoryId: d.categoryId,
    brandId: d.brandId,
    stock: d.stock,
    badge: d.badge,
    status: d.status,
    specs,
    faq,
    isFeatured: d.isFeatured,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
  };

  try {
    if (id) {
      await updateProduct(id, payload);
    } else {
      await createProduct(payload);
    }
    revalidatePath("/admin/san-pham");
    revalidatePath("/admin");
  } catch (err) {
    console.error("[admin] saveProduct:", err);
    return {
      ok: false,
      message: "Không thể lưu sản phẩm (SKU hoặc slug đã tồn tại?).",
    };
  }

  redirect("/admin/san-pham?saved=1");
}

export async function deleteProductAction(id: number): Promise<void> {
  await deleteProduct(id);
  revalidatePath("/admin/san-pham");
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

/** Đăng xuất: xoá cookie phiên rồi đưa về trang đăng nhập. */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/dang-nhap");
}

/* ------------------------------------------------------------------ */
/* Blog CRUD                                                            */
/* ------------------------------------------------------------------ */

const postSchema = z.object({
  title: z.string().trim().min(5, "Tiêu đề quá ngắn").max(240),
  slug: z.string().trim().max(260).optional(),
  excerpt: z.string().trim().max(400).optional().nullable(),
  content: z.string().trim().min(50, "Nội dung quá ngắn"),
  coverImage: z.string().trim().max(500).optional().nullable(),
  coverAlt: z.string().trim().max(200).optional().nullable(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  tags: z.string().trim().optional().nullable(),
  isPublished: z.coerce.boolean().default(false),
  readingTime: z.coerce.number().int().min(1).max(120),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(320).optional().nullable(),
});

export async function savePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || null,
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || null,
    coverAlt: formData.get("coverAlt") || null,
    categoryId: formData.get("categoryId") || null,
    tags: formData.get("tags") || null,
    isPublished: formData.get("isPublished") === "on",
    readingTime: formData.get("readingTime"),
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Dữ liệu không hợp lệ.",
      errors: fieldErrors(parsed.error),
    };
  }

  const d = parsed.data;
  const tags = (d.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  try {
    if (id) {
      await updatePost(id, { ...d, tags });
    } else {
      await createPost({ ...d, tags });
    }
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
  } catch (err) {
    console.error("[admin] savePost:", err);
    return { ok: false, message: "Không thể lưu bài viết (slug đã tồn tại?)." };
  }

  redirect("/admin/blog?saved=1");
}

export async function deletePostAction(id: number): Promise<void> {
  await deletePost(id);
  revalidatePath("/admin/blog");
}

/* ------------------------------------------------------------------ */
/* Categories & brands                                                   */
/* ------------------------------------------------------------------ */

const categorySchema = z.object({
  name: z.string().trim().min(2, "Tên danh mục quá ngắn").max(120),
  slug: z.string().trim().max(140).optional(),
  description: z.string().trim().optional().nullable(),
  icon: z.string().trim().max(60).optional().nullable(),
  position: z.coerce.number().int().min(0).max(999).default(0),
  isFeatured: z.coerce.boolean().default(false),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(320).optional().nullable(),
});

export async function saveCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || null,
    icon: formData.get("icon") || null,
    position: formData.get("position") || 0,
    isFeatured: formData.get("isFeatured") === "on",
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Dữ liệu không hợp lệ.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    if (id) {
      await updateCategory(id, parsed.data);
    } else {
      await createCategory(parsed.data);
    }
    revalidatePath("/admin/danh-muc");
    return { ok: true, message: "Đã lưu danh mục." };
  } catch (err) {
    console.error("[admin] saveCategory:", err);
    return { ok: false, message: "Không thể lưu danh mục (slug đã tồn tại?)." };
  }
}

export async function deleteCategoryAction(id: number): Promise<void> {
  await deleteCategory(id);
  revalidatePath("/admin/danh-muc");
}

const brandSchema = z.object({
  name: z.string().trim().min(2, "Tên thương hiệu quá ngắn").max(100),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(320).optional().nullable(),
});

export async function saveBrandAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || null,
    isFeatured: formData.get("isFeatured") === "on",
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Dữ liệu không hợp lệ.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    if (id) {
      await updateBrand(id, parsed.data);
    } else {
      await createBrand(parsed.data);
    }
    revalidatePath("/admin/thuong-hieu");
    return { ok: true, message: "Đã lưu thương hiệu." };
  } catch (err) {
    console.error("[admin] saveBrand:", err);
    return { ok: false, message: "Không thể lưu thương hiệu (slug đã tồn tại?)." };
  }
}

export async function deleteBrandAction(id: number): Promise<void> {
  await deleteBrand(id);
  revalidatePath("/admin/thuong-hieu");
}

/* ------------------------------------------------------------------ */
/* Settings                                                             */
/* ------------------------------------------------------------------ */

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof key === "string" && key.startsWith("setting_")) {
      values[key.replace("setting_", "")] = String(value);
    }
  }

  if (!Object.keys(values).length) {
    return { ok: false, message: "Không có thay đổi nào để lưu." };
  }

  try {
    await saveSettings(values);
    revalidatePath("/admin/cai-dat");
    return { ok: true, message: "Đã lưu cài đặt." };
  } catch (err) {
    console.error("[admin] saveSettings:", err);
    return { ok: false, message: "Không thể lưu cài đặt." };
  }
}
