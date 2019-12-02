# ConsoleGUI

## Install:
```bash
npm install console-gui
```

## Usage:
```js
const ConsoleGUI = require("console-gui");
const app = new ConsoleGUI();

app.name("foo")
    .version("1.0.0")
    .motd("Welcome message!")
    .logo(" <= FOO => ");

app.run();
```

## Examples:
```js
app
    .name("TESTING")
    .version("1.101.2")
    .motd("Message Of The Day!")

app.addCommand("hello")
    .action(() => {
        console.log("world")
    })
app.addCommand("say <message>")
    .description("Say something to the world!")
    .action(messages => {
        console.log(messages);
    })

app.run();
```

## ConsoleGUI Methods:
### .name(string)
Sets the name for the program or app:
 - `string` The name to use
 - `returns` ConsoleGUI Object 
```js
app.name("bar");
```

### .version(string)
Sets the version of the program or app:
- `string` The version to use
- `returns` ConsoleGUI Object
```js
app.version("1.2.3");
```

### .motd(string)
Sets the welcome message:
- `string` The message to use
- `returns` ConsoleGUI Object
```js
app.motd("Welcome message!");
```

### .logo(string|function)
Sets the logo for the program or app. If it's a string, just the string will be printed, but if it's a function, the function will be executed and when the callback is called the program or app will then start.
- `string` The string of the logo
- `function` A function with a callback
- `returns` ConsoleGUI Object
```js
app.logo(" <= FOO => ");
app.logo(callback => {
    // Print your logo or do something...
    callback();
})
```

### .run()
Start the app or program
```js
app.run();
```

### .addCommand(string)
Add a command to your app:
- `string` Command to be added
- `returns` Command Object
```js
app.addCommand("foo");
```

## Command Methods:
### .description(string)
Sets the description of the command
- `string` The description of the command
- `returns` Command Object
```js
app.addCommand("foo")
    .description("bar")
```

### .action(function)
- `function` The function that will run when the command is executed
- `returns` Command Object
```js
app.addCommand("foo <arg>")
    .action(arg => {
        console.log(arg);
    })
```

