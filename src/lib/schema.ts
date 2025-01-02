export interface Entry {
	__uuid__: string;
	__column__: number;
	task: string;
	project: string;
	client: string;
	start: number; // unix ms start
	end: number; // unix ms end
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
