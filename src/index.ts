import { startMCServer, serverOutput, logServer } from "./server/serverManager";
import { createPrompt } from "./shell/prompt";
import { createCommandHandler, loadCommands } from "./shell/commandHandler";

const server = startMCServer();
const commands = loadCommands();
const handleCommand = createCommandHandler(commands);

serverOutput(server, (line: string) => {
    logServer(line);
    process.stdout.write(">> ");
});

createPrompt((cmd) => {
    handleCommand(cmd, server);
})