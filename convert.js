const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processClient(dir) {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      const code = fs.readFileSync(filePath, 'utf8');
      const isTsx = filePath.endsWith('.tsx');
      
      let result = babel.transformSync(code, {
        presets: [
          ['@babel/preset-typescript']
        ],
        plugins: ['@babel/plugin-syntax-jsx'],
        filename: filePath,
        retainLines: true,
      });

      const newExt = isTsx ? '.jsx' : '.js';
      const newFilePath = filePath.replace(/\.tsx?$/, newExt);
      
      fs.writeFileSync(newFilePath, result.code);
      fs.unlinkSync(filePath);
      console.log(`Converted Client: ${filePath} -> ${newFilePath}`);
    }
  });
}

function processServer(dir) {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.ts')) {
      const code = fs.readFileSync(filePath, 'utf8');
      
      let result = babel.transformSync(code, {
        presets: [
          ['@babel/preset-typescript']
        ],
        filename: filePath,
        retainLines: true,
      });

      // Add .js extension to local imports
      let newCode = result.code.replace(/from\s+['"](\.[^'"]+)['"]/g, "from '$1.js'");
      newCode = newCode.replace(/import\s+['"](\.[^'"]+)['"]/g, "import '$1.js'");
      
      const newFilePath = filePath.replace(/\.ts$/, '.js');
      
      fs.writeFileSync(newFilePath, newCode);
      fs.unlinkSync(filePath);
      console.log(`Converted Server: ${filePath} -> ${newFilePath}`);
    }
  });
}

processClient(path.join(__dirname, 'client', 'src'));

// Also rename vite.config.ts to js
const viteConfigPath = path.join(__dirname, 'client', 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
    const code = fs.readFileSync(viteConfigPath, 'utf8');
    let result = babel.transformSync(code, {
        presets: [['@babel/preset-typescript']],
        filename: viteConfigPath,
        retainLines: true,
    });
    fs.writeFileSync(path.join(__dirname, 'client', 'vite.config.js'), result.code);
    fs.unlinkSync(viteConfigPath);
}

processServer(path.join(__dirname, 'server', 'src'));
