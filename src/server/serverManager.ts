import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { writeLog } from "./logsManager";
import chalk from "chalk";

//* ========== Start MC Server ==========
/**
 * Inicia el servidor de Minecraft.
 * @returns El proceso del servidor.
 */
export function startMCServer(serverPath: string): ChildProcessWithoutNullStreams {
    const server = spawn("java", ["-Xmx8G", "-Xms4G", "-jar", "server.jar", "nogui"], {
        cwd: serverPath,
    });
    logServer("BY RAFAXWOLF - https://rafaxwolf.com");
    logServer("\n========== Starting Minecraft Server ==========\n");

    return server;
}

//* ========== Server Output ==========
/**
 * Obtiene la salida del servidor.
 * @param server Servidor del que obtener la salida.
 * @param onLine Callback para cada línea de salida.
 */
export function serverOutput(server: ChildProcessWithoutNullStreams, onLine: (line: string) => void) {
    const printLine = (data: Buffer) => {
        const text = data.toString().split(/\r?\n/);
        for(let line of text) {
            line = line.trim();
            if(line === "") continue;

            process.stdout.cursorTo(0);
            process.stdout.clearLine(0);

            onLine(line);
        }
    }
    
    server.stdout.on("data", printLine);
    server.stderr.on("data", printLine);
}

//* ========== Log Server ==========
/**
 * Registra mensajes del servidor.
 * @param message Mensaje a Registrar.
 */
export function logServer(message: string) {
    if(message.includes("[Command]")) return;

    //? === Diferenciar tipos de mensajes para mejor logueo y visualización ===
    var warnKeywords = ["WARN", "WARNING"];
    var errKeywords = ["ERROR", "Error", "Exception", "SEVERE", "crashed"];
    var infoKeywords = ["INFO", "Info", "Starting net", "Done"];

    if (warnKeywords.some(kw => message.includes(kw))) {
        console.log(chalk.yellowBright("[Warn]: ") + message);
        writeLog(`[Warn]: ${message}`);

    } else if(errKeywords.some(kw => message.includes(kw))) {
        console.log(chalk.redBright("[Error]: ") + message);
        writeLog(`[Error]: ${message}`);

    } else if(infoKeywords.some(kw => message.includes(kw))) {
        console.log(chalk.blueBright("[Server]: ") + message);
        writeLog(`[Server]: ${message}`);

    } else {
        console.log(message);
        writeLog(message);
    }
}

//* ========== Send Command ==========
/**
 * Envía un comando al servidor.
 * @param server Servidor al que enviar el comando.
 * @param command Comando a enviar.
 */
export function sendCommand(server: ChildProcessWithoutNullStreams, command: string) {
    logServer(`[Command]: ${command}`)
    server.stdin.write(command + "\n");
}

//* ========== Detect Stop / Crash ==========
/**
 * Detecta si el servidor se detuvo o se cayó.
 * @param server Servidor a monitorear.
 * @param callback Callback al detectar detención o caída.
 */
export function detectStop(server: ChildProcessWithoutNullStreams, callback: (type: "stop" | "crash", code: number | null) => void) {
    server.on("exit", (code) => {
        if (code === 0) {
            logServer("Server stopped gracefully with /stop.");
            callback("stop", code);
        } else {
            logServer(`Server crashed with exit code ${code}.`);
            callback("crash", code);
        }
    });

    server.on("error", (err) => {
        writeLog(`Server error: ${err}`);
        callback("crash", -1);
    })
}