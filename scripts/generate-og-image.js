// Simple script to generate OG image using Node.js
// Run: node scripts/generate-og-image.js
// Requires: npm install canvas (optional - can use online tools instead)

const fs = require('fs');
const path = require('path');

// This is a placeholder script
// For actual image generation, you can:
// 1. Use online tools (recommended for quick setup)
// 2. Install 'canvas' package: npm install canvas
// 3. Use image editing software

console.log(`
📸 OG Image Generator

To create your OG image (1200x630px):

Option 1: Online Tools (Easiest)
- Visit: https://og-image.vercel.app/
- Or: https://www.bannerbear.com/tools/open-graph-image-generator/

Option 2: Design Software
- Canva: Create 1200x630 design
- Figma: Create 1200x630 frame
- Photoshop: Create 1200x630 canvas

Option 3: Use Existing Logo
- Copy bihar-logo-red.png
- Resize to 1200x630
- Add text overlay
- Save as: public/og-image.png

Required:
- Size: 1200x630 pixels
- Format: PNG or JPG
- Location: public/og-image.png
- Content: IPRD ERP branding + text

Once created, social media sharing will work automatically!
`);

// Check if OG image exists
const ogImagePath = path.join(__dirname, '../public/og-image.png');
if (fs.existsSync(ogImagePath)) {
  console.log('✅ OG image found at:', ogImagePath);
} else {
  console.log('⚠️  OG image not found. Please create public/og-image.png');
}

