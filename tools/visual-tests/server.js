/* eslint-disable no-underscore-dangle */
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import util from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execPromise = util.promisify(exec);
const app = express();
const port = process.env.PORT || 3001;
const MAX_PORT = 3010; // Maximum port number to try

// Ensure the directory for port.txt exists
const portFilePath = path.join(__dirname, 'port.txt');
const portFileDir = path.dirname(portFilePath);

// Function to check if a port is used by our visual-test server
async function isOurServer(portToCheck) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${portToCheck}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.status === 'ok');
        } catch (e) {
          resolve(false);
        }
      });
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function tryStartServerOnPort(currentPort) {
  // If port is in use, check if it's our server
  if (await isOurServer(currentPort)) {
    process.exit(0);
  }
  // Try to start server on current port
  app.listen(currentPort);
  // If successful, write port to file and exit function
  try {
    if (!fs.existsSync(portFileDir)) {
      fs.mkdirSync(portFileDir, { recursive: true });
    }
    fs.writeFileSync(portFilePath, currentPort.toString(), 'utf8');
  } catch (error) {
    console.error('Error writing port file:', error);
  }
}

async function startServer() {
  let currentPort = port;
  // eslint-disable-next-line no-await-in-loop
  while (currentPort <= MAX_PORT) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await tryStartServerOnPort(currentPort);
      return;
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        currentPort += 1;
      } else {
        process.exit(1);
      }
    }
  }
  // If we get here, we've run out of ports to try
  process.exit(1);
}

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from the playwright-report directory
const reportPath = path.join(__dirname, '../../playwright-report');
if (fs.existsSync(reportPath)) {
  app.use('/playwright-report', express.static(reportPath));
} else {
  console.log('Playwright report directory not found at:', reportPath);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Port endpoint
app.get('/port.txt', (req, res) => {
  try {
    const portNumber = fs.readFileSync(portFilePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(portNumber);
  } catch (error) {
    res.status(500).send('Error reading port');
  }
});

// Run visual test endpoint
app.post('/api/run-visual-test', async (req, res) => {
  const { command, component } = req.body;

  if (command !== 'test:visual:blocks') {
    return res.status(400).json({ error: 'Invalid command' });
  }

  if (!component) {
    return res.status(400).json({ error: 'Missing component name' });
  }

  // Get the project root directory (2 levels up from server.js)
  const projectRoot = path.resolve(__dirname, '../');

  // Construct the command to run visual tests
  const testCommand = `npm run test:visual:blocks ${component}`;

  try {
    // Ensure the directory exists
    if (!fs.existsSync(projectRoot)) {
      return res.status(400).json({ error: 'Working directory does not exist' });
    }

    exec(testCommand, {
      cwd: projectRoot,
      env: {
        ...process.env,
        FORCE_COLOR: true,
        PATH: process.env.PATH,
      },
      shell: process.platform === 'win32',
    }, (error, stdout, stderr) => {
      if (stderr) console.log('Command errors:', stderr);

      if (error) {
        res.status(500).json({
          error: 'Command execution failed',
          details: error.message,
          output: stdout,
          stderr,
        });
        return;
      }

      if (stderr && stderr.toLowerCase().includes('error')) {
        res.status(500).json({
          error: 'Command completed with errors',
          output: stdout,
          stderr,
        });
        return;
      }

      res.json({
        success: true,
        output: stdout,
        stderr,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to execute command',
      details: error.message,
    });
  }
  return null;
});

app.post('/start-codegen', async (req, res) => {
  const { url, device } = req.body;

  if (!url || !device) return res.status(400).send('Missing url or device');

  const urlToTest = url;
  const componentName = urlToTest.split('/').pop() || 'component';

  let selectedDevice = 'Pixel 5';
  if (device === 'tablet') selectedDevice = 'iPad Mini';
  else if (device === 'desktop') selectedDevice = 'Desktop Chrome';

  const folderPath = path.join(__dirname, 'tests', componentName);
  const projectFile = path.join(folderPath, `${componentName}.spec.js`);
  const tempFile = path.resolve(process.cwd(), 'temp.spec.js');

  try {
    fs.mkdirSync(folderPath, { recursive: true });

    // Run Playwright codegen
    const codegenCmd = `PLAYWRIGHT_CODEGEN_USE_BASIC_SELECTORS=1 npx playwright codegen --target=locator ${urlToTest} --device="${selectedDevice}" --output ${tempFile}`;
    await execPromise(codegenCmd);

    // Read generated code and remove any import statements
    let tempCode = fs.readFileSync(tempFile, 'utf-8');
    tempCode = tempCode
      .split('\n')
      .filter((line) => !line.trim().startsWith('import '))
      .join('\n');

    // Replace the default `test` declaration to create isolated context per device
    tempCode = tempCode.replace(
      /test\('test', async \(\{ page \}\) => {/,
      `test('Interaction Tests - ${componentName} interation test at ${device} viewport', async ({ browser }) => {
  const context = await browser.newContext(devices['${selectedDevice}']);
  const page = await context.newPage();`,
    );

    // Wrap in device-specific block
    const wrappedCode = `\n// DEVICE: ${componentName} - ${device}\n${tempCode}\n// END DEVICE: ${componentName} - ${device}\n`;

    // Read existing project file or start fresh
    let projectCode = '';
    if (fs.existsSync(projectFile)) {
      projectCode = fs.readFileSync(projectFile, 'utf-8');
      // Remove existing block for this device
      const deviceRegex = new RegExp(
        `// DEVICE: ${componentName} - ${device}[\\s\\S]*?// END DEVICE: ${componentName} - ${device}`,
        'g',
      );
      projectCode = projectCode.replace(deviceRegex, '');
      projectCode = projectCode.replace(/\n\s*\n/g, '\n');
    }

    // Ensure single import block at the top
    const imports = "import { test, expect, devices } from '@playwright/test';";
    if (!projectCode.startsWith(imports)) projectCode = imports + projectCode;

    // Append new device block
    projectCode += wrappedCode;

    // Write back to project file
    fs.writeFileSync(projectFile, projectCode, 'utf-8');

    // Clean up temp file
    fs.unlinkSync(tempFile);

    return res.status(200).send(`✅ Playwright codegen inserted for device "${device}" into ${projectFile}`);
  } catch (err) {
    return res.status(500).send(err.message || 'Error running codegen');
  }
});

app.post('/play-codegen', (req, res) => {
  const { url } = req.body;
  const urlToTest = url;
  const links = urlToTest.split('/');
  const componentName = links[links.length - 1];
  exec(`npx playwright test ./tests/${componentName}/`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(stdout + stderr);
    }
    return res.status(200).send('Playwright test executed successfully');
  });
});

app.post('/play-all-codegen', (req, res) => {
  exec('npx playwright test ./tests/', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(stdout + stderr);
    }
    return res.status(200).send('Playwright test executed successfully');
  });
});
// Start the server
startServer();

export default startServer;
