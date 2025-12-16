import fs from "fs";
import { logServer } from "../server/serverManager";
import { getLogDate, logsDir } from "../server/logsManager";

export const name = "logs";
export const description = "Muestra los logs / lista los logs del servidor / elimina logs antiguos";

export function run(server: any, args: string[]) {
    if (args.length === 0) return logServer("Syntax Error: !logs <show|list|clean>");
    const action = args[0].toLowerCase();

    switch(action) {
        case "show":
            logServer("Mostrando logs actuales del servidor:");
            const logfile = getLogDate();

        case "list":
            logServer("Listando archivos de logs del servidor:");
            fs.readdirSync(logsDir).forEach(file => {
                logServer(` - ${file}`);
            })

        case "clean":
            break;
        default:
            return logServer("Syntax Error: !logs <show|list|clean>");
    }

    if (action === "show") {
        
        return;

    } else if (action === "list") {
        return;
    }
}