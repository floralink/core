// Plugin type guards
// -------------------------------------------------------

import type {
	ApiGroup,
	JsonGroup,
	OccurrencesApiGroup,
	TaxaJsonGroup,
	TraitsJsonGroup,
} from "./types/groups.js";
import type {
	ApiSourcePlugin,
	JsonSourcePlugin,
	SourcePlugin,
} from "./types/plugins.js";
import type { ScaleOfMeasure } from "./types/property.js";

export function isSourcePlugin(plugin: SourcePlugin): plugin is SourcePlugin {
	return Object.hasOwn(plugin, "groups");
}

export function sourcePluginIsJsonSourcePlugin(
	plugin: SourcePlugin,
): plugin is JsonSourcePlugin {
	return plugin.sourceType === "json";
}

export function sourcePluginIsApiSourcePlugin(
	plugin: SourcePlugin,
): plugin is ApiSourcePlugin {
	return plugin.sourceType === "api";
}

// Group type guards
// -------------------------------------------------------

export function groupIsTaxaJsonGroup(group: JsonGroup): group is TaxaJsonGroup {
	return group.type === "taxa";
}

export function groupIsTraitsJsonGroup(
	group: JsonGroup,
): group is TraitsJsonGroup {
	return group.type === "traits";
}

export function groupIsOccurrencesApiGroup(
	group: ApiGroup,
): group is OccurrencesApiGroup {
	return group.type === "occurrences";
}

// Trait helpers
// -------------------------------------------------------

export function getPluginScalesOfMeasure(
	plugin: SourcePlugin,
): ScaleOfMeasure[] {
	const scales: ScaleOfMeasure[] = [];

	if (sourcePluginIsJsonSourcePlugin(plugin)) {
		plugin.groups?.forEach((group) => {
			if (groupIsTraitsJsonGroup(group)) {
				getGroupScalesOfMeasure(group).forEach((scale) => {
					if (!scales.includes(scale)) scales.push(scale);
				});
			}
		});
	}

	return scales;
}

export function getGroupScalesOfMeasure(
	group: TraitsJsonGroup,
): ScaleOfMeasure[] {
	const scales: ScaleOfMeasure[] = [];
	if (group.properties) {
		Object.values(group.properties).forEach((property) => {
			if (property.scaleOfMeasure && !scales.includes(property.scaleOfMeasure))
				scales.push(property.scaleOfMeasure);
		});
	}
	return scales;
}
