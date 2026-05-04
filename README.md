# @floralink/core

![Floralink Core](logo.png)

**A small library for working with plant occurrence data, taxon specific data and taxon reference data.**

It consists of methods for calculating statistics for a set of taxa, taxon traits, occurrences or taxa in occurrences
as well as utilities for defining plugins, transforming data formats and working with dates among others.
Currently only supports local JSON databases for taxa or traits and API connectors for occurrences. Documentation is limited.

## Setup

### Install

```sh
npm install @floralink/core
```

### Import

```typescript
import * as floralink from "@floralink/core";
```

## Plugins

To get the scales of measure of properties in a group or all groups of a traits plugin,
you can use one of the following methods respectively:

```ts
function getGroupScalesOfMeasure(group: TraitsJsonGroup): ScaleOfMeasure[];
function getPluginScalesOfMeasure(plugin: SourcePlugin): ScaleOfMeasure[];

type ScaleOfMeasure = "nominal" | "ordinal" | "interval";
```

## Queries

### Taxon - `resolveTaxon`

```ts
function resolveTaxon(
  data: IdentifierIndexedObject<Taxon>,
  taxonID: string,
  path?: string[],
): Taxon;
```

Resolve potential synonyms of a taxonID defined in data and return `Taxon` object. Returns the resolved taxon's data.

### Outer taxon hierarchy - `getOuterTaxonHierarchy`

```ts
function getOuterTaxonHierarchy(
  data: IdentifierIndexedObject<Taxon>,
  taxonID: string,
): Taxon[];
```

### Traits - `getTraitsByTaxonIDs`

```ts
function getTraitsByTaxonIDs<T>(
  data: IdentifierIndexedObject<T>,
  ids: string[],
): IdentifierIndexedObject<T>;
```

### Occurrences - `queryAPI`

```ts
function queryAPI(
  group: ApiGroup,
  query: OccurrenceQuery,
  options?: ApiOptions,
): Promise<Occurrence[]>;
```

## Transformations

### `convertToTaxonOccurrenceIDs`

```ts
function convertToTaxonOccurrenceIDs(
  occurrences: Occurrence[],
): TaxonIndexedObject<string[]>;
```

Convert an object of occurrence data indexed by occurrence IDs to a new object where each key is a taxon ID and each value is an object with an "occurrenceIDs" property containing an array of occurrence IDs from the original object.

### `getTaxonIDsFromOccurrences`

```ts
function getTaxonIDsFromOccurrences(occurrences: Occurrence[]): string[];
```

Returns a deduplicated list of taxon IDs referenced in the given array of occurrences.

## Statistics

### `getOccurrencesStatistics`

```ts
function getOccurrencesStatistics(
  occurrences: Occurrence[],
): QueryOccurrencesStatistics;
```

Calculate and return statistics based on the given array of occurrences
including total occurrences count, unique taxa count, extreme dates, and yearly frequencies.

### `getTaxaStatistics`

```ts
function getTaxaStatistics(taxa: Taxon[]): TaxaStatistics;
```

### `getTaxonOccurrencesStatistics`

```ts
function getTaxonOccurrencesStatistics(
  taxonOccurrenceIDs: TaxonIndexedObject<string[]>,
  occurrencesData: OccurrenceIndexedObject<Occurrence>,
): TaxonIndexedObject<QueryOccurrencesStatistics>;
```

### `getTraitsStatistics`

```ts
function getTraitsStatistics(
  traitsGroup: TraitsJsonGroup,
  data: TaxonIndexedObject<Traits>,
  taxonIDs: string[],
  filterIDs?: string[],
): TraitsStatistics;
```

## Date utilities

### `getDateStringFromISO`

```ts
function getGermanDateStringFromISO(
  isoDate: string,
  localeCode?: string,
): string;
```

Helps to display an ISO date with time in a German locale.

### `getDateStringFromVagueDate`

```ts
function getDateStringFromVagueDate(
  vagueDate: VagueDate,
  localeCode?: string,
): string;
```

Helps to display a `VagueDate` localized.

`VagueDate` is a type specific to the NetPhyD API.
It allows to define resolution of data and date ranges where the actual data lies within.

### `getYearStringFromVagueDate`

```ts
function getYearStringFromVagueDate(vagueDate: VagueDate): string;
```

Takes in a `VagueDate` and returns

- the year as a string if start and end year are the same
- or a German year range like `"von 2010 bis 2019"`.

## Defining plugins

You can use define functions to declare or export a typed object in a type-safe way.

- `defineGeneratorConfig`
- `defineGroup`
- `defineJsonGroup`
- `definePlugin`
- `defineProperty`
- `defineTaxaJsonGroup`
- `defineTraitsJsonGroup`

```ts
import { definePlugin } from "@floralink/web";

export default definePlugin({
  id: "germansl",
  version: "1.5.6",
  title: "GermanSL",
  sourceType: "json",
  description: "Die GermanSL ist eine taxonomische Referenzdatenbank ...",
  license: {
    spdx: "CC-BY-4.0",
    title: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/deed.de",
  },
  homepage: "https://germansl.infinitenature.org/",
  taxonReference: true,
  // ...
});
```

### Regions

In a traits group of a plugin you can specify the region this data applies to on the `meta.region` key with a `Describable` object. This library exports some regions for reusal.

```ts
import { de } from "@floralink/core";

// {
//   title: "Deutschland",
//   short: "DE",
// }
```
