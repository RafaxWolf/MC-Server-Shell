export const name = "ping"
export const description = "Sends a ping command to the server."

export function run(server: any, args: string[]) {
    console.log("pong!");
}