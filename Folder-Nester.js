const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    console.log('--- Nested Folder Creator ---');

    let baseLocation = await askQuestion('Where should we build this? (Press Enter for current directory): ');
    if (!baseLocation.trim()) {
      baseLocation = process.cwd();
    }

    const countInput = await askQuestion('How many nested folders deep do you want to go?: ');
    const folderCount = parseInt(countInput, 10);

    if (isNaN(folderCount) || folderCount <= 0) {
      console.log('Please enter a valid number greater than 0.');
      rl.close();
      return;
    }

    const folderNames = [];
    for (let i = 0; i < folderCount; i++) {
      const name = await askQuestion(`Enter name for folder layer ${i + 1}: `);
      if (!name.trim()) {
        console.log('Folder name cannot be empty. Restarting script...');
        rl.close();
        return;
      }
      folderNames.push(name.trim());
    }

    const finalFullPath = path.join(baseLocation, ...folderNames);

    console.log(`\nCreating path: ${finalFullPath}`);

    await fs.mkdir(finalFullPath, { recursive: true });

    console.log('All nested folders created successfully!');

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
  }
}

main();
