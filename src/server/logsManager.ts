import path from "path";
import fs from 'fs';

// Define the logs directory path
const logsDir = path.join(__dirname, '..', '..', 'logs');

// Asegurarse de que el directorio de logs exista
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Obtiene el nombre del archivo de log basado en la fecha actual.
 * @returns 
 */
function getLogDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return path.join(logsDir, `serverLog-${year}-${month}-${day}.log`);
}

/**
 * Escribe un registro en el archivo de log.
 * @param message Registro a escribir en el log.
 */
export function writeLog(message: string) {
    const file = getLogDate();
    const logMessage = `${message}\n`;
    fs.appendFileSync(file, logMessage);
}