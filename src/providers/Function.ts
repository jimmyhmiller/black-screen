import i = require('../Interfaces');
import _ = require('lodash');
import Functions = require('../Functions');
import Prompt = require("../Prompt");
var score: (i: string, m: string) => number = require('fuzzaldrin').score;

class Function implements i.AutocompletionProvider {
    getSuggestions(prompt: Prompt) {
        return new Promise((resolve) => {
            if (prompt.getWholeCommand().length > 1) {
                return resolve([]);
            }

            var lastArgument = prompt.getLastArgument();

            var all = _.map(Functions.functions, (command: string, functionName: string) => {
                return {
                    value: functionName,
                    score: 1.5 * (score(functionName, lastArgument)),
                    synopsis: command,
                    description: `Function ${functionName}.`,
                    type: 'alias'
                }
            });

            resolve(_(all).sortBy('score').reverse().take(10).value());
        });
    }
}

export = Function;
