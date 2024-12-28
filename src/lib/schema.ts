export interface Entry {
	__uuid__: string;
	__column__: number;
	task: string;
	project: string;
	client: string;
	z_start: string; // ISO 8601 DateTime
	z_end: string; // ISO 8601 DateTime
	start: number; // 0-23 hours
	end: number; // 0-23 hours
	duration: number; // precomputed end - start
	tags: string[];
}

export interface Project {
	__archived__: boolean;
	name: string;
	color: string;
}

export interface Client {
	name: string;
	color: string;
	projects: Project[];
}

export interface InputData {
	task: string;
	clientProject: string;
	start: string | undefined;
}
