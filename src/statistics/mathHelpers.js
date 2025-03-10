function getMedian(arr) {
  let arrLength = arr.length;
  if (arrLength === 0) return [];
  if (arrLength === 1) return [arr[0]];

  let sortedArray = arr.sort((a, b) => a - b);
  if (arrLength % 2 === 0) {
    // length is even number -> return average of both middle values
    if (sortedArray[arrLength / 2 - 1] === sortedArray[arrLength / 2])
      return [sortedArray[arrLength / 2]];
    else return [sortedArray[arrLength / 2 - 1], sortedArray[arrLength / 2]];
  } else {
    // length is odd number -> return middle value
    return [sortedArray[(arrLength - 1) / 2]];
  }
}

function getQuantile(arr, q) {
  // LAZY WORKAROUND
  if (arr.length < 5) return -1;
  const round = Math.floor;

  let sorted = arr.sort((a, b) => a - b);
  let pos = arr.length * q - 1;

  let quantile;

  // if calculated position is integer
  if (pos % 1 === 0) {
    quantile = 0.5 * (sorted[round(pos)] + sorted[round(pos + 1)]);
  } else {
    quantile = sorted[round(pos + 1)];
  }

  return quantile;
}

function getMode(arr) {
  if (arr.length === 0) return [];
  if (arr.length === 1) return [arr[0]];

  let counter = {};
  let mode = [];
  let max = 0;

  arr.forEach((value) => {
    if (!(value in counter)) counter[value] = 0;
    counter[value]++;

    if (counter[value] == max) mode.push(value);
    else if (counter[value] > max) {
      max = counter[value];
      mode = [value];
    }
  });

  return mode;
}

function getVariance(arr, average) {
  let sum = 0;
  arr.forEach((value) => {
    sum += Math.pow(value - average, 2);
  });
  return sum / (arr.length - 1);
}

function getFrequencies(arr, transform, check) {
  let frequencies = {};
  arr.forEach((value) => {
    if (!check || check(value))
      addOneToKeyValue(frequencies, transform ? transform(value) : value);
  });
  return frequencies;
}

function addOneToKeyValue(object, key) {
  if (Object.prototype.hasOwnProperty.call(object, key)) {
    object[key] += 1;
  } else {
    object[key] = 1;
  }
}

// return statistics object for array of values (currently only integers)
// todo: pass scale of measure for "intelligent" statistics
export function calculateStatistics(
  { values, possibleValues, scaleOfMeasure },
  roundToDecimals = 2
) {
  let propertyStatistics = {};

  // delete empty entries
  values = values.filter((value) => value.toString().trim() !== "");

  // convert number values to Number type
  values = values.map((value) => {
    if (!isNaN(value)) return parseFloat(value);
    else return value;
  });

  // calculate statistics based on scale of measure
  switch (scaleOfMeasure) {
    case "nominal":
      propertyStatistics.mode = getMode(values);
      propertyStatistics.frequencies = getFrequencies(values);
      break;
    case "ordinal": {
      propertyStatistics.mode = getMode(values);
      propertyStatistics.frequencies = getFrequencies(values);

      // sort out non-ordinal meta values
      // (with extraOrdinal === true, like "no data" or "n/a")
      // for ordinal statistics
      let ordinalValues = values;
      if (possibleValues) {
        Object.entries(possibleValues).forEach(
          ([possibleValue, definition]) => {
            if (definition.extraOrdinal) {
              ordinalValues = ordinalValues.filter((v) => v != possibleValue);
            }
          }
        );
      }

      propertyStatistics.ordinalValues = ordinalValues;

      propertyStatistics.median = getMedian(ordinalValues);
      propertyStatistics.quantile25 = getQuantile(ordinalValues, 0.25);
      propertyStatistics.quantile50 = getQuantile(ordinalValues, 0.5);
      propertyStatistics.quantile75 = getQuantile(ordinalValues, 0.75);
      break;
    }
    case "interval":
    case "ratio": {
      // unrounded results for further calculations
      let averageFloat = values.reduce((a, b) => a + b) / values.length;
      let variance = getVariance(values, averageFloat);

      propertyStatistics.average = averageFloat.toFixed(roundToDecimals);
      propertyStatistics.variance = variance.toFixed(roundToDecimals);
      propertyStatistics.standardDeviation =
        Math.sqrt(variance).toFixed(roundToDecimals);
      break;
    }
  }

  propertyStatistics.valuesTotal = values.length;

  return propertyStatistics;
}

// Dates

export function getMinMaxDate(dates) {
  if (dates.length === 0) return [];

  let minFromDateObject = dates[0];
  let minFromDate = new Date(minFromDateObject.from);
  const updateMinFrom = (date) => {
    minFromDateObject = date;
    minFromDate = new Date(minFromDateObject.from);
  };

  let maxToDateObject = dates[0];
  let maxToDate = new Date(maxToDateObject.to);
  const updateMaxTo = (date) => {
    maxToDateObject = date;
    maxToDate = new Date(maxToDateObject.from);
  };

  dates.forEach((date) => {
    let fromDate = new Date(date.from);
    let toDate = new Date(date.to);

    if (
      fromDate < minFromDate ||
      (fromDate = minFromDate && toDate < new Date(minFromDateObject.to))
    )
      updateMinFrom(date);

    // Note: The following is not an else-if condition because the earliest date range could also be the latest
    if (
      toDate > maxToDate ||
      (toDate = maxToDate && fromDate > new Date(maxToDateObject.from))
    )
      updateMaxTo(date);
  });

  return {
    minFromDateObject,
    maxToDateObject,
  };
}

export function getYearlyFrequencies(dates) {
  return getFrequencies(
    dates,
    (date) => new Date(date.from).getFullYear(),
    // Ignore date ranges that aren't contained in a single year
    (date) =>
      new Date(date.from).getFullYear() === new Date(date.to).getFullYear()
  );
}
