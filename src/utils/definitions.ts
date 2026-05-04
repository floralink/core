import type { GeneratorConfig } from "../types/generate.js";
import type {
	Group,
	GroupType,
	JsonGroup,
	TaxaJsonGroup,
	TraitsJsonGroup,
} from "../types/groups.js";
import type { SourcePlugin } from "../types/plugins.js";
import type { Property } from "../types/property.js";

/**
 * Helper method to get a plugin with type safety
 * @param plugin - The plugin.
 * @returns The plugin, typed.
 */
export function definePlugin(plugin: SourcePlugin): SourcePlugin {
	return plugin;
}

/**
 * Helper method to get a group with type safety
 * @param group - The group.
 * @returns The group, typed.
 */
export function defineGroup(group: Group): Group {
	return group;
}

/**
 * Helper method to get a JSON group with type safety
 * @param group - The JSON group.
 * @returns The JSON group, typed.
 */
export function defineJsonGroup(group: JsonGroup): JsonGroup {
	return group;
}

/**
 * Helper method to get a JSON group with type safety
 * @param group - The JSON group.
 * @returns The JSON group, typed.
 */
export function defineTraitsJsonGroup(group: TraitsJsonGroup): TraitsJsonGroup {
	return group;
}

/**
 * Helper method to get a JSON group with type safety
 * @param group - The JSON group.
 * @returns The JSON group, typed.
 */
export function defineTaxaJsonGroup(group: TaxaJsonGroup): TaxaJsonGroup {
	return group;
}

/**
 * Helper method to get a property with type safety
 * @param property - The property.
 * @returns The property, typed.
 */
export function defineProperty(property: Property): Property {
	return property;
}

/**
 * Helper method to get a generator config with type safety
 * @param config - The generator config.
 * @returns The generator config, typed.
 */
export function defineGeneratorConfig<T extends GroupType>(
	config: GeneratorConfig<T>,
) {
	return config;
}
