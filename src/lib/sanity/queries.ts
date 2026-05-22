import { sanity } from "./client";

const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc) {
  _id, title, "slug": slug.current, tagline, description, heroImage, order, seo
}`;

const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, tagline, description, heroImage, seo,
  "products": *[_type == "product" && references(^._id)] | order(title asc) {
    _id, title, "slug": slug.current, shortDescription, images, tags, featured
  }
}`;

const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $product
  && category->slug.current == $category][0] {
  _id, title, "slug": slug.current, shortDescription, description, images, specs, tags, seo,
  "category": category->{ title, "slug": slug.current }
}`;

const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true][0...8] {
  _id, title, "slug": slug.current, shortDescription, images,
  "category": category->{ title, "slug": slug.current }
}`;

const GALLERY_QUERY = `*[_type == "galleryItem"] | order(order asc, _createdAt desc) {
  _id, title, image, tags, featured
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  phone, email, serviceAreaCopy, legalAddress, socialHandles, defaultOgImage, headerCtaLabel
}`;

const LEGAL_PAGE_QUERY = `*[_type == "legalPage" && slug.current == $slug][0] {
  title, "slug": slug.current, body, lastUpdated
}`;

export async function getCategories() {
  return sanity.fetch(CATEGORIES_QUERY, {}, { next: { revalidate: 60, tags: ["categories"] } });
}
export async function getCategory(slug: string) {
  return sanity.fetch(CATEGORY_BY_SLUG_QUERY, { slug }, {
    next: { revalidate: 60, tags: ["categories", `category:${slug}`] },
  });
}
export async function getProduct(category: string, product: string) {
  return sanity.fetch(PRODUCT_BY_SLUG_QUERY, { category, product }, {
    next: { revalidate: 60, tags: [`product:${product}`] },
  });
}
export async function getFeaturedProducts() {
  return sanity.fetch(FEATURED_PRODUCTS_QUERY, {}, { next: { revalidate: 60, tags: ["featured"] } });
}
export async function getGalleryItems() {
  return sanity.fetch(GALLERY_QUERY, {}, { next: { revalidate: 60, tags: ["gallery"] } });
}
export async function getSiteSettings() {
  return sanity.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 300, tags: ["siteSettings"] } });
}
export async function getLegalPage(slug: string) {
  return sanity.fetch(LEGAL_PAGE_QUERY, { slug }, {
    next: { revalidate: 300, tags: [`legal:${slug}`] },
  });
}
