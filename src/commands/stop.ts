import { sendCommand } from "../server/serverManager";

export const name = "stop"
export const description = "Stops the Minecraft server."

export function run(server: any, args: string[]) {
    sendCommand(server, "stop");
}