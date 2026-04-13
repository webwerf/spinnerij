export interface Ruimte {
  id: string;
  name: string;
  subtitle: string;
  capacity: number;
  description: string;
  image: string;
}

export const ruimtes: Ruimte[] = [
  {
    id: "1",
    name: "Ruimte 1.19",
    subtitle: "Textielkamer",
    capacity: 40,
    description: "Industriele ruimte met 8 vergadertafels en 20 paarse stoelen. Digischerm en flipover aanwezig. Theateropstelling met max. 40 stoelen mogelijk.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Ruimte 1.18",
    subtitle: "Spoelkamer",
    capacity: 12,
    description: "Intieme vergaderruimte met een grote ovale tafel voor 12 personen. Whiteboard en beamer aanwezig. Ideaal voor workshops en brainstorms.",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Ruimte 0.10",
    subtitle: "Spinzaal",
    capacity: 80,
    description: "De grootste ruimte van De Spinnerij. Geschikt voor grotere evenementen, lezingen en netwerkbijeenkomsten. Eigen ingang en bar aanwezig.",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&h=400&fit=crop",
  },
];
