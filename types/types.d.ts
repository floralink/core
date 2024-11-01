type StringIndexedObject<T = any> = { [id: string]: T };

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

type IndexedOccurrences = StringIndexedObject<Occurrence>;
type TaxonOccurrenceIDs = StringIndexedObject<string[]>;

type IndexedOccurrenceQueryResults = IndexedObject<{ occurrenceIDs: string[] }>;
