// InfoComm 2025 exhibitor data — merged from Apify scrape + curated majors
// Zone mapping: C5-C6→C1, C7(0-799)→C2, C7800+/C8(0-699)→C3, C8700+/C9/C10→C4,
//   C4xxx→C4.1, N1-N5→N1, N6→N2, N7→N3, N8-N9→N4

function boothToZone(booth) {
  const m = booth.match(/^([CN])(\d+)/);
  if (!m) return "C1";
  const [, hall, numStr] = m;
  const num = parseInt(numStr, 10);
  if (hall === "C") {
    if (num < 5000) return "C4.1";          // C4xxx and below
    if (num < 7000) return "C1";            // C5xxx–C6xxx
    if (num < 7800) return "C2";            // C7000–C7799
    if (num < 8700) return "C3";            // C7800–C8699
    return "C4";                            // C8700+, C9xxx, C10xxx
  }
  // North hall
  if (num < 600) return "N1";               // N1xx–N5xx (Audio Demo Rooms)
  if (num < 7000) return "N2";              // N6xxx
  if (num < 8000) return "N3";              // N7xxx
  return "N4";                              // N8xxx–N9xxx
}

export const BOOTHS = [
  // ── Apify-scraped exhibitors (20) ─────────────────────────────────────
  { id: "absen",       name: "Absen Inc.",                    booth: "C7236",  zone: boothToZone("C7236"),  category: "Video",             width: 60, height: 50, area: 3000, website: null },
  { id: "1sound",      name: "1 SOUND",                      booth: "N108",   zone: boothToZone("N108"),   category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "1sound-2",    name: "1 SOUND",                      booth: "N6553",  zone: boothToZone("N6553"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "acemic",      name: "ACEMIC",                       booth: "N6317",  zone: boothToZone("N6317"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "22miles",     name: "22MILES",                       booth: "C5753",  zone: boothToZone("C5753"),  category: "Digital Signage",   width: null, height: null, area: null, website: null },
  { id: "ac-americas", name: "A.C. Americas",                 booth: "N7745",  zone: boothToZone("N7745"),  category: "Lighting",          width: null, height: null, area: null, website: null },
  { id: "ac-americas-2", name: "A.C. Americas",               booth: "N7845",  zone: boothToZone("N7845"),  category: "Lighting",          width: null, height: null, area: null, website: null },
  { id: "7thsense",    name: "7thSense",                     booth: "N7556",  zone: boothToZone("N7556"),  category: "Control",           width: null, height: null, area: null, website: null },
  { id: "4thewall",    name: "4TheWall",                     booth: "C5057",  zone: boothToZone("C5057"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "adaptive",    name: "Adaptive Technologies Group",  booth: "N6263",  zone: boothToZone("N6263"),  category: "Mounting",          width: null, height: null, area: null, website: null },
  { id: "acoustical",  name: "Acoustical Fulfillment",       booth: "C9718",  zone: boothToZone("C9718"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "adtechno",    name: "ADTECHNO Inc.",                booth: "C6808",  zone: boothToZone("C6808"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "adi",         name: "ADI",                          booth: "C8537",  zone: boothToZone("C8537"),  category: "Infrastructure",    width: null, height: null, area: null, website: null },
  { id: "act-ent",     name: "ACT Entertainment",            booth: "N6813",  zone: boothToZone("N6813"),  category: "Lighting",          width: null, height: null, area: null, website: null },
  { id: "adder",       name: "Adder Technology",             booth: "C5449",  zone: boothToZone("C5449"),  category: "Infrastructure",    width: null, height: null, area: null, website: null },
  { id: "adj",         name: "ADJ",                          booth: "N119",   zone: boothToZone("N119"),   category: "Lighting",          width: null, height: null, area: null, website: null },
  { id: "adj-2",       name: "ADJ",                          booth: "N6105",  zone: boothToZone("N6105"),  category: "Lighting",          width: null, height: null, area: null, website: null },
  { id: "abccabls",    name: "ABCCABLS",                     booth: "C5467",  zone: boothToZone("C5467"),  category: "Cable",             width: null, height: null, area: null, website: null },
  { id: "advantech",   name: "ADVANTECH",                    booth: "C6422",  zone: boothToZone("C6422"),  category: "Security",          width: null, height: null, area: null, website: null },
  { id: "adv-mounting",name: "Advanced Mounting & Design",   booth: "N7017",  zone: boothToZone("N7017"),  category: "Mounting",          width: null, height: null, area: null, website: null },
  { id: "and-devices", name: "Advanced Network Devices",     booth: "N8357",  zone: boothToZone("N8357"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "adamson",     name: "Adamson",                      booth: "N203",   zone: boothToZone("N203"),   category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "adamson-2",   name: "Adamson",                      booth: "N6445",  zone: boothToZone("N6445"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "amt",         name: "Advanced Media Technologies",  booth: "C7623",  zone: boothToZone("C7623"),  category: "Infrastructure",    width: null, height: null, area: null, website: null },

  // ── Curated major exhibitors (not in scrape) ──────────────────────────
  { id: "crestron",    name: "Crestron",                     booth: "C7300",  zone: boothToZone("C7300"),  category: "Control",           width: null, height: null, area: null, website: null },
  { id: "qsys",        name: "Q-SYS",                        booth: "C8737",  zone: boothToZone("C8737"),  category: "Control",           width: null, height: null, area: null, website: null },
  { id: "harman",      name: "HARMAN",                       booth: "C8024",  zone: boothToZone("C8024"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "sony",        name: "Sony Electronics",             booth: "C8901",  zone: boothToZone("C8901"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "biamp",       name: "Biamp",                        booth: "C7822",  zone: boothToZone("C7822"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "lg",          name: "LG Electronics",               booth: "C7836",  zone: boothToZone("C7836"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "christie",    name: "Christie",                     booth: "N6805",  zone: boothToZone("N6805"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "almo",        name: "Almo Pro AV",                  booth: "C7636",  zone: boothToZone("C7636"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "aurora",      name: "Aurora Multimedia",            booth: "C7529",  zone: boothToZone("C7529"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "aver",        name: "AVer Information",             booth: "C9078",  zone: boothToZone("C9078"),  category: "UC",                width: null, height: null, area: null, website: null },
  { id: "freeaxez",    name: "FreeAxez",                     booth: "C9329",  zone: boothToZone("C9329"),  category: "Mounting",          width: null, height: null, area: null, website: null },
  { id: "froggys",     name: "Froggys Fog",                  booth: "N8945",  zone: boothToZone("N8945"),  category: "Lighting",          width: null, height: null, area: null, website: null },
  { id: "gude",        name: "GUDE Systems USA",             booth: "C1706",  zone: boothToZone("C1706"),  category: "Control",           width: null, height: null, area: null, website: null },
  { id: "inogeni",     name: "INOGENI",                      booth: "C7153",  zone: boothToZone("C7153"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "ivs",         name: "Intelligent Video Solutions",  booth: "C7625",  zone: boothToZone("C7625"),  category: "Software",          width: null, height: null, area: null, website: null },
  { id: "cti",         name: "CTI",                          booth: "C10701", zone: boothToZone("C10701"), category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "av-stumpfl",  name: "AV Stumpfl",                   booth: "N7123",  zone: boothToZone("N7123"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "shure",       name: "Shure",                        booth: "C9018",  zone: boothToZone("C9018"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "samsung",     name: "Samsung",                      booth: "N6553",  zone: boothToZone("N6553"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "barco",       name: "Barco",                        booth: "C8505",  zone: boothToZone("C8505"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "epson",       name: "Epson",                        booth: "N7025",  zone: boothToZone("N7025"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "panasonic",   name: "Panasonic Connect",            booth: "C8105",  zone: boothToZone("C8105"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "nec",         name: "NEC Display",                  booth: "N6445",  zone: boothToZone("N6445"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "extron",      name: "Extron",                       booth: "C8525",  zone: boothToZone("C8525"),  category: "Control",           width: null, height: null, area: null, website: null },
  { id: "amx",         name: "AMX",                          booth: "C7856",  zone: boothToZone("C7856"),  category: "Control",           width: null, height: null, area: null, website: null },
  { id: "atlona",      name: "Atlona",                       booth: "N7835",  zone: boothToZone("N7835"),  category: "Networking",        width: null, height: null, area: null, website: null },
  { id: "audinate",    name: "Dante / Audinate",             booth: "C8859",  zone: boothToZone("C8859"),  category: "Networking",        width: null, height: null, area: null, website: null },
  { id: "poly",        name: "Poly (HP)",                    booth: "C7506",  zone: boothToZone("C7506"),  category: "UC",                width: null, height: null, area: null, website: null },
  { id: "logitech",    name: "Logitech",                     booth: "C8200",  zone: boothToZone("C8200"),  category: "UC",                width: null, height: null, area: null, website: null },
  { id: "jabra",       name: "Jabra",                        booth: "C9500",  zone: boothToZone("C9500"),  category: "UC",                width: null, height: null, area: null, website: null },
  { id: "sennheiser",  name: "Sennheiser",                   booth: "N7200",  zone: boothToZone("N7200"),  category: "Audio",             width: null, height: null, area: null, website: null },
  { id: "brightsign",  name: "BrightSign",                   booth: "C6200",  zone: boothToZone("C6200"),  category: "Digital Signage",   width: null, height: null, area: null, website: null },
  { id: "planar",      name: "Planar",                       booth: "C7100",  zone: boothToZone("C7100"),  category: "Video",             width: null, height: null, area: null, website: null },
  { id: "chief",       name: "Chief / Legrand",              booth: "N8100",  zone: boothToZone("N8100"),  category: "Mounting",          width: null, height: null, area: null, website: null },
  { id: "legrand",     name: "LEGRAND",                      booth: "C7968",  zone: boothToZone("C7968"),  category: "Mounting",          width: null, height: null, area: null, website: null },
  { id: "mid-atlantic",name: "Middle Atlantic",              booth: "N5500",  zone: boothToZone("N5500"),  category: "Mounting",          width: null, height: null, area: null, website: null },
];

export const CATEGORIES = [
  "Audio",
  "Cable",
  "Control",
  "Digital Signage",
  "Infrastructure",
  "Lighting",
  "Mounting",
  "Networking",
  "Security",
  "Software",
  "UC",
  "Video",
];
