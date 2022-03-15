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

function getFrequencies(arr) {
  let frequencies = {};
  arr.forEach((value) => {
    if (Object.prototype.hasOwnProperty.call(frequencies, value)) {
      frequencies[value] += 1;
    } else {
      frequencies[value] = 1;
    }
  });
  return frequencies;
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

export function getMinMaxDate(dates) {
  if (dates.length === 0) return [];
  let minDate = dates[0];
  let maxDate = dates[0];

  dates.forEach((date) => {
    if (new Date(date.from) < new Date(minDate.from)) {
      minDate = date;
    } else if (new Date(date.from) > new Date(maxDate.from)) {
      // behaviour moves to outer limits from date.from
      maxDate = date;
    }
  });

  let minMaxDate = {
    minDate,
    maxDate,
  };

  return minMaxDate;
}
