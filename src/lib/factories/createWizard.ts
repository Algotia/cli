import inquirer, { ListQuestion, Answers } from "inquirer";
import { log, getQuestionsToAsk } from "../../utils";
import { PossibleQuestionns } from "../../types";

const createWizard = async (
	answersGiven: Object,
	possibleQuestions: PossibleQuestionns
) => {
	try {
		const addVerboseQuestion = (
			possibleQuestions: PossibleQuestionns
		): PossibleQuestionns => {
			const verboseQuestion: ListQuestion = {
				type: "list",
				name: "verbose",
				message: "Would you like verbose or quiet output?",
				choices: [
					{
						name: "verbose",
						value: true
					},
					{
						name: "quiet",
						value: false
					}
				]
			};

			possibleQuestions["verbose"] = verboseQuestion;

			return possibleQuestions;
		};

		const checkForPlugins = async (questionsThatWillBeAsked: any[]) => {
			try {
				//TODO: Could get this from packageJson inquirer-*
				const plugins = {
					fuzzypath: "inquirer-fuzzy-path",
					datepicker: "inquirer-datepicker-prompt",
					autocomplete: "inquirer-autocomplete-prompt"
				};

				questionsThatWillBeAsked.forEach(async (question) => {
					try {
						if (question && question.type in plugins) {
							const pluginName = question.type;
							inquirer.registerPrompt(pluginName, require(plugins[pluginName]));
						}
					} catch (err) {
						log.error(err);
					}
				});
			} catch (err) {
				log.error(err);
			}
		};
		const askQuestions = async (): Promise<Answers> => {
			try {
				const allQuestions = addVerboseQuestion(possibleQuestions);

				// If user passed command line arg for a value, don't ask a question for it.
				const questionsToAsk = getQuestionsToAsk(answersGiven, allQuestions);

				await checkForPlugins(questionsToAsk);

				const wizardAnswers: Answers = await inquirer.prompt(questionsToAsk);

				const answers = { ...answersGiven, ...wizardAnswers };

				return answers;
			} catch (err) {
				log.error(err);
			}
		};

		return await askQuestions();
	} catch (err) {
		log.error(err);
	}
};

export default createWizard;
