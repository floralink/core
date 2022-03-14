// todo: generalize hierarchy switch function, here occurrence -> taxon
// add optional array of IDs for filtering
export function convertToTaxonOccurrenceData(occurrenceData) {
  let taxonData = {};
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
