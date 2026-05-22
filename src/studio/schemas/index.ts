import type { SchemaTypeDefinition } from "sanity";
import { seo } from "./objects/seo";
import { spec } from "./objects/spec";
import { category } from "./category";
import { product } from "./product";
import { galleryItem } from "./galleryItem";
import { testimonial } from "./testimonial";
import { siteSettings } from "./siteSettings";
import { legalPage } from "./legalPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  seo, spec, category, product, galleryItem, testimonial, siteSettings, legalPage,
];
