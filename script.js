const userName = prompt("Введите ваше имя:");
const displayName = userName ? userName : "гость";
alert("Привет, " + displayName + "! Добро пожаловать на страницу дизайнера.");

const layouts = [1440, 1920, 2560, 1200, 1024, 3840, 1600];
console.log("Массив ширин макетов (px):", layouts);

function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function filterWide(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 1920) {
            result.push(arr[i]);
        }
    }
    return result;
}

function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

const maxLayout = findMax(layouts);
const wideLayouts = filterWide(layouts);
const totalWidth = calculateSum(layouts);
const averageWidth = Math.round(totalWidth / layouts.length);

let narrowCount = 0;
for (let i = 0; i < layouts.length; i++) {
    if (layouts[i] <= 1200) {
        narrowCount++;
    }
}

const narrowShare = Math.round((narrowCount / layouts.length) * 100);

alert("Средняя ширина – " + averageWidth + " px, " + wideLayouts.length + " макетов – сверхширокие.");

console.log("Узких макетов (≤ 1200 px): " + narrowCount);
console.log("Доля узких макетов: " + narrowShare + "%");

if (maxLayout > 2560) {
    console.log("Такой макет лучше разбить на несколько экранов.");
}

// 5 laba

const STORAGE_KEY = 'designer_palette_v1';
const THEME_KEY = 'designer_theme_v1';

const defaultColors = [
    { hex: '#FF6B6B', name: 'Закат' },
    { hex: '#48D1CC', name: 'Океан' },
    { hex: '#228B22', name: 'Лес' },
    { hex: '#FFD700', name: 'Солнце' },
    { hex: '#DDA0DD', name: 'Лаванда' },
    { hex: '#333333', name: 'Графит' }
];

function isValidHex(hex) {
    return /^#([0-9A-Fa-f]{6})$/.test(hex);
}

function loadColors() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Ошибка чтения localStorage:', e);
    }
    return defaultColors.slice();
}

function saveColors(colors) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
    }
}

function loadTheme() {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'theme-dark' || stored === 'theme-light') {
            return stored;
        }
    } catch (e) {
        console.error('Ошибка чтения темы:', e);
    }
    return 'theme-light';
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
        console.error('Ошибка сохранения темы:', e);
    }
}

function createColorTile(color) {
    const tile = document.createElement('div');
    tile.className = 'color-tile';
    tile.dataset.hex = color.hex;

    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color.hex;

    const info = document.createElement('div');
    info.className = 'color-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'color-name';
    nameSpan.textContent = color.name;

    const hexSpan = document.createElement('span');
    hexSpan.className = 'color-hex';
    hexSpan.textContent = color.hex.toUpperCase();

    info.appendChild(nameSpan);
    info.appendChild(hexSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Удалить цвет ' + color.name);
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', function () {
        deleteColor(tile, color.hex);
    });

    tile.appendChild(swatch);
    tile.appendChild(info);
    tile.appendChild(deleteBtn);

    return tile;
}

function renderPalette(colors) {
    const container = document.getElementById('paletteContainer');
    if (!container) {
        console.error('Элемент не найден: #paletteContainer');
        return;
    }
    container.innerHTML = '';
    colors.forEach(function (color) {
        container.appendChild(createColorTile(color));
    });
}

function deleteColor(tile, hex) {
    let colors = loadColors();
    colors = colors.filter(function (c) {
        return c.hex.toUpperCase() !== hex.toUpperCase();
    });
    saveColors(colors);
    tile.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    tile.style.opacity = '0';
    tile.style.transform = 'scale(0.8)';
    setTimeout(function () {
        renderPalette(colors);
    }, 300);
}

function addColor() {
    const hexInput = prompt('Введите HEX-код цвета (например, #FF6B6B):');
    if (!hexInput) {
        return;
    }
    let hex = hexInput.trim();
    if (hex.charAt(0) !== '#') {
        hex = '#' + hex;
    }
    if (!isValidHex(hex)) {
        alert('Некорректный HEX-код. Используйте формат #RRGGBB.');
        return;
    }
    const nameInput = prompt('Введите название цвета:');
    if (!nameInput || !nameInput.trim()) {
        alert('Название цвета не может быть пустым.');
        return;
    }
    const colors = loadColors();
    const exists = colors.some(function (c) {
        return c.hex.toUpperCase() === hex.toUpperCase();
    });
    if (exists) {
        alert('Такой цвет уже есть в палитре.');
        return;
    }
    colors.push({ hex: hex.toUpperCase(), name: nameInput.trim() });
    saveColors(colors);
    renderPalette(colors);
}

function clearPalette() {
    const container = document.getElementById('paletteContainer');
    if (!container) {
        console.error('Элемент не найден: #paletteContainer');
        return;
    }
    const tiles = container.querySelectorAll('.color-tile');
    if (tiles.length === 0) {
        alert('Палитра уже пуста.');
        return;
    }
    const confirmClear = confirm('Удалить все цвета из палитры?');
    if (confirmClear) {
        saveColors([]);
        renderPalette([]);
    }
}

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) {
        console.error('Элемент не найден: #themeToggleBtn');
        return;
    }
    const currentTheme = body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
    const newTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    body.classList.remove('theme-dark', 'theme-light');
    body.classList.add(newTheme);
    themeBtn.textContent = newTheme === 'theme-dark' ? 'Светлая тема' : 'Тёмная тема';
    saveTheme(newTheme);
}

function togglePaletteVisibility() {
    const section = document.getElementById('palette-manager');
    const toggleBtn = document.getElementById('togglePaletteBtn');
    if (!section) {
        console.error('Элемент не найден: #palette-manager');
        return;
    }
    if (!toggleBtn) {
        console.error('Элемент не найден: #togglePaletteBtn');
        return;
    }
    const isHidden = section.classList.contains('hidden');
    if (isHidden) {
        section.classList.remove('hidden');
        toggleBtn.textContent = 'Скрыть палитру';
    } else {
        section.classList.add('hidden');
        toggleBtn.textContent = 'Показать палитру';
    }
}

function init() {
    const addBtn = document.getElementById('addColorBtn');
    const clearBtn = document.getElementById('clearPaletteBtn');
    const themeBtn = document.getElementById('themeToggleBtn');
    const toggleBtn = document.getElementById('togglePaletteBtn');

    if (!addBtn) console.error('Элемент не найден: #addColorBtn');
    if (!clearBtn) console.error('Элемент не найден: #clearPaletteBtn');
    if (!themeBtn) console.error('Элемент не найден: #themeToggleBtn');
    if (!toggleBtn) console.error('Элемент не найден: #togglePaletteBtn');

    const savedTheme = loadTheme();
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(savedTheme);
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'theme-dark' ? 'Светлая тема' : 'Тёмная тема';
    }

    const colors = loadColors();
    renderPalette(colors);

    if (addBtn) addBtn.addEventListener('click', addColor);
    if (clearBtn) clearBtn.addEventListener('click', clearPalette);
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (toggleBtn) toggleBtn.addEventListener('click', togglePaletteVisibility);
}

document.addEventListener('DOMContentLoaded', init);