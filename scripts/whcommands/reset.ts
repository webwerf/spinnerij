#!/usr/bin/env wh run

// command: spinnerij:reset
// short: Delete all WRD entities from the spinnerij schema

import { run } from "@webhare/cli";
import * as env from "@webhare/env";
import * as whdb from "@webhare/whdb";
import { spinnerijSchema } from "wh:wrd/spinnerij";

const ENTITY_TYPES = ["reservation", "report", "supplyDemand", "tenant", "room"] as const;

run({
  async main() {
    if (![`development`, `test`].includes(env.dtapStage)) {
      throw new Error(`Only on dev or test servers (current: ${env.dtapStage})`);
    }

    await whdb.beginWork();

    for (const type of ENTITY_TYPES) {
      const entities = await spinnerijSchema
        .query(type)
        .select(["wrdId"])
        .historyMode("all")
        .execute();
      for (const entity of entities) {
        await spinnerijSchema.delete(type, entity.wrdId);
      }
      console.log(`✅ Deleted ${entities.length} ${type} entities`);
    }

    await whdb.commitWork();
    console.log("\n✅ Spinnerij database reset complete");
  },
});
