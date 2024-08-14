export interface Entry {
	__column__: number;
	name: string;
	client: string;
	start: number;
	end: number;
	duration: number;
	tags: string[];
}

export interface Client {
	name: string;
	color: string;
	projects: string[];
}
