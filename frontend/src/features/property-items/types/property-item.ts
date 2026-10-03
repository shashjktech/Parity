export type PropertyItemKind = 'room' | 'area' | 'asset';
export type PropertyItemStatus = 'AVAILABLE' | 'OUT_OF_SERVICE';

export type PropertyItem = {
  id: string;
  property_id: string;
  kind: PropertyItemKind;
  name: string;
  subtype: string | null;
  area: string | null;
  floor_level: string | null;
  capacity: number | null;
  status: PropertyItemStatus;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type CreatePropertyItem = Pick<PropertyItem, 'kind' | 'name'> &
  Partial<Pick<
    PropertyItem,
    'subtype' | 'area' | 'floor_level' | 'capacity' | 'status' | 'description'
  >> & { image_path?: string | null };