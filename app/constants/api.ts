const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://sites.tech42.nl/spinnerij-app";

export const DATA_URL = `${API_BASE_URL}/data.json`;

// data.json carries host-relative image-cache links ("/.wh/ea/uc/..."), served by the same WebHare as the data
export function resolveImageUrl(link: string | null): string | null {
  return link ? new URL(link, DATA_URL).href : null;
}

export const WHATSAPP_NUMBER = "31630415725";
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}?text=`;
