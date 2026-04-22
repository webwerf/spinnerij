/*
Import rooms and tenants from the WordPress export CSVs.
Downloads images to /tmp/spinnerij_images (skip if already cached).
Upserts by wrdTitle so re-running is safe.

wh run mod::spinnerij/scripts/import-csv.ts
*/

import { run } from "@webhare/cli";
import * as whdb from "@webhare/whdb";
import { ResourceDescriptor } from "@webhare/services";
import { spinnerijSchema } from "wh:wrd/spinnerij";
import { execFile } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);
const RESIZE_THRESHOLD = 10 * 1024 * 1024; // 10 MB
const RESIZE_MAX_DIM = 2000;
const RESIZE_QUALITY = 85;

const IMG_DIR = "/tmp/spinnerij_images";
const EXPORT_DIR = "/Users/wouter/Downloads/spinnerij_export";
const RUIMTES_CSV = path.join(EXPORT_DIR, "spinnerij_ruimtes.csv");
const HUURDERS_CSV = path.join(EXPORT_DIR, "spinnerij_huurders.csv");

type CsvRow = Record<string, string>;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === "\"") {
        if (text[i + 1] === "\"") {
          field += "\"";
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === "\"") {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      if (c === "\r" && text[i + 1] === "\n") i += 2;
      else i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function readCsv(filePath: string): Promise<CsvRow[]> {
  const text = await fs.readFile(filePath, "utf8");
  const rows = parseCsv(text);
  const headers = rows[0];
  return rows
    .slice(1)
    .filter(r => r.length === headers.length)
    .map(r => Object.fromEntries(headers.map((h, idx) => [h, r[idx]])));
}

async function resizeIfLarge(filePath: string): Promise<void> {
  const { size } = await fs.stat(filePath);
  if (size <= RESIZE_THRESHOLD) return;
  try {
    await execFileP("magick", [
      filePath,
      "-resize", `${RESIZE_MAX_DIM}x${RESIZE_MAX_DIM}>`,
      "-quality", String(RESIZE_QUALITY),
      filePath,
    ]);
    const after = (await fs.stat(filePath)).size;
    console.log(`  📐 resized ${path.basename(filePath)}: ${size} → ${after} bytes`);
  } catch (e) {
    console.log(`  ⚠️  resize failed for ${path.basename(filePath)}: ${(e as Error).message}`);
  }
}

async function downloadIfMissing(url: string): Promise<string | null> {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return null;
  }
  const filename = path.basename(decodeURIComponent(urlObj.pathname)) || `img-${Date.now()}`;
  const dest = path.join(IMG_DIR, filename);
  try {
    await fs.access(dest);
    await resizeIfLarge(dest);
    return dest;
  } catch {
    // not cached yet
  }
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  ❌ ${filename} (HTTP ${res.status})`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    console.log(`  ⬇️  ${filename} (${buf.length} bytes)`);
    await resizeIfLarge(dest);
    return dest;
  } catch (e) {
    console.log(`  ❌ ${filename}: ${(e as Error).message}`);
    return null;
  }
}

interface GroupedPost {
  postId: string;
  postType: string;
  postTitle: string;
  postContent: string;
  postParent: string;
  guid: string;
  postMimeType: string;
  meta: Record<string, string>;
}

function groupByPost(rows: CsvRow[]): Map<string, GroupedPost> {
  const map = new Map<string, GroupedPost>();
  for (const r of rows) {
    const id = r.post_id;
    if (!id) continue;
    let g = map.get(id);
    if (!g) {
      g = {
        postId: id,
        postType: r.post_type || "",
        postTitle: r.post_title || "",
        postContent: r.post_content || "",
        postParent: r.post_parent || "",
        guid: r.guid || "",
        postMimeType: r.post_mime_type || "",
        meta: {},
      };
      map.set(id, g);
    }
    if (r.meta_key) {
      const v = (r.meta_value || "").trim();
      if (v && !g.meta[r.meta_key]) g.meta[r.meta_key] = v;
    }
  }
  return map;
}

function childImages(byPost: Map<string, GroupedPost>, parentId: string): string[] {
  const images: string[] = [];
  for (const g of byPost.values()) {
    if (g.postType === "attachment" && g.postParent === parentId && g.guid) {
      images.push(g.guid);
    }
  }
  return images;
}

function parseIntOrNull(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

async function buildImageDescriptor(url: string | undefined): Promise<ResourceDescriptor | null> {
  if (!url) return null;
  const localPath = await downloadIfMissing(url);
  if (!localPath) return null;
  return await ResourceDescriptor.fromDisk(localPath);
}

run({
  async main() {
    await fs.mkdir(IMG_DIR, { recursive: true });

    console.log("Reading CSVs...");
    const ruimtes = await readCsv(RUIMTES_CSV);
    const huurders = await readCsv(HUURDERS_CSV);
    const rGrouped = groupByPost(ruimtes);
    const hGrouped = groupByPost(huurders);

    const roomPosts = [...rGrouped.values()].filter(g => g.postType === "properties");
    const tenantPosts = [...hGrouped.values()].filter(g => g.postType === "huurders");
    console.log(`Found ${roomPosts.length} rooms, ${tenantPosts.length} tenants`);

    await whdb.beginWork();

    // --- Rooms ---
    console.log("\n=== Rooms ===");
    let roomsCreated = 0;
    let roomsUpdated = 0;
    for (const p of roomPosts) {
      const title = p.postTitle.trim();
      if (!title) continue;
      console.log(`\n→ ${title}`);
      const imgUrl = childImages(rGrouped, p.postId)[0];
      const img = await buildImageDescriptor(imgUrl);
      const [, isNew] = await spinnerijSchema.upsert(
        "room",
        { wrdTitle: title },
        {
          description: p.meta.es_property_description || "",
          areaSqm: parseIntOrNull(p.meta.es_property_area) ?? 0,
          floorLevel: parseIntOrNull(p.meta.es_property_floor_level) ?? 0,
          ...(img ? { image: img } : {}),
        },
        { ifNew: {} }
      );
      if (isNew) roomsCreated++;
      else roomsUpdated++;
    }
    console.log(`\n✅ rooms: ${roomsCreated} created, ${roomsUpdated} updated`);

    // --- Tenants ---
    console.log("\n=== Tenants ===");
    let tenantsCreated = 0;
    let tenantsUpdated = 0;
    for (const p of tenantPosts) {
      const title = p.postTitle.trim();
      if (!title) continue;
      console.log(`→ ${title}`);
      const imgUrl = childImages(hGrouped, p.postId)[0];
      const img = await buildImageDescriptor(imgUrl);
      const [, isNew] = await spinnerijSchema.upsert(
        "tenant",
        { wrdTitle: title },
        {
          description: p.postContent || "",
          category: p.meta.company_label || "",
          room: p.meta.office_number || "",
          website: p.meta.website_url || "",
          email: p.meta["e-mail"] || "",
          phone: p.meta.phone_number || "",
          address: p.meta.tenant_address || "",
          facebook: p.meta.facebook_new || "",
          linkedin: p.meta.linkedin_new || "",
          instagram: p.meta.instagram_new || "",
          youtube: p.meta.youtube_new || "",
          twitter: p.meta.twitter_new || "",
          pinterest: p.meta.pinterest_new || "",
          vimeo: p.meta.vimeo_new || "",
          ...(img ? { logo: img } : {}),
        },
        { ifNew: {} }
      );
      if (isNew) tenantsCreated++;
      else tenantsUpdated++;
    }
    console.log(`\n✅ tenants: ${tenantsCreated} created, ${tenantsUpdated} updated`);

    await whdb.commitWork();
    console.log("\n✅ Import complete!");
  },
});
