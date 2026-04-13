export interface Huurder {
  id: string;
  name: string;
  description: string;
  category: string;
  room: string;
  logo: string;
  website: string;
}

export const categories = [
  "Catering",
  "Multimedia",
  "Financieel adviseur",
  "Digital signage",
  "Maatschappelijke ondersteuning",
  "IT consultancy",
  "Coaching",
  "Muziek",
  "EHBO & veiligheid",
  "Kleding & fashion",
  "Fysiotherapie",
  "Marketing & communicatie",
  "Architectuur & interieur",
  "Grafisch ontwerp",
] as const;

export const huurders: Huurder[] = [
  {
    id: "1",
    name: "Appeltjes van Oranje",
    description: "Catering",
    category: "Catering",
    room: "Ruimte Kantine",
    logo: "https://ui-avatars.com/api/?name=AO&background=F4A261&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://appeltjesvanoranje.nl",
  },
  {
    id: "2",
    name: "Artvision",
    description: "Multimedia",
    category: "Multimedia",
    room: "Ruimte 0.03A en 0.03C",
    logo: "https://ui-avatars.com/api/?name=AV&background=2D5E40&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://artvision.nl",
  },
  {
    id: "3",
    name: "Attentas Financieel Adviseurs",
    description: "Financieel adviseur",
    category: "Financieel adviseur",
    room: "Ruimte 1.03",
    logo: "https://ui-avatars.com/api/?name=AT&background=4A7C6B&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://attentas.nl",
  },
  {
    id: "4",
    name: "Blast Digital Signage",
    description: "Boost je omzet!",
    category: "Digital signage",
    room: "Ruimte 1.07",
    logo: "https://ui-avatars.com/api/?name=BD&background=C8A96E&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://blastdigitalsignage.com",
  },
  {
    id: "5",
    name: "Brickworkz",
    description: "Maatschappelijke ondersteuning",
    category: "Maatschappelijke ondersteuning",
    room: "Ruimte 1.05",
    logo: "https://ui-avatars.com/api/?name=BW&background=A0522D&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://brickworkz.nl",
  },
  {
    id: "6",
    name: "Brite",
    description: "IT consultancy",
    category: "IT consultancy",
    room: "Ruimte 1.29 t/m 1.31 en 1.20",
    logo: "https://ui-avatars.com/api/?name=BR&background=3A7A53&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://brite.nl",
  },
  {
    id: "7",
    name: "De Betekenisfabriek",
    description: "Coaching & ontwikkeling",
    category: "Coaching",
    room: "Ruimte 1.10",
    logo: "https://ui-avatars.com/api/?name=DB&background=8B7355&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://betekenisfabriek.nl",
  },
  {
    id: "8",
    name: "De Muziek Beleving",
    description: "Muziekonderwijs & evenementen",
    category: "Muziek",
    room: "Ruimte 0.08",
    logo: "https://ui-avatars.com/api/?name=MB&background=E76F51&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://demuziekbeleving.nl",
  },
  {
    id: "9",
    name: "EHBO en Zo",
    description: "EHBO-cursussen & veiligheid",
    category: "EHBO & veiligheid",
    room: "Ruimte 1.12",
    logo: "https://ui-avatars.com/api/?name=EZ&background=2A9D8F&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://ehboenzo.nl",
  },
  {
    id: "10",
    name: "Fiswear",
    description: "Kleding & fashion",
    category: "Kleding & fashion",
    room: "Ruimte 1.15",
    logo: "https://ui-avatars.com/api/?name=FW&background=264653&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://fiswear.nl",
  },
  {
    id: "11",
    name: "Fysio Spinnerij",
    description: "Fysiotherapie & beweging",
    category: "Fysiotherapie",
    room: "Ruimte 0.05",
    logo: "https://ui-avatars.com/api/?name=FS&background=2D5E40&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://fysiospinnerij.nl",
  },
  {
    id: "12",
    name: "Marktplaats Media",
    description: "Marketing & communicatie",
    category: "Marketing & communicatie",
    room: "Ruimte 2.01",
    logo: "https://ui-avatars.com/api/?name=MM&background=C8A96E&color=fff&size=128&font-size=0.4&bold=true",
    website: "https://marktplaatsmedia.nl",
  },
];
