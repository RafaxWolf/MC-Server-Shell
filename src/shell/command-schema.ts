export interface Command {
    name: string;
    description?: string;
    run: (server: any, args: string[]) => void;
}