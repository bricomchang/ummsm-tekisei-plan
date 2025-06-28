const inputPedigreePositions = [
    {gen: 1, pos: 31, label: '本人', row: 1, displayFactor: false}, {gen: 2, pos: 15, label: '父', row: 1, displayFactor: true},
    {gen: 2, pos: 30, label: '母', row: 9, displayFactor: true}, {gen: 3, pos: 7, label: '父方祖父', row: 1, displayFactor: true},
    {gen: 3, pos: 14, label: '父方祖母', row: 5, displayFactor: true}, {gen: 3, pos: 22, label: '母方祖父', row: 9, displayFactor: true},
    {gen: 3, pos: 29, label: '母方祖母', row: 13, displayFactor: true}, {gen: 4, pos: 3, label: '父方祖父の父', row: 1, displayFactor: true},
    {gen: 4, pos: 6, label: '父方祖父の母', row: 3, displayFactor: true}, {gen: 4, pos: 10, label: '父方祖母の父', row: 5, displayFactor: true},
    {gen: 4, pos: 13, label: '父方祖母の母', row: 7, displayFactor: true}, {gen: 4, pos: 18, label: '母方祖父の父', row: 9, displayFactor: true},
    {gen: 4, pos: 21, label: '母方祖父の母', row: 11, displayFactor: true}, {gen: 4, pos: 25, label: '母方祖母の父', row: 13, displayFactor: true},
    {gen: 4, pos: 28, label: '母方祖母の母', row: 15, displayFactor: true}, {gen: 5, pos: 1, label: '父方祖父の父の父', row: 1, displayFactor: true},
    {gen: 5, pos: 2, label: '父方祖父の父の母', row: 2, displayFactor: true}, {gen: 5, pos: 4, label: '父方祖父の母の父', row: 3, displayFactor: true},
    {gen: 5, pos: 5, label: '父方祖父の母の母', row: 4, displayFactor: true}, {gen: 5, pos: 8, label: '父方祖母の父の父', row: 5, displayFactor: true},
    {gen: 5, pos: 9, label: '父方祖母の父の母', row: 6, displayFactor: true}, {gen: 5, pos: 11, label: '父方祖母の母の父', row: 7, displayFactor: true},
    {gen: 5, pos: 12, label: '父方祖母の母の母', row: 8, displayFactor: true}, {gen: 5, pos: 16, label: '母方祖父の父の父', row: 9, displayFactor: true},
    {gen: 5, pos: 17, label: '母方祖父の父の母', row: 10, displayFactor: true}, {gen: 5, pos: 19, label: '母方祖父の母の父', row: 11, displayFactor: true},
    {gen: 5, pos: 20, label: '母方祖父の母の母', row: 12, displayFactor: true}, {gen: 5, pos: 23, label: '母方祖母の父の父', row: 13, displayFactor: true},
    {gen: 5, pos: 24, label: '母方祖母の父の母', row: 14, displayFactor: true}, {gen: 5, pos: 26, label: '母方祖母の母の父', row: 15, displayFactor: true},
    {gen: 5, pos: 27, label: '母方祖母の母の母', row: 16, displayFactor: true}
];
const displayPositions = [31, 15, 30, 7, 14, 22, 29];
const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
let horseData = [];
const LOCAL_STORAGE_KEY = 'umamusumePedigreeData';

function csvToObjects(csvText) {
    const headerMapping = {'名前': '名前', '芝': '芝', 'ダ': 'ダート', '短': '短距離', 'マ': 'マイル', '中': '中距離', '長': '長距離', '逃': '逃げ', '先': '先行', '差': '差し', '追': '追込'};
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
            if (internalKey) obj[internalKey] = currentline[j] ? currentline[j].trim() : '';
        }
        if (Object.keys(obj).length > 0 && obj['名前']) result.push(obj);
    }
    return result;
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('umadata.csv');
        if (!response.ok) throw new Error(`CSV読込失敗: ${response.statusText}`);
        const csvData = await response.text();
        horseData = csvToObjects(csvData);
        createPedigreeGrid();
        initializeDropdowns();
        setupCopyButtons();
        setupControlButtons();
        loadStateFromLocalStorage();
    } catch (error) {
        console.error('初期化エラー:', error);
        alert('データ読込/初期化に失敗しました。');
    }
});

function createPedigreeGrid() {
    const container = document.getElementById('pedigreeGrid');
    if (!container) return;
    inputPedigreePositions.forEach(p => {
        const cell = document.createElement('div');
        cell.className = 'pedigree-cell gen' + p.gen;
        cell.setAttribute('data-position', p.pos);
        let span = 1;
        if (p.gen === 1) span = 16; else if (p.gen === 2) span = 8; else if (p.gen === 3) span = 4; else if (p.gen === 4) span = 2;
        cell.style.gridRow = p.row + ' / span ' + span;

        let content = `<div class="pedigree-cell-title">${p.label}</div><select id="individual_${p.pos}" class="individual-select"><option value="">未指定</option></select>`;
        if (p.displayFactor) {
            content += `<div class="factor-input"><select id="factor_${p.pos}" class="factor-select"><option value="">因子選択</option></select><div class="stars-group">` +
                [0, 1, 2, 3].map(s => `<label><input type="radio" name="stars_${p.pos}" value="${s}" id="stars_${p.pos}_${s}" ${s===0?'checked':''}>${s===0?'なし': '★'.repeat(s)}</label>`).join('') +
                `</div></div>`;
        }
        if (p.pos === 22) content += `<button type="button" class="copy-button" data-action="copyGrandfather">父方祖父系統からコピー</button>`;
        else if (p.pos === 29) content += `<button type="button" class="copy-button" data-action="copyGrandmother">父方祖母系統からコピー</button>`;
        
        if (displayPositions.includes(p.pos)) {
            content += `<div id="aptitude_${p.pos}" class="aptitude-display" style="display:none;"></div>`;
        }
        cell.innerHTML = content;
        container.appendChild(cell);
    });
}

function collectFormData() {
    const data = {};
    inputPedigreePositions.forEach(p => {
        const pos = p.pos;
        data[`individual_${pos}`] = document.getElementById(`individual_${pos}`)?.value;
        if (p.displayFactor) {
            data[`factor_${pos}`] = document.getElementById(`factor_${pos}`)?.value;
            const starRadio = document.querySelector(`input[name="stars_${pos}"]:checked`);
            data[`stars_${pos}`] = starRadio ? starRadio.value : '0';
        }
    });
    return data;
}

function saveStateToLocalStorage() { if (typeof(Storage) !== "undefined") localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(collectFormData())); }
function loadStateFromLocalStorage() { const data = localStorage.getItem(LOCAL_STORAGE_KEY); if (data) applyDataToForm(JSON.parse(data)); }

function applyDataToForm(data) {
    inputPedigreePositions.forEach(p => {
        const pos = p.pos;
        const indSel = document.getElementById(`individual_${p.pos}`);
        if (indSel && data[`individual_${p.pos}`]) {
            indSel.value = data[`individual_${p.pos}`];
            indSel.dispatchEvent(new Event('change'));
            if (p.displayFactor) {
                const facSel = document.getElementById(`factor_${p.pos}`);
                if (facSel && data[`factor_${p.pos}`]) facSel.value = data[`factor_${p.pos}`];
                if (data[`stars_${p.pos}`]) {
                    const starRad = document.getElementById(`stars_${p.pos}_${data[`stars_${p.pos}`]}`);
                    if (starRad) starRad.checked = true;
                }
            }
        }
    });
}

function setupControlButtons() {
    document.getElementById('calculate-button').addEventListener('click', () => { calculateAptitudes(); handleExport(); });
    document.getElementById('reset-button').addEventListener('click', () => { if (confirm("入力内容をリセットしますか？")) { localStorage.removeItem(LOCAL_STORAGE_KEY); location.reload(); } });
    document.getElementById('import-button').addEventListener('click', () => {
        const text = document.getElementById('import-data-input').value;
        if (!text.trim()) { alert("インポートデータを入力してください。"); return; }
        try { applyDataToForm(JSON.parse(text)); saveStateToLocalStorage(); alert("インポートしました。"); } catch (e) { alert("データ形式が正しくありません。"); }
    });
    document.getElementById('copy-export-button').addEventListener('click', () => {
        const textarea = document.getElementById('export-data-output');
        navigator.clipboard.writeText(textarea.value).then(() => { textarea.select(); alert('クリップボードにコピーしました'); });
    });
}

function handleExport() {
    const container = document.getElementById('export-container');
    const textarea = document.getElementById('export-data-output');
    textarea.value = JSON.stringify(collectFormData(), null, 2);
    container.style.display = 'block';
}

function initializeDropdowns() {
    const horseNames = horseData.map(horse => horse.名前).sort();
    const handler = (e) => {
        const target = e.target;
        if (target.classList.contains('individual-select')) {
            updateHorseSelection(target.id.split('_')[1], target.value);
        }
        saveStateToLocalStorage();
    };
    document.querySelectorAll('.individual-select').forEach(s => { horseNames.forEach(n => { const o = document.createElement('option'); o.value = n; o.textContent = n; s.appendChild(o); }); s.addEventListener('change', handler); });
    document.querySelectorAll('.factor-select').forEach(s => { factorTypes.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; s.appendChild(o); }); s.addEventListener('change', handler); });
    document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', handler));
}

function updateHorseSelection(pos, horseName) {
    const isDisplay = displayPositions.includes(parseInt(pos));
    const aptDiv = document.getElementById('aptitude_' + pos);
    if (isDisplay && horseName) {
        const horse = horseData.find(h => h.名前 === horseName);
        if (horse) {
            aptDiv.innerHTML = formatAptitudeTable(horse);
            aptDiv.style.display = 'block';
            selectBestFactor(pos, horse);
        }
    } else if (aptDiv) {
        aptDiv.innerHTML = '';
        aptDiv.style.display = 'none';
    }
}

function selectBestFactor(pos, horse) {
    const factorSelect = document.getElementById('factor_' + pos);
    if (!factorSelect) return;
    const aptitudes = factorTypes.map(t => ({ t, v: horse[t] })).sort((a, b) => aptitudeRanks.indexOf(b.v) - aptitudeRanks.indexOf(a.v));
    factorSelect.value = (aptitudes.length > 0 && aptitudes[0].v !== 'G') ? aptitudes[0].t : '';
}

function setupCopyButtons() {
    document.querySelectorAll('.copy-button').forEach(b => {
        b.addEventListener('click', function() {
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

// ★★★★★ コピー機能の修正箇所 ★★★★★
function copyIndividualData(fromPos, toPos) {
    const fromInd = document.getElementById(`individual_${fromPos}`);
    const toInd = document.getElementById(`individual_${toPos}`);
    toInd.value = fromInd.value;

    const fromFactor = document.getElementById(`factor_${fromPos}`);
    const fromFactorValue = fromFactor ? fromFactor.value : '';
    
    const fromStar = document.querySelector(`input[name="stars_${fromPos}"]:checked`);
    const fromStarValue = fromStar ? fromStar.value : '0';

    const horse = horseData.find(h => h.名前 === toInd.value);
    const aptDiv = document.getElementById('aptitude_' + toPos);
    if (horse && aptDiv) {
        aptDiv.innerHTML = formatAptitudeTable(horse);
        aptDiv.style.display = 'block';
    } else if (aptDiv) {
        aptDiv.innerHTML = '';
        aptDiv.style.display = 'none';
    }
    
    const toFactor = document.getElementById(`factor_${toPos}`);
    if(toFactor) toFactor.value = fromFactorValue;

    const toStar = document.getElementById(`stars_${toPos}_${fromStarValue}`);
    if (toStar) toStar.checked = true;
}


function calculateAptitudes() {
    const formData = collectFormData();
    const results = { individuals: {}, originalAptitudes: {}, correctedAptitudes: {}, changes: {}, genePotentials: {} };
    inputPedigreePositions.forEach(({pos}) => {
        const horseName = formData[`individual_${pos}`];
        if (!horseName) return;
        const horse = horseData.find(h => h.名前 === horseName);
        if (!horse) return;
        results.individuals[pos] = { name: horseName, factor: formData[`factor_${pos}`] || '', stars: formData[`stars_${pos}`] || '0' };
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
    const boosts = {}; factorTypes.forEach(t => boosts[t] = 0);
    const map = { 31: [15, 30, 7, 14, 22, 29], 15: [7, 14, 3, 6, 10, 13], 30: [22, 29, 18, 21, 25, 28], 7: [3, 6, 1, 2, 4, 5], 14: [10, 13, 8, 9, 11, 12], 22: [18, 21, 16, 17, 19, 20], 29: [25, 28, 23, 24, 26, 27] };
    (map[targetPos] || []).forEach(p => { const f = formData[`factor_${p}`], s = parseInt(formData[`stars_${p}`] || '0'); if (f && s > 0) boosts[f] = (boosts[f] || 0) + s; });
    const levels = {}; for (const t in boosts) { const stars = boosts[t]; if (stars >= 10) levels[t] = 4; else if (stars >= 7) levels[t] = 3; else if (stars >= 4) levels[t] = 2; else if (stars >= 1) levels[t] = 1; else levels[t] = 0; }
    return levels;
}

function applyBoostToRank(rank, boost) { if (boost <= 0) return rank; const idx = aptitudeRanks.indexOf(rank); if (idx === -1) return rank; return aptitudeRanks[Math.min(idx + boost, aptitudeRanks.length - 1)]; }

function calculateGenePotential(pos, formData) {
    const map = { 31: [15, 30, 7, 14, 22, 29], 15: [7, 14, 3, 6, 10, 13], 30: [22, 29, 18, 21, 25, 28], 7: [3, 6, 1, 2, 4, 5], 14: [10, 13, 8, 9, 11, 12], 22: [18, 21, 16, 17, 19, 20], 29: [25, 28, 23, 24, 26, 27] };
    const counts = {}; (map[pos] || []).forEach(p => { const f = formData[`factor_${p}`], s = parseInt(formData[`stars_${p}`] || '0'); if (f && s > 0) counts[f] = (counts[f] || 0) + s; });
    const potentials = []; for (const type in counts) { const stars = counts[type]; if (stars >= 12) potentials.push({type, status: 'confirmed', stars}); else if (stars >= 6) potentials.push({type, status: 'potential', stars}); }
    return potentials.sort((a, b) => b.stars - a.stars).slice(0, 3);
}

// ★★★★★ 結果表示関数（修正箇所） ★★★★★
function displayResults(results) {
    const resultDiv = document.getElementById('results');
    if (!resultDiv) return;
    let html = '<h2>計算結果</h2><div class="results-pedigree-container">';
    const layoutMap = {
        1: { pos: 31, col: 1, row: 1, rowSpan: 16 }, 2: [{ pos: 15, col: 2, row: 1, rowSpan: 8 }, { pos: 30, col: 2, row: 9, rowSpan: 8 }],
        3: [{ pos: 7,  col: 3, row: 1, rowSpan: 4 }, { pos: 14, col: 3, row: 5, rowSpan: 4 }, { pos: 22, col: 3, row: 9, rowSpan: 4 }, { pos: 29, col: 3, row: 13, rowSpan: 4 }],
        4: [{ pos: 3, col: 4, row: 1, rowSpan: 2 }, { pos: 6, col: 4, row: 3, rowSpan: 2 }, { pos: 10, col: 4, row: 5, rowSpan: 2 }, { pos: 13, col: 4, row: 7, rowSpan: 2 }, { pos: 18, col: 4, row: 9, rowSpan: 2 }, { pos: 21, col: 4, row: 11, rowSpan: 2 }, { pos: 25, col: 4, row: 13, rowSpan: 2 }, { pos: 28, col: 4, row: 15, rowSpan: 2 }],
        5: [{ pos: 1, col: 5, row: 1 }, { pos: 2, col: 5, row: 2 }, { pos: 4, col: 5, row: 3 }, { pos: 5, col: 5, row: 4 }, { pos: 8, col: 5, row: 5 }, { pos: 9, col: 5, row: 6 }, { pos: 11, col: 5, row: 7 }, { pos: 12, col: 5, row: 8 }, { pos: 16, col: 5, row: 9 }, { pos: 17, col: 5, row: 10 }, { pos: 19, col: 5, row: 11 }, { pos: 20, col: 5, row: 12 }, { pos: 23, col: 5, row: 13 }, { pos: 24, col: 5, row: 14 }, { pos: 26, col: 5, row: 15 }, { pos: 27, col: 5, row: 16 }]
    };
    [layoutMap[1], ...layoutMap[2], ...layoutMap[3], ...layoutMap[4], ...layoutMap[5]].forEach(p => {
        const individual = results.individuals[p.pos];
        const name = individual ? individual.name.split('[')[0].trim() : '未指定';
        const factor = (individual && individual.factor && individual.stars > 0) ? `${individual.factor}${individual.stars}★` : '';
        const style = `grid-column: ${p.col}; grid-row: ${p.row} / span ${p.rowSpan || 1};`;
        html += `<div class="result-cell" style="${style}">`;
        html += `<div class="individual-name">${name}</div>`;
        if (factor) html += `<div class="factor-info">${factor}</div>`;
        if (individual && displayPositions.includes(p.pos)) {
            html += `<div class="aptitude-display" style="display:block;">${formatAptitudeTable(results.correctedAptitudes[p.pos], results.changes[p.pos])}</div>`;
            html += generateGenePotentialHTML(results.genePotentials[p.pos]);
        }
        html += '</div>';
    });
    html += '</div>';
    html += `<div class="calculation-info"><h3>補足</h3><ul>` +
            `<li><b>適性補正:</b> 1・2代前の因子☆1/4/7/10個で適性が1/2/3/4段階UP (A上限)。<span style="color:red; font-weight:bold;">赤字</span>は上昇した項目。</li>` +
            `<li><b>遺伝子:</b> 同種因子☆6以上で「獲得」、☆12以上で「確定」と表示。</li>` +
            `</ul></div>`;
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// ★★★★★ 適性表示関数（修正箇所） ★★★★★
function formatAptitudeTable(aptitudes, changes = {}) {
    if (!aptitudes) return '';
    let html = '<table class="aptitude-table">';
    const layout = [
        ['芝', 'ダート'],
        ['短距離', 'マイル', '中距離', '長距離'],
        ['逃げ', '先行', '差し', '追込']
    ];
    const labels = {'芝':'芝', 'ダート':'ダ', '短距離':'短', 'マイル':'マ', '中距離':'中', '長距離':'長', '逃げ':'逃', '先行':'先', '差し':'差', '追込':'追'};
    
    layout.forEach(row => {
        html += '<tr>';
        row.forEach(type => { html += `<td><span class="apt-label">${labels[type]}</span></td>`; });
        html += '</tr><tr>';
        row.forEach(type => {
            const rank = aptitudes[type] || 'G';
            const isChanged = changes[type] || false;
            html += `<td class="rank-${rank}"><span class="apt-value${isChanged ? ' changed' : ''}">${rank}</span></td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}


function generateGenePotentialHTML(potentials) {
    if (!potentials || potentials.length === 0) return '';
    let html = '<div class="gene-potential">';
    potentials.forEach(p => { html += `<div>${p.status === 'confirmed' ? `<strong>${p.type}遺伝子確定</strong>` : `${p.type}遺伝子獲得`} (${p.stars}☆)</div>`; });
    html += '</div>';
    return html;
}
