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

// 修正点2: 結果表示の対象を全世代に拡張
const displayPositions = inputPedigreePositions.map(p => p.pos);

const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
let horseData = [];
const LOCAL_STORAGE_KEY = 'umamusumePedigreeData';

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

        let content = `<div class="pedigree-cell-title">${p.label}</div>`;
        content += `<select class="individual-select"><option value="">選択...</option></select>`;
        content += `<div class="aptitude-display"></div>`;

        if (p.displayFactor) {
            content += `<div class="stars-group">`;
            [1, 2, 3].forEach(star => {
                const id = `stars-${p.pos}-${star}`;
                content += `<input type="radio" id="${id}" name="stars-${p.pos}" value="${star}" ${star === 3 ? 'checked' : ''}><label for="${id}">${'★'.repeat(star)}</label>`;
            });
            content += `</div>`;
            content += `<select class="factor-select"><option value="">因子1...</option></select>`;
            content += `<select class="factor-select"><option value="">因子2...</option></select>`;
        }
        cell.innerHTML = content;
        container.appendChild(cell);
    });
}

function initializeDropdowns() {
    const individualSelects = document.querySelectorAll('.individual-select');
    const factorSelects = document.querySelectorAll('.factor-select');

    const horseNames = horseData.map(h => h['名前']).sort();
    individualSelects.forEach(select => {
        horseNames.forEach(name => {
            select.add(new Option(name, name));
        });
        select.addEventListener('change', (e) => {
            const pos = e.target.closest('.pedigree-cell').dataset.position;
            updateAptitudeDisplay(pos, e.target.value);
        });
    });

    factorSelects.forEach(select => {
        factorTypes.forEach(type => {
            select.add(new Option(`${type}因子`, type));
        });
    });
}

function updateAptitudeDisplay(pos, individualName) {
    const cell = document.querySelector(`.pedigree-cell[data-position="${pos}"]`);
    const displayDiv = cell.querySelector('.aptitude-display');
    const individual = getIndividualAptitudes(individualName);

    if (!individual) {
        displayDiv.innerHTML = '';
        return;
    }

    let html = `<table class="aptitude-table">`;
    const labels = {'芝': '芝', 'ダ': 'ダート', '短': '短距離', 'マ': 'マイル', '中': '中距離', '長': '長距離', '逃': '逃げ', '先': '先行', '差': '差し', '追': '追込'};
    
    html += '<thead><tr>';
    Object.values(labels).forEach(label => { html += `<th>${label}</th>`; });
    html += '</tr></thead>';
    
    html += '<tbody><tr>';
    Object.keys(labels).forEach(typeKey => {
        const apt = labels[typeKey];
        const rank = individual[apt] || 'G';
        const rankClass = `rank-${rank}`;
        html += `<td class="apt-value ${rankClass}">${rank}</td>`;
    });
    html += '</tr></tbody></table>';
    
    displayDiv.innerHTML = html;
}

function getIndividualAptitudes(name) {
    return horseData.find(h => h['名前'] === name);
}

function setupControlButtons() {
    document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm('すべての入力内容をリセットしますか？')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            location.reload();
        }
    });

    document.getElementById('calculate-button').addEventListener('click', displayResults);

    const exportButton = document.getElementById('copy-export-button');
    const exportTextarea = document.getElementById('export-data');
    exportButton.addEventListener('click', () => {
        const state = {};
        inputPedigreePositions.forEach(p => {
            const cell = document.querySelector(`.pedigree-cell[data-position="${p.pos}"]`);
            if (!cell) return;
            const individualSelect = cell.querySelector('.individual-select');
            if (individualSelect && individualSelect.value) {
                state[p.pos] = {
                    name: individualSelect.value,
                    factors: [],
                    stars: 0
                };
                if (p.displayFactor) {
                    const factorSelects = cell.querySelectorAll('.factor-select');
                    factorSelects.forEach(s => { if (s.value) state[p.pos].factors.push(s.value); });
                    const checkedStar = cell.querySelector(`input[name="stars-${p.pos}"]:checked`);
                    if (checkedStar) state[p.pos].stars = parseInt(checkedStar.value, 10);
                }
            }
        });
        const exportString = JSON.stringify(state);
        exportTextarea.value = exportString;
        navigator.clipboard.writeText(exportString).then(() => {
            alert('クリップボードにコピーしました。');
        }, () => {
            alert('コピーに失敗しました。');
        });
    });

    const importButton = document.getElementById('import-button');
    const importTextarea = document.getElementById('import-data');
    importButton.addEventListener('click', () => {
        try {
            const state = JSON.parse(importTextarea.value);
            loadState(state);
            alert('データをインポートしました。');
        } catch (e) {
            alert('インポートデータが不正です。');
            console.error("Import Error:", e);
        }
    });
}

function loadState(state) {
    Object.keys(state).forEach(pos => {
        const data = state[pos];
        const cell = document.querySelector(`.pedigree-cell[data-position="${pos}"]`);
        if (cell && data) {
            const individualSelect = cell.querySelector('.individual-select');
            if (individualSelect) individualSelect.value = data.name;

            updateAptitudeDisplay(pos, data.name);
            
            if(data.factors){
                const factorSelects = cell.querySelectorAll('.factor-select');
                factorSelects.forEach((select, index) => {
                    if (data.factors[index]) select.value = data.factors[index];
                });
            }
            if(data.stars){
                const starRadio = cell.querySelector(`input[type="radio"][value="${data.stars}"]`);
                if (starRadio) starRadio.checked = true;
            }
        }
    });
}

function saveStateToLocalStorage() {
    const state = {};
    inputPedigreePositions.forEach(p => {
        const individualSelect = document.querySelector(`.pedigree-cell[data-position="${p.pos}"] .individual-select`);
        if (individualSelect && individualSelect.value) {
            const data = {
                name: individualSelect.value,
                factors: [],
                stars: 0
            };
            if(p.displayFactor){
                const factorSelects = document.querySelectorAll(`.pedigree-cell[data-position="${p.pos}"] .factor-select`);
                factorSelects.forEach(select => {
                    if (select.value) data.factors.push(select.value);
                });
                const checkedStar = document.querySelector(`.pedigree-cell[data-position="${p.pos}"] input[type="radio"]:checked`);
                if(checkedStar) data.stars = parseInt(checkedStar.value, 10);
            }
            state[p.pos] = data;
        }
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadStateFromLocalStorage() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
        const state = JSON.parse(savedState);
        loadState(state);
    }
}

function calculateAptitudes() {
    const baseIndividualName = document.querySelector('.pedigree-cell[data-position="31"] .individual-select').value;
    if (!baseIndividualName) return null;

    const baseAptitudes = getIndividualAptitudes(baseIndividualName);
    if (!baseAptitudes) return null;

    let finalAptitudes = {};
    factorTypes.forEach(type => {
        finalAptitudes[type] = baseAptitudes[type];
    });

    let factorCounts = {};
    factorTypes.forEach(t => factorCounts[t] = 0);

    inputPedigreePositions.forEach(p => {
        if (p.pos === 31 || !p.displayFactor) return;
        const cell = document.querySelector(`.pedigree-cell[data-position="${p.pos}"]`);
        if (!cell) return;

        const factorSelects = cell.querySelectorAll('.factor-select');
        factorSelects.forEach(select => {
            if (select.value) {
                factorCounts[select.value] = (factorCounts[select.value] || 0) + 1;
            }
        });
    });

    for (const [type, count] of Object.entries(factorCounts)) {
        if (count > 0) {
            const baseRank = baseAptitudes[type];
            const baseRankIndex = aptitudeRanks.indexOf(baseRank);
            if (baseRankIndex === -1) continue;
            let increase = 0;
            if (count >= 1 && count <= 2) increase = 1;
            else if (count >= 3 && count <= 4) increase = 2;
            else if (count >= 5 && count <= 6) increase = 3;
            else if (count >= 7) increase = 4;
            const newIndex = Math.min(baseRankIndex + increase, aptitudeRanks.length - 1);
            finalAptitudes[type] = aptitudeRanks[newIndex];
        }
    }

    return {
        base: baseAptitudes,
        final: finalAptitudes
    };
}

function displayResults() {
    saveStateToLocalStorage();
    const container = document.getElementById('resultsPedigreeContainer');
    container.innerHTML = '';
    
    const finalAptitudes = calculateAptitudes();
    if (!finalAptitudes) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">育成ウマ娘を選択し、「計算する」ボタンを押してください。</p>';
        return;
    }

    displayPositions.forEach(pos => {
        const p = inputPedigreePositions.find(item => item.pos === pos);
        if (!p) return;

        const cell = document.createElement('div');
        cell.className = `result-cell gen${p.gen}`;
        let span = 1;
        if (p.gen === 1) span = 16;
        else if (p.gen === 2) span = 8;
        else if (p.gen === 3) span = 4;
        else if (p.gen === 4) span = 2;
        cell.style.gridRow = `${p.row} / span ${span}`;
        cell.style.gridColumn = p.gen;
        
        const individualSelect = document.querySelector(`.pedigree-cell[data-position="${p.pos}"] .individual-select`);
        const individualName = individualSelect ? individualSelect.value : '';

        if (!individualName) {
            container.appendChild(cell);
            return;
        }

        let html = `<div class="individual-name">${individualName}</div>`;
        
        if (p.displayFactor) {
            const factorSelects = document.querySelectorAll(`.pedigree-cell[data-position="${p.pos}"] .factor-select`);
            let factorInfo = '';
            factorSelects.forEach(select => {
                if(select.value) factorInfo += `<div>${select.value}</div>`;
            });
            if(factorInfo) html += `<div class="factor-info">${factorInfo}</div>`;
        }

        // 修正点1: 因子反映後の最終適性をテーブルで表示し、変更箇所を赤字にする
        if (p.pos === 31) {
            html += `<div class="aptitude-display"><h4>最終適性</h4>`;
            html += `<table class="aptitude-table">`;
            const labels = {'芝': '芝', 'ダート': 'ダ', '短距離': '短', 'マイル': 'マ', '中距離': '中', '長距離': '長', '逃げ': '逃', '先行': '先', '差し': '差', '追込': '追'};
            
            html += '<thead><tr>';
            Object.values(labels).forEach(label => html += `<th>${label}</th>`);
            html += '</tr></thead>';

            html += '<tbody><tr>';
            Object.keys(labels).forEach(type => {
                const baseRank = finalAptitudes.base[type];
                const finalRank = finalAptitudes.final[type];
                const rankClass = `rank-${finalRank}`;
                const isChanged = baseRank !== finalRank;
                const valueClass = isChanged ? 'aptitude-value changed' : 'apt-value';
                
                html += `<td class="${rankClass}"><span class="${valueClass}">${finalRank}</span></td>`;
            });
            html += '</tr></tbody></table></div>';
        }

        cell.innerHTML = html;
        container.appendChild(cell);
    });
}
