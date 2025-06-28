document.addEventListener('DOMContentLoaded', async function() {
    // --- 定数定義 ---
    const inputPedigreePositions = [
        {gen: 1, pos: 31, label: '本人', row: 1, displayFactor: false},
        {gen: 2, pos: 15, label: '父', row: 1, displayFactor: true}, {gen: 2, pos: 30, label: '母', row: 9, displayFactor: true},
        {gen: 3, pos: 7, label: '父方祖父', row: 1, displayFactor: true}, {gen: 3, pos: 14, label: '父方祖母', row: 5, displayFactor: true}, {gen: 3, pos: 22, label: '母方祖父', row: 9, displayFactor: true}, {gen: 3, pos: 29, label: '母方祖母', row: 13, displayFactor: true},
        {gen: 4, pos: 3, label: '父方祖父の父', row: 1, displayFactor: true}, {gen: 4, pos: 6, label: '父方祖父の母', row: 3, displayFactor: true}, {gen: 4, pos: 10, label: '父方祖母の父', row: 5, displayFactor: true}, {gen: 4, pos: 13, label: '父方祖母の母', row: 7, displayFactor: true}, {gen: 4, pos: 18, label: '母方祖父の父', row: 9, displayFactor: true}, {gen: 4, pos: 21, label: '母方祖父の母', row: 11, displayFactor: true}, {gen: 4, pos: 25, label: '母方祖母の父', row: 13, displayFactor: true}, {gen: 4, pos: 28, label: '母方祖母の母', row: 15, displayFactor: true},
        {gen: 5, pos: 1, label: '父方祖父の父の父', row: 1, displayFactor: true}, {gen: 5, pos: 2, label: '父方祖父の父の母', row: 2, displayFactor: true}, {gen: 5, pos: 4, label: '父方祖父の母の父', row: 3, displayFactor: true}, {gen: 5, pos: 5, label: '父方祖父の母の母', row: 4, displayFactor: true}, {gen: 5, pos: 8, label: '父方祖母の父の父', row: 5, displayFactor: true}, {gen: 5, pos: 9, label: '父方祖母の父の母', row: 6, displayFactor: true}, {gen: 5, pos: 11, label: '父方祖母の母の父', row: 7, displayFactor: true}, {gen: 5, pos: 12, label: '父方祖母の母の母', row: 8, displayFactor: true}, {gen: 5, pos: 16, label: '母方祖父の父の父', row: 9, displayFactor: true}, {gen: 5, pos: 17, label: '母方祖父の父の母', row: 10, displayFactor: true}, {gen: 5, pos: 19, label: '母方祖父の母の父', row: 11, displayFactor: true}, {gen: 5, pos: 20, label: '母方祖父の母の母', row: 12, displayFactor: true}, {gen: 5, pos: 23, label: '母方祖母の父の父', row: 13, displayFactor: true}, {gen: 5, pos: 24, label: '母方祖母の父の母', row: 14, displayFactor: true}, {gen: 5, pos: 26, label: '母方祖母の母の父', row: 15, displayFactor: true}, {gen: 5, pos: 27, label: '母方祖母の母の母', row: 16, displayFactor: true}
    ];
    const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
    const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const APTITUDE_LAYOUT_GRID = [
        [{ key: '芝', label: '芝' }, { key: 'ダート', label: 'ダ' }],
        [{ key: '短距離', label: '短' }, { key: 'マイル', label: 'マ' }],
        [{ key: '中距離', label: '中' }, { key: '長距離', label: '長' }],
        [{ key: '逃げ', label: '逃' }, { key: '先行', label: '先' }],
        [{ key: '差し', label: '差' }, { key: '追込', label: '追' }]
    ];
    let horseData = [];
    const LOCAL_STORAGE_KEY = 'umamusumePedigreeData';

    // --- 遺伝子付与可能性のロジック (ご提示のものを統合) ---
    function getAncestorsForGenePotential(pos) {
        const mappings = {
            31: [15, 30, 7, 14, 22, 29], 15: [7, 14, 3, 6, 10, 13], 30: [22, 29, 18, 21, 25, 28],
            7: [3, 6, 1, 2, 4, 5], 14: [10, 13, 8, 9, 11, 12], 22: [18, 21, 16, 17, 19, 20], 29: [25, 28, 23, 24, 26, 27]
        };
        return mappings[pos] || [];
    }

    function calculateGenePotential(pos, formData) {
        const ancestors = getAncestorsForGenePotential(pos);
        const factorCounts = {};
        factorTypes.forEach(type => { factorCounts[type] = 0; });

        ancestors.forEach(ancestorPos => {
            const factor = formData[`factor_${ancestorPos}`];
            const stars = parseInt(formData[`star_${ancestorPos}`] || '0');
            if (factor && stars > 0) {
                factorCounts[factor] += stars;
            }
        });
        const genePotentials = [];
        factorTypes.forEach(type => {
            const stars = factorCounts[type];
            if (stars >= 12) {
                genePotentials.push({type: type, status: 'confirmed', stars: stars});
            } else if (stars >= 6) {
                genePotentials.push({type: type, status: 'potential', stars: stars});
            }
        });
        genePotentials.sort((a, b) => b.stars - a.stars);
        return genePotentials.slice(0, 3);
    }

    function generateGenePotentialHTML(genePotentials) {
        if (genePotentials.length === 0) return '';
        let html = '<div class="gene-potentials">';    
        genePotentials.forEach(gene => {
            if (gene.status === 'confirmed') {
                html += `<div class="gene-confirmed">${gene.type}遺伝子確定</div>`;
            } else {
                html += `<div class="gene-potential">${gene.type}遺伝子獲得</div>`;
            }
        });
        html += '</div>';
        return html;
    }

    // --- 主要な関数 ---
    async function loadCSV() {
        const response = await fetch('umadata.csv');
        if (!response.ok) throw new Error('CSVの読み込みに失敗しました。');
        const csvText = await response.text();
        const headerMapping = {'名前': '名前', '芝': '芝', 'ダ': 'ダート', '短': '短距離', 'マ': 'マイル', '中': '中距離', '長': '長距離', '逃': '逃げ', '先': '先行', '差': '差し', '追': '追込'};
        const lines = csvText.trim().split(/\r\n|\n/);
        const csvHeaders = lines[0].split(',');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const obj = {};
            const currentline = lines[i].split(',');
            for (let j = 0; j < csvHeaders.length; j++) {
                const internalKey = headerMapping[csvHeaders[j].trim()];
                if (internalKey) obj[internalKey] = currentline[j] ? currentline[j].trim() : '';
            }
            if (obj['名前']) data.push(obj);
        }
        return data;
    }

    function createPedigreeGrid() {
        const container = document.getElementById('pedigreeGrid');
        if (!container) return;
        container.innerHTML = '';
        inputPedigreePositions.forEach(p => {
            const cell = document.createElement('div');
            cell.className = `pedigree-cell gen${p.gen}`;
            cell.setAttribute('data-position', p.pos);
            let span = 1;
            if (p.gen === 1) span = 16; else if (p.gen === 2) span = 8; else if (p.gen === 3) span = 4; else if (p.gen === 4) span = 2;
            cell.style.gridRow = `${p.row} / span ${span}`;
            let content = `<div class="pedigree-cell-title"></div>`;
            content += `<select class="individual-select" data-position="${p.pos}"><option value="">選択してください</option></select>`;
            if (p.displayFactor) {
                content += `<select class="factor-select" data-position="${p.pos}"><option value="">因子なし</option>`;
                factorTypes.forEach(type => { content += `<option value="${type}">${type}</option>`; });
                content += `</select>`;
                content += `<div class="stars-group" data-position="${p.pos}">`;
                for (let i = 1; i <= 3; i++) {
                    content += `<label><input type="radio" name="stars_${p.pos}" value="${i}"> ☆${i}</label>`;
                }
                content += `</div>`;
            }
            if (p.gen <= 3) {
                content += `<div class="aptitude-display" data-position="${p.pos}"></div>`;
            }
            cell.innerHTML = content;
            container.appendChild(cell);
        });
    }

    function initializeDropdowns() {
        const selects = document.querySelectorAll('.individual-select');
        selects.forEach(select => {
            horseData.forEach(horse => {
                const option = document.createElement('option');
                option.value = horse['名前'];
                option.textContent = horse['名前'];
                select.appendChild(option);
            });
        });
    }

    function createAptitudeTableHTML(horseName, calculatedRanks = {}) {
        const horse = horseData.find(h => h['名前'] === horseName);
        if (!horse) return '';
        let html = '<table class="aptitude-table">';
        APTITUDE_LAYOUT_GRID.forEach(row => {
            html += '<tr>';
            row.forEach(apt => html += `<td class="apt-label">${apt.label}</td>`);
            html += '</tr><tr>';
            row.forEach(apt => {
                const finalRank = calculatedRanks[apt.key]?.final || horse[apt.key] || 'G';
                const changedClass = calculatedRanks[apt.key]?.changed ? ' changed' : '';
                html += `<td class="apt-value rank-${finalRank}${changedClass}">${finalRank}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    }

    function updateAptitudeDisplay(position) {
        const select = document.querySelector(`.individual-select[data-position="${position}"]`);
        const aptitudeDiv = document.querySelector(`.aptitude-display[data-position="${position}"]`);
        if (select && aptitudeDiv) {
            aptitudeDiv.innerHTML = createAptitudeTableHTML(select.value);
        }
    }

    function getCurrentFormData() {
        const formData = {};
        inputPedigreePositions.forEach(p => {
            const pos = p.pos;
            const select = document.querySelector(`.individual-select[data-position="${pos}"]`);
            if (select) formData[`horse_${pos}`] = select.value;
            if (p.displayFactor) {
                const factor = document.querySelector(`.factor-select[data-position="${pos}"]`);
                if (factor) formData[`factor_${pos}`] = factor.value;
                const star = document.querySelector(`input[name="stars_${pos}"]:checked`);
                if (star) formData[`star_${pos}`] = star.value;
            }
        });
        return formData;
    }

    function saveState() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getCurrentFormData()));
    }

    function loadState() {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!savedState) return;
        const state = JSON.parse(savedState);
        inputPedigreePositions.forEach(p => {
            const pos = p.pos;
            const select = document.querySelector(`.individual-select[data-position="${pos}"]`);
            if (select && state[`horse_${pos}`]) {
                select.value = state[`horse_${pos}`];
                if (p.gen <= 3) updateAptitudeDisplay(pos);
            }
            if (p.displayFactor) {
                const factor = document.querySelector(`.factor-select[data-position="${pos}"]`);
                if (factor && state[`factor_${pos}`]) factor.value = state[`factor_${pos}`];
                const star = document.querySelector(`input[name="stars_${pos}"][value="${state[`star_${pos}`]}"]`);
                if (star) star.checked = true;
            }
        });
    }

    function calculate() {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<h2>計算結果</h2>';
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-pedigree-container';
        resultsContainer.appendChild(resultsGrid);
        
        const currentFormData = getCurrentFormData();
        
        const factorCounts = {};
        factorTypes.forEach(type => factorCounts[type] = 0);
        inputPedigreePositions.forEach(p => {
            if (p.displayFactor) {
                const factor = currentFormData[`factor_${p.pos}`];
                const star = currentFormData[`star_${p.pos}`];
                if (factor && star) {
                    factorCounts[factor] += parseInt(star, 10);
                }
            }
        });
        
        const mainHorseName = currentFormData['horse_31'];
        const mainHorseData = horseData.find(h => h['名前'] === mainHorseName);

        const calculatedRanksForMain = {};
        if (mainHorseData) {
            factorTypes.forEach(type => {
                const baseRankIndex = aptitudeRanks.indexOf(mainHorseData[type] || 'G');
                let increase = 0;
                const stars = factorCounts[type];
                if (stars >= 10) increase = 4;
                else if (stars >= 7) increase = 3;
                else if (stars >= 4) increase = 2;
                else if (stars >= 1) increase = 1;
                const newRankIndex = Math.min(baseRankIndex + increase, aptitudeRanks.length - 1);
                calculatedRanksForMain[type] = {
                    final: aptitudeRanks[newRankIndex],
                    changed: newRankIndex > baseRankIndex
                };
            });
        }
        
        inputPedigreePositions.forEach(p => {
            const cell = document.createElement('div');
            cell.className = `result-cell gen${p.gen}`;
            let span = 1;
            if (p.gen === 1) span = 16; else if (p.gen === 2) span = 8; else if (p.gen === 3) span = 4; else if (p.gen === 4) span = 2;
            cell.style.gridRow = `${p.row} / span ${span}`;
            
            const horseName = currentFormData[`horse_${p.pos}`];
            const nameHTML = `<div class="individual-name">${horseName || (p.pos === 31 ? '未指定' : '')}</div>`;
            
            const factor = currentFormData[`factor_${p.pos}`];
            const star = currentFormData[`star_${p.pos}`];
            const factorHTML = (p.displayFactor && factor && star) ? `<div class="factor-info">${factor} ☆${star}</div>` : '';
            
            let tableHTML = '';
            let genePotentialHTML = '';

            if (p.gen <= 3) {
                tableHTML = (p.pos === 31) ? createAptitudeTableHTML(horseName, calculatedRanksForMain) : createAptitudeTableHTML(horseName);
                const genePotentials = calculateGenePotential(p.pos, currentFormData);
                genePotentialHTML = generateGenePotentialHTML(genePotentials);
            }

            cell.innerHTML = nameHTML + factorHTML + tableHTML + genePotentialHTML;
            resultsGrid.appendChild(cell);
        });
    }
    
    function setupEventListeners() {
        document.getElementById('calculate').addEventListener('click', calculate);
        document.getElementById('reset').addEventListener('click', () => {
            if (confirm('全ての入力をリセットしますか？')) {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                createPedigreeGrid();
                initializeDropdowns();
                document.getElementById('resultsContainer').style.display = 'none';
            }
        });
        document.getElementById('pedigreeGrid').addEventListener('change', (e) => {
            if (e.target.matches('.individual-select, .factor-select, input[type="radio"]')) {
                if (e.target.matches('.individual-select')) {
                    updateAptitudeDisplay(e.target.getAttribute('data-position'));
                }
                saveState();
            }
        });
    }

    try {
        horseData = await loadCSV();
        createPedigreeGrid();
        initializeDropdowns();
        loadState();
        setupEventListeners();
    } catch (error) {
        console.error('アプリケーションの初期化に失敗しました:', error);
        alert('アプリケーションの初期化に失敗しました。ページを再読み込みしてください。');
    }
});
