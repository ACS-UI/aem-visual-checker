import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { FIGMA_ACCESS_TOKEN, FIGMA_CONFIG } from '../../test-config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Downloads a Figma design as an image
 * @param {string} figmaFileId - The Figma file ID
 * @param {string} nodeId - The node ID to export
 * @param {string} name - The name for the downloaded image file
 * @param {string} figmaToken - Figma access token (optional, can be set via FIGMA_TOKEN env var)
 * @param {string} format - Image format (png, jpg, svg, pdf) - defaults to 'png'
 * @param {number} scale - Scale factor (1, 2, 4) - defaults to 1
 * @returns {Promise<string>} - Path to the downloaded image
 */
export async function downloadFigmaImage(figmaFileId, nodeId, name, format = 'png', scale = 1) {
    try {
        // Get Figma token from environment variable if not provided
        const token = FIGMA_ACCESS_TOKEN;
        if (!token) {
            throw new Error('Figma token is required. Set FIGMA_TOKEN environment variable or pass it as parameter.');
        }

        // Validate inputs
        if (!figmaFileId || !nodeId || !name) {
            throw new Error('figmaFileId, nodeId, and name are required parameters.');
        }

        // Create snapshots directory path
        const snapshotsDir = path.join(__dirname, 'visual.spec.js-snapshots');
        
        // Ensure snapshots directory exists
        if (!fs.existsSync(snapshotsDir)) {
            fs.mkdirSync(snapshotsDir, { recursive: true });
        }

        // Generate filename with format extension
        const filename = `${name}.${format}`;
        const filePath = path.join(snapshotsDir, filename);

        // Get image URL from Figma API
        const imageUrl = await getFigmaImageUrl(figmaFileId, nodeId, token, format, scale);
        
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

async function generateScreenshotsForBlocks() {
  let count = 0;
  await FIGMA_CONFIG.forEach(async (config) => {
    const { name, figmaFile, figmaNode } = config;
    await downloadFigmaImage(figmaFile, figmaNode, name);
    count++;
  });
  console.log(`Downloaded ${count} Figma images`);
}

generateScreenshotsForBlocks();