import { Command } from 'commander';

export function main(argv?: string[]) {
    const program = new Command();

    program
        .name('brylo')
        .description('Brylo CLI - install, run, create, edit .devmod modules and .devpack packs')
        .version('1.0.0');

    program
        .command('list')
        .description('List available modules')
        .action(() => {
            // TODO: List modules implementation
            console.log('Listing modules...');
        });

    program
        .command('use <module>')
        .description('Run a .devmod module')
        .action((module: string) => {
            // TODO: Run module implementation
            console.log(`Running module: ${module}`);
        });

    const newCmd = program.command('new').description('Create modules or packs');
    newCmd
        .command('module <name>')
        .description('Create a new .devmod module')
        .action((name: string) => {
            // TODO: Create module implementation
            console.log(`Creating module: ${name}`);
        });

    newCmd
        .command('pack <name>')
        .description('Create a new .devpack pack')
        .action((name: string) => {
            // TODO: Create pack implementation
            console.log(`Creating pack: ${name}`);
        });

    const edit = program.command('edit').description('Edit modules or packs');
    edit.command('module <name>')
        .description('Open a module for editing')
        .action((name: string) => {
            // TODO: Edit module implementation
            console.log(`Editing module: ${name}`);
        });

    edit.command('pack <name>')
        .description('Open a pack for editing')
        .action((name: string) => {
            // TODO: Edit pack implementation
            console.log(`Editing pack: ${name}`);
        });

    program.parse(argv || process.argv);
}
