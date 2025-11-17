import { sendCommand } from "../server/serverManager";

export const name = "reload"
export const description = "Reloads the Minecraft server."

export function run(server: any, args: string[]) {
    sendCommand(server, "reload");
}