import { type SiteRequest, SiteResponse, type SiteResponseSettings } from "@webhare/router";

export async function spinnerijDesign(request: SiteRequest, settings: SiteResponseSettings) {
  return new SiteResponse({}, request, settings);
}
