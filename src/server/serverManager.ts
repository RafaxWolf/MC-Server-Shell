import { spawn, ChildProcessWithoutNullStreams } from "child_process";

/**
 * Starts the Minecraft server process.
 * @returns The Server.
 */
export function startMCServer(): ChildProcessWithoutNullStreams {
    const server = spawn("java", ["-Xmx8G", "-Xms4G", "-jar", "server.jar", "nogui"], {
        cwd: "/home/ubuntu/mc-server",
    });

    return server;
}

/**
 * Gets the output from the server.
 * @param server Server process.
 * @param onLine Callback for each line of output.
 */
export function serverOutput(server: ChildProcessWithoutNullStreams, onLine: (line: string) => void) {
    server.stdout.on("data", (data: Buffer) => {
        const text = data.toString().trim();
        onLine(text);
    })

    server.stderr.on("data", (data: Buffer) => {
        const text = data.toString().trim();
        onLine(text);
    })
}

/**
 * Sends a command to the server.
 * @param server Server process.
 * @param command Command to send.
 */
export function sendCommand(server: ChildProcessWithoutNullStreams, command: string) {
    server.stdin.write(command + "\n");
}

export function logServer(message: string) {
    console.log(`[Server]: ${message}`);
}