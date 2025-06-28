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
        if (p.gen === 1) span = 16;
        else if (p.gen === 2) span = 8;
        else if (p.gen === 3) span = 4;
        else if (p.gen === 4) span = 2;
        
        cell.style.gridRow = p.row + ' / span ' + span;
        
        let content = `<div class="pedigree-cell-title"></div>`;
        
        if (p.displayFactor) {
            content += `<select class="individual-select" data-position="${p.pos}">
                <option value="">選択してください</option>
            </select>`;
            
            content += `<select class="factor-select" data-position="${p.pos}">
                <option value="">因子なし</option>`;
            factorTypes.forEach(type => {
                content += `<option value="${type}">${type}</option>`;
            });
            content += `</select>`;
            
            content += `<div class="stars-group" data-position="${p.pos}">`;
            for (let i = 1; i <= 3; i++) {
                content += `<label><input type="radio" name="stars_${p.pos}" value="${i}"> ☆${i}</label>`;
            }
            content += `</div>`;
            
            // 4代目・5代目は適性表示なし
            if (p.gen <= 3) {
                content += `<div class="aptitude-display" data-position="${p.pos}"></div>`;
            }
        } else {
            content += `<select class="individual-select" data-position="${p.pos}">
                <option value="">選択してください</option>
            </select>`;
            content += `<div class="aptitude-display" data-position="${p.pos}"></div>`;
        }
        
        if (p.pos === 22 || p.pos === 29) {
            content += `<button class="copy-button" data-position="${p.pos}">父方からコピー</button>`;
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
        
        select.addEventListener('change', function() {
            updateAptitudeDisplay(this);
        });
    });
}

function updateAptitudeDisplay(select) {
    const position = select.getAttribute('data-position');
    const selectedHorse = select.value;
    const aptitudeDiv = document.querySelector(`[data-position="${position}"] .aptitude-display`);
    
    if (!aptitudeDiv) return;
    
    if (selectedHorse) {
        const horseData_item = horseData.find(h => h['名前'] === selectedHorse);
        if (horseData_item) {
            // 3段6行の適性表示
            let html = '<table class="aptitude-table">';
            
            // 1段目: 芝・ダート
            html += '<tr>';
            html += `<td class="apt-label">芝</td><td class="apt-value rank-${horseData_item['芝'] || 'G'}">${horseData_item['芝'] || 'G'}</td>`;
            html += `<td class="apt-label">ダ</td><td class="apt-value rank-${horseData_item['ダート'] || 'G'}">${horseData_item['ダート'] || 'G'}</td>`;
            html += '</tr>';
            
            // 2段目: 短・マ
            html += '<tr>';
            html += `<td class="apt-label">短</td><td class="apt-value rank-${horseData_item['短距離'] || 'G'}">${horseData_item['短距離'] || 'G'}</td>`;
            html += `<td class="apt-label">マ</td><td class="apt-value rank-${horseData_item['マイル'] || 'G'}">${horseData_item['マイル'] || 'G'}</td>`;
            html += '</tr>';
            
            // 3段目: 中・長
            html += '<tr>';
            html += `<td class="apt-label">中</td><td class="apt-value rank-${horseData_item['中距離'] || 'G'}">${horseData_item['中距離'] || 'G'}</td>`;
            html += `<td class="apt-label">長</td><td class="apt-value rank-${horseData_item['長距離'] || 'G'}">${horseData_item['長距離'] || 'G'}</td>`;
            html += '</tr>';
            
            // 4段目: 逃・先
            html += '<tr>';
            html += `<td class="apt-label">逃</td><td class="apt-value rank-${horseData_item['逃げ'] || 'G'}">${horseData_item['逃げ'] || 'G'}</td>`;
            html += `<td class="apt-label">先</td><td class="apt-value rank-${horseData_item['先行'] || 'G'}">${horseData_item['先行'] || 'G'}</td>`;
            html += '</tr>';
            
            // 5段目: 差・追
            html += '<tr>';
            html += `<td class="apt-label">差</td><td class="apt-value rank-${horseData_item['差し'] || 'G'}">${horseData_item['差し'] || 'G'}</td>`;
            html += `<td class="apt-label">追</td><td class="apt-value rank-${horseData_item['追込'] || 'G'}">${horseData_item['追込'] || 'G'}</td>`;
            html += '</tr>';
            
            html += '</table>';
            aptitudeDiv.innerHTML = html;
        }
    } else {
        aptitudeDiv.innerHTML = '';
    }
}

function setupCopyButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-button')) {
            const position = parseInt(e.target.getAttribute('data-position'));
            copyPedigreeData(position);
        }
    });
}

function copyPedigreeData(sourcePosition) {
    // 修正: 正しいコピー機能の実装
    let sourcePositions = [];
    let targetPositions = [];
    
    if (sourcePosition === 22) { // 母方祖父
        // 母方祖父系統の7人分
        sourcePositions = [22, 18, 21, 16, 17, 19, 20];
        // 父方祖父系統の7人分
        targetPositions = [7, 3, 6, 1, 2, 4, 5];
    } else if (sourcePosition === 29) { // 母方祖母
        // 母方祖母系統の7人分
        sourcePositions = [29, 25, 28, 23, 24, 26, 27];
        // 父方祖母系統の7人分
        targetPositions = [14, 10, 13, 8, 9, 11, 12];
    }
    
    // 修正: コピー元の情報を保存してからコピー実行
    const copyData = [];
    for (let i = 0; i < sourcePositions.length; i++) {
        const sourceCell = document.querySelector(`[data-position="${sourcePositions[i]}"]`);
        if (sourceCell) {
            const sourceSelect = sourceCell.querySelector('.individual-select');
            const sourceFactor = sourceCell.querySelector('.factor-select');
            const sourceStars = sourceCell.querySelector('input[type="radio"]:checked');
            
            copyData.push({
                horseName: sourceSelect ? sourceSelect.value : '',
                factorType: sourceFactor ? sourceFactor.value : '',
                starsValue: sourceStars ? sourceStars.value : ''
            });
        } else {
            copyData.push({
                horseName: '',
                factorType: '',
                starsValue: ''
            });
        }
    }
    
    // コピー実行
    for (let i = 0; i < targetPositions.length && i < copyData.length; i++) {
        const targetCell = document.querySelector(`[data-position="${targetPositions[i]}"]`);
        
        if (targetCell) {
            // ウマ娘名をコピー
            const targetSelect = targetCell.querySelector('.individual-select');
            if (targetSelect) {
                targetSelect.value = copyData[i].horseName;
                updateAptitudeDisplay(targetSelect);
            }
            
            // 因子の種類をコピー
            const targetFactor = targetCell.querySelector('.factor-select');
            if (targetFactor) {
                targetFactor.value = copyData[i].factorType;
            }
            
            // 因子の数（星）をコピー
            if (copyData[i].starsValue) {
                const targetStars = targetCell.querySelector(`input[value="${copyData[i].starsValue}"]`);
                if (targetStars) {
                    targetStars.checked = true;
                }
            }
        }
    }
    
    saveStateToLocalStorage();
    alert('父方にデータをコピーしました。');
}

function setupControlButtons() {
    const calculateBtn = document.getElementById('calculate-button');
    const resetBtn = document.getElementById('reset-button');
    const importBtn = document.getElementById('import-button');
    const exportBtn = document.getElementById('export-button');
    const copyExportBtn = document.getElementById('copy-export-button');
    
    // 修正: 計算ボタンのイベントリスナーを正しく設定
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculateResults();
        });
    }
    
    if (resetBtn) resetBtn.addEventListener('click', resetAllInputs);
    if (importBtn) importBtn.addEventListener('click', importData);
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (copyExportBtn) copyExportBtn.addEventListener('click', copyExportData);
    
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('individual-select') || 
            e.target.classList.contains('factor-select') || 
            e.target.type === 'radio') {
            saveStateToLocalStorage();
        }
    });
}

function calculateResults() {
    const targetPosition = 31;
    const targetCell = document.querySelector(`[data-position="${targetPosition}"]`);
    const targetSelect = targetCell.querySelector('.individual-select');
    const targetHorse = targetSelect.value;
    
    // 修正: ウマ娘が選択されていない場合の処理
    if (!targetHorse) {
        displayEmptyResults();
        return;
    }
    
    const targetData = horseData.find(h => h['名前'] === targetHorse);
    if (!targetData) {
        alert('選択されたウマ娘のデータが見つかりません。');
        return;
    }
    
    const factorCounts = {};
    factorTypes.forEach(type => factorCounts[type] = 0);
    
    inputPedigreePositions.forEach(p => {
        if (p.displayFactor) {
            const cell = document.querySelector(`[data-position="${p.pos}"]`);
            if (cell) {
                const factorSelect = cell.querySelector('.factor-select');
                const starsGroup = cell.querySelector('.stars-group');
                
                if (factorSelect && starsGroup) {
                    const selectedFactor = factorSelect.value;
                    const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                    
                    if (selectedFactor && selectedStar) {
                        const stars = parseInt(selectedStar.value);
                        factorCounts[selectedFactor] += stars;
                    }
                }
            }
        }
    });
    
    const results = {};
    factorTypes.forEach(type => {
        const baseRank = targetData[type] || 'G';
        const baseIndex = aptitudeRanks.indexOf(baseRank);
        const stars = factorCounts[type];
        
        let increase = 0;
        if (stars >= 10) increase = 4;
        else if (stars >= 7) increase = 3;
        else if (stars >= 4) increase = 2;
        else if (stars >= 1) increase = 1;
        
        const newIndex = Math.min(baseIndex + increase, aptitudeRanks.length - 1);
        const newRank = aptitudeRanks[newIndex];
        
        results[type] = {
            base: baseRank,
            final: newRank,
            stars: stars,
            changed: newIndex > baseIndex
        };
    });
    
    displayResults(results, targetHorse);
}

// 修正: 未指定時の結果表示関数を追加
function displayEmptyResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const title = document.createElement('h2');
    title.textContent = '計算結果';
    container.appendChild(title);
    
    const pedigreeContainer = document.createElement('div');
    pedigreeContainer.className = 'results-pedigree-container';
    
    displayPositions.forEach(pos => {
        const cell = document.createElement('div');
        cell.className = 'result-cell';
        
        let span = 1;
        const positionData = inputPedigreePositions.find(p => p.pos === pos);
        if (positionData) {
            if (positionData.gen === 1) span = 16;
            else if (positionData.gen === 2) span = 8;
            else if (positionData.gen === 3) span = 4;
            else if (positionData.gen === 4) span = 2;
            cell.style.gridRow = positionData.row + ' / span ' + span;
        }
        
        const inputCell = document.querySelector(`[data-position="${pos}"]`);
        const individualSelect = inputCell ? inputCell.querySelector('.individual-select') : null;
        const selectedHorse = individualSelect ? individualSelect.value : '';
        
        if (selectedHorse) {
            const nameDiv = document.createElement('div');
            nameDiv.className = 'individual-name';
            nameDiv.textContent = selectedHorse;
            cell.appendChild(nameDiv);
            
            const horseData_item = horseData.find(h => h['名前'] === selectedHorse);
            if (horseData_item) {
                const aptitudeTable = document.createElement('table');
                aptitudeTable.className = 'aptitude-table';
                
                // 3段6行の適性表示
                let html = '';
                
                // 1段目: 芝・ダート
                html += '<tr>';
                ['芝', 'ダート'].forEach(type => {
                    const rank = horseData_item[type] || 'G';
                    const label = type === 'ダート' ? 'ダ' : type;
                    html += `<td class="apt-label">${label}</td><td class="apt-value rank-${rank}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 2段目: 短・マ
                html += '<tr>';
                ['短距離', 'マイル'].forEach(type => {
                    const rank = horseData_item[type] || 'G';
                    const label = type === '短距離' ? '短' : 'マ';
                    html += `<td class="apt-label">${label}</td><td class="apt-value rank-${rank}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 3段目: 中・長
                html += '<tr>';
                ['中距離', '長距離'].forEach(type => {
                    const rank = horseData_item[type] || 'G';
                    const label = type === '中距離' ? '中' : '長';
                    html += `<td class="apt-label">${label}</td><td class="apt-value rank-${rank}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 4段目: 逃・先
                html += '<tr>';
                ['逃げ', '先行'].forEach(type => {
                    const rank = horseData_item[type] || 'G';
                    const label = type === '逃げ' ? '逃' : '先';
                    html += `<td class="apt-label">${label}</td><td class="apt-value rank-${rank}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 5段目: 差・追
                html += '<tr>';
                ['差し', '追込'].forEach(type => {
                    const rank = horseData_item[type] || 'G';
                    const label = type === '差し' ? '差' : '追';
                    html += `<td class="apt-label">${label}</td><td class="apt-value rank-${rank}">${rank}</td>`;
                });
                html += '</tr>';
                
                aptitudeTable.innerHTML = html;
                cell.appendChild(aptitudeTable);
            }
            
            if (pos !== 31) {
                const factorSelect = inputCell ? inputCell.querySelector('.factor-select') : null;
                const starsGroup = inputCell ? inputCell.querySelector('.stars-group') : null;
                
                if (factorSelect && starsGroup) {
                    const selectedFactor = factorSelect.value;
                    const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                    
                    if (selectedFactor && selectedStar) {
                        const factorInfo = document.createElement('div');
                        factorInfo.className = 'factor-info';
                        factorInfo.textContent = `${selectedFactor} ☆${selectedStar.value}`;
                        cell.appendChild(factorInfo);
                    }
                }
            }
        } else if (pos === 31) {
            // 本人が未指定の場合
            const nameDiv = document.createElement('div');
            nameDiv.className = 'individual-name';
            nameDiv.textContent = '未指定';
            cell.appendChild(nameDiv);
        }
        
        pedigreeContainer.appendChild(cell);
    });
    
    container.appendChild(pedigreeContainer);
    container.style.display = 'block';
}

function displayResults(results, targetHorse) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const title = document.createElement('h2');
    title.textContent = '計算結果';
    container.appendChild(title);
    
    const pedigreeContainer = document.createElement('div');
    pedigreeContainer.className = 'results-pedigree-container';
    
    displayPositions.forEach(pos => {
        const cell = document.createElement('div');
        cell.className = 'result-cell';
        
        let span = 1;
        const positionData = inputPedigreePositions.find(p => p.pos === pos);
        if (positionData) {
            if (positionData.gen === 1) span = 16;
            else if (positionData.gen === 2) span = 8;
            else if (positionData.gen === 3) span = 4;
            else if (positionData.gen === 4) span = 2;
            cell.style.gridRow = positionData.row + ' / span ' + span;
        }
        
        const inputCell = document.querySelector(`[data-position="${pos}"]`);
        const individualSelect = inputCell ? inputCell.querySelector('.individual-select') : null;
        const selectedHorse = individualSelect ? individualSelect.value : '';
        
        if (selectedHorse) {
            const nameDiv = document.createElement('div');
            nameDiv.className = 'individual-name';
            nameDiv.textContent = selectedHorse;
            cell.appendChild(nameDiv);
            
            const horseData_item = horseData.find(h => h['名前'] === selectedHorse);
            if (horseData_item) {
                const aptitudeTable = document.createElement('table');
                aptitudeTable.className = 'aptitude-table';
                
                // 3段6行の適性表示
                let html = '';
                
                // 1段目: 芝・ダート
                html += '<tr>';
                ['芝', 'ダート'].forEach(type => {
                    let rank;
                    let isChanged = false;
                    
                    if (pos === 31) {
                        rank = results[type].final;
                        isChanged = results[type].changed;
                    } else {
                        rank = horseData_item[type] || 'G';
                    }
                    
                    const cellClass = `apt-value rank-${rank}${isChanged ? ' changed' : ''}`;
                    const label = type === 'ダート' ? 'ダ' : type;
                    html += `<td class="apt-label">${label}</td><td class="${cellClass}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 2段目: 短・マ
                html += '<tr>';
                ['短距離', 'マイル'].forEach(type => {
                    let rank;
                    let isChanged = false;
                    
                    if (pos === 31) {
                        rank = results[type].final;
                        isChanged = results[type].changed;
                    } else {
                        rank = horseData_item[type] || 'G';
                    }
                    
                    const cellClass = `apt-value rank-${rank}${isChanged ? ' changed' : ''}`;
                    const label = type === '短距離' ? '短' : 'マ';
                    html += `<td class="apt-label">${label}</td><td class="${cellClass}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 3段目: 中・長
                html += '<tr>';
                ['中距離', '長距離'].forEach(type => {
                    let rank;
                    let isChanged = false;
                    
                    if (pos === 31) {
                        rank = results[type].final;
                        isChanged = results[type].changed;
                    } else {
                        rank = horseData_item[type] || 'G';
                    }
                    
                    const cellClass = `apt-value rank-${rank}${isChanged ? ' changed' : ''}`;
                    const label = type === '中距離' ? '中' : '長';
                    html += `<td class="apt-label">${label}</td><td class="${cellClass}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 4段目: 逃・先
                html += '<tr>';
                ['逃げ', '先行'].forEach(type => {
                    let rank;
                    let isChanged = false;
                    
                    if (pos === 31) {
                        rank = results[type].final;
                        isChanged = results[type].changed;
                    } else {
                        rank = horseData_item[type] || 'G';
                    }
                    
                    const cellClass = `apt-value rank-${rank}${isChanged ? ' changed' : ''}`;
                    const label = type === '逃げ' ? '逃' : '先';
                    html += `<td class="apt-label">${label}</td><td class="${cellClass}">${rank}</td>`;
                });
                html += '</tr>';
                
                // 5段目: 差・追
                html += '<tr>';
                ['差し', '追込'].forEach(type => {
                    let rank;
                    let isChanged = false;
                    
                    if (pos === 31) {
                        rank = results[type].final;
                        isChanged = results[type].changed;
                    } else {
                        rank = horseData_item[type] || 'G';
                    }
                    
                    const cellClass = `apt-value rank-${rank}${isChanged ? ' changed' : ''}`;
                    const label = type === '差し' ? '差' : '追';
                    html += `<td class="apt-label">${label}</td><td class="${cellClass}">${rank}</td>`;
                });
                html += '</tr>';
                
                aptitudeTable.innerHTML = html;
                cell.appendChild(aptitudeTable);
            }
            
            if (pos !== 31) {
                const factorSelect = inputCell ? inputCell.querySelector('.factor-select') : null;
                const starsGroup = inputCell ? inputCell.querySelector('.stars-group') : null;
                
                if (factorSelect && starsGroup) {
                    const selectedFactor = factorSelect.value;
                    const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                    
                    if (selectedFactor && selectedStar) {
                        const factorInfo = document.createElement('div');
                        factorInfo.className = 'factor-info';
                        factorInfo.textContent = `${selectedFactor} ☆${selectedStar.value}`;
                        cell.appendChild(factorInfo);
                    }
                }
            }
        }
        
        pedigreeContainer.appendChild(cell);
    });
    
    container.appendChild(pedigreeContainer);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'calculation-info';
    infoDiv.innerHTML = `
        <h3>計算詳細</h3>
        <ul>
            <li>因子☆1-3個: +1段階</li>
            <li>因子☆4-6個: +2段階</li>
            <li>因子☆7-9個: +3段階</li>
            <li>因子☆10個以上: +4段階</li>
        </ul>
    `;
    container.appendChild(infoDiv);
    
    container.style.display = 'block';
}

function resetAllInputs() {
    if (confirm('全ての入力内容をリセットしますか？')) {
        document.querySelectorAll('.individual-select').forEach(select => {
            select.value = '';
            updateAptitudeDisplay(select);
        });
        document.querySelectorAll('.factor-select').forEach(select => select.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        document.getElementById('resultsContainer').style.display = 'none';
    }
}

function saveStateToLocalStorage() {
    const state = {};
    
    inputPedigreePositions.forEach(p => {
        const cell = document.querySelector(`[data-position="${p.pos}"]`);
        if (cell) {
            const individualSelect = cell.querySelector('.individual-select');
            if (individualSelect) {
                state[`individual_${p.pos}`] = individualSelect.value;
            }
            
            if (p.displayFactor) {
                const factorSelect = cell.querySelector('.factor-select');
                if (factorSelect) {
                    state[`factor_${p.pos}`] = factorSelect.value;
                }
                
                const starsGroup = cell.querySelector('.stars-group');
                if (starsGroup) {
                    const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                    if (selectedStar) {
                        state[`stars_${p.pos}`] = selectedStar.value;
                    }
                }
            }
        }
    });
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadStateFromLocalStorage() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedState) return;
    
    try {
        const state = JSON.parse(savedState);
        
        inputPedigreePositions.forEach(p => {
            const cell = document.querySelector(`[data-position="${p.pos}"]`);
            if (cell) {
                const individualSelect = cell.querySelector('.individual-select');
                if (individualSelect && state[`individual_${p.pos}`]) {
                    individualSelect.value = state[`individual_${p.pos}`];
                    updateAptitudeDisplay(individualSelect);
                }
                
                if (p.displayFactor) {
                    const factorSelect = cell.querySelector('.factor-select');
                    if (factorSelect && state[`factor_${p.pos}`]) {
                        factorSelect.value = state[`factor_${p.pos}`];
                    }
                    
                    const starsValue = state[`stars_${p.pos}`];
                    if (starsValue) {
                        const starsGroup = cell.querySelector('.stars-group');
                        if (starsGroup) {
                            const radioButton = starsGroup.querySelector(`input[value="${starsValue}"]`);
                            if (radioButton) {
                                radioButton.checked = true;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('データ復元エラー:', error);
    }
}

function exportData() {
    const state = {};
    
    inputPedigreePositions.forEach(p => {
        const cell = document.querySelector(`[data-position="${p.pos}"]`);
        if (cell) {
            const individualSelect = cell.querySelector('.individual-select');
            if (individualSelect && individualSelect.value) {
                state[`individual_${p.pos}`] = individualSelect.value;
            }
            
            if (p.displayFactor) {
                const factorSelect = cell.querySelector('.factor-select');
                if (factorSelect && factorSelect.value) {
                    state[`factor_${p.pos}`] = factorSelect.value;
                }
                
                const starsGroup = cell.querySelector('.stars-group');
                if (starsGroup) {
                    const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                    if (selectedStar) {
                        state[`stars_${p.pos}`] = selectedStar.value;
                    }
                }
            }
        }
    });
    
    const exportText = JSON.stringify(state, null, 2);
    document.getElementById('export-data').value = exportText;
    document.getElementById('export-container').style.display = 'block';
}

function importData() {
    const importText = document.getElementById('import-data').value.trim();
    if (!importText) {
        alert('インポートするデータを入力してください。');
        return;
    }
    
    try {
        const state = JSON.parse(importText);
        
        document.querySelectorAll('.individual-select').forEach(select => {
            select.value = '';
            updateAptitudeDisplay(select);
        });
        document.querySelectorAll('.factor-select').forEach(select => select.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        
        inputPedigreePositions.forEach(p => {
            const cell = document.querySelector(`[data-position="${p.pos}"]`);
            if (cell) {
                const individualSelect = cell.querySelector('.individual-select');
                if (individualSelect && state[`individual_${p.pos}`]) {
                    individualSelect.value = state[`individual_${p.pos}`];
                    updateAptitudeDisplay(individualSelect);
                }
                
                if (p.displayFactor) {
                    const factorSelect = cell.querySelector('.factor-select');
                    if (factorSelect && state[`factor_${p.pos}`]) {
                        factorSelect.value = state[`factor_${p.pos}`];
                    }
                    
                    const starsValue = state[`stars_${p.pos}`];
                    if (starsValue) {
                        const starsGroup = cell.querySelector('.stars-group');
                        if (starsGroup) {
                            const radioButton = starsGroup.querySelector(`input[value="${starsValue}"]`);
                            if (radioButton) {
                                radioButton.checked = true;
                            }
                        }
                    }
                }
            }
        });
        
        saveStateToLocalStorage();
        alert('データをインポートしました。');
        document.getElementById('import-data').value = '';
    } catch (error) {
        console.error('インポートエラー:', error);
        alert('データの形式が正しくありません。');
    }
}

function copyExportData() {
    const exportData = document.getElementById('export-data').value;
    if (exportData) {
        navigator.clipboard.writeText(exportData).then(() => {
            alert('エクスポートデータをクリップボードにコピーしました。');
        });
    }
}
