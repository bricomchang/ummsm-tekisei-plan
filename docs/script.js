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
    // CSVヘッダーとプログラム内部で使用するキー名の対応表
    const headerMapping = {
        '名前': '名前',
        '芝': '芝',
        'ダ': 'ダート',
        '短': '短距離',
        'マ': 'マイル',
        '中': '中距離',
        '長': '長距離',
        '逃': '逃げ',
        '先': '先行',
        '差': '差し',
        '追': '追込'
    };

    // 改行コードで各行に分割
    const lines = csvText.trim().split(/\r\n|\n/);

    // 1行目をヘッダーとして取得
    const csvHeaders = lines[0].split(',');
    const result = [];

    // 2行目から最終行までループ
    for (let i = 1; i < lines.length; i++) {
        // 空行は処理をスキップ
        if (lines[i].trim() === '') continue;

        const obj = {};
        const currentline = currentline[i].split(',');

        for (let j = 0; j < csvHeaders.length; j++) {
            const csvHeader = csvHeaders[j].trim();
            // 対応表から内部キーを取得
            const internalKey = headerMapping[csvHeader];
            if (internalKey) {
                // 対応するキーが存在する場合のみオブジェクトに追加
                obj[internalKey] = currentline[j] ? currentline[j].trim() : '';
            }
        }
        // オブジェクトに何らかのデータが含まれている場合のみ配列に追加
        if (Object.keys(obj).length > 0 && obj['名前']) {
            result.push(obj);
        }
    }
    return result;
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // CSVデータの読み込み
        const response = await fetch('umadata.csv');
        if (!response.ok) {
            throw new Error(`CSVファイルの読み込みに失敗しました: ${response.statusText}`);
        }
        const csvData = await response.text();
        horseData = csvToObjects(csvData);
        console.log('馬データを読み込みました');

        // 血統表グリッドを生成
        createPedigreeGrid();
        // プルダウンリストを初期化
        initializeDropdowns();
        // コピーボタンのイベントリスナー設定
        setupCopyButtons();
        // 操作ボタンのイベントリスナーを設定
        setupControlButtons();
        // LocalStorageからデータを復元
        loadStateFromLocalStorage();

    } catch (error) {
        console.error('データ読み込みまたは初期化エラー:', error);
        alert('データの読み込みまたは初期化に失敗しました。ファイルが存在するか確認し、ページを再読み込みしてください。');
    }
});

// 血統表グリッドを生成する関数
function createPedigreeGrid() {
    const container = document.getElementById('pedigreeGrid');
    if (!container) {
        console.error('pedigreeGridが見つかりません');
        return;
    }

    // 各ポジションのセルを作成
    pedigreePositions.forEach(p => {
        const cell = document.createElement('div');
        cell.className = 'pedigree-cell gen' + p.gen;
        cell.setAttribute('data-position', p.pos);

        // 行と列のスパンを設定
        let span = 1;
        if (p.gen === 1) span = 16;
        else if (p.gen === 2) span = 8;
        else if (p.gen === 3) span = 4;
        else if (p.gen === 4) span = 2;
        cell.style.gridRow = p.row + ' / span ' + span;

        // 基本情報
        let cellContent = `<div class="pedigree-cell-title">${p.label}</div>` +
            `<select id="individual_${p.pos}" class="individual-select">` +
            `<option value="">未指定</option>` +
            `</select>`;

        // 因子入力欄（本人以外）
        if (p.displayFactor) {
            cellContent += `<div class="factor-input">` +
                `<select id="factor_${p.pos}" class="factor-select">` +
                `<option value="">因子選択</option>` +
                `</select>` +
                `<div class="stars-group">` +
                `<label><input type="radio" name="stars_${p.pos}" value="0" id="stars_${p.pos}_0" checked>なし</label>` +
                `<label><input type="radio" name="stars_${p.pos}" value="1" id="stars_${p.pos}_1">★</label>` +
                `<label><input type="radio" name="stars_${p.pos}" value="2" id="stars_${p.pos}_2">★★</label>` +
                `<label><input type="radio" name="stars_${p.pos}" value="3" id="stars_${p.pos}_3">★★★</label>` +
                `</div>` +
                `</div>`;
        }

        // 母方祖父と母方祖母にのみコピーボタンを追加
        if (p.pos === 22) {
            cellContent += `<button type="button" class="copy-button" data-action="copyGrandfather">父方祖父系統からコピー</button>`;
        } else if (p.pos === 29) {
            cellContent += `<button type="button" class="copy-button" data-action="copyGrandmother">父方祖母系統からコピー</button>`;
        }

        // 適性表示用のエリア（本人、親、祖父母のみ）
        if (displayPositions.some(dp => dp.pos === p.pos)) {
            cellContent += `<div id="aptitude_${p.pos}" class="aptitude-display"></div>`;
        }

        cell.innerHTML = cellContent;
        container.appendChild(cell);
    });
}

/**
 * フォームの入力内容をオブジェクトとして収集する
 * @returns {object} フォームデータ
 */
function collectFormData() {
    const data = {};
    pedigreePositions.forEach(p => {
        const pos = p.pos;
        const individualSelect = document.getElementById(`individual_${pos}`);
        if (individualSelect) {
            data[`individual_${pos}`] = individualSelect.value;
        }

        if (p.displayFactor) {
            const factorSelect = document.getElementById(`factor_${pos}`);
            const starRadio = document.querySelector(`input[name="stars_${pos}"]:checked`);
            if (factorSelect) {
                data[`factor_${pos}`] = factorSelect.value;
            }
            if (starRadio) {
                data[`stars_${pos}`] = starRadio.value;
            } else {
                data[`stars_${pos}`] = '0'; // 未選択の場合は0
            }
        }
    });
    return data;
}

/**
 * フォームの状態をLocalStorageに保存する
 */
function saveStateToLocalStorage() {
    if (typeof(Storage) === "undefined") {
        console.warn("このブラウザはLocalStorageをサポートしていません。自動保存は機能しません。");
        return;
    }
    const formData = collectFormData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    console.log("フォームの状態を自動保存しました。");
}

/**
 * LocalStorageからフォームの状態を復元する
 */
function loadStateFromLocalStorage() {
    const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedDataJSON) return;
    const savedData = JSON.parse(savedDataJSON);
    applyDataToForm(savedData);
    console.log("保存されたデータを復元しました。");
}

/**
 * オブジェクトデータに基づいてフォームを更新する
 * @param {object} data - フォームデータオブジェクト
 */
function applyDataToForm(data) {
    pedigreePositions.forEach(p => {
        const pos = p.pos;
        const individualValue = data[`individual_${pos}`];
        const factorValue = data[`factor_${pos}`];
        const starValue = data[`stars_${pos}`];

        const individualSelect = document.getElementById(`individual_${pos}`);
        if (individualSelect && individualValue) {
            individualSelect.value = individualValue;
            // changeイベントを発火させて適性表示などを更新
            // このイベント発火はupdateHorseSelectionをトリガーするため重要
            individualSelect.dispatchEvent(new Event('change'));
        }

        if (p.displayFactor) {
            const factorSelect = document.getElementById(`factor_${pos}`);
            if (factorSelect && factorValue) {
                factorSelect.value = factorValue;
            }
            if (starValue) {
                const starRadio = document.getElementById(`stars_${pos}_${starValue}`);
                if (starRadio) starRadio.checked = true;
            }
        }
    });
}

/**
 * 操作ボタン（計算、リセット、インポート、コピー）のイベントリスナーを設定する
 */
function setupControlButtons() {
    document.getElementById('calculate-button').addEventListener('click', () => {
        calculateAptitudes();
        handleExport(); // 計算後にエクスポート処理も行う
    });
    document.getElementById('reset-button').addEventListener('click', handleReset);
    document.getElementById('import-button').addEventListener('click', handleImport);
    document.getElementById('copy-export-button').addEventListener('click', copyExportDataToClipboard);
}

/**
 * リセット処理
 */
function handleReset() {
    if (confirm("本当に入力内容をすべてリセットしますか？\nこの操作は元に戻せません。")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        // 画面をリロードして完全に初期状態に戻す
        location.reload();
    }
}

/**
 * インポート処理
 */
function handleImport() {
    const importDataText = document.getElementById('import-data-input').value;
    if (!importDataText.trim()) {
        alert("インポートするデータを入力してください。");
        return;
    }

    try {
        const importData = JSON.parse(importDataText);
        applyDataToForm(importData);
        saveStateToLocalStorage(); // インポートした内容を自動保存
        alert("データをインポートしました。");
    } catch (e) {
        alert("データの形式が正しくありません。エクスポートされたテキストを正しく貼り付けてください。");
        console.error("インポートエラー:", e);
    }
}

/**
 * エクスポート処理（テキストエリアに表示）
 */
function handleExport() {
    const exportContainer = document.getElementById('export-container');
    const exportTextarea = document.getElementById('export-data-output');
    const formData = collectFormData();
    // JSON文字列を整形して出力
    exportTextarea.value = JSON.stringify(formData, null, 2);
    exportContainer.style.display = 'block';
}

/**
 * エクスポートデータをクリップボードにコピーする
 */
function copyExportDataToClipboard() {
    const exportTextarea = document.getElementById('export-data-output');
    const copyButton = document.getElementById('copy-export-button');
    navigator.clipboard.writeText(exportTextarea.value).then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'コピーしました！';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('クリップボードへのコピーに失敗しました。');
        console.error('コピー失敗:', err);
    });
}

// ドロップダウンの初期化（イベントリスナーに自動保存を追加）
function initializeDropdowns() {
    const horseNames = horseData.map(horse => horse.名前).sort();

    // イベントリスナーの共通処理
    const eventHandler = (event) => {
        if (event.target.classList.contains('individual-select')) {
            const pos = event.target.id.split('_')[1];
            updateHorseSelection(pos, event.target.value);
        }
        saveStateToLocalStorage(); // どの入力が変更されても保存
    };

    document.querySelectorAll('.individual-select').forEach(select => {
        horseNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
        select.addEventListener('change', eventHandler);
    });

    document.querySelectorAll('.factor-select').forEach(select => {
        factorTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });
        select.addEventListener('change', eventHandler);
    });

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', eventHandler);
    });
}

// 馬選択時の処理
function updateHorseSelection(pos, horseName) {
    // 対象ポジションが適性表示対象かチェック
    const isDisplayTarget = displayPositions.some(dp => dp.pos == pos);
    if (isDisplayTarget && horseName) {
        // 選択された馬のデータを取得
        const horse = horseData.find(h => h.名前 === horseName);
        if (horse) {
            // 適性表示を更新
            updateAptitudeDisplay(pos, horse);
            // 最適な因子を選択
            selectBestFactor(pos, horse);
        }
    } else if (isDisplayTarget && !horseName) {
        // 「未指定」が選択された場合、適性表示をクリア
        const aptitudeDisplay = document.getElementById('aptitude_' + pos);
        if (aptitudeDisplay) {
            aptitudeDisplay.innerHTML = '';
            aptitudeDisplay.style.display = 'none';
        }
    }
}

// 適性表示を更新（縦並び形式）
function updateAptitudeDisplay(pos, horse) {
    const aptitudeDisplay = document.getElementById('aptitude_' + pos);
    if (!aptitudeDisplay) return;

    let html = '';
    html += '<div class="aptitude-group">';
    html += '<div class="aptitude-item"><span class="apt-label">芝:</span><span class="apt-value rank-' + horse.芝 + '">' + horse.芝 + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">ダ:</span><span class="apt-value rank-' + horse.ダート + '">' + horse.ダート + '</span></div>';
    html += '</div>';

    html += '<div class="aptitude-group">';
    html += '<div class="aptitude-item"><span class="apt-label">短:</span><span class="apt-value rank-' + horse.短距離 + '">' + horse.短距離 + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">マ:</span><span class="apt-value rank-' + horse.マイル + '">' + horse.マイル + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">中:</span><span class="apt-value rank-' + horse.中距離 + '">' + horse.中距離 + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">長:</span><span class="apt-value rank-' + horse.長距離 + '">' + horse.長距離 + '</span></div>';
    html += '</div>';

    html += '<div class="aptitude-group">';
    html += '<div class="aptitude-item"><span class="apt-label">逃:</span><span class="apt-value rank-' + horse.逃げ + '">' + horse.逃げ + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">先:</span><span class="apt-value rank-' + horse.先行 + '">' + horse.先行 + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">差:</span><span class="apt-value rank-' + horse.差し + '">' + horse.差し + '</span></div>';
    html += '<div class="aptitude-item"><span class="apt-label">追:</span><span class="apt-value rank-' + horse.追込 + '">' + horse.追込 + '</span></div>';
    html += '</div>';

    aptitudeDisplay.innerHTML = html;
    aptitudeDisplay.style.display = 'block';
}

// 最適な因子を選択
function selectBestFactor(pos, horse) {
    const factorSelect = document.getElementById('factor_' + pos);
    if (!factorSelect) return;

    // 適性をランク順にソート
    const aptitudes = [
        {type: '芝', value: horse.芝},
        {type: 'ダート', value: horse.ダート},
        {type: '短距離', value: horse.短距離},
        {type: 'マイル', value: horse.マイル},
        {type: '中距離', value: horse.中距離},
        {type: '長距離', value: horse.長距離},
        {type: '逃げ', value: horse.逃げ},
        {type: '先行', value: horse.先行},
        {type: '差し', value: horse.差し},
        {type: '追込', value: horse.追込}
    ].sort((a, b) => {
        const rank = {'A': 7, 'B': 6, 'C': 5, 'D': 4, 'E': 3, 'F': 2, 'G': 1};
        return rank[b.value] - rank[a.value];
    });

    // 最高適性の因子を選択（ただしGではないもの）
    if (aptitudes.length > 0 && aptitudes[0].value !== 'G') {
        factorSelect.value = aptitudes[0].type;
    } else {
        factorSelect.value = ''; // Gしかない場合は未選択に
    }
}

// コピーボタンの設定
function setupCopyButtons() {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (action === 'copyGrandfather') {
                copyPaternalBranch(7, 22); // 父方祖父 -> 母方祖父
            } else if (action === 'copyGrandmother') {
                copyPaternalBranch(14, 29); // 父方祖母 -> 母方祖母
            }
            saveStateToLocalStorage(); // コピー後も保存
        });
    });
}

// 父方の系統をコピー
function copyPaternalBranch(fromPos, toPos) {
    // 対象ポジションを取得
    const targetPositions = [];
    // コピー元と対象のポジションを探す
    if (fromPos === 7 && toPos === 22) {
        // 父方祖父系 -> 母方祖父系
        targetPositions.push({from: 7, to: 22}); // 祖父
        targetPositions.push({from: 3, to: 18}); // 曾祖父
        targetPositions.push({from: 6, to: 21}); // 曾祖母
        targetPositions.push({from: 1, to: 16}); // 高祖父
        targetPositions.push({from: 2, to: 17}); // 高祖母
        targetPositions.push({from: 4, to: 19}); // 高祖父
        targetPositions.push({from: 5, to: 20}); // 高祖母
    } else if (fromPos === 14 && toPos === 29) {
        // 父方祖母系 -> 母方祖母系
        targetPositions.push({from: 14, to: 29}); // 祖母
        targetPositions.push({from: 10, to: 25}); // 曾祖父
        targetPositions.push({from: 13, to: 28}); // 曾祖母
        targetPositions.push({from: 8, to: 23}); // 高祖父
        targetPositions.push({from: 9, to: 24}); // 高祖母
        targetPositions.push({from: 11, to: 26}); // 高祖父
        targetPositions.push({from: 12, to: 27}); // 高祖母
    }

    // 各ポジションでコピー実行
    targetPositions.forEach(target => {
        copyIndividualData(target.from, target.to);
    });
}

// 個体データをコピー
function copyIndividualData(fromPos, toPos) {
    // 個体名
    const fromSelect = document.getElementById('individual_' + fromPos);
    const toSelect = document.getElementById('individual_' + toPos);
    if (fromSelect && toSelect) {
        toSelect.value = fromSelect.value;
    }

    // 因子
    const fromFactor = document.getElementById('factor_' + fromPos);
    const toFactor = document.getElementById('factor_' + toPos);
    if (fromFactor && toFactor) {
        toFactor.value = fromFactor.value;
    }

    // 因子の☆数
    const fromStar = document.querySelector('input[name="stars_' + fromPos + '"]:checked');
    if (fromStar) {
        const toStar = document.getElementById('stars_' + toPos + '_' + fromStar.value);
        if (toStar) {
            toStar.checked = true;
        }
    }

    // 適性表示も更新するが、因子の自動選択(selectBestFactor)は行わないようにする。
    // そのため、updateHorseSelectionの代わりに、updateAptitudeDisplayを直接呼び出す。
    if (toSelect && toSelect.value) {
        const horse = horseData.find(h => h.名前 === toSelect.value);
        if (horse) {
            updateAptitudeDisplay(toPos, horse);
        }
    } else {
        // コピー元が「未指定」の場合、コピー先の適性表示もクリアする
        const aptitudeDisplay = document.getElementById('aptitude_' + toPos);
        if (aptitudeDisplay) {
            aptitudeDisplay.innerHTML = '';
            aptitudeDisplay.style.display = 'none';
        }
    }
}

// 適性計算
function calculateAptitudes() {
    // フォームデータを収集
    const formData = collectFormData();

    // 計算対象の個体(本人、親、祖父母)を取得
    const targetPositions = [31, 15, 30, 7, 14, 22, 29];

    // 計算結果を格納するオブジェクト
    const results = {
        individuals: {},      // 個体情報
        originalAptitudes: {}, // 元の適性
        correctedAptitudes: {},// 補正後の適性
        changes: {},           // 変更があった項目
        genePotentials: {}     // 遺伝子付与可能性を追加
    };

    // 各計算対象について処理
    targetPositions.forEach(pos => {
        const horseName = formData['individual_' + pos];
        if (!horseName) {
            // 未指定の場合はスキップ
            return;
        }

        // 馬データを取得
        const horse = horseData.find(h => h.名前 === horseName);
        if (!horse) {
            console.warn(`馬データが見つかりません: ${horseName} (ポジション: ${pos})`);
            return;
        }

        // 個体情報を格納
        results.individuals[pos] = {
            name: horseName,
            factor: pos !== 31 ? formData['factor_' + pos] : '',
            stars: pos !== 31 ? (formData['stars_' + pos] || '0') : '0'
        };

        // 元の適性を格納
        results.originalAptitudes[pos] = {
            芝: horse.芝,
            ダート: horse.ダート,
            短距離: horse.短距離,
            マイル: horse.マイル,
            中距離: horse.中距離,
            長距離: horse.長距離,
            逃げ: horse.逃げ,
            先行: horse.先行,
            差し: horse.差し,
            追込: horse.追込
        };

        // 因子による補正値を計算
        const factorBoosts = calculateFactorBoosts(pos, formData);

        // 補正後の適性を計算
        results.correctedAptitudes[pos] = {};
        results.changes[pos] = {};
        factorTypes.forEach(type => {
            const originalRank = results.originalAptitudes[pos][type];
            const boost = factorBoosts[type] || 0;
            const correctedRank = applyBoostToRank(originalRank, boost);
            results.correctedAptitudes[pos][type] = correctedRank;
            results.changes[pos][type] = (originalRank !== correctedRank);
        });

        // 遺伝子付与可能性を計算して追加
        results.genePotentials[pos] = calculateGenePotential(pos, formData);
    });

    // 結果を表示
    displayResults(results);
}

// 因子による適性補正値を計算
function calculateFactorBoosts(targetPos, formData) {
    // 適性補正値を格納するオブジェクト（因子タイプごと）
    const factorBoosts = {};
    factorTypes.forEach(type => factorBoosts[type] = 0);

    // 計算対象の1代・2代前の枠を定義
    let relevantAncestors = [];
    if (targetPos === 31) { // 本人
        relevantAncestors = [15, 30, 7, 14, 22, 29];
    } else if (targetPos === 15) { // 父
        relevantAncestors = [7, 14, 3, 6, 10, 13];
    } else if (targetPos === 30) { // 母
        relevantAncestors = [22, 29, 18, 21, 25, 28];
    } else if (targetPos === 7) { // 父方祖父
        relevantAncestors = [3, 6, 1, 2, 4, 5];
    } else if (targetPos === 14) { // 父方祖母
        relevantAncestors = [10, 13, 8, 9, 11, 12];
    } else if (targetPos === 22) { // 母方祖父
        relevantAncestors = [18, 21, 16, 17, 19, 20];
    } else if (targetPos === 29) { // 母方祖母
        relevantAncestors = [25, 28, 23, 24, 26, 27];
    }

    // 各ポジションの因子と☆数を集計
    relevantAncestors.forEach(pos => {
        const factor = formData['factor_' + pos];
        const stars = parseInt(formData['stars_' + pos] || '0');
        // 因子がある場合のみ集計
        if (factor && stars > 0) {
            factorBoosts[factor] = (factorBoosts[factor] || 0) + stars;
        }
    });

    // 因子の☆数に応じた補正段階を計算
    const boostLevels = {};
    factorTypes.forEach(type => {
        const totalStars = factorBoosts[type];
        if (totalStars >= 10) {
            boostLevels[type] = 4; // 4段階上昇（☆10以上）
        } else if (totalStars >= 7) {
            boostLevels[type] = 3; // 3段階上昇（☆7〜9）
        } else if (totalStars >= 4) {
            boostLevels[type] = 2; // 2段階上昇（☆4〜6）
        } else if (totalStars >= 1) {
            boostLevels[type] = 1; // 1段階上昇（☆1〜3）
        } else {
            boostLevels[type] = 0; // 補正なし
        }
    });
    return boostLevels;
}

// 適性ランクに補正を適用
function applyBoostToRank(originalRank, boostLevel) {
    if (boostLevel <= 0) return originalRank;
    const rankIndex = aptitudeRanks.indexOf(originalRank);
    if (rankIndex === -1) return originalRank; // 不明なランクはそのまま返す
    const newIndex = Math.min(rankIndex + boostLevel, aptitudeRanks.length - 1); // Aが上限
    return aptitudeRanks[newIndex];
}

// 結果表示で使用する適性表示関数
function formatAptitudeTable(originalApt, correctedApt, changes) {
    let tableHTML = '';
    // 適性項目と表示ラベルの対応
    const aptitudesLayout = [
        [{key: '芝', label: '芝'}, {key: 'ダート', label: 'ダ'}],
        [{key: '短距離', label: '短'}, {key: 'マイル', label: 'マ'}, {key: '中距離', label: '中'}, {key: '長距離', label: '長'}],
        [{key: '逃げ', label: '逃'}, {key: '先行', label: '先'}, {key: '差し', label: '差'}, {key: '追込', label: '追'}]
    ];

    aptitudesLayout.forEach(group => {
        tableHTML += '<div class="aptitude-group">';
        group.forEach(item => {
            const isChanged = changes[item.key];
            const className = `apt-value rank-${correctedApt[item.key]}${isChanged ? ' changed' : ''}`;
            tableHTML += `<div class="aptitude-item"><span class="apt-label">${item.label}:</span><span class="${className}">${correctedApt[item.key]}</span></div>`;
        });
        tableHTML += '</div>';
    });
    return tableHTML;
}

// 個体から見て2代前までの先祖を取得する関数
function getAncestorsForGenePotential(pos) {
    let ancestors = [];
    if (pos === 31) { // 本人
        ancestors = [15, 30, 7, 14, 22, 29];
    } else if (pos === 15) { // 父
        ancestors = [7, 14, 3, 6, 10, 13];
    } else if (pos === 30) { // 母
        ancestors = [22, 29, 18, 21, 25, 28];
    } else if (pos === 7) { // 父方祖父
        ancestors = [3, 6, 1, 2, 4, 5];
    } else if (pos === 14) { // 父方祖母
        ancestors = [10, 13, 8, 9, 11, 12];
    } else if (pos === 22) { // 母方祖父
        ancestors = [18, 21, 16, 17, 19, 20];
    } else if (pos === 29) { // 母方祖母
        ancestors = [25, 28, 23, 24, 26, 27];
    }
    return ancestors;
}

// 同じ種類の因子を集計して遺伝子付与可能性を判定する関数
function calculateGenePotential(pos, formData) {
    const ancestors = getAncestorsForGenePotential(pos);
    const factorCounts = {};
    factorTypes.forEach(type => {
        factorCounts[type] = 0;
    });

    ancestors.forEach(ancestorPos => {
        const factor = formData['factor_' + ancestorPos];
        const stars = parseInt(formData['stars_' + ancestorPos] || '0');
        if (factor && stars > 0) {
            factorCounts[factor] += stars;
        }
    });

    const genePotentials = [];
    factorTypes.forEach(type => {
        const stars = factorCounts[type];
        if (stars >= 12) {
            genePotentials.push({type: type, status: 'confirmed', stars: stars}); // 確定
        } else if (stars >= 6) {
            genePotentials.push({type: type, status: 'potential', stars: stars}); // 獲得
        }
    });
    genePotentials.sort((a, b) => b.stars - a.stars); // スター数の多い順にソート
    return genePotentials.slice(0, 3); // 最大3つまで返す
}

// 遺伝子付与可能性の表示用HTML生成
function generateGenePotentialHTML(genePotentials) {
    if (genePotentials.length === 0) return '';
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

function displayResults(results) {
    const resultDiv = document.getElementById('results');
    if (!resultDiv) return;

    let html = '<h2>計算結果</h2>';
    html += '<div class="pedigree-grid-container results-grid">'; // 結果表示用のグリッド

    pedigreePositions.forEach(position => {
        const pos = position.pos;
        const individualName = document.getElementById(`individual_${pos}`)?.value || '';

        let factorInfo = '';
        if (position.displayFactor) {
            const factorType = document.getElementById(`factor_${pos}`)?.value || '';
            const starRadio = document.querySelector(`input[name="stars_${pos}"]:checked`);
            const stars = starRadio ? starRadio.value : '0';
            if (factorType && stars > 0) {
                factorInfo = `${factorType}${stars}★`;
            }
        }

        html += `<div class="pedigree-cell gen${position.gen}">`;
        
        let displayName = individualName;
        if (displayName && displayName.includes('[')) {
            displayName = displayName.split('[')[0].trim();
        }
        html += `<div class="pedigree-cell-title">${position.label}</div>`;
        html += `<div>${displayName || '未指定'}</div>`;

        if (factorInfo) {
            html += `<div>${factorInfo}</div>`;
        }

        const individualResult = results.individuals[pos];
        if (displayPositions.some(dp => dp.pos === pos) && individualResult) {
            const originalApt = results.originalAptitudes[pos];
            const correctedApt = results.correctedAptitudes[pos];
            const changes = results.changes[pos];
            const genePotentials = results.genePotentials[pos];

            if (originalApt && correctedApt) {
                html += `<div class="aptitude-display" style="display:block;">${formatAptitudeTable(originalApt, correctedApt, changes)}</div>`;
                html += generateGenePotentialHTML(genePotentials);
            }
        }
        html += '</div>'; // .pedigree-cell
    });

    html += '</div>'; // .pedigree-grid-container

    html += '<div class="factor-explanation">';
    html += '<h3>因子による適性補正について</h3>';
    html += '<ul>';
    html += '<li>1代目・2代目の因子：☆1個→1段階上昇、☆4個→2段階上昇、☆7個→3段階上昇、☆10個→4段階上昇</li>';
    html += '<li>※適性はG→F→E→D→C→B→Aの順に上昇し、Aが上限となります</li>';
    html += '<li>※赤字は因子による補正で上昇した項目</li>';
    html += '</ul>';
    html += '<h3>遺伝子付与可能性について</h3>';
    html += '<ul>';
    html += '<li>※遺伝子については「同じ種類の因子☆6以上で獲得、☆12以上で確定」説を採用しています</li>';
    html += '</ul>';
    html += '</div>';

    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// ランダム入力でフォームを埋める関数（開発用）
function fillRandomData() {
    if (!horseData || horseData.length === 0) {
        alert('馬データが読み込まれていません。ページを再読み込みしてください。');
        return;
    }

    document.querySelectorAll('.individual-select').forEach(select => {
        const options = select.querySelectorAll('option');
        if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1; // 0は「未指定」
            select.selectedIndex = randomIndex;
            select.dispatchEvent(new Event('change')); // 適性表示更新のため
        }
    });

    document.querySelectorAll('.factor-select').forEach(select => {
        const options = select.querySelectorAll('option');
        if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
            select.selectedIndex = randomIndex;
        }
    });

    document.querySelectorAll('input[type="radio"][value="3"]').forEach(radio => {
        radio.checked = true;
    });

    saveStateToLocalStorage(); // ランダム入力後も保存
    console.log('ランダム入力が完了しました。すべての因子は☆3に設定されています。');
}
