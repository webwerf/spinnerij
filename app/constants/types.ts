export interface Room {
  wrdid: number;
  wrdtitle: string;
  subtitle: string;
  capacity: number;
  description: string;
  wrdordering: number;
}

export interface Tenant {
  wrdid: number;
  wrdtitle: string;
  description: string;
  category: string;
  room: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  twitter: string;
  pinterest: string;
  vimeo: string;
}

export interface SupplyDemandItem {
  wrdid: number;
  wrdtitle: string;
  type: "vraag" | "aanbod";
  description: string;
  author: string;
  organization: string;
  email: string;
  date: string;
  wrdcreationdate: string;
}

export interface Report {
  wrdid: number;
  category: string;
  description: string;
  reportername: string;
  reporteremail: string;
  status: string;
  wrdcreationdate: string;
}

export interface Reservation {
  wrdid: number;
  room: number;
  date: string;
  requestername: string;
  requesteremail: string;
  description: string;
  status: string;
}

export interface SpinnerijData {
  rooms: Room[];
  tenants: Tenant[];
  supplydemanditems: SupplyDemandItem[];
  reports: Report[];
  reservations: Reservation[];
}
