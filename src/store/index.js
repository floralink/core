// load JSON databases into objects (dataStorage)
var dataStorage = {};

export async function initializePlugin(plugin, credentials = {}) {
  // todo: generalize, switch by local or API database
  switch (plugin.sourceType) {
    case "api": // API
      plugin.initialize(credentials);
      console.log(`INFO: Plugin '${plugin.name}' successfully initialized.`);
      break;
    case "local":
      dataStorage[plugin.name] = plugin.getDatabase();
      console.log(`INFO: Plugin '${plugin.name}' successfully initialized.`);
      break;
    default:
      console.log(
        `INFO: Plugin '${plugin.name}' could't be initialized, because data type (${plugin.sourceType}) is not specified or unknown.`
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
