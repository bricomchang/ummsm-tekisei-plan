document.addEventListener('DOMContentLoaded', async function() {
    // 定数定義
    const inputPedigreePositions = [
        {gen: 1, pos: 31, label: '本人', row: 1, displayFactor: false},
        {gen: 2, pos: 15, label: '父', row: 1, displayFactor: true}, {gen: 2, pos: 30, label: '母', row: 9, displayFactor: true},
        {gen: 3, pos: 7, label: '父方祖父', row: 1, displayFactor: true}, {gen: 3, pos: 14, label: '父方祖母', row: 5, displayFactor: true}, {gen: 3, pos: 22, label: '母方祖父', row: 9, displayFactor: true}, {gen: 3, pos: 29, label: '母方祖母', row: 13, displayFactor: true},
        {gen: 4, pos: 3, label: '父方祖父の父', row: 1, displayFactor: true}, {gen: 4, pos: 6, label: '父方祖父の母', row: 3, displayFactor: true}, {gen: 4, pos: 10, label: '父方祖母の父', row: 5, displayFactor: true}, {gen: 4, pos: 13, label: '父方祖母の母', row: 7, displayFactor: true}, {gen: 4, pos: 18, label: '母方祖父の父', row: 9, displayFactor: true}, {gen: 4, pos: 21, label: '母方祖父の母', row: 11, displayFactor: true}, {gen: 4, pos: 25, label: '母方祖母の父', row: 13, displayFactor: true}, {gen: 4, pos: 28, label: '母方祖母の母', row: 15, displayFactor: true},
        {gen: 5, pos: 1, label: '父方祖父の父の父', row: 1, displayFactor: true}, {gen: 5, pos: 2, label: '父方祖父の父の母', row: 2, displayFactor: true}, {gen: 5, pos: 4, label: '父方祖父の母の父', row: 3, displayFactor: true}, {gen: 5, pos: 5, label: '父方祖父の母の母', row: 4, displayFactor: true}, {gen: 5, pos: 8, label: '父方祖母の父の父', row: 5, displayFactor: true}, {gen: 5, pos: 9, label: '父方祖母の父の母', row: 6, displayFactor: true}, {gen: 5, pos: 11, label: '父方祖母の母の父', row: 7, displayFactor: true}, {gen: 5, pos: 12, label: '父方祖母の母の母', row: 8, displayFactor: true}, {gen: 5, pos: 16, label: '母方祖父の父の父', row: 9, displayFactor: true}, {gen: 5, pos: 17, label: '母方祖父の父の母', row: 10, displayFactor: true}, {gen: 5, pos: 19, label: '母方祖父の母の父', row: 11, displayFactor: true}, {gen: 5, pos: 20, label: '母方祖父の母の母', row: 12, displayFactor: true}, {gen: 5, pos: 23, label: '母方祖母の父の父', row: 13, displayFactor: true}, {gen: 5, pos: 24, label: '母方祖母の父の母', row: 14, displayFactor: true}, {gen: 5, pos: 26, label: '母方祖母の母の父', row: 15, displayFactor: true}, {gen: 5, pos: 27, label: '母方祖母の母の母', row: 16, displayFactor: true}
    ];
    const displayResultPositions = [31, 15, 30, 7, 14, 22, 29];
    const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
    const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const APTITUDE_GROUPS = [
        [{key: '芝', label: '芝'}, {key: 'ダート', label: 'ダ'}],
        [{key: '短距離', label: '短'}, {key: 'マイル', label: 'マ'}],
        [{key: '中距離', label: '中'}, {key: '長距離', label: '長'}],
        [{key: '逃げ', label: '逃'}, {key: '先行', label: '先'}],
        [{key: '差し', label: '差'}, {key: '追込', label: '追'}]
    ];
    let horseData = [];
    const LOCAL_STORAGE_KEY = 'umamusumePedigreeData';

    // CSVデータ読み込み
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

    // 血統表のHTMLを生成
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
            
            // 続柄表記は削除
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

            // 3代目まで適性表を表示
            if (p.gen <= 3) {
                content += `<div class="aptitude-display" data-position="${p.pos}"></div>`;
            }

            cell.innerHTML = content;
            container.appendChild(cell);
        });
    }

    // ウマ娘選択ドロップダウンを初期化
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
    
    // 適性表示テーブルを生成する共通関数
    function createAptitudeTableHTML(horseName) {
        const horse = horseData.find(h => h['名前'] === horseName);
        if (!horse) return '';
        
        let html = '<table class="aptitude-table">';
        APTITUDE_GROUPS.forEach(group => {
            html += '<tr>';
            group.forEach(apt => {
                const rank = horse[apt.key] || 'G';
                html += `<td class="apt-label">${apt.label}</td><td class="apt-value rank-${rank}">${rank}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    }
    
    // 入力欄の適性表示を更新
    function updateAptitudeDisplay(position) {
        const select = document.querySelector(`.individual-select[data-position="${position}"]`);
        const aptitudeDiv = document.querySelector(`.aptitude-display[data-position="${position}"]`);
        if (select && aptitudeDiv) {
            aptitudeDiv.innerHTML = createAptitudeTableHTML(select.value);
        }
    }

    // LocalStorageへ保存
    function saveState() {
        const state = {};
        inputPedigreePositions.forEach(p => {
            const pos = p.pos;
            const select = document.querySelector(`.individual-select[data-position="${pos}"]`);
            if (select) state[`horse_${pos}`] = select.value;
            if (p.displayFactor) {
                const factor = document.querySelector(`.factor-select[data-position="${pos}"]`);
                if (factor) state[`factor_${pos}`] = factor.value;
                const star = document.querySelector(`input[name="stars_${pos}"]:checked`);
                if (star) state[`star_${pos}`] = star.value;
            }
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }

    // LocalStorageから復元
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

    // 計算ロジック
    function calculate() {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<h2>計算結果</h2>';
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-pedigree-container';
        resultsContainer.appendChild(resultsGrid);
        
        // 因子合計を計算
        const factorCounts = {};
        factorTypes.forEach(type => factorCounts[type] = 0);
        inputPedigreePositions.forEach(p => {
            if (p.displayFactor) {
                const factor = document.querySelector(`.factor-select[data-position="${p.pos}"]`)?.value;
                const star = document.querySelector(`input[name="stars_${p.pos}"]:checked`)?.value;
                if (factor && star) {
                    factorCounts[factor] += parseInt(star, 10);
                }
            }
        });
        
        const mainHorseName = document.querySelector('.individual-select[data-position="31"]')?.value;
        const mainHorseData = horseData.find(h => h['名前'] === mainHorseName);

        // 結果表示
        displayResultPositions.forEach(pos => {
            const cell = document.createElement('div');
            const pData = inputPedigreePositions.find(p => p.pos === pos);
            cell.className = `result-cell gen${pData.gen}`;
            let span = 1;
            if (pData.gen === 1) span = 16; else if (pData.gen === 2) span = 8; else if (pData.gen === 3) span = 4;
            cell.style.gridRow = `${pData.row} / span ${span}`;
            
            const horseName = document.querySelector(`.individual-select[data-position="${pos}"]`)?.value;
            const horseInfo = horseData.find(h => h['名前'] === horseName);
            
            let nameHTML = `<div class="individual-name">${horseName || (pos === 31 ? '未指定' : '')}</div>`;
            let tableHTML = '';
            
            if (pos === 31 && mainHorseData) { // 本人のみ計算結果を反映
                tableHTML = '<table class="aptitude-table">';
                APTITUDE_GROUPS.forEach(group => {
                    tableHTML += '<tr>';
                    group.forEach(apt => {
                        const baseRankIndex = aptitudeRanks.indexOf(mainHorseData[apt.key] || 'G');
                        let increase = 0;
                        const stars = factorCounts[apt.key];
                        if (stars >= 10) increase = 4;
                        else if (stars >= 7) increase = 3;
                        else if (stars >= 4) increase = 2;
                        else if (stars >= 1) increase = 1;
                        
                        const newRankIndex = Math.min(baseRankIndex + increase, aptitudeRanks.length - 1);
                        const newRank = aptitudeRanks[newRankIndex];
                        const changedClass = newRankIndex > baseRankIndex ? ' changed' : '';
                        
                        tableHTML += `<td class="apt-label">${apt.label}</td><td class="apt-value rank-${newRank}${changedClass}">${newRank}</td>`;
                    });
                    tableHTML += '</tr>';
                });
                tableHTML += '</table>';
            } else if (horseInfo) {
                tableHTML = createAptitudeTableHTML(horseName);
            }
            
            const factor = document.querySelector(`.factor-select[data-position="${pos}"]`)?.value;
            const star = document.querySelector(`input[name="stars_${pos}"]:checked`)?.value;
            let factorHTML = (pos !== 31 && factor && star) ? `<div class="factor-info">${factor} ☆${star}</div>` : '';

            cell.innerHTML = nameHTML + tableHTML + factorHTML;
            resultsGrid.appendChild(cell);
        });
    }
    
    // イベントリスナー設定
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
                    const pos = e.target.getAttribute('data-position');
                    updateAptitudeDisplay(pos);
                }
                saveState();
            }
        });
    }

    // 初期化処理
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
