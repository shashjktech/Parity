export type InspectionSpaceType = 'room' | 'area' | 'assets';
export type InspectionSpaceStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'failed'
  | 'not_configured';
export type InspectionFilter = 'all' | InspectionSpaceStatus;

export type InspectionSpace = {
  id: string;
  type: InspectionSpaceType;
  name: string;
  location: string | null;
  imageUrl: string | null;
  status: InspectionSpaceStatus;
  captureId: string | null;
};

export type InspectionChecklist = {
  property: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  spaces: InspectionSpace[];
};

export type InspectionIssue = {
  id: string;
  title: string;
  category: string;
  description: string | null;
};

export type InspectionCaptureResult = {
  captureId: string;
  spaceId: string;
  status: InspectionSpaceStatus;
  masterImageUrl: string | null;
  currentImageUrl: string | null;
  issues: InspectionIssue[];
};