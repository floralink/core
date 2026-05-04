export interface OccurrenceQuery {
	area?: Area;
	period?: TimePeriod;
}

interface Area {
	format: string;
	value: string;
}

interface TimePeriod {
	from: string;
	to: string;
}
