import inquirer, { ListQuestion, Answers } from "inquirer";
import { log, getQuestionsToAsk } from "../../utils";
import { PossibleQuestionns } from "../../types";

const createWizard = async (
	answersGiven: Object,
	possibleQuestions: PossibleQuestionns
) => {
	try {
		const checkForPlugins = async (questionsThatWillBeAsked: any[]) => {
			try {
				//TODO: Could get this from packageJson inquirer-*
				const plugins = {
					filetree: "inquirer-file-tree-selection-prompt",
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
				// If user passed command line arg for a value, don't ask a question for it.
				const questionsToAsk = getQuestionsToAsk(
					answersGiven,
					possibleQuestions
				);

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
