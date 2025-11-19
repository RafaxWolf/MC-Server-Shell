import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { writeLog } from "./logsManager";
import chalk from "chalk";

/**
 * Inicia el servidor de Minecraft.
 * @returns El proceso del servidor.
 */
export function startMCServer(): ChildProcessWithoutNullStreams {
    const server = spawn("java", ["-Xmx8G", "-Xms4G", "-jar", "server.jar", "nogui"], {
        cwd: "/home/ubuntu/mc-server",
    });
    writeLog("\n========== Starting Minecraft Server ==========\n");

    return server;
}

/**
 * Obtiene la salida del servidor.
 * @param server Servidor del que obtener la salida.
 * @param onLine Callback para cada línea de salida.
 */
export function serverOutput(server: ChildProcessWithoutNullStreams, onLine: (line: string) => void) {
    const printLine = (data: Buffer) => {
        const text = data.toString().trim();

        process.stdout.cursorTo(0);
        process.stdout.clearLine(0);
        onLine(text);
    }
    server.stdout.on("data", printLine);
    server.stderr.on("data", printLine);
}

/**
 * Envia un comando al servidor.
 * @param server Servidor al que enviar el comando.
 * @param command Comando a enviar.
 */
export function sendCommand(server: ChildProcessWithoutNullStreams, command: string) {
    writeLog(chalk.redBright("[Command]") + `> ${command}`);
    server.stdin.write(command + "\n");
}

/**
 * Registra mesanjes del servidor.
 * @param message Mensaje a Registar.
 */
export function logServer(message: string) {
    console.log(chalk.blueBright(`[Server]: `) + message);
    writeLog(`[Server]: ${message}`);
}

/**
 * Detecta si el servidor se detuvo o se cayó.
 * @param server Servidor a monitorear.
 * @param callback Callback al detectar detención o caída.
 */
export function detectStop(server: ChildProcessWithoutNullStreams, callback: (type: "stop" | "crash", code: number | null) => void) {
    server.on("exit", (code) => {
        if (code === 0) {
            writeLog("Server stopped gracefully with /stop.");
            callback("stop", code);
        } else {
            writeLog(`Server crashed with exit code ${code}.`);
            callback("crash", code);
        }
    });

    server.on("error", (err) => {
        writeLog(`Server error: ${err}`);
        callback("crash", -1);
    })
}