// Base
// -------------------------------------------------------

import type { ApiGroup, Group, JsonGroup } from "./groups.js";
import type { Citations, Describable } from "./shared.js";

export interface PluginReference {
	id: string;
	version: string;
}

type SourceType = "json" | "api";

interface PluginBase<S extends SourceType>
	extends PluginReference,
		Describable {
	sourceType: S;
	homepage?: string;
	citation?: Citations;
	license?: License;
	/**
	 * Reference to the plugin which contains the used taxon reference as the first group.
	 * Set to `true` if this plugin contains its own taxon reference.
	 */
	taxonReference: PluginReference | true;
}

interface License {
	spdx?: string;
	title: string;
	url: string;
}

// Source types
// -------------------------------------------------------

export type SourcePlugin = JsonSourcePlugin | ApiSourcePlugin;

interface SourcePluginBase<S extends SourceType, G extends Group>
	extends PluginBase<S> {
	groups: G[];
}

export interface JsonSourcePlugin extends SourcePluginBase<"json", JsonGroup> {}

export interface ApiSourcePlugin extends SourcePluginBase<"api", ApiGroup> {
	/**
	 * You can specify a function that should be run before
	 * data is fetched and should return true if successful.
	 */
	setup?: () => boolean;
	login?: (credentials: Credentials) => Promise<boolean>;
}

export interface Credentials {
	user: string;
	password: string;
}
