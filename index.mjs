import inquirer from 'inquirer';
import { getBanner } from './utils/banner.mjs';
import { checkDiskIds, changeDiskIds } from './utils/disk.mjs';

async function showMenu() {
    console.clear();
    const banner = await getBanner();
    console.log(banner);

    const choices = [
        'Check DISK IDs',
        'Change DISK IDs\n',
        'Exit'
    ];

    const { option } = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Select an option:\n\n',
            choices
        }
    ]);

    switch (option) {
        case 'Check DISK IDs':
            await checkDiskIds();
            break;
        case 'Change DISK IDs':
            await changeDiskIds();
            break;
        case 'Exit':
            console.log('Exiting...');
            process.exit(0);
            break;
    }

    showMenu();
}

showMenu();
