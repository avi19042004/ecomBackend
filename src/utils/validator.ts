import * as z from "zod";

export const productValidator = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  size: z.array(z.string().nonempty("Size cannot be empty")).min(1, "Size is required"),
  category: z.array(z.string().nonempty("Category cannot be empty")).min(1, "Category is required"),
  price: z.number().positive("Price must be greater than 0"),
  image: z.array(z.string().nonempty("Image cannot be empty")).min(1, "Image is required"),
  stock: z.number().positive("Stock must be greater than 0"),
});

export const userValidator = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  wishlist: z.array(z.string().nonempty("Wishlist item ID cannot be empty")).optional().default([]),
  cart: z
    .array(
      z.object({
        items: z.string().nonempty("Product ID is required"),
        count: z.number().min(1, "Count must be at least 1").default(1),
        size: z.string().nonempty("Size is required"),
      })
    )
    .optional()
    .default([]),
});

export const loginValidator = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
