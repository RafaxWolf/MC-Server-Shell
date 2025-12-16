import fs from "fs";
import path from 'path';
import chalk from "chalk";
import { sendCommand } from "../server/serverManager";
import { Command } from "./command-schema";

/**
 * Crea el Command Handler para los comandos de la Shell.
 * 
 * @param commands Todos los comandos cargados.
 * @returns El Command handler function.
 */
export function createCommandHandler(prefix: string, commands: Map<string, any>) {
    return function handleCommand(command: string, server: any) {

        //* Si el comando empieza con el prefix
        if (command.startsWith(prefix)) {
            const parts = command.trim().split(/\s+/); //* Divide el comando en partes (secuencias de espacios)
            
            // Elimina el prefix del nombre del comando
            const rawName = parts[0].slice(prefix.length);
            const cmdName = rawName.toLowerCase(); //* Nombre del comando sin prefix, en minúsculas
            const args = parts.slice(1); //* Argumentos del comando

            if (!cmdName) return;

            console.log(chalk.greenBright("[Debug]: ") + `Ejecutando comando interno: ${prefix}${cmdName} con argumentos: ${args.join(", ")}`);

            //* Comando interno: help
            if(cmdName === "help") {
                console.log("\n[+] Comandos disponibles:\n");
    
                for (const [name, cmd] of commands) {
                    const desc = cmd.description || "Sin descripción";
                    console.log(chalk.greenBright(` - ${name}: `) + desc);
                }
                console.log("\n")
                return;
            }
    
            const cmd = commands.get(cmdName);
            if(cmd) {
                cmd.run(server, args);
            } else {
                console.log(chalk.red(`[!] Comando desconocido: ${cmdName}`));
                return;
            }

        //* Si el comando empieza con "/"
        } else if (command.startsWith("/")) {
            sendCommand(server, command)
            return;

        //* Comando normal
        } else {
            sendCommand(server, command)
            return;
        }

    }
}

/**
 * Carga los comandos desde la carpeta de comandos.
 * @returns Comandos cargados.
 */
export function loadCommands() {
    const commands = new Map<string, any>();
    const commandsPath = path.join(__dirname, '..', 'commands');
    console.log(chalk.greenBright("[Debug]: ") + commandsPath);

    const files = fs.readdirSync(commandsPath)

    for (const file of files) {
        if(!file.endsWith('.ts') && !file.endsWith('.js')) continue;

        const cmd: Command = require(path.join(commandsPath, file));

        if(!cmd.name || typeof cmd.run !== 'function') {
            console.log(chalk.red(`[!] Comando inválido en archivo: ${file} (Falta 'name' o 'run()')`));
            continue;
        }
        commands.set(cmd.name.toLowerCase(), cmd);
    }

    return commands;
}

export function getCommandList(commands: Map<string, Command>) {
    return Array.from(commands.keys());
}