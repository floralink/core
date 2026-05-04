export function getAverage(numbers: number[]) {
	return numbers.reduce((a, b) => a + b) / numbers.length;
}

export function getVariance(arr: number[], average: number) {
	let sum = 0;
	arr.forEach((value) => {
		sum += (value - average) ** 2;
	});
	return sum / (arr.length - 1);
}
