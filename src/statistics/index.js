import { calculateStatistics, getMinMaxDate } from "./mathHelpers.js";

export function getOccurrenceStatistics(occurrences) {
  const occurrenceDates = Object.values(occurrences).reduce((prev, curr) => {
    return [...prev, curr.date];
  }, []);

  let taxonIDs = Object.values(occurrences).map(
    (occurrence) => occurrence.taxonID
  );
  let uniqueTaxaCount = taxonIDs.filter(
    (value, index, self) => self.indexOf(value) === index
  ).length;

  return {
    total: Object.keys(occurrences).length,
    uniqueTaxaCount,
    ...getMinMaxDate(occurrenceDates),
  };
}

export function getTaxonOccurrenceStatistics(taxa, occurrences) {
  let taxaStatistics = {};

  Object.keys(taxa).forEach((taxonID) => {
    let taxonOccurrenceDates = [];
    taxa[taxonID].occurrenceIDs.forEach((occurrenceID) => {
      taxonOccurrenceDates.push(occurrences[occurrenceID].date);
    });
    taxaStatistics[taxonID] = { ...getMinMaxDate(taxonOccurrenceDates) };
  });

  return taxaStatistics;
}

// currently ellenberg hardcoded
export function getTaxonSpecificStatistics(
  taxonSpecificPlugin,
  taxonSpecificData,
  filters = []
) {
  let propertiesStatistics = {};

  // initialize propertyStatistics for each property
  Object.keys(taxonSpecificPlugin.properties).forEach((propertyKey) => {
    propertiesStatistics[propertyKey] = {
      // TODO: move values into statistics and make statistics the object (wihout property definition)
      ...taxonSpecificPlugin.properties[propertyKey],
      values: [],
      statistics: {},
    };
  });

  // iterate through taxa and populate values
  Object.keys(taxonSpecificData.taxa).forEach((taxonID) => {
    // check if defined and filter (Samenpflanzen und keine Hydrophyten)
    let taxonSpecific = taxonSpecificData.taxa[taxonID]; /// taxonSpecific[taxonSpecificData.taxonSpecificPluginID];

    // iterate through properties and push filtered taxa values
    if (taxonSpecific !== undefined) {
      if (useTaxon(taxonSpecific, taxonSpecificPlugin.filters, filters)) {
        Object.keys(propertiesStatistics).forEach((propertyKey) => {
          if (
            Object.prototype.hasOwnProperty.call(taxonSpecific, propertyKey)
          ) {
            propertiesStatistics[propertyKey].values.push(
              taxonSpecific[propertyKey]
            );
          }
        });
      }
    }
  });

  // calculate statistics for each property
  // todo: scaleOfMeasure-aware statistics
  Object.values(propertiesStatistics).forEach((property) => {
    if (property.values.length > 1) {
      property.statistics = calculateStatistics(property);
    }
  });

  return propertiesStatistics;
}

// check if taxon is supposed to be filtered for statistics
function useTaxon(taxonSpecific, filterConfig, filters) {
  let use;
  if (filterConfig) {
    use = Object.entries(filterConfig).every(([filterID, filter]) => {
      if (filter.default || filters.includes(filterID)) {
        let isMatching =
          taxonSpecific[filter.filterKey] === filter.filterValue ||
          (Array.isArray(taxonSpecific[filter.filterKey]) &&
            taxonSpecific[filter.filterKey].includes(filter.filterValue));

        if (isMatching === filter.onlyMatching) {
          return true;
        } else {
          return false;
        }
      }
    });
  } else {
    use = true;
  }
  return use;
}
