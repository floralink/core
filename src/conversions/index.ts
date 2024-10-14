/**
 * Convert an object of occurrence data indexed by occurrence IDs to a new object
 * where each key is a taxon ID and each value is an object with an "occurrenceIDs"
 * property containing an array of occurrence IDs from the original object.
 *
 * @param {IndexedOccurrences} occurrenceData Object of occurrence data with
 * occurrence IDs as keys.
 * @return {TaxonOccurrenceData} Object with taxon IDs as keys and objects with
 * occurrence IDs as values.
 */
export function convertToTaxonOccurrenceData(
  occurrenceData: IndexedOccurrences
): TaxonOccurrenceData {
  let taxonData: TaxonOccurrenceData = {};
  Object.entries(occurrenceData).forEach(([occurrenceID, occurrence]) => {
    if (taxonData[occurrence.taxonID] !== undefined) {
      taxonData[occurrence.taxonID].occurrenceIDs.push(occurrenceID);
    } else {
      taxonData[occurrence.taxonID] = {
        occurrenceIDs: [occurrenceID],
      };
    }
  });
  return taxonData;
}
