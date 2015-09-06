var child_pty = require('child_pty');
import _ = require('lodash')

class Functions {
    static functions: _.Dictionary<string>;

    static initialize(): void {
        this.functions = {};
        this.importFunctionsFrom('zsh');
    }

    static find(functionName: string): string {
        return this.functions[functionName];
    }

    static importFunctionsFrom(shellName: string): void {
        var zsh = child_pty.spawn(shellName, ['-i', '-c', 'functions'], { env: process.env });

        var functionNamePattern = /^[a-zA-Z0-9_\-]+/;

        var functions = '';
        zsh.stdout.on('data', (text: string) => functions += text.toString());
        zsh.on('exit', () => {
            functions.split('\n').forEach((_function: string) => {
                var functionName = functionNamePattern.exec(_function)
                if (functionName) {
                    this.functions[functionName[0]] = `zsh -i -c ${functionName[0]}`;
                }
            });
        });
    }
}

Functions.initialize();

export = Functions;
