import camelcase from "camelcase";
import { BootData } from "@algotia/core";
import { CommandArgs, Wizard } from "../../types";

const createCommand = (commandArgs: CommandArgs) => {
	const { program, bootData } = commandArgs;
	let calledAddCommad = false;
	let command;
	let wizard;

	const addCommand = (title: string, description: string) => {
		calledAddCommad = true;
		command = program.command(title).description(description);
		return command;
	};
	const addOptions = (optionsArr?: string[][]) => {
		if (!calledAddCommad) {
			throw new Error(
				"Cannot call add options without calling addCommand first"
			);
		}
		if (optionsArr) {
			optionsArr.forEach((option) => {
				command.option(option[0], option[1], undefined, option[2]);
			});
		}
	};

	const addWizard = (wizardToBeAdded: Wizard) => {
		wizard = wizardToBeAdded;
	};

	const addAction = async (
		action: (bootData: BootData, options: any) => Promise<any>
	) => {
		if (!calledAddCommad) {
			throw new Error(
				"Cannot call add options without calling addCommand first"
			);
		}
		command.action(async (parameterOrOptions?: any, options?: any) => {
			let userPassedOptions = {};

			const registerOptions = (options) => {
				options.options.forEach(async (opt) => {
					let optionName = camelcase(opt.long);
					userPassedOptions[optionName] = options[optionName];
				});
			};

			// This conditional block exists because inquirer passes
			// options/parameters down in a strange way depending
			// on if the command is a subcommand and if it takes in a parameter
			if (parameterOrOptions && options) {
				registerOptions(options);
				userPassedOptions["documentName"] = parameterOrOptions;
			} else if (!parameterOrOptions && options) {
				registerOptions(options);
			} else {
				registerOptions(parameterOrOptions);
			}

			if (wizard) {
				const wizardAnswers = await wizard(bootData, userPassedOptions);
				await action(bootData, wizardAnswers);
				await bootData.client.close();
			} else {
				await action(bootData, userPassedOptions);
			}
		});
	};
	return {
		addCommand,
		addOptions,
		addWizard,
		addAction
	};
};

export default createCommand;
