const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas');
const path = require('path');

registerFont(path.join(__dirname, '../../assets/Mirza-Regular.ttf'), { family: 'Mirza' });

async function drawCard(emoji) {

    // this is the average collectible card size from what I could find!
    const canvas = createCanvas(350, 490);
    const context = canvas.getContext("2d");

    const height = canvas.height;
    const width = canvas.width;

    const tiers = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Cosmic'];
    const tierColors = ['#AAAAAA', '#0099FF', '#9933FF', '#FFD001', '#FF4500', '#470077'];

    let gradient = context.createLinearGradient(200, 0, 400, 200);
    gradient.addColorStop(0, tierColors[emoji.tier - 1]);
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, tierColors[emoji.tier - 1]);

    const padding = 10;

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'rgba(255, 255, 255, 0.53)';
    context.fillRect(padding, padding, width - padding * 2, height - padding * 2);

    // node canvas is peak because it actually only loads the first frame of a gif, which is perfect
    const image = await loadImage(`https://cdn.discordapp.com/emojis/${emoji.id}.${(emoji.animated) ? 'gif' : 'png'}`);

    const imageDimensions = 128;
    context.drawImage(image, (width / 2) - (128 / 2), padding * 2, imageDimensions, imageDimensions);

    function text(text, y, color, shadowColor, size) {
        context.save();
        context.font = `${size}px Mirza`;
        context.textAlign = "center";
        context.fillStyle = color;
        context.textBaseline = "middle";
        context.shadowColor = shadowColor;
        context.shadowBlur = 8;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.fillText(text, width / 2, y);
        context.restore();
    }

    function drawTextMultipleLines(input, color, shadowColor, size, lines) {

        const tokens = input.split(' ');

        const maxWidth = 320;
        const baseFontSize = size;

        const approxTextWidth = input.length * baseFontSize * 0.6;
        const linesNeeded = Math.ceil(approxTextWidth / maxWidth);

        // this is like the most sketchy code ever written, I should research how to properly scale text

        if (lines < linesNeeded) { size -= (linesNeeded - lines) * 1.2 }

        context.font = `${size}px Mirza`;

        let line = '';

        for (const token of tokens) {
            const potentialLine = line + token + ' ';
            if (context.measureText(potentialLine).width < maxWidth) {
                line += token + ' ';
            } else {
                text(line, currentY, color, shadowColor, size);
                currentY += size + 3;
                line = token + ' ';
            }
        }
        text(line, currentY, color, shadowColor, size);
        currentY += size + 3;
    }

    const color = "#000000ff"
    const shadowColor = "#00000063";

    let currentY = padding * 3.6 + imageDimensions;

    text(emoji.owner + "'s", currentY, "#00000080", shadowColor, 20);
    currentY += 28;

    text(emoji.name, currentY, color, shadowColor, 35);
    currentY += 26;

    const tierColor = tierColors[emoji.tier - 1];
    text(tiers[emoji.tier - 1], currentY, tierColor, tierColor, 25);
    currentY += 30;

    text(`❤️ ${emoji.health}  ⚔️ ${emoji.damage}`, currentY, color, shadowColor, 23);
    currentY += 27;

    drawTextMultipleLines(emoji.bio, color, shadowColor, 20, 4);

    text(`———————————————————`, currentY, color, shadowColor, 20);
    currentY += 21;

    text(emoji.abilityName, currentY, color, shadowColor, 25);
    currentY += 25;

    drawTextMultipleLines(emoji.abilityBio, color, shadowColor, 20, 3);

    const buffer = canvas.toBuffer('image/png');

    return buffer;
}

module.exports = drawCard;
