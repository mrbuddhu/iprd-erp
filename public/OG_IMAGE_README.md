# OG Image for Social Media Sharing

## 📸 Required Image

You need to create an **OG image** (`og-image.png`) for social media sharing.

### Specifications:
- **Size**: 1200x630 pixels (recommended)
- **Format**: PNG or JPG
- **Location**: `public/og-image.png`
- **Content**: Should include:
  - IPRD ERP System logo/branding
  - "IPRD ERP System" text
  - "Government Content Management" subtitle
  - Professional design matching your brand colors

### Quick Creation Options:

1. **Canva** (Free):
   - Go to canva.com
   - Create custom size: 1200x630
   - Add logo, text, and design
   - Export as PNG

2. **Figma** (Free):
   - Create frame: 1200x630
   - Design with logo and text
   - Export as PNG

3. **Online Tools**:
   - https://www.bannerbear.com/tools/open-graph-image-generator/
   - https://og-image.vercel.app/

### Current Status:
The OG meta tags are already configured in `public/index.html`. Once you add `og-image.png` to the `public` folder, social media sharing will work automatically!

### Testing:
- Use Facebook Debugger: https://developers.facebook.com/tools/debug/
- Use Twitter Card Validator: https://cards-dev.twitter.com/validator
- Use LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

**Note**: For now, the system will use the logo as fallback, but a dedicated OG image will look much better when sharing!

