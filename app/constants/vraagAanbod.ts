export type VraagAanbodType = "vraag" | "aanbod";

export interface VraagAanbodItem {
  id: string;
  type: VraagAanbodType;
  title: string;
  description: string;
  author: string;
  organization: string;
  email: string;
  date: string;
  image?: string;
}

export const vraagAanbodItems: VraagAanbodItem[] = [
  {
    id: "1",
    type: "aanbod",
    title: "6 persoons vergadertafel met stoelen",
    description: "Ik hen een tafel over heeft iemand er belang bij?",
    author: "Chris Hudepohl",
    organization: "Spinnerij",
    email: "chris@spinnerijoosterveld.nl",
    date: "5 feb.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    type: "vraag",
    title: "Beamer nodig voor presentatie",
    description: "Heeft iemand een beamer die ik volgende week woensdag mag lenen voor een klantpresentatie?",
    author: "Lisa de Vries",
    organization: "Artvision",
    email: "lisa@artvision.nl",
    date: "3 feb.",
  },
  {
    id: "3",
    type: "aanbod",
    title: "Bureaustoelen (4 stuks)",
    description: "We hebben 4 bureaustoelen over na onze verbouwing. In goede staat, gratis op te halen.",
    author: "Mark Jansen",
    organization: "Brite",
    email: "mark@brite.nl",
    date: "1 feb.",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=400&fit=crop",
  },
];
