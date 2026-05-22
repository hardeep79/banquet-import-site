import type { SchemaTypeDefinition } from "sanity";
import { seo } from "./objects/seo";
import { spec } from "./objects/spec";

export const schemaTypes: SchemaTypeDefinition[] = [seo, spec];
