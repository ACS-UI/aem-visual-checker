import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { FIGMA_ACCESS_TOKEN } from '../../test-config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

/**
 * Parses a Figma URL to extract file ID and node ID
 * @param {string} figmaUrl - The Figma URL
 * @returns {{fileId: string, nodeId: string}} - The extracted file ID and node ID
 */
function parseFigmaUrl(figmaUrl) {
    try {
        const url = new URL(figmaUrl);
        
        // Extract file ID from path
        // Format: /file/{fileId}/... or /design/{fileId}/...
        const pathParts = url.pathname.split('/');
        const fileIndex = pathParts.findIndex(part => part === 'file' || part === 'design');
        
        if (fileIndex === -1 || !pathParts[fileIndex + 1]) {
            throw new Error('Invalid Figma URL: Could not find file ID');
        }
        
        const fileId = pathParts[fileIndex + 1];
        
        // Extract node ID from query parameters
        // Format: ?node-id=1-2 (needs to be converted to 1:2 for API)
        const nodeIdParam = url.searchParams.get('node-id');
        
        if (!nodeIdParam) {
            throw new Error('Invalid Figma URL: Missing node-id parameter');
        }
        
        // Convert node-id format from "1-2" to "1:2"
        const nodeId = nodeIdParam.replace(/-/g, ':');
        
        return { fileId, nodeId };
    } catch (error) {
        throw new Error(`Failed to parse Figma URL: ${error.message}`);
    }
}

/**
 * Downloads a Figma design as an image
 * Supports both URL format and legacy file ID + node ID format
 * @param {string|object} figmaUrlOrFileId - Either a Figma URL string or file ID (legacy)
 * @param {string} nodeId - The node ID (only if using legacy format)
 * @param {string} name - The name for the downloaded image file
 * @param {string} blockName - The block name (for determining save location)
 * @param {string} format - Image format (png, jpg, svg, pdf) - defaults to 'png'
 * @param {number} scale - Scale factor (1, 2, 4) - defaults to 1
 * @returns {Promise<string>} - Path to the downloaded image
 */
export async function downloadFigmaImage(figmaUrlOrFileId, nodeId, name, blockName, format = 'png', scale = 1) {
    try {
        // Get Figma token from environment variable if not provided
        const token = FIGMA_ACCESS_TOKEN;
        if (!token) {
            throw new Error('Figma token is required. Set FIGMA_TOKEN environment variable or pass it as parameter.');
        }

        let figmaFileId;
        let figmaNodeId;

        // Check if figmaUrlOrFileId is a URL (contains http/https)
        if (typeof figmaUrlOrFileId === 'string' && (figmaUrlOrFileId.startsWith('http://') || figmaUrlOrFileId.startsWith('https://'))) {
            // Parse Figma URL
            const parsed = parseFigmaUrl(figmaUrlOrFileId);
            figmaFileId = parsed.fileId;
            figmaNodeId = parsed.nodeId;
        } else {
            // Legacy format: separate file ID and node ID
            figmaFileId = figmaUrlOrFileId;
            figmaNodeId = nodeId;
        }

        // Validate inputs
        if (!figmaFileId || !figmaNodeId || !name || !blockName) {
            throw new Error('figmaFileId, nodeId, name, and blockName are required parameters.');
        }

        // Create snapshots directory path for the specific block
        const snapshotsDir = path.join(__dirname, 'blocks', blockName, `${blockName}.spec.js-snapshots`);
        
        // Ensure snapshots directory exists
        if (!fs.existsSync(snapshotsDir)) {
            fs.mkdirSync(snapshotsDir, { recursive: true });
        }

        // Generate filename with format extension
        const filename = `${name}.${format}`;
        const filePath = path.join(snapshotsDir, filename);

        // Get image URL from Figma API
        const imageUrl = await getFigmaImageUrl(figmaFileId, figmaNodeId, token, format, scale);
        
        // Download the image
        await downloadImage(imageUrl, filePath);

        console.log(`Successfully downloaded Figma image to: ${filePath}`);
        return filePath;

    } catch (error) {
        console.error('Error downloading Figma image:', error.message);
        throw error;
    }
}

/**
 * Gets the image URL from Figma API
 * @param {string} figmaFileId - The Figma file ID
 * @param {string} nodeId - The node ID to export
 * @param {string} token - Figma access token
 * @param {string} format - Image format
 * @param {number} scale - Scale factor
 * @returns {Promise<string>} - The image URL
 */
async function getFigmaImageUrl(figmaFileId, nodeId, token, format, scale) {
    return new Promise((resolve, reject) => {
        const url = `https://api.figma.com/v1/images/${figmaFileId}?ids=${nodeId}&format=${format}&scale=${scale}`;
        
        const options = {
            headers: {
                'X-Figma-Token': token
            }
        };

        https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        const imageUrl = response.images[nodeId];
                        
                        if (imageUrl) {
                            resolve(imageUrl);
                        } else {
                            reject(new Error(`No image URL found for node ID: ${nodeId}`));
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse Figma API response: ${error.message}`));
                    }
                } else {
                    reject(new Error(`Figma API request failed with status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`Failed to get Figma image URL: ${error.message}`));
        });
    });
}

/**
 * Downloads an image from URL to local file
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} filePath - The local file path to save the image
 * @returns {Promise<void>}
 */
async function downloadImage(imageUrl, filePath) {
    return new Promise((resolve, reject) => {
        https.get(imageUrl, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                
                res.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
                
                fileStream.on('error', (error) => {
                    fs.unlink(filePath, () => {}); // Delete the file if it exists
                    reject(new Error(`Failed to write image file: ${error.message}`));
                });
            } else {
                reject(new Error(`Failed to download image: HTTP ${res.statusCode}`));
            }
        }).on('error', (error) => {
            reject(new Error(`Failed to download image: ${error.message}`));
        });
    });
}

/**
 * Scans all block folders for config.js files with FIGMA_CONFIG
 * and downloads Figma images for those blocks
 */
async function generateScreenshotsForBlocks() {
  const blocksDir = path.join(__dirname, 'blocks');
  
  if (!fs.existsSync(blocksDir)) {
    console.error('Blocks directory not found:', blocksDir);
    return;
  }

  // Get all block directories
  const blockFolders = fs.readdirSync(blocksDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let totalCount = 0;
  let processedBlocks = 0;

  console.log(`\nScanning ${blockFolders.length} block folders for Figma configurations...\n`);

  // Process each block folder
  for (const blockName of blockFolders) {
    const blockConfigPath = path.join(blocksDir, blockName, 'config.js');
    
    // Check if config.js exists in the block folder
    if (fs.existsSync(blockConfigPath)) {
      try {
        // Dynamically import the block's config
        const configModule = await import(`file://${blockConfigPath}`);
        const blockConfig = configModule.FIGMA_CONFIG;

        if (blockConfig && Array.isArray(blockConfig) && blockConfig.length > 0) {
          console.log(`\n📦 Processing block: ${blockName}`);
          console.log(`   Found ${blockConfig.length} Figma configuration(s)`);
          
          processedBlocks++;

          // Download images for each config entry
          for (const config of blockConfig) {
            const { name, figmaUrl, figmaFile, figmaNode, format = 'png', scale = 1 } = config;
            
            // Support both new figmaUrl format and legacy figmaFile+figmaNode format
            if (!name || (!figmaUrl && (!figmaFile || !figmaNode))) {
              console.warn(`   ⚠️  Skipping invalid config entry in ${blockName}:`, config);
              continue;
            }

            try {
              if (figmaUrl) {
                // New format: Use figmaUrl
                await downloadFigmaImage(figmaUrl, null, name, blockName, format, scale);
              } else {
                // Legacy format: Use figmaFile and figmaNode
                await downloadFigmaImage(figmaFile, figmaNode, name, blockName, format, scale);
              }
              totalCount++;
              console.log(`   ✅ Downloaded: ${name}.${format}`);
            } catch (error) {
              console.error(`   ❌ Failed to download ${name}:`, error.message);
            }
          }
        } else {
          console.log(`⏭️  Skipping ${blockName}: No FIGMA_CONFIG found or empty`);
        }
      } catch (error) {
        console.error(`❌ Error loading config for ${blockName}:`, error.message);
      }
    } else {
      console.log(`⏭️  Skipping ${blockName}: No config.js found`);
    }
  }

  console.log(`\n✨ Summary:`);
  console.log(`   Blocks processed: ${processedBlocks}/${blockFolders.length}`);
  console.log(`   Total images downloaded: ${totalCount}`);
}

generateScreenshotsForBlocks();