export type PropertySpaceType = "room" | "area" | "asset";

export type PropertyItem = {
  id: string;
  property_id: string;
  type: PropertySpaceType;
  name: string;
  promptId: string | null;
  description: string | null;
  image_url: string | null;
  image_headers?: Record<string, string>;
  created_at: string;
};

export type CreatePropertyItem = Pick<PropertyItem, "type" | "name"> &
  Partial<Pick<PropertyItem, "promptId" | "description">>;
