import {
	BootData as TBootData,
	ConfigOptions as TConfigOptions
} from "@algotia/core";
import { Answers } from "inquirer";

// re-export reusable 3rd party types
export type BootData = TBootData;
export type ConfigOptions = TConfigOptions;

export type Wizard = (
	bootData: BootData,
	answersGiven: UserPasssedOptionHash
) => Promise<Answers>;

interface ICommandArgs {
	program: any;
	bootData: BootData;
}
export type CommandArgs = ICommandArgs;
export type Command = (commandArgs: CommandArgs) => Promise<any>;

interface UserPasssedOptionHash {
	[key: string]: string | number | boolean;
}

export type CommandOptions = string[][];

export type CommandArr = Command[];

interface IPossibleQuestions {
	[key: string]: any;
}

export type PossibleQuestionns = IPossibleQuestions;
