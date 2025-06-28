const inputPedigreePositions = [
    {gen: 1, pos: 31, label: '本人', row: 1, displayFactor: false},
    {gen: 2, pos: 15, label: '父', row: 1, displayFactor: true},
    {gen: 2, pos: 30, label: '母', row: 9, displayFactor: true},
    {gen: 3, pos: 7, label: '父方祖父', row: 1, displayFactor: true},
    {gen: 3, pos: 14, label: '父方祖母', row: 5, displayFactor: true},
    {gen: 3, pos: 22, label: '母方祖父', row: 9, displayFactor: true},
    {gen: 3, pos: 29, label: '母方祖母', row: 13, displayFactor: true},
    {gen: 4, pos: 3, label: '父方祖父の父', row: 1, displayFactor: true},
    {gen: 4, pos: 6, label: '父方祖父の母', row: 3, displayFactor: true},
    {gen: 4, pos: 10, label: '父方祖母の父', row: 5, displayFactor: true},
    {gen: 4, pos: 13, label: '父方祖母の母', row: 7, displayFactor: true},
    {gen: 4, pos: 18, label: '母方祖父の父', row: 9, displayFactor: true},
    {gen: 4, pos: 21, label: '母方祖父の母', row: 11, displayFactor: true},
    {gen: 4, pos: 25, label: '母方祖母の父', row: 13, displayFactor: true},
    {gen: 4, pos: 28, label: '母方祖母の母', row: 15, displayFactor: true},
    {gen: 5, pos: 1, label: '父方祖父の父の父', row: 1, displayFactor: true},
    {gen: 5, pos: 2, label: '父方祖父の父の母', row: 2, displayFactor: true},
    {gen: 5, pos: 4, label: '父方祖父の母の父', row: 3, displayFactor: true},
    {gen: 5, pos: 5, label: '父方祖父の母の母', row: 4, displayFactor: true},
    {gen: 5, pos: 8, label: '父方祖母の父の父', row: 5, displayFactor: true},
    {gen: 5, pos: 9, label: '父方祖母の父の母', row: 6, displayFactor: true},
    {gen: 5, pos: 11, label: '父方祖母の母の父', row: 7, displayFactor: true},
    {gen: 5, pos: 12, label: '父方祖母の母の母', row: 8, displayFactor: true},
    {gen: 5, pos: 16, label: '母方祖父の父の父', row: 9, displayFactor: true},
    {gen: 5, pos: 17, label: '母方祖父の父の母', row: 10, displayFactor: true},
    {gen: 5, pos: 19, label: '母方祖父の母の父', row: 11, displayFactor: true},
    {gen: 5, pos: 20, label: '母方祖父の母の母', row: 12, displayFactor: true},
    {gen: 5, pos: 23, label: '母方祖母の父の父', row: 13, displayFactor: true},
    {gen: 5, pos: 24, label: '母方祖母の父の母', row: 14, displayFactor: true},
    {gen: 5, pos: 26, label: '母方祖母の母の父', row: 15, displayFactor: true},
    {gen: 5, pos: 27, label: '母方祖母の母の母', row: 16, displayFactor: true}
];

const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']; 
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
    container.innerHTML = '';
    inputPedigreePositions.forEach(p => {
        const cell = document.createElement('div');
        cell.className = 'pedigree-cell gen' + p.gen;
        cell.setAttribute('data-position', p.pos);
        let span = 1;
        if (p.gen === 1) span = 16;
        else if (p.gen === 2) span = 8;
        else if (p.gen === 3) span = 4;
        else if (p.gen === 4) span = 2;
        cell.style.gridRow = p.row + ' / span ' + span;

        // 続柄のタイトル表示を削除
        let content = `
            <select id="individual-${p.pos}" class="individual-select">
                <option value="">ウマ娘を選択</option>
            </select>
        `;

        if (p.displayFactor) {
            let factorHtml = '<div class="factors-grid">';
            factorTypes.forEach(type => {
                factorHtml += `
                    <div class="factor-group">
                        <label for="factor-${type}-${p.pos}">${type}</label>
                        <select id="factor-${type}-${p.pos}" class="factor-select">
                            <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                        </select>
                    </div>`;
            });
            factorHtml += '</div>';
            let starsHtml = '<div class="stars-group">';
            for (let i = 3; i >= 1; i--) {
                starsHtml += `<label><input type="radio" name="stars-${p.pos}" value="${i}"> ${'★'.repeat(i)}</label>`;
            }
            starsHtml += '</div>';
            content += starsHtml + factorHtml;
        }
        if (p.gen === 1) {
            content += `<div class="aptitude-display" id="aptitude-display-${p.pos}"></div>`;
        }
        cell.innerHTML = content;
        container.appendChild(cell);
    });
}

function initializeDropdowns() {
    const sortedHorseData = [...horseData].sort((a, b) => a['名前'].localeCompare(b['名前'], 'ja'));
    const optionsHtml = sortedHorseData.map(h => `<option value="${h['名前']}">${h['名前']}</option>`).join('');
    inputPedigreePositions.forEach(p => {
        const select = document.getElementById(`individual-${p.pos}`);
        if (select) {
            select.innerHTML += optionsHtml;
            if (p.gen === 1) {
                select.addEventListener('change', (e) => displayBaseAptitude(e.target.value, p.pos));
            }
        }
    });
}

function setupControlButtons() {
    document.getElementById('calculate-button').addEventListener('click', calculateAndDisplayResults);
    document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm('すべての入力内容をリセットしますか？')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            createPedigreeGrid();
            initializeDropdowns();
            document.getElementById('resultsContainer').style.display = 'none';
            document.getElementById('export-container').style.display = 'none';
        }
    });
    document.getElementById('import-button').addEventListener('click', importState);
    document.getElementById('copy-export-button').addEventListener('click', copyExportData);
    // 自動保存
    document.getElementById('pedigreeGrid').addEventListener('change', saveStateToLocalStorage);
}

function displayBaseAptitude(name, pos) {
    const displayDiv = document.getElementById(`aptitude-display-${pos}`);
    if (!name) {
        displayDiv.innerHTML = '';
        return;
    }
    const horse = horseData.find(h => h['名前'] === name);
    if (!horse) {
        displayDiv.innerHTML = '';
        return;
    }
    const labels = {'芝': '芝', 'ダート': 'ダ', '短距離': '短', 'マイル': 'マ', '中距離': '中', '長距離': '長', '逃げ': '逃', '先行': '先', '差し': '差', '追込': '追'};
    let html = '<h6>初期適性</h6><table class="aptitude-table">';
    const displayOrder = [
        ['芝', 'ダート'],
        ['短距離', 'マイル', '中距離', '長距離'],
        ['逃げ', '先行', '差し', '追込']
    ];
    displayOrder.forEach(row => {
        html += '<tr>';
        row.forEach(type => html += `<td class="apt-label">${labels[type]}</td>`);
        html += '</tr><tr>';
        row.forEach(type => {
            const rank = horse[type] || 'G';
            html += `<td class="apt-value rank-${rank}">${rank}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    displayDiv.innerHTML = html;
}

function calculateAptitude(baseRank, factorValue) {
    let rankIndex = aptitudeRanks.indexOf(baseRank);
    if (rankIndex === -1) return baseRank;
    if (factorValue >= 10) rankIndex += 3;
    else if (factorValue >= 7) rankIndex += 2;
    else if (factorValue >= 1) rankIndex += 1;
    return aptitudeRanks[Math.min(rankIndex, aptitudeRanks.length - 1)];
}

function saveStateToLocalStorage() {
    const state = {};
    // 全世代の入力情報を保存
    inputPedigreePositions.forEach(p => {
        const pos = p.pos;
        const individualSelect = document.getElementById(`individual-${pos}`);
        if (!individualSelect) return;
        const factorSelects = factorTypes.map(type => document.getElementById(`factor-${type}-${pos}`));
        const starRadios = Array.from(document.querySelectorAll(`input[name="stars-${pos}"]:checked`));
        state[pos] = {
            individual: individualSelect.value,
            factors: {},
            stars: starRadios.length > 0 ? parseInt(starRadios[0].value) : 0
        };
        factorSelects.forEach((select, index) => {
            if (select) {
                const type = factorTypes[index];
                state[pos].factors[type] = select.value;
            }
        });
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    // エクスポート用データも更新
    const exportContainer = document.getElementById('export-container');
    const exportData = document.getElementById('export-data');
    exportData.value = JSON.stringify(state);
    exportContainer.style.display = 'block';
}

function loadStateFromLocalStorage() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedState) return;
    const state = JSON.parse(savedState);
    loadState(state);
}

function importState() {
    const importArea = document.getElementById('import-area');
    try {
        const state = JSON.parse(importArea.value);
        loadState(state);
        saveStateToLocalStorage();
        importArea.value = '';
    } catch (e) {
        alert('データの形式が正しくありません。');
        console.error("Import failed:", e);
    }
}

function loadState(state) {
    Object.keys(state).forEach(posStr => {
        const pos = parseInt(posStr);
        const data = state[pos];
        if (data.individual) {
            const indSelect = document.getElementById(`individual-${pos}`);
            if(indSelect) {
                indSelect.value = data.individual;
                if(pos === 31) displayBaseAptitude(data.individual, pos);
            }
        }
        if (data.stars) {
            const starRadio = document.querySelector(`input[name="stars-${pos}"][value="${data.stars}"]`);
            if(starRadio) starRadio.checked = true;
        }
        if (data.factors) {
            factorTypes.forEach(type => {
                const factorSelect = document.getElementById(`factor-${type}-${pos}`);
                if (factorSelect && data.factors[type]) {
                    factorSelect.value = data.factors[type];
                }
            });
        }
    });
}

function copyExportData() {
    const exportData = document.getElementById('export-data');
    exportData.select();
    document.execCommand('copy');
    alert('クリップボードにコピーしました。');
}

function calculateAndDisplayResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    const pedigreeContainer = document.getElementById('resultsPedigreeContainer');
    const calculationInfo = document.getElementById('calculationInfo');
    pedigreeContainer.innerHTML = '';
    calculationInfo.innerHTML = '';

    const selectedIndividuals = {};
    const selectedFactors = {};
    const selectedStars = {};
    inputPedigreePositions.forEach(p => {
        const pos = p.pos;
        const individualSelect = document.getElementById(`individual-${pos}`);
        if (individualSelect && individualSelect.value) {
            selectedIndividuals[pos] = individualSelect.value;
            selectedStars[pos] = parseInt(document.querySelector(`input[name="stars-${pos}"]:checked`)?.value || '0');
            selectedFactors[pos] = {};
            factorTypes.forEach(type => {
                const factorSelect = document.getElementById(`factor-${type}-${pos}`);
                if (factorSelect) selectedFactors[pos][type] = factorSelect.value;
            });
        }
    });

    if (!selectedIndividuals[31]) {
        resultsContainer.style.display = 'none';
        return;
    }
    resultsContainer.style.display = 'block';

    const baseAptitudes = {};
    const baseHorse = horseData.find(h => h['名前'] === selectedIndividuals[31]);
    if (!baseHorse) return;
    factorTypes.forEach(type => { baseAptitudes[type] = baseHorse[type] || 'G'; });

    const totalFactors = {};
    factorTypes.forEach(type => { totalFactors[type] = 0; });

    // 全世代の親子関係を定義
    const inheritanceMap = {
        15: [7, 14],   30: [22, 29],
        7: [3, 6],     14: [10, 13],
        22: [18, 21],  29: [25, 28],
        3: [1, 2],     6: [4, 5],
        10: [8, 9],    13: [11, 12],
        18: [16, 17],  21: [19, 20],
        25: [23, 24],  28: [26, 27]
    };

    function getInheritanceFactor(pos, type) {
        if (!selectedIndividuals[pos]) return 0;
        const star = selectedStars[pos] || 0;
        const factorValue = parseInt(selectedFactors[pos]?.[type] || '0');
        let totalFactor = factorValue * star;
        const parents = inheritanceMap[pos];
        if (parents) {
            totalFactor += Math.floor((getInheritanceFactor(parents[0], type) + getInheritanceFactor(parents[1], type)) / 2);
        }
        return totalFactor;
    }

    factorTypes.forEach(type => {
        totalFactors[type] = getInheritanceFactor(15, type) + getInheritanceFactor(30, type);
    });

    const finalAptitudes = {};
    const changedTypes = {}; // 適性変化を追跡
    factorTypes.forEach(type => {
        const baseRank = baseAptitudes[type] || 'G';
        const factorValue = totalFactors[type] || 0;
        const finalRank = calculateAptitude(baseRank, factorValue);
        finalAptitudes[type] = finalRank;
        if (baseRank !== finalRank) changedTypes[type] = true;
    });

    const labels = {'芝': '芝', 'ダート': 'ダ', '短距離': '短', 'マイル': 'マ', '中距離': '中', '長距離': '長', '逃げ': '逃', '先行': '先', '差し': '差', '追込': '追'};
    const turfHeader = `<td>${labels['芝']}</td><td>${labels['ダート']}</td>`;
    const distanceHeader = `<td>${labels['短距離']}</td><td>${labels['マイル']}</td><td>${labels['中距離']}</td><td>${labels['長距離']}</td>`;
    const strategyHeader = `<td>${labels['逃げ']}</td><td>${labels['先行']}</td><td>${labels['差し']}</td><td>${labels['追込']}</td>`;

    // 変化した適性に 'changed' クラスを付与
    const turfValues = `<td class="apt-value rank-${finalAptitudes['芝']} ${changedTypes['芝'] ? 'changed' : ''}">${finalAptitudes['芝']}</td><td class="apt-value rank-${finalAptitudes['ダート']} ${changedTypes['ダート'] ? 'changed' : ''}">${finalAptitudes['ダート']}</td>`;
    const distanceValues = `<td class="apt-value rank-${finalAptitudes['短距離']} ${changedTypes['短距離'] ? 'changed' : ''}">${finalAptitudes['短距離']}</td><td class="apt-value rank-${finalAptitudes['マイル']} ${changedTypes['マイル'] ? 'changed' : ''}">${finalAptitudes['マイル']}</td><td class="apt-value rank-${finalAptitudes['中距離']} ${changedTypes['中距離'] ? 'changed' : ''}">${finalAptitudes['中距離']}</td><td class="apt-value rank-${finalAptitudes['長距離']} ${changedTypes['長距離'] ? 'changed' : ''}">${finalAptitudes['長距離']}</td>`;
    const strategyValues = `<td class="apt-value rank-${finalAptitudes['逃げ']} ${changedTypes['逃げ'] ? 'changed' : ''}">${finalAptitudes['逃げ']}</td><td class="apt-value rank-${finalAptitudes['先行']} ${changedTypes['先行'] ? 'changed' : ''}">${finalAptitudes['先行']}</td><td class="apt-value rank-${finalAptitudes['差し']} ${changedTypes['差し'] ? 'changed' : ''}">${finalAptitudes['差し']}</td><td class="apt-value rank-${finalAptitudes['追込']} ${changedTypes['追込'] ? 'changed' : ''}">${finalAptitudes['追込']}</td>`;

    // 全世代を結果血統表に表示
    const resultPositions = inputPedigreePositions.map(p => {
        const col = 6 - p.gen;
        let rowSpan = 1;
        if (p.gen === 1) rowSpan = 16;
        else if (p.gen === 2) rowSpan = 8;
        else if (p.gen === 3) rowSpan = 4;
        else if (p.gen === 4) rowSpan = 2;
        return { pos: p.pos, row: p.row, col, rowSpan, colSpan: 1 };
    });

    resultPositions.forEach(p => {
        const name = selectedIndividuals[p.pos];
        if (!name) return;
        const cell = document.createElement('div');
        cell.className = 'result-cell';
        cell.style.gridArea = `${p.row} / ${p.col} / span ${p.rowSpan} / span 1`;
        let content = `<div class="individual-name">${name}</div>`;
        if (p.pos !== 31) {
            const stars = selectedStars[p.pos] || 0;
            if (stars > 0) content += `<div class="factor-info">青因子 ★${stars}</div>`;
        } else {
            content += `<table class="aptitude-table">
                <tr>${turfHeader}</tr><tr>${turfValues}</tr>
                <tr>${distanceHeader}</tr><tr>${distanceValues}</tr>
                <tr>${strategyHeader}</tr><tr>${strategyValues}</tr>
            </table>`;
        }
        cell.innerHTML = content;
        pedigreeContainer.appendChild(cell);
    });

    let infoHtml = '<ul>';
    factorTypes.forEach(type => {
        const base = baseAptitudes[type], final = finalAptitudes[type];
        if (base !== final
