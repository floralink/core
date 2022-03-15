// load JSON databases into objects (dataStorage)
var dataStorage = {};

export async function initializeDatabase(database, credentials = {}) {
  switch (database.sourceType) {
    case "api": // API
      database.initialize(credentials);
      console.log(`INFO: Plugin '${database.id}' successfully initialized.`);
      break;
    case "local":
      dataStorage[database.id] = database.data;
      console.log(`INFO: Plugin '${database.id}' successfully initialized.`);
      break;
    default:
      console.log(
        `INFO: Plugin '${database.id}' could't be initialized, because data type (${database.id}) is not specified or unknown.`
      );
  }
}

export async function getOccurrenceData(provider, query) {
  let rawData = await provider.getRawData(query);
  return provider.convertToOccurrenceData(rawData);
}

export function getTaxonDataByIDs(taxonIDs, pluginID) {
  if (!dataStorage[pluginID]) {
    throw `Taxon data plugin (${pluginID}) is not initialized!`;
  }

  let taxa = {};

  // populate taxa for each taxonID
  taxonIDs.forEach((taxonID) => {
    let taxonSpecificData = dataStorage[pluginID][taxonID];
    if (taxonSpecificData) taxa[taxonID] = taxonSpecificData;
  });

  return {
    pluginID: pluginID,
    taxa: taxa,
  };
}
