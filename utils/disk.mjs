import { exec } from 'child_process';
import readline from 'readline';

async function checkDiskIds() {
    try {
        const serials = await getDiskSerialNumbers();

        console.clear();
        console.log('Matrix - github.com/ottersek/matrix\n');

        Object.keys(serials).forEach((drive) => {
            console.log(`${drive.replace(/\\\.\\PHYSICALDRIVE/g, '')} -> ${serials[drive] || 'Unknown'}`);
        });

        await pressEnterToContinue();
    } catch (error) {
        console.error('Failed to retrieve disk IDs:', error);
    }
}

async function changeDiskIds() {
    try {
        const serials = await getDiskSerialNumbers();
        const diskChoices = Object.keys(serials).map((drive) => ({
            name: `${drive.replace(/\\\.\\PHYSICALDRIVE/g, '')} (current ID: ${serials[drive] || 'Unknown'})`,
            value: drive
        }));

        console.clear();
        console.log('Matrix - github.com/ottersek/matrix\n');

        const { diskIndex } = await askQuestionWithDefault({
            question: 'Select the disk to change the ID:',
            choices: diskChoices
        });

        const { confirmChange } = await askConfirmationQuestion(`Are you sure you want to change the ID of ${diskIndex}? (Y/n) `, true);

        if (confirmChange) {
            const { newId } = await askQuestionWithDefault({
                question: `Enter the new ID for ${diskIndex}:`
            });

            console.log(`Successfully changed the ID of ${diskIndex} to ${newId}`);
        }

        await pressEnterToContinue();
    } catch (error) {
        console.error('Failed to change disk ID:', error);
    }
}

function getDiskSerialNumbers() {
    return new Promise((resolve, reject) => {
        exec('wmic diskdrive get DeviceID,SerialNumber', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            const lines = stdout.trim().split('\r\n');
            const serials = {};

            for (let i = 1; i < lines.length; i++) {
                const [drive, serial] = lines[i].trim().split(/\s+/);
                serials[drive] = serial;
            }

            resolve(serials);
        });
    });
}

function askQuestionWithDefault({ question, choices }) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`${question}\n`, (answer) => {
            rl.close();
            if (!answer.trim()) {
                resolve({ diskIndex: choices[0].value });
            } else {
                const selectedDisk = choices.find((choice) => choice.value === answer.trim());
                resolve({ diskIndex: selectedDisk ? selectedDisk.value : answer.trim() });
            }
        });
    });
}

function askConfirmationQuestion(question, defaultYes = true) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`${question}\n`, (answer) => {
            rl.close();
            if (!answer.trim()) {
                resolve(defaultYes);
            } else {
                resolve(answer.trim().toLowerCase() === 'y');
            }
        });
    });
}

async function pressEnterToContinue() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    await new Promise((resolve) => {
        rl.question('Press [ENTER] to return to the main menu.', () => {
            rl.close();
            resolve();
        });
    });
}

export { checkDiskIds, changeDiskIds };
