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
	wizard?: Wizard;
}
export type CommandArgs = ICommandArgs;
export type Command = (commandArgs: CommandArgs) => Promise<any>;

interface UserPasssedOptionHash {
	[key: string]: string | number | boolean;
}

export type CommandOptions = string[][];

interface ICommandObj {
	command: Command;
	wizard?: Wizard;
}

type ConmmandObj = ICommandObj;

export type CommandArr = ConmmandObj[];

interface IPossibleQuestions {
	[key: string]: any;
}

export type PossibleQuestionns = IPossibleQuestions;
