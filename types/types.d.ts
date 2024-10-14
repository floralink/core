type IndexedObject<T = any> = { [index: string]: T };

interface VagueDate {
  from: string;
  to: string;
  type:
    | "DAY"
    | "DAYS"
    | "MONTH_IN_YEAR"
    | "YEAR"
    | "TO_YEAR"
    | "FROM_YEAR"
    | "YEARS";
}

interface Occurrence {
  taxonID: string;
  date: VagueDate;
}

type IndexedOccurrences = IndexedObject<Occurrence>;
type TaxonOccurrenceData = IndexedObject<{ occurrenceIDs: string[] }>;
