# @floralink/core

A very small library for working with plant occurrence data, taxon specific data and taxon reference data. Contains a simple store for collected data and methods for calculating statistics. A final data structure is yet to be described. This documentation will be enriched when the library has reached a stable concept.

- [@floralink/core](#floralinkcore)
  - [Setup](#setup)
  - [Methods](#methods)
    - [Data sources (Store)](#data-sources-store)
    - [Type Conversions](#type-conversions)
    - [Statistics](#statistics)

## Setup

You can install the Floralink core library with npm:

```
npm install @floralink/core
```

Then, in your project:

```javascript
import * as floralink from "@floralink/core";
```

## Methods

### Data sources (Store)

```javascript
initializePlugin(plugin, credentials);
```

```javascript
getOccurrenceData(provider, query);
```

```javascript
getTaxonDataByID(taxonIDs, pluginID);
```

```javascript
getTaxonSpecific(taxonIDs, pluginID);
```

### Type Conversions

```javascript
convertToTaxonOccurrenceData(occurrenceData);
```

### Statistics

```javascript
getOccurrenceStatistics(occurrenceData);
```

```javascript
getTaxonOccurrenceStatistics(taxonOccurrenceData, occurrenceData);
```

```javascript
getTaxonSpecificStatistics(taxonSpecificPlugin, taxonSpecificData, filterIDs);
```
