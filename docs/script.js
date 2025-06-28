// 血統表のポジションデータ
const pedigreePositions = [
    // 本人
    {gen: 1, pos: 31, label: '本人', row: 1, sheetRow: 33, displayFactor: false},
    // 両親
    {gen: 2, pos: 15, label: '父', row: 1, sheetRow: 17, displayFactor: true},
    {gen: 2, pos: 30, label: '母', row: 9, sheetRow: 32, displayFactor: true},
    // 祖父母
    {gen: 3, pos: 7, label: '父方祖父', row: 1, sheetRow: 9, displayFactor: true},
    {gen: 3, pos: 14, label: '父方祖母', row: 5, sheetRow: 16, displayFactor: true},
    {gen: 3, pos: 22, label: '母方祖父', row: 9, sheetRow: 24, displayFactor: true, copyFrom: 7},
    {gen: 3, pos: 29, label: '母方祖母', row: 13, sheetRow: 31, displayFactor: true, copyFrom: 14},
    // 曾祖父母
    {gen: 4, pos: 3, label: '父方祖父の父', row: 1, sheetRow: 5, displayFactor: true},
    {gen: 4, pos: 6, label: '父方祖父の母', row: 3, sheetRow: 8, displayFactor: true},
    {gen: 4, pos: 10, label: '父方祖母の父', row: 5, sheetRow: 12, displayFactor: true},
    {gen: 4, pos: 13, label: '父方祖母の母', row: 7, sheetRow: 15, displayFactor: true},
    {gen: 4, pos: 18, label: '母方祖父の父', row: 9, sheetRow: 20, displayFactor: true, copyFrom: 3},
    {gen: 4, pos: 21, label: '母方祖父の母', row: 11, sheetRow: 23, displayFactor: true, copyFrom: 6},
    {gen: 4, pos: 25, label: '母方祖母の父', row: 13, sheetRow: 27, displayFactor: true, copyFrom: 10},
    {gen: 4, pos: 28, label: '母方祖母の母', row: 15, sheetRow: 30, displayFactor: true, copyFrom: 13},
    // 高祖父母
    {gen: 5, pos: 1, label: '父方祖父の父の父', row: 1, sheetRow: 3, displayFactor: true},
    {gen: 5, pos: 2, label: '父方祖父の父の母', row: 2, sheetRow: 4, displayFactor: true},
    {gen: 5, pos: 4, label: '父方祖父の母の父', row: 3, sheetRow: 6, displayFactor: true},
    {gen: 5, pos: 5, label: '父方祖父の母の母', row: 4, sheetRow: 7, displayFactor: true},
    {gen: 5, pos: 8, label: '父方祖母の父の父', row: 5, sheetRow: 10, displayFactor: true},
    {gen: 5, pos: 9, label: '父方祖母の父の母', row: 6, sheetRow: 11, displayFactor: true},
    {gen: 5, pos: 11, label: '父方祖母の母の父', row: 7, sheetRow: 13, displayFactor: true},
    {gen: 5, pos: 12, label: '父方祖母の母の母', row: 8, sheetRow: 14, displayFactor: true},
    {gen: 5, pos: 16, label: '母方祖父の父の父', row: 9, sheetRow: 18, displayFactor: true, copyFrom: 1},
    {gen: 5, pos: 17, label: '母方祖父の父の母', row: 10, sheetRow: 19, displayFactor: true, copyFrom: 2},
    {gen: 5, pos: 19, label: '母方祖父の母の父', row: 11, sheetRow: 21, displayFactor: true, copyFrom: 4},
    {gen: 5, pos: 20, label: '母方祖父の母の母', row: 12, sheetRow: 22, displayFactor: true, copyFrom: 5},
    {gen: 5, pos: 23, label: '母方祖母の父の父', row: 13, sheetRow: 25, displayFactor: true, copyFrom: 8},
    {gen: 5, pos: 24, label: '母方祖母の父の母', row: 14, sheetRow: 26, displayFactor: true, copyFrom: 9},
    {gen: 5, pos: 26, label: '母方祖母の母の父', row: 15, sheetRow: 28, displayFactor: true, copyFrom: 11},
    {gen: 5, pos: 27, label: '母方祖母の母の母', row: 16, sheetRow: 29, displayFactor: true, copyFrom: 12}
];

// 適性を表示すべき人物の定義
const displayPositions = [
    {pos: 31, sheetRow: 33, label: '本人'}, // 本人
    {pos: 30, sheetRow: 32, label: '母'}, // 母
    {pos: 15, sheetRow: 17, label: '父'}, // 父
    {pos: 29, sheetRow: 31, label: '母方祖母'}, // 母方祖母
    {pos: 22, sheetRow: 24, label: '母方祖父'}, // 母方祖父
    {pos: 14, sheetRow: 16, label: '父方祖母'}, // 父方祖母
    {pos: 7, sheetRow: 9, label: '父方祖父'} // 父方祖父
];

// 因子タイプ
const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];

// 適性ランク（G→A）
const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];

// グローバル変数
let horseData = [];
const LOCAL_STORAGE_KEY = 'umamusumePedigreeData';

/**
 * CSVテキストをオブジェクトの配列に変換する関数
 * @param {string} csvText - CSV形式のテキストデータ
 * @returns {Array} パースされたオブジェクトの配列
 */
function csvToObjects(csvText) {
    const headerMapping = {
        '名前': '名前', '芝': '芝', 'ダ': 'ダート', '短': '短距離', 'マ': 'マイル',
        '中': '中距離', '長': '長距離', '逃': '逃げ', '先': '先行', '差': '差し', '追': '追込'
    };
    const lines = csvText.trim().split(/\r\n|\n/);
    const csvHeaders = lines[0].split(',');
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < csvHeaders.length; j++) {
            const csvHeader = csvHeaders[j].trim();
            const internalKey = headerMapping[csvHeader];
            if (internalKey) {
                obj[internalKey] = currentline[j] ? currentline[j].trim() : '';
            }
        }
        if (Object.keys(obj).length > 0 && obj['名前']) {
            result.push(obj);
        }
    }
    return result;
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('umadata.csv');
        if (!response.ok) throw new Error(`CSVファイルの読み込みに失敗しました: ${response.statusText}`);
        const csvData = await response.text();
        horseData = csvToObjects(csvData);
        createPedigreeGrid();
        initializeDropdowns();
        setupCopyButtons();
        setupControlButtons();
        loadStateFromLocalStorage();
    } catch (error) {
        console.error('データ読み込みまたは初期化エラー:', error);
        alert('データの読み込みまたは初期化に失敗しました。ファイルが存在するか確認し、ページを再読み込みしてください。');
    }
});

function createPedigreeGrid() {
    const container = document.getElementById('pedigreeGrid');
    if (!container) return;

    pedigreePositions.forEach(p => {
        const cell = document.createElement('div');
        cell.className = 'pedigree-cell gen' + p.gen;
        cell.setAttribute('data-position', p.pos);

        let span = 1;
        if (p.gen === 1) span = 16;
        else if (p.gen === 2) span = 8;
        else if (p.gen === 3) span = 4;
        else if (p.gen === 4) span = 2;
        cell.style.gridRow = p.row + ' / span ' + span;

        let cellContent = `<div class="pedigree-cell-title">${p.label}</div>` +
            `<select id="individual_${p.pos}" class="individual-select"><option value="">未指定</option></select>`;

        if (p.displayFactor) {
            cellContent += `<div class="factor-input">` +
                `<select id="factor_${p.pos}" class="factor-select"><option value="">因子選択</option></select>` +
                `<div class="stars-group">` +
                `<label><input type="radio" name="stars_${p.pos}" value="0" id="stars_${p.pos}_0" checked>なし</label>` +
                `<label><input type="radio" name="stars_${p.pos}" value="1" id="stars_${p.pos}_1">★</label>` +
                `<label><input type="radio" name="stars_${p.pos}" value="2" id="stars_${p.pos}_2">★★</label>` +
                `<label><input type="radio" name="stars_${p.pos}" value="3" id="stars_${p.pos}_3">★★★</label>` +
                `</div></div>`;
        }

        if (p.pos === 22) {
            cellContent += `<button type="button" class="copy-button" data-action="copyGrandfather">父方祖父系統からコピー</button>`;
        } else if (p.pos === 29) {
            cellContent += `<button type="button" class="copy-button" data-action="copyGrandmother">父方祖母系統からコピー</button>`;
        }

        if (displayPositions.some(dp => dp.pos === p.pos)) {
            cellContent += `<div id="aptitude_${p.pos}" class="aptitude-display"></div>`;
        }

        cell.innerHTML = cellContent;
        container.appendChild(cell);
    });
}

function collectFormData() {
    const data = {};
    pedigreePositions.forEach(p => {
        const pos = p.pos;
        const individualSelect = document.getElementById(`individual_${pos}`);
        if (individualSelect) data[`individual_${pos}`] = individualSelect.value;
        if (p.displayFactor) {
            const factorSelect = document.getElementById(`factor_${pos}`);
            const starRadio = document.querySelector(`input[name="stars_${pos}"]:checked`);
            if (factorSelect) data[`factor_${pos}`] = factorSelect.value;
            data[`stars_${pos}`] = starRadio ? starRadio.value : '0';
        }
    });
    return data;
}

function saveStateToLocalStorage() {
    if (typeof(Storage) === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(collectFormData()));
}

function loadStateFromLocalStorage() {
    const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedDataJSON) return;
    applyDataToForm(JSON.parse(savedDataJSON));
}

function applyDataToForm(data) {
    pedigreePositions.forEach(p => {
        const pos = p.pos;
        const individualValue = data[`individual_${pos}`];
        const factorValue = data[`factor_${pos}`];
        const starValue = data[`stars_${pos}`];

        const individualSelect = document.getElementById(`individual_${pos}`);
        if (individualSelect && individualValue) {
            individualSelect.value = individualValue;
            individualSelect.dispatchEvent(new Event('change'));
        }

        if (p.displayFactor) {
            const factorSelect = document.getElementById(`factor_${pos}`);
            if (factorSelect && factorValue) factorSelect.value = factorValue;
            if (starValue) {
                const starRadio = document.getElementById(`stars_${pos}_${starValue}`);
                if (starRadio) starRadio.checked = true;
            }
        }
    });
}

function setupControlButtons() {
    document.getElementById('calculate-button').addEventListener('click', () => {
        calculateAptitudes();
        handleExport();
    });
    document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm("本当に入力内容をすべてリセットしますか？")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            location.reload();
        }
    });
    document.getElementById('import-button').addEventListener('click', () => {
        const importDataText = document.getElementById('import-data-input').value;
        if (!importDataText.trim()) { alert("インポートするデータを入力してください。"); return; }
        try {
            applyDataToForm(JSON.parse(importDataText));
            saveStateToLocalStorage();
            alert("データをインポートしました。");
        } catch (e) { alert("データの形式が正しくありません。"); }
    });
    document.getElementById('copy-export-button').addEventListener('click', () => {
        const exportTextarea = document.getElementById('export-data-output');
        const copyButton = document.getElementById('copy-export-button');
        navigator.clipboard.writeText(exportTextarea.value).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'コピーしました！';
            setTimeout(() => { copyButton.textContent = originalText; }, 2000);
        });
    });
}

function handleExport() {
    const exportContainer = document.getElementById('export-container');
    const exportTextarea = document.getElementById('export-data-output');
    exportTextarea.value = JSON.stringify(collectFormData(), null, 2);
    exportContainer.style.display = 'block';
}

function initializeDropdowns() {
    const horseNames = horseData.map(horse => horse.名前).sort();
    const eventHandler = (event) => {
        if (event.target.classList.contains('individual-select')) {
            updateHorseSelection(event.target.id.split('_')[1], event.target.value);
        }
        saveStateToLocalStorage();
    };
    document.querySelectorAll('.individual-select').forEach(select => {
        horseNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name; option.textContent = name;
            select.appendChild(option);
        });
        select.addEventListener('change', eventHandler);
    });
    document.querySelectorAll('.factor-select').forEach(select => {
        factorTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type; option.textContent = type;
            select.appendChild(option);
        });
        select.addEventListener('change', eventHandler);
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', eventHandler);
    });
}

function updateHorseSelection(pos, horseName) {
    const isDisplayTarget = displayPositions.some(dp => dp.pos == pos);
    const aptitudeDisplay = document.getElementById('aptitude_' + pos);
    if (isDisplayTarget && horseName) {
        const horse = horseData.find(h => h.名前 === horseName);
        if (horse) {
            updateAptitudeDisplay(pos, horse);
            selectBestFactor(pos, horse);
        }
    } else if (aptitudeDisplay) {
        aptitudeDisplay.innerHTML = '';
        aptitudeDisplay.style.display = 'none';
    }
}

function updateAptitudeDisplay(pos, horse) {
    const aptitudeDisplay = document.getElementById('aptitude_' + pos);
    if (!aptitudeDisplay) return;
    let html = '';
    const groups = {
        'バ場': ['芝', 'ダート'], '距離': ['短距離', 'マイル', '中距離', '長距離'], '脚質': ['逃げ', '先行', '差し', '追込']
    };
    const labels = {'ダート': 'ダ', '短距離': '短', 'マイル': 'マ', '中距離': '中', '長距離': '長', '先行': '先', '追込': '追'};
    for (const groupName in groups) {
        html += '<div class="aptitude-group">';
        groups[groupName].forEach(type => {
            html += `<div class="aptitude-item"><span class="apt-label">${labels[type] || type[0]}:</span><span class="apt-value rank-${horse[type]}">${horse[type]}</span></div>`;
        });
        html += '</div>';
    }
    aptitudeDisplay.innerHTML = html;
    aptitudeDisplay.style.display = 'block';
}

function selectBestFactor(pos, horse) {
    const factorSelect = document.getElementById('factor_' + pos);
    if (!factorSelect) return;
    const aptitudes = factorTypes.map(type => ({ type, value: horse[type] }))
        .sort((a, b) => aptitudeRanks.indexOf(b.value) - aptitudeRanks.indexOf(a.value));
    if (aptitudes.length > 0 && aptitudes[0].value !== 'G') {
        factorSelect.value = aptitudes[0].type;
    } else {
        factorSelect.value = '';
    }
}

function setupCopyButtons() {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (action === 'copyGrandfather') copyPaternalBranch(7, 22);
            else if (action === 'copyGrandmother') copyPaternalBranch(14, 29);
            saveStateToLocalStorage();
        });
    });
}

function copyPaternalBranch(fromPos, toPos) {
    const branchMap = { 7: [3, 6, 1, 2, 4, 5], 14: [10, 13, 8, 9, 11, 12] };
    const copyMap = { 22: [18, 21, 16, 17, 19, 20], 29: [25, 28, 23, 24, 26, 27] };
    copyIndividualData(fromPos, toPos);
    branchMap[fromPos].forEach((from, i) => copyIndividualData(from, copyMap[toPos][i]));
}

function copyIndividualData(fromPos, toPos) {
    document.getElementById('individual_' + toPos).value = document.getElementById('individual_' + fromPos).value;
    const fromFactor = document.getElementById('factor_' + fromPos);
    if (fromFactor) document.getElementById('factor_' + toPos).value = fromFactor.value;
    const fromStar = document.querySelector(`input[name="stars_${fromPos}"]:checked`);
    if (fromStar) document.getElementById(`stars_${toPos}_${fromStar.value}`).checked = true;
    document.getElementById('individual_' + toPos).dispatchEvent(new Event('change'));
}

function calculateAptitudes() {
    const formData = collectFormData();
    const results = { individuals: {}, originalAptitudes: {}, correctedAptitudes: {}, changes: {}, genePotentials: {} };
    displayPositions.forEach(({pos}) => {
        const horseName = formData['individual_' + pos];
        if (!horseName) return;
        const horse = horseData.find(h => h.名前 === horseName);
        if (!horse) return;
        results.individuals[pos] = { name: horseName, factor: pos !== 31 ? formData['factor_' + pos] : '', stars: pos !== 31 ? (formData['stars_' + pos] || '0') : '0' };
        results.originalAptitudes[pos] = { ...horse };
        const factorBoosts = calculateFactorBoosts(pos, formData);
        results.correctedAptitudes[pos] = {};
        results.changes[pos] = {};
        factorTypes.forEach(type => {
            const originalRank = results.originalAptitudes[pos][type];
            const boost = factorBoosts[type] || 0;
            const correctedRank = applyBoostToRank(originalRank, boost);
            results.correctedAptitudes[pos][type] = correctedRank;
            results.changes[pos][type] = (originalRank !== correctedRank);
        });
        results.genePotentials[pos] = calculateGenePotential(pos, formData);
    });
    displayResults(results);
}

function calculateFactorBoosts(targetPos, formData) {
    const boosts = {};
    factorTypes.forEach(type => boosts[type] = 0);
    const ancestorMap = {
        31: [15, 30, 7, 14, 22, 29], 15: [7, 14, 3, 6, 10, 13], 30: [22, 29, 18, 21, 25, 28],
        7: [3, 6, 1, 2, 4, 5], 14: [10, 13, 8, 9, 11, 12], 22: [18, 21, 16, 17, 19, 20], 29: [25, 28, 23, 24, 26, 27]
    };
    (ancestorMap[targetPos] || []).forEach(pos => {
        const factor = formData['factor_' + pos];
        const stars = parseInt(formData['stars_' + pos] || '0');
        if (factor && stars > 0) boosts[factor] = (boosts[factor] || 0) + stars;
    });
    const levels = {};
    for (const type in boosts) {
        const totalStars = boosts[type];
        if (totalStars >= 10) levels[type] = 4;
        else if (totalStars >= 7) levels[type] = 3;
        else if (totalStars >= 4) levels[type] = 2;
        else if (totalStars >= 1) levels[type] = 1;
        else levels[type] = 0;
    }
    return levels;
}

function applyBoostToRank(originalRank, boostLevel) {
    if (boostLevel <= 0) return originalRank;
    const rankIndex = aptitudeRanks.indexOf(originalRank);
    if (rankIndex === -1) return originalRank;
    return aptitudeRanks[Math.min(rankIndex + boostLevel, aptitudeRanks.length - 1)];
}

function calculateGenePotential(pos, formData) {
    const ancestorMap = {
        31: [15, 30, 7, 14, 22, 29], 15: [7, 14, 3, 6, 10, 13], 30: [22, 29, 18, 21, 25, 28],
        7: [3, 6, 1, 2, 4, 5], 14: [10, 13, 8, 9, 11, 12], 22: [18, 21, 16, 17, 19, 20], 29: [25, 28, 23, 24, 26, 27]
    };
    const factorCounts = {};
    (ancestorMap[pos] || []).forEach(ancestorPos => {
        const factor = formData['factor_' + ancestorPos];
        const stars = parseInt(formData['stars_' + ancestorPos] || '0');
        if (factor && stars > 0) factorCounts[factor] = (factorCounts[factor] || 0) + stars;
    });
    const potentials = [];
    for (const type in factorCounts) {
        const stars = factorCounts[type];
        if (stars >= 12) potentials.push({type, status: 'confirmed', stars});
        else if (stars >= 6) potentials.push({type, status: 'potential', stars});
    }
    return potentials.sort((a, b) => b.stars - a.stars).slice(0, 3);
}

// ★★★★★ 結果表示関数（修正箇所） ★★★★★
function displayResults(results) {
    const resultDiv = document.getElementById('results');
    if (!resultDiv) return;

    let html = '<h2>計算結果</h2>';
    html += '<div class="results-grid-container">';

    const resultPositions = [
        {pos: 7, label: '父方祖父', col: 1, row: 1, span: 1}, {pos: 14, label: '父方祖母', col: 1, row: 2, span: 1},
        {pos: 22, label: '母方祖父', col: 1, row: 3, span: 1}, {pos: 29, label: '母方祖母', col: 1, row: 4, span: 1},
        {pos: 15, label: '父', col: 2, row: 1, span: 2}, {pos: 30, label: '母', col: 2, row: 3, span: 2},
        {pos: 31, label: '本人', col: 3, row: 1, span: 4}
    ];

    resultPositions.forEach(p => {
        const individualResult = results.individuals[p.pos];
        const name = individualResult ? individualResult.name.split('[')[0].trim() : '未指定';
        const style = `grid-column: ${p.col}; grid-row: ${p.row} / span ${p.span};`;
        html += `<div class="pedigree-cell" style="${style}">`;
        html += `<div class="pedigree-cell-title">${p.label}</div><div>${name}</div>`;
        if (p.pos !== 31 && individualResult && individualResult.factor && individualResult.stars > 0) {
            html += `<div>${individualResult.factor}${individualResult.stars}★</div>`;
        }
        if (individualResult) {
            const correctedApt = results.correctedAptitudes[p.pos];
            const changes = results.changes[p.pos];
            html += `<div class="aptitude-display">${formatAptitudeTable(null, correctedApt, changes)}</div>`;
            const genePotentials = results.genePotentials[p.pos];
            if (genePotentials) html += generateGenePotentialHTML(genePotentials);
        }
        html += '</div>';
    });
    html += '</div>';
    html += `<div class="factor-explanation"><h3>因子による適性補正</h3><ul>` +
            `<li>1・2代前の因子: ☆1→1段階, ☆4→2段階, ☆7→3段階, ☆10→4段階上昇 (Aが上限)</li>` +
            `<li><span class="aptitude-value changed" style="display:inline-block; padding: 0 5px; color: yellow; text-shadow: 1px 1px 2px black;">黄色文字</span>は補正で上昇した項目</li>` +
            `</ul><h3>遺伝子付与可能性</h3><ul>` +
            `<li>同じ種類の因子☆6以上で「獲得」、☆12以上で「確定」と表示されます</li></ul></div>`;
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

function formatAptitudeTable(_, correctedApt, changes) {
    if (!correctedApt) return '';
    let html = '';
    const groups = {
        'バ場': ['芝', 'ダート'], '距離': ['短距離', 'マイル', '中距離', '長距離'], '脚質': ['逃げ', '先行', '差し', '追込']
    };
    const labels = {'ダート': 'ダ', '短距離': '短', 'マイル': 'マ', '中距離': '中', '長距離': '長', '先行': '先', '追込': '追'};
    for (const groupName in groups) {
        html += '<div class="aptitude-group">';
        groups[groupName].forEach(type => {
            const isChanged = changes[type];
            const className = `apt-value rank-${correctedApt[type]}${isChanged ? ' changed' : ''}`;
            html += `<div class="aptitude-item"><span class="apt-label">${labels[type] || type[0]}:</span><span class="${className}">${correctedApt[type]}</span></div>`;
        });
        html += '</div>';
    }
    return html;
}

function generateGenePotentialHTML(genePotentials) {
    if (!genePotentials || genePotentials.length === 0) return '';
    let html = '<div class="gene-potential">';
    genePotentials.forEach(gene => {
        if (gene.status === 'confirmed') {
            html += `<div><strong>${gene.type}遺伝子確定</strong> (${gene.stars}☆)</div>`;
        } else {
            html += `<div>${gene.type}遺伝子獲得 (${gene.stars}☆)</div>`;
        }
    });
    html += '</div>';
    return html;
}
