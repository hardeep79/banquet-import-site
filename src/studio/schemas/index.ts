import type { SchemaTypeDefinition } from "sanity";
import { seo } from "./objects/seo";
import { spec } from "./objects/spec";
import { category } from "./category";
import { product } from "./product";
import { galleryItem } from "./galleryItem";

export const schemaTypes: SchemaTypeDefinition[] = [seo, spec, category, product, galleryItem];
