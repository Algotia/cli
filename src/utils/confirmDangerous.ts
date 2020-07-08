import inquirer from "inquirer";

export default async (documentsAffected?: number) => {
	try {
		let mes: string;
		if (documentsAffected) {
			mes = `The following operation affects ${documentsAffected} ${
				documentsAffected > 1 ? "documents" : "document"
			} and is destructive. Continue?`;
		} else {
			mes = `The following operation is destructive. Continue?`;
		}
		const question = [
			{
				type: "confirm",
				name: "proceedDangerous",
				message: mes,
				default: false
			}
		];
		const answer = await inquirer.prompt(question);

		return answer;
	} catch (err) {
		return Promise.reject(new Error(err));
	}
};
