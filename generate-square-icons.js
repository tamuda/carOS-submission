const sharp = require("sharp");
const fs = require("fs");

const sizes = [192, 512];
const backgroundColor = "#0a0a0a"; // Dark background

async function generateSquareIcons() {
  console.log("🎨 Generating square PWA icons...");

  const logoPath = "./public/logo-01.png";
  if (!fs.existsSync(logoPath)) {
    console.error("❌ Logo file not found at", logoPath);
    return;
  }

  for (const size of sizes) {
    try {
      // Create a square canvas with dark background
      const canvas = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: backgroundColor,
        },
      });

      // Resize logo to fit within the square with padding
      const logoSize = Math.round(size * 0.8); // 80% of icon size for padding
      const padding = Math.round((size - logoSize) / 2);

      const logo = await sharp(logoPath)
        .resize(logoSize, logoSize, {
          fit: "contain", // This ensures the logo maintains aspect ratio
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
        })
        .toBuffer();

      // Composite logo onto square canvas
      await canvas
        .composite([
          {
            input: logo,
            top: padding,
            left: padding,
          },
        ])
        .png()
        .toFile(`./public/icon-${size}.png`);

      console.log(`✅ Generated square icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating ${size}px icon:`, error.message);
    }
  }

  // Also create apple-touch-icon (should be square)
  try {
    const appleIconSize = 180;
    const canvas = sharp({
      create: {
        width: appleIconSize,
        height: appleIconSize,
        channels: 4,
        background: backgroundColor,
      },
    });

    const logoSize = Math.round(appleIconSize * 0.8);
    const padding = Math.round((appleIconSize - logoSize) / 2);

    const logo = await sharp(logoPath)
      .resize(logoSize, logoSize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    await canvas
      .composite([
        {
          input: logo,
          top: padding,
          left: padding,
        },
      ])
      .png()
      .toFile("./public/apple-touch-icon.png");

    console.log("✅ Generated square apple-touch-icon.png");
  } catch (error) {
    console.error("❌ Error generating apple-touch-icon:", error.message);
  }

  // Create square favicon
  try {
    const faviconSize = 32;
    const canvas = sharp({
      create: {
        width: faviconSize,
        height: faviconSize,
        channels: 4,
        background: backgroundColor,
      },
    });

    const logoSize = Math.round(faviconSize * 0.8);
    const padding = Math.round((faviconSize - logoSize) / 2);

    const logo = await sharp(logoPath)
      .resize(logoSize, logoSize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    await canvas
      .composite([
        {
          input: logo,
          top: padding,
          left: padding,
        },
      ])
      .png()
      .toFile("./src/app/favicon.ico");

    console.log("✅ Generated square favicon.ico");
  } catch (error) {
    console.error("❌ Error generating favicon:", error.message);
  }

  console.log("🎉 Square icon generation complete!");
}

generateSquareIcons().catch(console.error);

