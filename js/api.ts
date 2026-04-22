import { type WRDSchema } from "@webhare/wrd";
import { spinnerijSchema } from "wh:wrd/spinnerij";

type SpinnerijSchema = typeof spinnerijSchema;

export interface Room {
  wrdId: number;
  wrdTitle: string;
  subtitle: string;
  capacity: number;
  description: string;
}

export interface Tenant {
  wrdId: number;
  wrdTitle: string;
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
  wrdId: number;
  wrdTitle: string;
  type: string;
  description: string;
  author: string;
  organization: string;
  email: string;
  date: Date;
}

export interface Report {
  wrdId: number;
  category: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  status: string;
}

export interface Reservation {
  wrdId: number;
  room: number;
  date: Date;
  requesterName: string;
  requesterEmail: string;
  description: string;
  status: string;
}

export class SpinnerijApi {
  #schema: SpinnerijSchema;

  public constructor(schema?: SpinnerijSchema) {
    this.#schema = (schema ?? spinnerijSchema) as SpinnerijSchema;
  }

  public async getRooms(): Promise<Room[]> {
    const rooms = await this.#schema
      .query("room")
      .select(["wrdId", "wrdTitle", "subtitle", "capacity", "description", "wrdOrdering"])
      .execute() as (Room & { wrdOrdering: number })[];
    rooms.sort((a, b) => (a.wrdOrdering ?? 0) - (b.wrdOrdering ?? 0));
    return rooms;
  }

  public async getTenants(): Promise<Tenant[]> {
    const tenants = await this.#schema
      .query("tenant")
      .select([
        "wrdId", "wrdTitle", "description", "category", "room", "website",
        "email", "phone", "address",
        "facebook", "linkedin", "instagram", "youtube", "twitter", "pinterest", "vimeo",
      ])
      .execute() as Tenant[];
    tenants.sort((a, b) => a.wrdTitle.localeCompare(b.wrdTitle));
    return tenants;
  }

  public async getSupplyDemandItems(): Promise<SupplyDemandItem[]> {
    const items = await this.#schema
      .query("supplyDemand")
      .select(["wrdId", "wrdTitle", "type", "description", "author", "organization", "email", "date", "wrdCreationDate"])
      .execute() as (SupplyDemandItem & { wrdCreationDate: Date })[];
    items.sort((a, b) => (b.wrdCreationDate?.getTime() ?? 0) - (a.wrdCreationDate?.getTime() ?? 0));
    return items;
  }

  public async getReports(): Promise<Report[]> {
    const reports = await this.#schema
      .query("report")
      .select(["wrdId", "category", "description", "reporterName", "reporterEmail", "status", "wrdCreationDate"])
      .execute() as (Report & { wrdCreationDate: Date })[];
    reports.sort((a, b) => (b.wrdCreationDate?.getTime() ?? 0) - (a.wrdCreationDate?.getTime() ?? 0));
    return reports;
  }

  public async getReservations(): Promise<Reservation[]> {
    const reservations = await this.#schema
      .query("reservation")
      .select(["wrdId", "room", "date", "requesterName", "requesterEmail", "description", "status"])
      .execute() as Reservation[];
    reservations.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
    return reservations;
  }
}
