// ======================================================================
// 3A: Project Data, Global State, and Element Selection
// ======================================================================

const COLOR_PALETTES = [
    // --- Existing Palettes ---
    { name: "Ocean Sunset", colors: ['#A8DADC', '#457B9D', '#1D3557', '#F1FAEE'] },
    { name: "Forest Calm", colors: ['#2A9D8F', '#264653', '#E9C46A', '#F4A261'] },
    { name: "Desert Rose", colors: ['#9D4EDD', '#C77DFF', '#E0AAFF', '#F7BFEF'] },
    { name: "Urban Concrete", colors: ['#333333', '#8D99AE', '#EDF2F4', '#D90429'] },
    { name: "Neon Punch", colors: ['#FF006E', '#8338EC', '#3A86FF', '#FFBE0B'] },

    // --- NEW Palettes ---
    { name: "Earthy Clay", colors: ['#784F44', '#BC987E', '#FFF0E9', '#A22C29'] },
    { name: "Mint Dream", colors: ['#C7E8F0', '#9AD1D4', '#66B9C2', '#2A4D69'] },
    { name: "Retro Pop", colors: ['#F7B538', '#EF6567', '#009B77', '#3C3F58'] },
    { name: "Deep Galaxy", colors: ['#1A1838', '#3F3B66', '#8C88A8', '#E6E6FA'] },
    { name: "Soft Pastel", colors: ['#F5E6E8', '#D9B4C0', '#B97C90', '#7A5B6B'] }
];

const FONT_PAIRS = [
    { heading: 'Oswald', body: 'Lato' },
    { heading: 'Playfair Display', body: 'Open Sans' },
    { heading: 'Bebas Neue', body: 'Roboto' },
    { heading: 'Montserrat', body: 'Source Sans Pro' },
    { heading: 'Dancing Script', body: 'Poppins' }
];

// Global State
let currentPalette = null;
let currentFontPair = null;
let isFontLocked = false;

// Utility functions for DOM selection
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Cached DOM elements
const elements = {
    generateBtn: $('#generate-btn'),
    lockFontBtn: $('#lock-font-btn'),
    headingText: $('#heading-text'),
    bodyText: $('#body-text'),
    fontDisplay: $('#font-display'),
    colorDisplay: $('#color-palette-display'),
    hexInfo: $('#hex-codes-info'),
    root: $(':root'),
    body: $('body'),


    themeToggle: $('#theme-toggle')
};

// Utility function to get a random item
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];


// ======================================================================
// 3B: Core Logic Functions
// ======================================================================

/**
 * Applies the selected font pair to the HTML elements.
 * @param {object} pair - The font pair object.
 */
function applyFonts(pair) {
    currentFontPair = pair;

    // Apply new font families
    elements.headingText.style.fontFamily = '${pair.heading}', sans - serif;
    elements.bodyText.style.fontFamily = '${pair.body}', sans - serif;

    // Update the display text
    elements.fontDisplay.textContent = `${pair.heading} / ${pair.body}`;

    // Note: The Google Fonts are already imported in index.html for simplicity.
}

/**
 * Applies the selected color palette to the global CSS variables and updates the swatches.
 * @param {object} palette - The color palette object.
 */
function applyColors(palette) {
    currentPalette = palette;
    elements.colorDisplay.innerHTML = ''; // Clear previous swatches

    // Assign colors from the palette array to specific roles
    const [bgColor, mainColor, accentColor, secondaryColor] = palette.colors;

    // 1. Update global CSS variables (used by other elements)
    elements.root.style.setProperty('--main-bg-color', bgColor);
    elements.root.style.setProperty('--primary-text-color', accentColor);
    elements.root.style.setProperty('--secondary-text-color', mainColor);
    elements.root.style.setProperty('--highlight-color', secondaryColor);

    // 2. Dynamically create color swatches and copy buttons
    palette.colors.forEach(hex => {
        const block = document.createElement('div');
        block.className = 'color-block';
        block.style.backgroundColor = hex;

        // Simple text color readability check (optional)
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (luminance > 0.5) {
            block.style.color = '#333'; // Darker text on light colors
        }

        block.innerHTML = `
            <span>${hex}</span>
            <button class="copy-btn" data-hex="${hex}">Copy</button>
        `;
        elements.colorDisplay.appendChild(block);
    });

    // 3. Update the info panel with palette details
    elements.hexInfo.innerHTML = `
        <p>Palette Name: <strong>${palette.name}</strong></p>
        <p>Colors: ${palette.colors.join(', ')}</p>
    `;

    // Re-attach click listeners for the new copy buttons
    attachCopyListeners();
}

/**
 * Main function to generate and update the entire palate, respecting the font lock.
 */


function applyFonts(pair) {
    currentFontPair = pair;

    // FIX: Ensure 'sans-serif' is inside the string using template literals (backticks).
    elements.headingText.style.fontFamily = `'${pair.heading}', "sans-serif"`;
    elements.bodyText.style.fontFamily = `'${pair.body}', "sans-serif"`;

    // Update the display text
    elements.fontDisplay.textContent = `${pair.heading} / ${pair.body}`;

    // ... (rest of the function) ...
}
function generatePalate() {
    // 1. Handle Fonts (check lock status)
    if (!isFontLocked) {
        const newFontPair = getRandomItem(FONT_PAIRS);
        applyFonts(newFontPair);
    }

    // 2. Handle Colors (always generate a new color palette)
    const newColorPalette = getRandomItem(COLOR_PALETTES);
    applyColors(newColorPalette);
}

// --- Clipboard API & Global Listeners ---

/**
 * Attaches click event listeners to all dynamically created copy buttons.
 */
function attachCopyListeners() {
    $$('.copy-btn').forEach(btn => {
        btn.onclick = () => {
            const hex = btn.dataset.hex;
            // Use the modern Clipboard API
            navigator.clipboard.writeText(hex).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => { btn.textContent = originalText; }, 1000); // Reset text after 1s
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };
    });
}

/**
 * Attaches event listeners for the main Generate and Lock buttons.
 */
function attachGlobalListeners() {
    // 1. Generate Button Listener
    elements.generateBtn.addEventListener('click', generatePalate);

    // 2. Font Lock Button Listener
    elements.lockFontBtn.addEventListener('click', () => {
        isFontLocked = !isFontLocked;
        elements.lockFontBtn.textContent = isFontLocked ? '🔒 Font Locked' : '🔓 Lock Font Pair';
        elements.lockFontBtn.classList.toggle('locked', isFontLocked);

        // Optional: Provide visual feedback when font is unlocked on next generate
        if (!isFontLocked) {
            elements.lockFontBtn.textContent = '🔓 Ready to Generate New Font';
            setTimeout(() => { elements.lockFontBtn.textContent = '🔓 Lock Font Pair'; }, 1000);
        }
    });
    elements.themeToggle.addEventListener('change', () => {
        // The .checked property tells us the current state of the checkbox
        if (elements.themeToggle.checked) {
            // If checked (on), apply dark mode
            elements.body.classList.add('dark-mode');
        } else {
            // If unchecked (off), remove dark mode
            elements.body.classList.remove('dark-mode');
        }

    });
}

// --- Initialization ---
// The entry point of the application
document.addEventListener('DOMContentLoaded', () => {
    attachGlobalListeners();
    generatePalate(); // Generate the first palate on page load
});