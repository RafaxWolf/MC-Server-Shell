import readline from 'readline';

export function createPrompt(onCommand: (command: string) => void) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>> '
    })

    rl.prompt();

    rl.on('line', (line) => {
        onCommand(line.trim());
        rl.prompt();
    })
}