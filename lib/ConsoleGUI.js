const colors = require("colors");
const cTable = require("console.table");

module.exports =
    class ConsoleGUI {
        constructor() {
            this._name = "ConsoleGUI";
            this._version;
            this._motd;
            this._logo;
            this._commands = [];

            this._prompt = require("prompt");
            this._prompt.message = "";
            this._prompt.delimiter = ">"
            this._prompt.colors = false;

            this.addCommand("help")
                .description("Show this help screen")
                .action(() => this.print().help())
            this.addCommand("version")
                .description("Show the running version")
                .action(() => this.print().version());
            this.addCommand("clear")
                .description("Clear the screen")
                .action(() => this.print().clear());
            this.addCommand("exit")
                .description("Exit the program")
                .action(() => process.exit(0));

            console.clear();
        }

        name(name) {
            this._name = name;
            return this;
        }

        version(version) {
            this._version = version;
            return this;
        }

        motd(motd) {
            this._motd = motd;
            return this;
        }

        logo(logo) {
            this._logo = logo;
            return this;
        }

        addCommand(cmd) {
            const newCommand = new Command(cmd);
            this._commands.push(newCommand);
            return newCommand;
        }

        run() {

            const getCmd = () => {
                this._prompt.start();
                this._prompt.get([{ name: "cmd", description: this._name }], (err, res) => {
                    try {
                        if (err) throw err;
                        const command = res.cmd.split(" ")[0];
                        const args = res.cmd.split(" ").filter((a, i) => i !== 0);
                        const cmd = this._commands.find(a => a._cmd === command);
                        if (!cmd) throw "command-not-found";
                        this._prompt.pause();
                        cmd.run(args);
                        getCmd();
                    } catch (err) {
                        if (err = "command-not-found") {
                            console.log("Command not found!")
                            this.print().help();
                            getCmd();
                        }
                    }
                });
            }

            if (typeof this._logo === "string") {
                console.log(this._logo);
                console.log(`${this._motd ? "\n" + this._motd : "\n"}`);
                getCmd();
            } else if (typeof this._logo === "function") {
                this._logo(() => {
                    console.log(`${this._motd ? "\n" + this._motd : "\n"}`);
                    getCmd();
                })
            }


        }

        print() {
            return {
                help: () => {
                    console.log();
                    console.log(`${this._name} ${this._version}`);
                    console.log("Usage: command <args> [args]");
                    console.log();
                    console.table(["Commands", "Description"], this._commands.map(a => {
                        return [
                            a.help(), a._description || ""
                        ]
                    }))
                },
                version: () => {
                    console.log(this._version);
                },
                clear: () => {
                    console.clear();
                }
            };
        }

    }


class Command {
    constructor(cmd) {
        this._cmd = cmd.split(" ")[0];
        this._action;
        this._alias;
        this._options;
        this._arguments = [];
        this._description;

        cmd.split(" ").forEach((a, i) => {
            if (i === 0) return this._cmd = a;
            var arg = {
                name: a.replace(/[<>[\]]/g, ""),
                required: false
            }
            switch (a[0]) {
                case "<":
                    arg.required = true;
                    return this._arguments.push(arg);
                case "[":
                    return this._arguments.push(arg);
            }

        })
    }

    /**
     * @param { Function } action
     */
    action(action) {
        this._action = action;
        return this;
    }

    /**
     * @param { String } alias
     */
    alias(alias) {
        this._alias = alias;
        return this;
    }

    /**
     * @param { String } description
     */
    description(description) {
        this._description = description;
        return this;
    }

    /**
     * @param { String } option
     */
    option(option) {
        this._option = option;
        return this;
    }

    help() {
        let help = `${this._cmd}`
        this._arguments.forEach(a => {
            help += ` ${a.required ? "<" : "["}${a.name}${a.required ? ">" : "]"}`
        })
        return help;
    }

    usage(msg) {
        if (msg) console.log(msg);
        let usage = `Usage: ${this.help()}`
        console.log(usage);
    }

    run(args) {
        for (var i in this._arguments) {
            if (this._arguments[i].required && !args[i]) {
                return this.usage(`Argument "${this._arguments[i].name}" is required!`);
            }
            this._arguments[i].value = args[i]
        }
        this._action(...(this._arguments.map(a => a.value)));
    }

}