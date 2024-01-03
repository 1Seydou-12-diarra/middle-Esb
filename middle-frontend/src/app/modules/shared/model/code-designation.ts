export class CodeDesignation {
	id: number;
	code: string;
	designation: string;

	constructor(code?: string, designation?: string, id ?: number) {
		this.code = code;
		this.designation = designation;
		this.id = id;
	}
}
