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
        
        // 修正: 続柄表記を削除
        let content = `<div class="pedigree-cell-title"></div>`;
        
        if (p.displayFactor) {
            content += `<select class="individual-select" data-position="${p.pos}">
                <option value="">選択してください</option>
            </select>`;
            
            factorTypes.forEach(type => {
                content += `<div>
                    <select class="factor-select" data-position="${p.pos}" data-factor="${type}">
                        <option value="">因子なし</option>
                        <option value="${type}">${type}</option>
                    </select>
                    <div class="stars-group" data-position="${p.pos}" data-factor="${type}">`;
                for (let i = 1; i <= 3; i++) {
                    content += `<label><input type="radio" name="stars_${p.pos}_${type}" value="${i}"> ☆${i}</label>`;
                }
                content += `</div></div>`;
            });
        } else {
            content += `<select class="individual-select" data-position="${p.pos}">
                <option value="">選択してください</option>
            </select>`;
        }
        
        content += `<button class="copy-button" data-position="${p.pos}">コピー</button>`;
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

function setupCopyButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-button')) {
            const position = e.target.getAttribute('data-position');
            copyToClipboard(position);
        }
    });
}

function copyToClipboard(position) {
    const cell = document.querySelector(`[data-position="${position}"]`);
    const individualSelect = cell.querySelector('.individual-select');
    const selectedHorse = individualSelect.value;
    
    if (!selectedHorse) {
        alert('コピーするウマ娘を選択してください。');
        return;
    }
    
    let copyText = `${selectedHorse}\n`;
    const factorSelects = cell.querySelectorAll('.factor-select');
    factorSelects.forEach(select => {
        const factor = select.getAttribute('data-factor');
        const selectedFactor = select.value;
        if (selectedFactor) {
            const starsGroup = cell.querySelector(`[data-position="${position}"][data-factor="${factor}"]`);
            const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
            const stars = selectedStar ? selectedStar.value : '0';
            copyText += `${factor}: ☆${stars}\n`;
        }
    });
    
    navigator.clipboard.writeText(copyText).then(() => {
        alert('クリップボードにコピーしました。');
    });
}

function setupControlButtons() {
    const calculateBtn = document.getElementById('calculate-button');
    const resetBtn = document.getElementById('reset-button');
    const importBtn = document.getElementById('import-button');
    const exportBtn = document.getElementById('export-button');
    const copyExportBtn = document.getElementById('copy-export-button');
    
    if (calculateBtn) calculateBtn.addEventListener('click', calculateResults);
    if (resetBtn) resetBtn.addEventListener('click', resetAllInputs);
    if (importBtn) importBtn.addEventListener('click', importData);
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (copyExportBtn) copyExportBtn.addEventListener('click', copyExportData);
    
    // 修正: 全ての入力要素の変更を監視（4代目・5代目も含む）
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('individual-select') || 
            e.target.classList.contains('factor-select') || 
            e.target.type === 'radio') {
            saveStateToLocalStorage();
        }
    });
}

function calculateResults() {
    const targetPosition = 31; // 本人の位置
    const targetCell = document.querySelector(`[data-position="${targetPosition}"]`);
    const targetSelect = targetCell.querySelector('.individual-select');
    const targetHorse = targetSelect.value;
    
    if (!targetHorse) {
        alert('育成対象のウマ娘を選択してください。');
        return;
    }
    
    const targetData = horseData.find(h => h['名前'] === targetHorse);
    if (!targetData) {
        alert('選択されたウマ娘のデータが見つかりません。');
        return;
    }
    
    // 修正: 全世代の因子を集計（4代目・5代目も含む）
    const factorCounts = {};
    factorTypes.forEach(type => factorCounts[type] = 0);
    
    inputPedigreePositions.forEach(p => {
        if (p.displayFactor) {
            const cell = document.querySelector(`[data-position="${p.pos}"]`);
            if (cell) {
                factorTypes.forEach(type => {
                    const factorSelect = cell.querySelector(`[data-factor="${type}"]`);
                    if (factorSelect && factorSelect.value === type) {
                        const starsGroup = cell.querySelector(`[data-position="${p.pos}"][data-factor="${type}"]`);
                        if (starsGroup) {
                            const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                            if (selectedStar) {
                                factorCounts[type] += parseInt(selectedStar.value);
                            }
                        }
                    }
                });
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
            // 修正: ランクが変化したかどうかのフラグを追加
            changed: newIndex > baseIndex
        };
    });
    
    displayResults(results, targetHorse);
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
                
                const labels = {'芝': '芝', 'ダート': 'ダ', '短距離': '短', 'マイル': 'マ', '中距離': '中', '長距離': '長', '逃げ': '逃', '先行': '先', '差し': '差', '追込': '追'};
                
                let html = '<tr>';
                factorTypes.forEach(type => {
                    html += `<td class="apt-label">${labels[type]}</td>`;
                });
                html += '</tr><tr>';
                
                factorTypes.forEach(type => {
                    let rank;
                    let isChanged = false;
                    
                    if (pos === 31) { // 本人の場合は計算結果を使用
                        rank = results[type].final;
                        isChanged = results[type].changed;
                    } else { // その他は元データを使用
                        rank = horseData_item[type] || 'G';
                    }
                    
                    // 修正: 変化した適性は赤文字で表示
                    const cellClass = `apt-value rank-${rank}${isChanged ? ' changed' : ''}`;
                    html += `<td class="${cellClass}">${rank}</td>`;
                });
                html += '</tr>';
                
                aptitudeTable.innerHTML = html;
                cell.appendChild(aptitudeTable);
            }
        }
        
        pedigreeContainer.appendChild(cell);
    });
    
    container.appendChild(pedigreeContainer);
    
    // 計算情報の表示
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
        // 修正: 全ての入力要素をリセット（4代目・5代目も含む）
        document.querySelectorAll('.individual-select').forEach(select => select.value = '');
        document.querySelectorAll('.factor-select').forEach(select => select.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        document.getElementById('resultsContainer').style.display = 'none';
    }
}

function saveStateToLocalStorage() {
    const state = {};
    
    // 修正: 全世代の入力状態を保存
    inputPedigreePositions.forEach(p => {
        const cell = document.querySelector(`[data-position="${p.pos}"]`);
        if (cell) {
            const individualSelect = cell.querySelector('.individual-select');
            if (individualSelect) {
                state[`individual_${p.pos}`] = individualSelect.value;
            }
            
            if (p.displayFactor) {
                factorTypes.forEach(type => {
                    const factorSelect = cell.querySelector(`[data-factor="${type}"]`);
                    if (factorSelect) {
                        state[`factor_${p.pos}_${type}`] = factorSelect.value;
                    }
                    
                    const starsGroup = cell.querySelector(`[data-position="${p.pos}"][data-factor="${type}"]`);
                    if (starsGroup) {
                        const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                        if (selectedStar) {
                            state[`stars_${p.pos}_${type}`] = selectedStar.value;
                        }
                    }
                });
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
        
        // 修正: 全世代の入力状態を復元
        inputPedigreePositions.forEach(p => {
            const cell = document.querySelector(`[data-position="${p.pos}"]`);
            if (cell) {
                const individualSelect = cell.querySelector('.individual-select');
                if (individualSelect && state[`individual_${p.pos}`]) {
                    individualSelect.value = state[`individual_${p.pos}`];
                }
                
                if (p.displayFactor) {
                    factorTypes.forEach(type => {
                        const factorSelect = cell.querySelector(`[data-factor="${type}"]`);
                        if (factorSelect && state[`factor_${p.pos}_${type}`]) {
                            factorSelect.value = state[`factor_${p.pos}_${type}`];
                        }
                        
                        const starsValue = state[`stars_${p.pos}_${type}`];
                        if (starsValue) {
                            const starsGroup = cell.querySelector(`[data-position="${p.pos}"][data-factor="${type}"]`);
                            if (starsGroup) {
                                const radioButton = starsGroup.querySelector(`input[value="${starsValue}"]`);
                                if (radioButton) {
                                    radioButton.checked = true;
                                }
                            }
                        }
                    });
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
                factorTypes.forEach(type => {
                    const factorSelect = cell.querySelector(`[data-factor="${type}"]`);
                    if (factorSelect && factorSelect.value) {
                        state[`factor_${p.pos}_${type}`] = factorSelect.value;
                    }
                    
                    const starsGroup = cell.querySelector(`[data-position="${p.pos}"][data-factor="${type}"]`);
                    if (starsGroup) {
                        const selectedStar = starsGroup.querySelector('input[type="radio"]:checked');
                        if (selectedStar) {
                            state[`stars_${p.pos}_${type}`] = selectedStar.value;
                        }
                    }
                });
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
        
        // 現在の入力をクリア
        document.querySelectorAll('.individual-select').forEach(select => select.value = '');
        document.querySelectorAll('.factor-select').forEach(select => select.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        
        // インポートしたデータを適用
        inputPedigreePositions.forEach(p => {
            const cell = document.querySelector(`[data-position="${p.pos}"]`);
            if (cell) {
                const individualSelect = cell.querySelector('.individual-select');
                if (individualSelect && state[`individual_${p.pos}`]) {
                    individualSelect.value = state[`individual_${p.pos}`];
                }
                
                if (p.displayFactor) {
                    factorTypes.forEach(type => {
                        const factorSelect = cell.querySelector(`[data-factor="${type}"]`);
                        if (factorSelect && state[`factor_${p.pos}_${type}`]) {
                            factorSelect.value = state[`factor_${p.pos}_${type}`];
                        }
                        
                        const starsValue = state[`stars_${p.pos}_${type}`];
                        if (starsValue) {
                            const starsGroup = cell.querySelector(`[data-position="${p.pos}"][data-factor="${type}"]`);
                            if (starsGroup) {
                                const radioButton = starsGroup.querySelector(`input[value="${starsValue}"]`);
                                if (radioButton) {
                                    radioButton.checked = true;
                                }
                            }
                        }
                    });
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
