export type Vehicle = {
  id: string;
  name: string;
  category: "Supercars" | "Luxury Sedans" | "Luxury SUVs" | "VIP Vans";
  year: number;
  specs: string;
  engine: string;
  transmission: string;
  day: number;
  month: number;
  seats: number;
  body: string;
  features: string[];
  photo: string;
  backdrop: string;
};

type VehicleSeed = readonly [name: string, year: number, day: number, photo: string, seats?: number];

const unsplash = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&h=675&q=85`;
const pexels = (photo: string) =>
  `https://images.pexels.com/photos/${photo}/pexels-photo-${photo}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop`;

const categoryDetails: Record<Vehicle["category"], Omit<Vehicle, "id" | "name" | "category" | "year" | "day" | "month" | "photo" | "backdrop">> = {
  Supercars: {
    specs: "GCC specification on request · Performance",
    engine: "Hybrid V6 / V8 / V12 options · model dependent",
    transmission: "Automatic · RWD / AWD, trim dependent",
    seats: 2,
    body: "Performance coupe",
    features: ["Performance specification", "Premium interior", "Concierge delivery"],
  },
  "Luxury Sedans": {
    specs: "GCC specification on request · Executive",
    engine: "Inline-6 / V8 / V12 / electric options · model dependent",
    transmission: "Automatic · drivetrain varies by trim",
    seats: 5,
    body: "Luxury sedan",
    features: ["Executive cabin", "Premium rear seating", "Chauffeur-ready"],
  },
  "Luxury SUVs": {
    specs: "GCC specification on request · Luxury",
    engine: "Turbocharged / hybrid / electric options · model dependent",
    transmission: "Automatic · AWD / 4WD, trim dependent",
    seats: 5,
    body: "Luxury SUV",
    features: ["Premium cabin", "Adaptive ride options", "UAE-wide delivery"],
  },
  "VIP Vans": {
    specs: "GCC specification on request · VIP",
    engine: "Diesel / hybrid / electric options · model dependent",
    transmission: "Automatic · drivetrain varies by trim",
    seats: 7,
    body: "VIP passenger van",
    features: ["First-class cabin options", "Flexible seating layouts", "Chauffeur-ready"],
  },
};

const createVehicles = (category: Vehicle["category"], seeds: VehicleSeed[]): Vehicle[] =>
  seeds.map(([name, year, day, photo, seats]) => {
    const details = categoryDetails[category];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `${slug}-${year}`,
      name,
      category,
      year,
      ...details,
      seats: seats ?? details.seats,
      day,
      month: day * 21,
      photo: photo.startsWith("pexels:")
        ? pexels(photo.slice("pexels:".length))
        : unsplash(photo),
      backdrop: "#e9e4dc",
    };
  });

const supercars: VehicleSeed[] = [
  ["Ferrari 296 GTB", 2025, 3300, "photo-1583121274602-3e2820c69888"],
  ["Ferrari 296 GTS", 2025, 3600, "photo-1508974239320-0a029497e820"],
  ["Ferrari SF90 Stradale", 2024, 4500, "photo-1619405399517-d7fce0f13302"],
  ["Ferrari SF90 Spider", 2024, 5000, "photo-1516298252535-cf2ac5147f9b"],
  ["Ferrari F8 Tributo", 2023, 3900, "photo-1503736334956-4c8f8e92946d"],
  ["Ferrari Roma", 2024, 2700, "photo-1532581140115-3e355d1ed1de"],
  ["Ferrari Portofino M", 2023, 2700, "photo-1573074617613-fc8ef27eaa2f"],
  ["Ferrari 812 GTS", 2023, 4800, "photo-1542362567-b07e54358753"],
  ["Lamborghini Revuelto", 2025, 5500, "photo-1628519592419-bf288f08cef5"],
  ["Lamborghini Huracan EVO", 2024, 3500, "photo-1566024164372-0281f1133aa6"],
  ["Lamborghini Huracan STO", 2023, 5000, "photo-1583427053896-00378e61e661"],
  ["Lamborghini Huracan Tecnica", 2024, 4000, "photo-1530675706010-bc677ce30ab6"],
  ["Lamborghini Aventador SVJ", 2023, 7000, "photo-1507136566006-cfc505b114fc"],
  ["Lamborghini Temerario", 2025, 4900, "photo-1579508542697-bb18e7d9aeaa"],
  ["McLaren 750S", 2025, 4600, "photo-1617814086906-d847a8bc6fca"],
  ["McLaren 720S", 2024, 4000, "photo-1625231334168-35067f8853ed"],
  ["McLaren Artura", 2024, 3300, "photo-1502161254066-6c74afbf07aa"],
  ["McLaren GT", 2023, 3000, "photo-1519245659620-e859806a8d3b"],
  ["McLaren 765LT", 2023, 6000, "photo-1617814076367-b759c7d7e738"],
  ["McLaren 600LT", 2023, 4000, "photo-1567818735868-e71b99932e29"],
  ["Porsche 911 Turbo S", 2025, 3300, "photo-1592853625601-bb9d23da12fc"],
  ["Porsche 911 GT3 RS", 2024, 5000, "photo-1592853625589-1a5bc69f9c95"],
  ["Porsche 911 Carrera GTS", 2025, 2600, "photo-1567808291548-fc3ee04dbcf0"],
  ["Porsche Taycan Turbo GT", 2025, 3100, "photo-1555215695-3004980ad54e"],
  ["Porsche 718 Cayman GT4 RS", 2024, 3300, "photo-1611651338412-8403fa6e3599"],
  ["Porsche 911 Dakar", 2024, 3200, "photo-1571607388263-1044f9ea01dd"],
  ["Aston Martin Vantage", 2024, 3000, "photo-1553440569-bcc63803a83d"],
  ["Maserati MC20", 2024, 3500, "photo-1707399720697-b1d1502fac58"],
];

const sedans: VehicleSeed[] = [
  ["Mercedes-Benz S-Class S 580", 2025, 1450, "photo-1707407772603-274cc5cf18f4"],
  ["Mercedes-AMG S-Class S 63 E Performance", 2025, 2600, "photo-1764605206511-7a649d9df63b"],
  ["Mercedes-Maybach S 580", 2025, 3000, "photo-1783124176603-6c8167d6fa7a"],
  ["Mercedes-Maybach S 680", 2024, 3800, "photo-1698816688678-a3f838fd4fe0"],
  ["Mercedes-Benz E 300", 2025, 850, "photo-1788664549222-fd52166c81b6"],
  ["Mercedes-AMG E 53", 2024, 1400, "photo-1731142582229-e0ee70302c02"],
  ["Rolls-Royce Ghost", 2024, 4800, "photo-1764089859664-30aa6919ef0b"],
  ["Rolls-Royce Phantom", 2024, 7500, "photo-1646644431825-e5171c8cba53"],
  ["Rolls-Royce Spectre", 2025, 6200, "photo-1659083934189-ebc3cfd8d4c4"],
  ["Rolls-Royce Wraith", 2023, 5000, "photo-1645664154168-750a991c9012"],
  ["Rolls-Royce Dawn", 2023, 5200, "photo-1786283593117-177ac4ec3425"],
  ["Bentley Flying Spur", 2024, 3600, "photo-1763789381108-b5622140f2e0"],
  ["Bentley Mulsanne", 2022, 4000, "photo-1660030070192-660f963400ad"],
  ["BMW 760i xDrive", 2025, 1800, "photo-1776924408077-75ff92bcb520"],
  ["BMW i7 M70", 2025, 2200, "photo-1706977384830-df8b515e6b70"],
  ["BMW 530i", 2025, 950, "photo-1767972885672-d469ccec0bd2"],
  ["BMW M5", 2025, 1900, "photo-1716066242980-c864821b1b67"],
  ["Audi A8 L", 2024, 1500, "photo-1675923759360-348b03df0d3e"],
  ["Audi RS 7 Sportback", 2024, 1900, "photo-1646283181928-59e4244eb1e8"],
  ["Lexus LS 500h", 2024, 1500, "photo-1774576319996-d27392231464"],
  ["Lexus ES 300h", 2025, 750, "photo-1669254383039-167a6f9cc49c"],
  ["Porsche Panamera GTS", 2024, 2400, "photo-1669254382128-9fdc409000d5"],
  ["Porsche Panamera Turbo E-Hybrid", 2025, 2900, "photo-1669254383015-fb0590490d05"],
  ["Genesis G90", 2024, 1450, "photo-1542906042-f41e62496963"],
  ["Maserati Quattroporte", 2023, 1800, "photo-1547731269-e4073e054f12"],
  ["Cadillac CT5-V Blackwing", 2024, 1800, "photo-1669254583989-51695d247384"],
];

const suvs: VehicleSeed[] = [
  ["Range Rover Autobiography", 2025, 2400, "photo-1779813377620-7615c9e3796c"],
  ["Range Rover SV", 2025, 4200, "photo-1758411898152-5fde4b5eef56"],
  ["Range Rover Sport", 2025, 1800, "photo-1774411679135-187f3c4b81b6"],
  ["Range Rover Sport SV", 2025, 2800, "photo-1760713164476-7eb5063b3d07"],
  ["Range Rover Velar", 2024, 1250, "photo-1759177628407-ce741877ef10"],
  ["Land Rover Defender 110", 2025, 1600, "photo-1649382801646-da9c4db0351e"],
  ["Land Rover Defender 130", 2024, 1900, "photo-1774434834038-98445d08a5d1"],
  ["Range Rover Evoque", 2024, 950, "photo-1758411898970-39925f9f6d9f"],
  ["Lamborghini Urus S", 2025, 3600, "photo-1776723210515-c7fad08ff3cd"],
  ["Lamborghini Urus Performante", 2024, 4200, "photo-1789330840425-33a17be135f8"],
  ["Mercedes-AMG G-Wagon G 63", 2025, 3200, "photo-1760552234270-4702f8e3f750"],
  ["Mercedes-Maybach GLS 600", 2025, 3500, "photo-1786467837752-2a7848ac3b61"],
  ["Mercedes-Benz GLS 580", 2025, 1900, "photo-1786283593136-2193cddce086"],
  ["Mercedes-Benz G-Wagon G 500", 2024, 2100, "photo-1759505738499-8c9b26c1b7e7"],
  ["Lexus LX 600", 2025, 1700, "photo-1774434834166-86066abd6b6c"],
  ["Lexus LX 700h", 2025, 2300, "photo-1758411898258-de9239ba0abb"],
  ["Lexus GX 550", 2025, 1450, "photo-1637859460045-ac3ae9ced99d"],
  ["Lexus RX 500h", 2025, 1250, "photo-1692106092781-94ac67c98d53"],
  ["Cadillac Escalade", 2025, 2200, "photo-1767749995462-9fe0890d5960", 7],
  ["Cadillac Escalade ESV", 2025, 2500, "photo-1767749995450-7b63ab7cd4fd", 7],
  ["Cadillac Escalade-V", 2024, 3200, "photo-1768024175254-373f5069324d", 7],
  ["Rolls-Royce Cullinan", 2025, 6800, "photo-1777244746608-80d1c21c7d76"],
  ["Rolls-Royce Cullinan Black Badge", 2024, 7800, "photo-1767749995458-b0927324e4d0"],
  ["Bentley Bentayga", 2025, 3800, "photo-1776924531760-c97bf4b9951a"],
  ["Bentley Bentayga Speed", 2024, 4500, "photo-1632487727140-4da9bb61760d"],
  ["BMW X7 M60i", 2025, 2200, "photo-1758223725140-3855ec687a16", 7],
  ["BMW XM Label", 2025, 2800, "photo-1760713170685-b67abc3be5ad"],
  ["BMW X5 M Competition", 2024, 2100, "photo-1758411898280-2dc7c95e0ba7"],
  ["Porsche Cayenne Turbo GT", 2024, 3400, "photo-1747414632749-6c8b14ba30fd"],
  ["Porsche Cayenne E-Hybrid", 2025, 1900, "photo-1768965468641-39e87aa78a9d"],
  ["Ferrari Purosangue", 2025, 6500, "photo-1758411898236-60451aa6c6c9"],
  ["Aston Martin DBX707", 2024, 3900, "photo-1784662498888-033aa7c99b68"],
  ["Audi RS Q8", 2025, 2300, "photo-1767749995473-961d1626e560"],
  ["GMC Yukon Denali Ultimate", 2025, 1600, "photo-1771989492091-dce42152f8cd", 7],
];

const vipVans: VehicleSeed[] = [
  ["Mercedes-Benz V-Class V 300", 2025, 1700, "pexels:17455633", 7],
  ["Mercedes-Benz V-Class V 250d", 2024, 1450, "pexels:17455630", 7],
  ["Mercedes-Benz V-Class V 300d", 2025, 1800, "pexels:17455624", 7],
  ["Mercedes-Benz V-Class Extra Long", 2024, 1900, "pexels:17455626", 7],
  ["Mercedes-Benz V-Class First Class", 2025, 2600, "pexels:18029638", 4],
  ["Mercedes-Benz Vito Tourer", 2024, 1050, "pexels:18930823", 8],
  ["Mercedes-Benz Sprinter VIP", 2025, 2300, "pexels:19871521", 10],
  ["Lexus LM 350h 4-Seater", 2025, 2900, "pexels:36377055", 4],
  ["Lexus LM 350h 6-Seater", 2025, 2700, "pexels:36377063", 6],
  ["Lexus LM 350h 7-Seater", 2025, 2500, "pexels:17455629", 7],
  ["Lexus LM 500h 4-Seater", 2025, 3400, "pexels:17455632", 4],
  ["Toyota Alphard Executive Lounge", 2025, 1600, "pexels:36377072", 7],
  ["Toyota Vellfire VIP", 2025, 1550, "pexels:17455625", 7],
  ["Toyota Granvia Premium", 2024, 1300, "pexels:36377060", 8],
  ["Kia Carnival VIP", 2025, 1050, "pexels:21012245", 7],
  ["Zeekr 009 Grand", 2025, 2400, "pexels:18029635", 6],
];

export const fleet: Vehicle[] = [
  ...createVehicles("Supercars", supercars),
  ...createVehicles("Luxury Sedans", sedans),
  ...createVehicles("Luxury SUVs", suvs),
  ...createVehicles("VIP Vans", vipVans),
];
