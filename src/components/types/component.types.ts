export type CrimeProperties = {
  date: string;
  last_outcome: string;
  source_id: string;
  type: string;
};

export type OfficerProperties = {
  badge_no: string;
  name: string;
  surname: string;
  rank: string;
};

export type LocationProperties = {
  address: string;
  longitude: number;
  latitude: number;
  position: {
    x: number;
    y: number;
    srid: number;
  };
  postcode: string;
};

export type NodeProperties =
  | CrimeProperties
  | OfficerProperties
  | LocationProperties;

export type NodeTypes = {
  id: string;
  index: number;
  label: "Crime" | "Officer" | "Location";
  properties: NodeProperties;
  type: string;
  vx: number;
  vy: number;
  x: number;
  y: number;
  __indexColor: string;
};
