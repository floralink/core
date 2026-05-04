import type { Primitive, TaxonIndexedObject, Traits } from "../types/data.js";
import type { Filter, TraitsJsonGroup } from "../types/groups.js";
import type { TraitsStatistics } from "../types/statistics.js";
import { getPropertyStatistics } from "./property.js";

export function getTraitsStatistics(
	traitsGroup: TraitsJsonGroup,
	data: TaxonIndexedObject<Traits>,
	taxonIDs: string[],
	filterIDs: string[] = [],
): TraitsStatistics {
	const traitsStatistics: TraitsStatistics = {};
	const filteredTaxaPropertyValues: Record<string, Primitive[]> = {};

	// Shortcut
	const properties = traitsGroup.properties;

	// Initialize empty values array for each property
	Object.keys(properties).forEach((propertyKey) => {
		filteredTaxaPropertyValues[propertyKey] = [];
	});

	// Iterate through taxa and populate filteredTaxaPropertyValues
	taxonIDs.forEach((taxonID) => {
		const taxonTraits = data[taxonID]; /// traits[traitsData.traitsPluginID];
		if (
			taxonTraits !== undefined &&
			useTaxon(taxonTraits, traitsGroup.statisticsFilters || [], filterIDs)
		) {
			Object.keys(properties).forEach((propertyKey) => {
				if (Object.hasOwn(taxonTraits, propertyKey)) {
					const value = taxonTraits[propertyKey];
					const values = Array.isArray(value) ? value : [value];
					filteredTaxaPropertyValues[propertyKey].push(...values);
				}
			});
		}
	});

	Object.keys(properties).forEach((propertyKey) => {
		if (filteredTaxaPropertyValues[propertyKey].length > 1) {
			traitsStatistics[propertyKey] = getPropertyStatistics(
				properties[propertyKey],
				filteredTaxaPropertyValues[propertyKey],
			);
		}
	});

	return traitsStatistics;
}

/**
 * Check if a taxon is supposed to be filtered based on selected or default filters defined in the group.
 *
 * @param traits This taxon's traits data
 * @param filters Definition of filters that must or can be applied
 * @param filterIDs An array of IDs (specified in `filters`) of non-default filters to be applied.
 */
function useTaxon(traits: Traits, filters: Filter[], filterIDs: string[]) {
	return (
		!filters?.length ||
		filters.every((filter) => {
			if (filter.default || filterIDs.includes(filter.id)) {
				const valueToCheck = traits[filter.filterKey];

				if (matches(valueToCheck, filter.filterValue) === filter.match) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		})
	);
}

function matches(maybeArray: Primitive | Primitive[], singleValue: Primitive) {
	// Array of values
	if (Array.isArray(maybeArray)) return maybeArray.includes(singleValue);
	// Single value
	else return maybeArray === singleValue;
}
