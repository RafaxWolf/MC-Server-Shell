import fs from "fs";
import path from 'path';
import { sendCommand } from "../server/serverManager";

export function createCommandHandler(comamnds: Map<string, any>) {
    return function handleCommand(command: string, server: any) {

        // If the command starts with "/"
        if (command.startsWith("/")) {
            sendCommand(server, command)
            return;
        }

        const parts = command.split(" ");
        const cmdName = parts[0];
        const args = parts.slice(1);

        const cmd = comamnds.get(cmdName);
        if (cmd) {
            cmd.execute(args, server);
        } else {
            console.log(`Comando desconocido: ${cmdName}`);
            return;
        }
    }
}

export function loadCommands() {
    const commands = new Map<string, any>();
    const commandsPath = path.join(__dirname, 'commands');
    const files = fs.readdirSync(commandsPath)

    for (const file of files) {
        if(!file.endsWith('.ts') || !file.endsWith(".js")) continue;

        const cmd = require(path.join(commandsPath, file));

        if (cmd.name && cmd.run) {
            commands.set(cmd.name, cmd);
        }
    }

    return commands;
}