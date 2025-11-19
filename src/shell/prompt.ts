import readline from 'readline';

/**
 * Crea el prompt para la shell.
 * @param onCommand Callback al recibir un comando.
 * @param getAutoCompleteList Función para obtener la lista de autocompletado.
 */
export function createPrompt(onCommand: (command: string) => void, getAutoCompleteList: () => string[]) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>> ',
        completer: (line: string) => { //* Función de autocompletado
            const commands = getAutoCompleteList()
            const hits = commands.filter((c) => c.startsWith(line))
            return [hits.length ? hits : commands, line];
        }
    })

    //* Iniciar el prompt
    rl.prompt();

    //* Manejar cada línea ingresada
    rl.on('line', (line) => {
        onCommand(line.trim());
        rl.prompt();
    })
}