import type { LocalizedText } from "@/types/event";

/**
 * MONTHLY Orthodox Tewahedo commemorations.
 *
 * Many saints and mysteries are commemorated on the **same day-of-month each
 * Ethiopian month**. We store the **day of month** (source of truth); the
 * Gregorian date of each of the 12 yearly occurrences is recomputed.
 *
 * This list is a **well-established subset** and is **extensible**. Usage
 * varies by parish; confirm against the Synaxarium (Senkessar) and an
 * ecclesiastical source (see docs/ORTHODOX_RITES.md).
 *
 * **Several commemorations may share the same day-of-month** (e.g. day 5:
 * Gebre Menfes Kidus AND Peter-and-Paul): each entry produces its own
 * occurrences with a distinct UID. Entries follow the practice where the
 * monthly commemoration falls on the same day-of-month as the saint's major
 * annual feast.
 *
 * Note: commemorations are generated only for **months 1 to 12** (30 days);
 * Pagumē (month 13) is ignored.
 */
export type MonthlyCommemoration = {
  /** Stable slug (UID base). */
  id: string;
  /** Day of the Ethiopian month (1..30). */
  day: number;
  title: LocalizedText;
  description?: Partial<LocalizedText>;
};

export const MONTHLY_COMMEMORATIONS: MonthlyCommemoration[] = [
  {
    id: "lideta-mariam",
    day: 1,
    title: { fr: "Lideta (Nativité de Marie)", en: "Lideta (Nativity of Mary)", am: "ልደታ ለማርያም" },
  },
  {
    id: "raguel",
    day: 1,
    title: { fr: "Saint Raguel (Ragu'el)", en: "Archangel Raguel", am: "ራጉኤል" },
  },
  {
    id: "beata",
    day: 3,
    title: { fr: "Be'ata (Présentation de Marie au Temple)", en: "Be'ata (Presentation of Mary)", am: "በዓታ" },
  },
  {
    id: "gebre-menfes-kidus",
    day: 5,
    title: { fr: "Gebre Menfes Kidus (Abbo)", en: "Gebre Menfes Kidus (Abbo)", am: "ገብረ መንፈስ ቅዱስ" },
  },
  {
    id: "petros-pawlos",
    day: 5,
    title: { fr: "Pierre et Paul (Petros wä-Pawlos)", en: "Peter and Paul", am: "ጴጥሮስ ወጳውሎስ" },
  },
  {
    id: "qusquam",
    day: 6,
    title: { fr: "Qusquam (Notre-Dame de Qusquam)", en: "Qusquam (Our Lady of Qusquam)", am: "ቁስቋም" },
  },
  {
    id: "selassie",
    day: 7,
    title: { fr: "Sainte Trinité (Selassie)", en: "Holy Trinity (Selassie)", am: "ሥላሴ" },
  },
  {
    id: "arbaetu-ensesa",
    day: 8,
    title: { fr: "Arba'etu Ensesa (Quatre Vivants)", en: "Arba'etu Ensesa (Four Living Creatures)", am: "አርባዕቱ እንስሳ" },
  },
  {
    id: "meskel-monthly",
    day: 10,
    title: { fr: "Meskel (commémoration mensuelle de la Croix)", en: "Meskel (monthly Cross commemoration)", am: "መስቀል" },
  },
  {
    id: "mikael",
    day: 12,
    title: { fr: "Saint Michel (Mikael)", en: "Archangel Michael (Mikael)", am: "ቅዱስ ሚካኤል" },
  },
  {
    id: "aregawi",
    day: 14,
    title: { fr: "Abune Aregawi", en: "Abune Aregawi", am: "አቡነ አረጋዊ" },
  },
  {
    id: "kirkos",
    day: 15,
    title: { fr: "Saint Cyriaque (Kirkos)", en: "St Cyriacus (Kirkos)", am: "ቅዱስ ቂርቆስ" },
  },
  {
    id: "kidane-mihret",
    day: 16,
    title: { fr: "Kidane Mihret (Alliance de Miséricorde)", en: "Kidane Mihret (Covenant of Mercy)", am: "ኪዳነ ምሕረት" },
  },
  {
    id: "estifanos",
    day: 17,
    title: { fr: "Saint Étienne (Estifanos)", en: "St Stephen (Estifanos)", am: "ቅዱስ እስጢፋኖስ" },
  },
  {
    id: "gabriel",
    day: 19,
    title: { fr: "Saint Gabriel", en: "Archangel Gabriel", am: "ቅዱስ ገብርኤል" },
  },
  {
    id: "mariam",
    day: 21,
    title: { fr: "Sainte Marie (Mariam)", en: "St Mary (Mariam)", am: "ቅድስት ማርያም" },
  },
  {
    id: "uriel",
    day: 22,
    title: { fr: "Saint Uriel (Uraël)", en: "Archangel Uriel", am: "ቅዱስ ዑራኤል" },
  },
  {
    id: "giyorgis",
    day: 23,
    title: { fr: "Saint Georges (Giyorgis)", en: "St George (Giyorgis)", am: "ቅዱስ ጊዮርጊስ" },
  },
  {
    id: "tekle-haymanot",
    day: 24,
    title: { fr: "Abune Tekle Haymanot", en: "Abune Tekle Haymanot", am: "ተክለ ሃይማኖት" },
  },
  {
    id: "merkorios",
    day: 25,
    title: { fr: "Saint Mercure (Merkorios)", en: "St Mercurius (Merkorios)", am: "ቅዱስ መርቆሬዎስ" },
  },
  {
    id: "medhane-alem",
    day: 27,
    title: { fr: "Medhane Alem (Sauveur du Monde)", en: "Medhane Alem (Saviour of the World)", am: "መድኃኔ ዓለም" },
  },
  {
    id: "amanuel",
    day: 28,
    title: { fr: "Amanuel (Emmanuel)", en: "Amanuel (Emmanuel)", am: "አማኑኤል" },
  },
  {
    id: "lidet-baale-wold",
    day: 29,
    title: { fr: "Lidet (commémoration mensuelle de la Nativité)", en: "Lidet (monthly Nativity commemoration)", am: "ልደት" },
  },
  {
    id: "marqos",
    day: 30,
    title: { fr: "Saint Marc l'Évangéliste (Marqos)", en: "St Mark the Evangelist", am: "ማርቆስ ወንጌላዊ" },
  },
];
