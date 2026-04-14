/*
wh runtest spinnerij.data
*/

import { reset } from "@webhare/test-backend";
import * as test from "@webhare/test";
import * as whdb from "@webhare/whdb";
import { WRDSchema } from "@webhare/wrd";
import { spinnerijSchema } from "wh:wrd/spinnerij";
import { SpinnerijApi } from "@mod-spinnerij/js/api";
import { getData } from "@mod-spinnerij/webdesigns/spinnerij/scripts/data";

type SpinnerijSchema = typeof spinnerijSchema;

const TEST_SCHEMA_TAG = "webhare_testsuite:spinnerij_data";

let testSchema: SpinnerijSchema;

async function setup(): Promise<void> {
  await reset({
    wrdSchema: TEST_SCHEMA_TAG,
    schemaDefinitionResource: "mod::spinnerij/data/wrdschema.xml",
  });
  testSchema = new WRDSchema(TEST_SCHEMA_TAG) as unknown as SpinnerijSchema;
}

async function testGetDataReturnsAllKeys(): Promise<void> {
  const api = new SpinnerijApi(testSchema);
  const data = await getData(api);

  test.assert("rooms" in data, "getData should return rooms key");
  test.assert("tenants" in data, "getData should return tenants key");
  test.assert("supplyDemandItems" in data, "getData should return supplyDemandItems key");
  test.assert("reports" in data, "getData should return reports key");
  test.assert("reservations" in data, "getData should return reservations key");
}

async function testGetDataEmptySchema(): Promise<void> {
  const api = new SpinnerijApi(testSchema);
  const data = await getData(api);

  test.eq(0, data.rooms.length, "rooms should be empty on clean schema");
  test.eq(0, data.tenants.length, "tenants should be empty on clean schema");
  test.eq(0, data.supplyDemandItems.length, "supplyDemandItems should be empty on clean schema");
  test.eq(0, data.reports.length, "reports should be empty on clean schema");
  test.eq(0, data.reservations.length, "reservations should be empty on clean schema");
}

async function testGetDataWithEntities(): Promise<void> {
  await whdb.runInWork(async () => {
    const roomId = await testSchema.insert("room", {
      wrdTitle: "Zaal 1",
      subtitle: "Testzaal",
      capacity: 10,
    });

    await testSchema.insert("tenant", {
      wrdTitle: "Test Huurder",
      description: "Testbedrijf",
      category: "kantoor",
    });

    await testSchema.insert("supplyDemand", {
      type: "aanbod",
      wrdTitle: "Test aanbod",
      author: "Tester",
    });

    await testSchema.insert("report", {
      category: "overig",
      description: "Testmelding",
      status: "open",
    });

    await testSchema.insert("reservation", {
      room: roomId,
      date: new Date("2026-06-01T10:00:00Z"),
      description: "Testreservering",
      status: "aangevraagd",
    });
  });

  const api = new SpinnerijApi(testSchema);
  const data = await getData(api);

  test.eq(1, data.rooms.length, "Should return 1 room");
  test.eq("Zaal 1", data.rooms[0].wrdTitle, "Room title should match");

  test.eq(1, data.tenants.length, "Should return 1 tenant");
  test.eq("Test Huurder", data.tenants[0].wrdTitle, "Tenant title should match");

  test.eq(1, data.supplyDemandItems.length, "Should return 1 supply/demand item");
  test.eq("Test aanbod", data.supplyDemandItems[0].wrdTitle, "Item title should match");

  test.eq(1, data.reports.length, "Should return 1 report");
  test.eq("Testmelding", data.reports[0].description, "Report description should match");

  test.eq(1, data.reservations.length, "Should return 1 reservation");
  test.eq("Testreservering", data.reservations[0].description, "Reservation description should match");
}

async function testGetDataCombinesMultipleEntities(): Promise<void> {
  await whdb.runInWork(async () => {
    await testSchema.insert("room", { wrdTitle: "Zaal A", wrdOrdering: 1 });
    await testSchema.insert("room", { wrdTitle: "Zaal B", wrdOrdering: 2 });
    await testSchema.insert("tenant", { wrdTitle: "Huurder 1" });
    await testSchema.insert("tenant", { wrdTitle: "Huurder 2" });
    await testSchema.insert("tenant", { wrdTitle: "Huurder 3" });
  });

  const api = new SpinnerijApi(testSchema);
  const data = await getData(api);

  test.eq(2, data.rooms.length, "Should return 2 rooms");
  test.eq(3, data.tenants.length, "Should return 3 tenants");
  test.eq(0, data.supplyDemandItems.length, "Should return 0 supply/demand items");
  test.eq(0, data.reports.length, "Should return 0 reports");
  test.eq(0, data.reservations.length, "Should return 0 reservations");
}

test.run([
  setup,
  testGetDataReturnsAllKeys,
  testGetDataEmptySchema,
  setup,
  testGetDataWithEntities,
  setup,
  testGetDataCombinesMultipleEntities,
]);
