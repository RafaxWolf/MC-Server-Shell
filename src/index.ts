import { startMCServer, serverOutput, logServer, detectStop } from "./server/serverManager";
import { createPrompt } from "./shell/prompt";
import { createCommandHandler, loadCommands } from "./shell/commandHandler";
import chalk from "chalk";

const prefix = "!"
const os = process.platform;

const server = startMCServer("/home/ubuntu/mc-server");

console.log(chalk.greenBright("[Debug]: ") + `Server Shell iniciado en ${chalk.yellowBright(os)}.`)
console.log(chalk.greenBright("[Debug]: ") + `Usando el prefijo de comandos: ${chalk.cyanBright(prefix)}`)

const commands = loadCommands();
const handleCommand = createCommandHandler(prefix, commands);

serverOutput(server, (line) => {
    logServer(line);
    process.stdout.write(">> ");
})

createPrompt((cmd) => {
    handleCommand(cmd, server);
}, () => {
    return Array.from(commands.keys());
})

detectStop(server, (type, code) => {
    if (type === "stop") {
        console.log("[+] El servidor se detuvo correctamente.");
        process.exit(0);
    } else {
        console.log(`[!] El servidor se cayó con el código: ${code}`);
        process.exit(code);
    } 
})