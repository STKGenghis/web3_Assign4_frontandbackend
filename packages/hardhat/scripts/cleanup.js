// Remove all deploy files except 00_deploy_baseflow_implementation.ts and 99_generateTsAbis.ts
const fs = require('fs');
const path = require('path');

const deployDir = path.join(__dirname, '../deploy');
const files = fs.readdirSync(deployDir);

for (const file of files) {
  if (file !== '00_deploy_baseflow_implementation.ts' && file !== '99_generateTsAbis.ts') {
    fs.unlinkSync(path.join(deployDir, file));
    console.log(`Removed ${file}`);
  }
}

console.log('Cleaned up deployment files.');
