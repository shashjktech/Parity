export type InspectionSpaceType = 'room' | 'area' | 'asset';
export type InspectionSpaceStatus = 'pending' | 'completed' | 'not_configured';
export type InspectionFilter = 'all' | InspectionSpaceStatus;

export type InspectionSpace = {
  id: string;
  type: InspectionSpaceType;
  name: string;
  location: string | null;
  imageUrl: string | null;
  status: InspectionSpaceStatus;
};

export type InspectionChecklist = {
  property: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  spaces: InspectionSpace[];
};