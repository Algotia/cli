import camelcase from "camelcase";
import { CommanderStatic } from "commander";
import { BootData } from "@algotia/core";
import { Wizard, CommandOptions, CommandArgs } from "../../types";

const createCommand = (commandArgs: CommandArgs, noVerbose?: boolean) => {
	const { program, bootData, wizard } = commandArgs;
	let calledAddCommad = false;
	let command;

	const addCommand = (title: string, description: string) => {
		calledAddCommad = true;
		command = program.command(title).description(description);
		return command;
	};
	const addOptions = (optionsArr?: string[][]) => {
		if (!calledAddCommad) {
			throw "Cannot call add options without calling addCommand first";
		}
		if (optionsArr) {
			optionsArr.forEach((option) => {
				command.option(option[0], option[1], undefined, option[2]);
			});
		}
		if (!noVerbose) {
			command.option("-v, --verbose", "verbose output");
		}
	};

	const addAction = async (
		action: (bootData: BootData, options: any) => Promise<any>
	) => {
		if (!calledAddCommad) {
			throw "Cannot call add options without calling addCommand first";
		}
		command.action(async (parameterOrOptions?: any, options?: any) => {
			let userPassedOptions = {};

			const registerOptions = ({ options }) => {
				options.forEach(async (opt) => {
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
		addAction
	};
};

export default createCommand;
