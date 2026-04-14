/*
wh runtest spinnerij.api
*/

import { reset } from "@webhare/test-backend";
import * as test from "@webhare/test";
import * as whdb from "@webhare/whdb";
import { WRDSchema } from "@webhare/wrd";
import { spinnerijSchema } from "wh:wrd/spinnerij";
import { SpinnerijApi } from "@mod-spinnerij/js/api";

type SpinnerijSchema = typeof spinnerijSchema;

const TEST_SCHEMA_TAG = "webhare_testsuite:spinnerij";

let testSchema: SpinnerijSchema;
let api: SpinnerijApi;

async function setup(): Promise<void> {
  await reset({
    wrdSchema: TEST_SCHEMA_TAG,
    schemaDefinitionResource: "mod::spinnerij/data/wrdschema.xml",
  });
  testSchema = new WRDSchema(TEST_SCHEMA_TAG) as unknown as SpinnerijSchema;
  api = new SpinnerijApi(testSchema);
}

async function testGetRooms(): Promise<void> {
  const roomId = await whdb.runInWork(async () => {
    return await testSchema.insert("room", {
      wrdTitle: "Ruimte 1.19",
      subtitle: "Textielkamer",
      capacity: 40,
      description: "Industriele ruimte met vergadertafels",
    });
  });
  test.assert(roomId > 0, "Room should be inserted");

  const rooms = await api.getRooms();
  test.eq(1, rooms.length, "Should return 1 room");
  test.eq("Ruimte 1.19", rooms[0].wrdTitle, "Room title should match");
  test.eq("Textielkamer", rooms[0].subtitle, "Room subtitle should match");
  test.eq(40, rooms[0].capacity, "Room capacity should match");
}

async function testGetTenants(): Promise<void> {
  const tenantId = await whdb.runInWork(async () => {
    return await testSchema.insert("tenant", {
      wrdTitle: "Appeltjes van Oranje",
      description: "Catering",
      category: "Catering",
      room: "Ruimte Kantine",
      website: "https://appeltjesvanoranje.nl",
    });
  });
  test.assert(tenantId > 0, "Tenant should be inserted");

  const tenants = await api.getTenants();
  test.assert(tenants.length >= 1, "Should return at least 1 tenant");

  const tenant = tenants.find((t) => t.wrdTitle === "Appeltjes van Oranje");
  test.assert(tenant !== undefined, "Should find inserted tenant");
  test.eq("Catering", tenant!.category, "Tenant category should match");
  test.eq("Ruimte Kantine", tenant!.room, "Tenant room should match");
  test.eq("https://appeltjesvanoranje.nl", tenant!.website, "Tenant website should match");
}

async function testGetSupplyDemandItems(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("supplyDemand", {
      type: "aanbod",
      wrdTitle: "Vergadertafel met stoelen",
      description: "Ik heb een tafel over",
      author: "Chris Hudepohl",
      organization: "Spinnerij",
      email: "chris@spinnerijoosterveld.nl",
    });
  });

  const items = await api.getSupplyDemandItems();
  test.assert(items.length >= 1, "Should return at least 1 item");

  const item = items.find((i) => i.wrdTitle === "Vergadertafel met stoelen");
  test.assert(item !== undefined, "Should find inserted item");
  test.eq("aanbod", item!.type, "Item type should match");
  test.eq("Chris Hudepohl", item!.author, "Item author should match");
}

async function testGetReports(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("report", {
      category: "verlichting",
      description: "Lamp in gang 2e verdieping doet het niet",
      reporterName: "Jan Jansen",
      reporterEmail: "jan@example.nl",
      status: "open",
    });
  });

  const reports = await api.getReports();
  test.assert(reports.length >= 1, "Should return at least 1 report");

  const report = reports.find((r) => r.description === "Lamp in gang 2e verdieping doet het niet");
  test.assert(report !== undefined, "Should find inserted report");
  test.eq("verlichting", report!.category, "Report category should match");
  test.eq("open", report!.status, "Report status should match");
  test.eq("Jan Jansen", report!.reporterName, "Reporter name should match");
}

async function testGetReservations(): Promise<void> {
  await whdb.runInWork(async () => {
    // First insert a room to reference
    const roomId = await testSchema.insert("room", {
      wrdTitle: "Ruimte 0.10",
      subtitle: "Spinzaal",
      capacity: 80,
    });

    const reservationDate = new Date("2026-05-01T14:00:00Z");
    await testSchema.insert("reservation", {
      room: roomId,
      date: reservationDate,
      requesterName: "Piet de Vries",
      requesterEmail: "piet@example.nl",
      description: "Teamvergadering",
      status: "aangevraagd",
    });
  });

  const reservations = await api.getReservations();
  test.assert(reservations.length >= 1, "Should return at least 1 reservation");

  const reservation = reservations.find((r) => r.description === "Teamvergadering");
  test.assert(reservation !== undefined, "Should find inserted reservation");
  test.eq("aangevraagd", reservation!.status, "Reservation status should match");
  test.eq("Piet de Vries", reservation!.requesterName, "Requester name should match");
}

// --- Empty results ---

async function testEmptyResults(): Promise<void> {
  const rooms = await api.getRooms();
  test.eq(0, rooms.length, "getRooms should return empty array when no rooms exist");

  const tenants = await api.getTenants();
  test.eq(0, tenants.length, "getTenants should return empty array when no tenants exist");

  const items = await api.getSupplyDemandItems();
  test.eq(0, items.length, "getSupplyDemandItems should return empty array when no items exist");

  const reports = await api.getReports();
  test.eq(0, reports.length, "getReports should return empty array when no reports exist");

  const reservations = await api.getReservations();
  test.eq(0, reservations.length, "getReservations should return empty array when no reservations exist");
}

// --- Sorting tests ---

async function testRoomsSortByOrdering(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("room", { wrdTitle: "Zaal C", wrdOrdering: 3 });
    await testSchema.insert("room", { wrdTitle: "Zaal A", wrdOrdering: 1 });
    await testSchema.insert("room", { wrdTitle: "Zaal B", wrdOrdering: 2 });
  });

  const rooms = await api.getRooms();
  test.eq(3, rooms.length, "Should return 3 rooms");
  test.eq("Zaal A", rooms[0].wrdTitle, "First room should have lowest ordering");
  test.eq("Zaal B", rooms[1].wrdTitle, "Second room should have middle ordering");
  test.eq("Zaal C", rooms[2].wrdTitle, "Third room should have highest ordering");
}

async function testTenantsSortAlphabetically(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("tenant", { wrdTitle: "Zebra Studio" });
    await testSchema.insert("tenant", { wrdTitle: "Atelier Bloem" });
    await testSchema.insert("tenant", { wrdTitle: "Kantoor Midden" });
  });

  const tenants = await api.getTenants();
  test.eq(3, tenants.length, "Should return 3 tenants");
  test.eq("Atelier Bloem", tenants[0].wrdTitle, "First tenant should be alphabetically first");
  test.eq("Kantoor Midden", tenants[1].wrdTitle, "Second tenant should be alphabetically second");
  test.eq("Zebra Studio", tenants[2].wrdTitle, "Third tenant should be alphabetically third");
}

async function testReservationsSortByDateDescending(): Promise<void> {
  await whdb.runInWork(async () => {
    const roomId = await testSchema.insert("room", { wrdTitle: "Testzaal" });
    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-01-01T10:00:00Z"),
      description: "Oudste",
      status: "aangevraagd",
    });
    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-06-15T10:00:00Z"),
      description: "Middelste",
      status: "aangevraagd",
    });
    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-12-31T10:00:00Z"),
      description: "Nieuwste",
      status: "bevestigd",
    });
  });

  const reservations = await api.getReservations();
  test.eq(3, reservations.length, "Should return 3 reservations");
  test.eq("Nieuwste", reservations[0].description, "First should be newest date");
  test.eq("Middelste", reservations[1].description, "Second should be middle date");
  test.eq("Oudste", reservations[2].description, "Third should be oldest date");
}

// --- Multiple entities & all statuses ---

async function testMultipleReportsAllStatuses(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("report", {
      category: "verlichting",
      description: "Melding verlichting",
      reporterName: "Tester A",
      status: "open",
    });
    await testSchema.insert("report", {
      category: "sanitair",
      description: "Melding sanitair",
      reporterName: "Tester B",
      status: "in_behandeling",
    });
    await testSchema.insert("report", {
      category: "overig",
      description: "Melding overig",
      reporterName: "Tester C",
      status: "afgehandeld",
    });
  });

  const reports = await api.getReports();
  test.eq(3, reports.length, "Should return 3 reports");

  const statuses = reports.map((r) => r.status);
  test.assert(statuses.includes("open"), "Should include open report");
  test.assert(statuses.includes("in_behandeling"), "Should include in_behandeling report");
  test.assert(statuses.includes("afgehandeld"), "Should include afgehandeld report");

  const categories = reports.map((r) => r.category);
  test.assert(categories.includes("verlichting"), "Should include verlichting category");
  test.assert(categories.includes("sanitair"), "Should include sanitair category");
  test.assert(categories.includes("overig"), "Should include overig category");
}

async function testMultipleSupplyDemandBothTypes(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("supplyDemand", {
      type: "aanbod",
      wrdTitle: "Lasapparaat te leen",
      description: "MIG/MAG lasapparaat beschikbaar",
      author: "Auteur A",
      organization: "Bedrijf A",
      email: "a@example.nl",
    });
    await testSchema.insert("supplyDemand", {
      type: "vraag",
      wrdTitle: "Gezocht: opslagruimte",
      description: "Op zoek naar 10m2 opslag",
      author: "Auteur B",
      organization: "Bedrijf B",
      email: "b@example.nl",
    });
    await testSchema.insert("supplyDemand", {
      type: "aanbod",
      wrdTitle: "Bureau af te geven",
      description: "Stevig houten bureau",
      author: "Auteur C",
    });
  });

  const items = await api.getSupplyDemandItems();
  test.eq(3, items.length, "Should return 3 supply/demand items");

  const aanbod = items.filter((i) => i.type === "aanbod");
  const vraag = items.filter((i) => i.type === "vraag");
  test.eq(2, aanbod.length, "Should have 2 aanbod items");
  test.eq(1, vraag.length, "Should have 1 vraag item");
}

async function testReservationAllStatuses(): Promise<void> {
  await whdb.runInWork(async () => {
    const roomId = await testSchema.insert("room", { wrdTitle: "Statuszaal" });
    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-03-01T10:00:00Z"),
      description: "Aangevraagde reservering",
      status: "aangevraagd",
    });
    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-04-01T10:00:00Z"),
      description: "Bevestigde reservering",
      status: "bevestigd",
    });
    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-05-01T10:00:00Z"),
      description: "Geannuleerde reservering",
      status: "geannuleerd",
    });
  });

  const reservations = await api.getReservations();
  test.eq(3, reservations.length, "Should return 3 reservations");

  const statuses = reservations.map((r) => r.status);
  test.assert(statuses.includes("aangevraagd"), "Should include aangevraagd");
  test.assert(statuses.includes("bevestigd"), "Should include bevestigd");
  test.assert(statuses.includes("geannuleerd"), "Should include geannuleerd");
}

// --- Field completeness ---

async function testRoomFieldCompleteness(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("room", {
      wrdTitle: "Compleet Atelier",
      subtitle: "Werkruimte met alle velden",
      capacity: 25,
      description: "Volledig ingevulde ruimte voor test",
      wrdOrdering: 1,
    });
  });

  const rooms = await api.getRooms();
  test.eq(1, rooms.length, "Should return 1 room");

  const room = rooms[0];
  test.assert(room.wrdId > 0, "wrdId should be set");
  test.eq("Compleet Atelier", room.wrdTitle, "wrdTitle should match");
  test.eq("Werkruimte met alle velden", room.subtitle, "subtitle should match");
  test.eq(25, room.capacity, "capacity should match");
  test.eq("Volledig ingevulde ruimte voor test", room.description, "description should match");
}

test.run([
  // Basic CRUD tests
  setup,
  testEmptyResults,
  testGetRooms,
  testGetTenants,
  testGetSupplyDemandItems,
  testGetReports,
  testGetReservations,
  // Sorting tests
  setup,
  testRoomsSortByOrdering,
  setup,
  testTenantsSortAlphabetically,
  setup,
  testReservationsSortByDateDescending,
  // Multiple entities & statuses
  setup,
  testMultipleReportsAllStatuses,
  setup,
  testMultipleSupplyDemandBothTypes,
  setup,
  testReservationAllStatuses,
  // Field completeness
  setup,
  testRoomFieldCompleteness,
]);
