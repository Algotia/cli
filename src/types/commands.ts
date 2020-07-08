interface ListOptions {
	pretty?: boolean;
}

interface DeleteOptions {
	verbose?: boolean;
}

interface BackfillOptions {
	since: number;
	pair: string;
	period: string;
	until: number;
	limit: number;
	documentName: string;
}

export { ListOptions, DeleteOptions, BackfillOptions };
