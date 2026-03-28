export interface Huurder {
  id: string;
  name: string;
  desc: string;
  room: string;
  logo: string;
}

const LOGOS = [
  "https://ui-avatars.com/api/?name=A&background=2D5E40&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=B&background=C8A96E&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=C&background=5B8A72&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=D&background=A0522D&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=E&background=4A7C6B&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=F&background=8B7355&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=G&background=3A7A53&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=H&background=6B4226&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=I&background=2D5E40&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=J&background=C8A96E&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=K&background=5B8A72&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=L&background=A0522D&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=M&background=4A7C6B&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=N&background=8B7355&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=O&background=3A7A53&color=fff&size=128&font-size=0.5&bold=true",
  "https://ui-avatars.com/api/?name=P&background=6B4226&color=fff&size=128&font-size=0.5&bold=true",
];

export const huurders: Huurder[] = [
  { id: "1", name: "Voorbeeld Bedrijf A", desc: "Software & IT-oplossingen", room: "1.01", logo: LOGOS[0] },
  { id: "2", name: "Voorbeeld Bedrijf B", desc: "Duurzame kleding & fashion", room: "1.08", logo: LOGOS[1] },
  { id: "3", name: "Voorbeeld Bedrijf C", desc: "Fysiotherapie & beweging", room: "1.15", logo: LOGOS[2] },
  { id: "4", name: "Voorbeeld Bedrijf D", desc: "Recruitment & HR-oplossingen", room: "1.22", logo: LOGOS[3] },
  { id: "5", name: "Voorbeeld Bedrijf E", desc: "Kunst & creatief design", room: "1.30", logo: LOGOS[4] },
  { id: "6", name: "Voorbeeld Bedrijf F", desc: "Koffie & horeca", room: "0.01", logo: LOGOS[5] },
  { id: "7", name: "Voorbeeld Bedrijf G", desc: "Flexibele werkplekken", room: "1.08", logo: LOGOS[6] },
  { id: "8", name: "Voorbeeld Bedrijf H", desc: "AI & software development", room: "1.32", logo: LOGOS[7] },
  { id: "9", name: "Voorbeeld Bedrijf I", desc: "Architectuur & interieur", room: "2.01", logo: LOGOS[8] },
  { id: "10", name: "Voorbeeld Bedrijf J", desc: "Marketing & communicatie", room: "2.05", logo: LOGOS[9] },
  { id: "11", name: "Voorbeeld Bedrijf K", desc: "Accountancy & belastingadvies", room: "2.10", logo: LOGOS[10] },
  { id: "12", name: "Voorbeeld Bedrijf L", desc: "Grafisch ontwerp & branding", room: "2.15", logo: LOGOS[11] },
  { id: "13", name: "Voorbeeld Bedrijf M", desc: "Coaching & persoonlijke ontwikkeling", room: "2.20", logo: LOGOS[12] },
  { id: "14", name: "Voorbeeld Bedrijf N", desc: "Fotografie & videoproductie", room: "2.25", logo: LOGOS[13] },
  { id: "15", name: "Voorbeeld Bedrijf O", desc: "Juridisch advies & mediation", room: "3.01", logo: LOGOS[14] },
  { id: "16", name: "Voorbeeld Bedrijf P", desc: "Webdesign & online marketing", room: "3.05", logo: LOGOS[15] },
];
