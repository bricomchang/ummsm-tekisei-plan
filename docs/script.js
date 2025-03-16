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
    {pos: 7, sheetRow: 9, label: '父方祖父'}    // 父方祖父
  ];
  
  // 因子タイプ
  const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
  
  // 適性ランク（G→A）
  const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
  
  // グローバル変数
  let horseData = [];
  
  // ページ読み込み時の処理
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // JSONデータの読み込み
      const response = await fetch('umadata.json');
      horseData = await response.json();
      console.log('馬データを読み込みました');
      
      // 血統表グリッドを生成
      createPedigreeGrid();
      
      // プルダウンリストを初期化
      initializeDropdowns();
      
      // コピーボタンのイベントリスナー設定
      setupCopyButtons();
      
      // 計算ボタンのイベントリスナー設定
      const calculateButton = document.getElementById('calculate-button');
      if (calculateButton) {
        calculateButton.addEventListener('click', calculateAptitudes);
      } else {
        console.error('計算ボタンが見つかりません。HTML内のID名を確認してください。');
      }
      
      // テストボタンのイベントリスナー設定
      const testButton = document.getElementById('test-button');
      if (testButton) {
        testButton.addEventListener('click', fillRandomData);
      } else {
        console.error('テストボタンが見つかりません。HTML内のID名を確認してください。');
      }
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
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
    for (let i = 0; i < pedigreePositions.length; i++) {
      const p = pedigreePositions[i];
      
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
      let cellContent = '<div class="cell-label">' + p.label + '</div>' +
        '<select class="individual-select" id="individual_' + p.pos + '" name="individual_' + p.pos + '">' +
        '<option value="">未指定</option>' +
        '</select>';
      
      // 因子入力欄（本人以外）
      if (p.displayFactor) {
        cellContent += '<select class="factor-select" id="factor_' + p.pos + '" name="factor_' + p.pos + '">' +
          '<option value="">因子選択</option>' +
          '</select>' +
          '<div class="radio-group" id="stars_group_' + p.pos + '">' +
          '<div class="radio-option">' +
          '<input type="radio" name="stars_' + p.pos + '" id="stars_' + p.pos + '_0" value="0" checked>' +
          '<label for="stars_' + p.pos + '_0">なし</label>' +
          '</div>' +
          '<div class="radio-option">' +
          '<input type="radio" name="stars_' + p.pos + '" id="stars_' + p.pos + '_1" value="1">' +
          '<label for="stars_' + p.pos + '_1">★</label>' +
          '</div>' +
          '<div class="radio-option">' +
          '<input type="radio" name="stars_' + p.pos + '" id="stars_' + p.pos + '_2" value="2">' +
          '<label for="stars_' + p.pos + '_2">★★</label>' +
          '</div>' +
          '<div class="radio-option">' +
          '<input type="radio" name="stars_' + p.pos + '" id="stars_' + p.pos + '_3" value="3">' +
          '<label for="stars_' + p.pos + '_3">★★★</label>' +
          '</div>' +
          '</div>';
      }
      
      // 母方祖父と母方祖母にのみコピーボタンを追加
      if (p.pos === 22) {
        cellContent += '<button type="button" class="copy-button" data-target="22" data-action="copyGrandfather">父方祖父系統からコピー</button>';
      } else if (p.pos === 29) {
        cellContent += '<button type="button" class="copy-button" data-target="29" data-action="copyGrandmother">父方祖母系統からコピー</button>';
      }
      
      // 適性表示用のエリア（本人、親、祖父母のみ）
      if (displayPositions.some(dp => dp.pos === p.pos)) {
        cellContent += '<div class="aptitude-display" id="aptitude_' + p.pos + '">' +
          '<div class="aptitude-row">' +
          '<span>芝: <span class="aptitude-value"></span></span>' +
          '<span>ダ: <span class="aptitude-value"></span></span>' +
          '</div>' +
          '<div class="aptitude-row">' +
          '<span>短: <span class="aptitude-value"></span></span>' +
          '<span>マ: <span class="aptitude-value"></span></span>' +
          '<span>中: <span class="aptitude-value"></span></span>' +
          '<span>長: <span class="aptitude-value"></span></span>' +
          '</div>' +
          '<div class="aptitude-row">' +
          '<span>逃: <span class="aptitude-value"></span></span>' +
          '<span>先: <span class="aptitude-value"></span></span>' +
          '<span>差: <span class="aptitude-value"></span></span>' +
          '<span>追: <span class="aptitude-value"></span></span>' +
          '</div>' +
          '</div>';
      }
      
      cell.innerHTML = cellContent;
      container.appendChild(cell);
    }
  }
  
  // ドロップダウンの初期化
  function initializeDropdowns() {
    // 馬名のプルダウン初期化
    const horseNames = horseData.map(horse => horse.名前).sort();
    
    document.querySelectorAll('.individual-select').forEach(select => {
      horseNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
      
      // 馬選択時のイベントリスナー
      select.addEventListener('change', function() {
        const pos = this.id.split('_')[1];
        updateHorseSelection(pos, this.value);
      });
    });
    
    // 因子タイプのプルダウン初期化
    document.querySelectorAll('.factor-select').forEach(select => {
      factorTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
      });
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
    }
  }
  
// 適性表示を更新（縦並び形式）
function updateAptitudeDisplay(pos, horse) {
    const aptitudeDisplay = document.getElementById('aptitude_' + pos);
    if (!aptitudeDisplay) return;
    
    // 縦並び3段組に変更
    let html = '<div class="aptitude-groups">';
    
    // 芝・ダート グループ
    html += '<div class="aptitude-group">';
    html += '<div class="aptitude-item"><span class="aptitude-label">芝</span><span class="aptitude-value rank-' + horse.芝 + '">' + horse.芝 + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">ダ</span><span class="aptitude-value rank-' + horse.ダート + '">' + horse.ダート + '</span></div>';
    html += '</div>';
    
    // 距離適性 グループ
    html += '<div class="aptitude-group">';
    html += '<div class="aptitude-item"><span class="aptitude-label">短</span><span class="aptitude-value rank-' + horse.短距離 + '">' + horse.短距離 + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">マ</span><span class="aptitude-value rank-' + horse.マイル + '">' + horse.マイル + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">中</span><span class="aptitude-value rank-' + horse.中距離 + '">' + horse.中距離 + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">長</span><span class="aptitude-value rank-' + horse.長距離 + '">' + horse.長距離 + '</span></div>';
    html += '</div>';
    
    // 脚質適性 グループ
    html += '<div class="aptitude-group">';
    html += '<div class="aptitude-item"><span class="aptitude-label">逃</span><span class="aptitude-value rank-' + horse.逃げ + '">' + horse.逃げ + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">先</span><span class="aptitude-value rank-' + horse.先行 + '">' + horse.先行 + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">差</span><span class="aptitude-value rank-' + horse.差し + '">' + horse.差し + '</span></div>';
    html += '<div class="aptitude-item"><span class="aptitude-label">追</span><span class="aptitude-value rank-' + horse.追込 + '">' + horse.追込 + '</span></div>';
    html += '</div>';
    
    html += '</div>';
    
    aptitudeDisplay.innerHTML = html;
    aptitudeDisplay.style.display = 'block';
  }

  // 個別の適性値を更新
  function updateAptitudeValue(element, value) {
    element.textContent = value;
    element.className = 'aptitude-value rank-' + value;
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
    
    // 最高適性の因子を選択
    if (aptitudes.length > 0 && aptitudes[0].value !== 'G') {
      factorSelect.value = aptitudes[0].type;
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
      
      // 適性表示も更新
      updateHorseSelection(toPos, toSelect.value);
    }
  }
  
  // フォームデータの収集
  function collectFormData() {
    const formData = {};
    
    // 各ポジションのデータを収集
    pedigreePositions.forEach(position => {
      const pos = position.pos;
      
      // 個体名
      const individualSelect = document.getElementById('individual_' + pos);
      if (individualSelect) {
        formData['individual_' + pos] = individualSelect.value;
      }
      
      // 因子タイプと☆数（本人以外）
      if (position.displayFactor) {
        const factorSelect = document.getElementById('factor_' + pos);
        if (factorSelect) {
          formData['factor_' + pos] = factorSelect.value;
        }
        
        const starRadio = document.querySelector('input[name="stars_' + pos + '"]:checked');
        if (starRadio) {
          formData['stars_' + pos] = starRadio.value;
        }
      }
    });
    
    return formData;
  }
  
  // 適性計算
  function calculateAptitudes() {
    // フォームデータを収集
    const formData = collectFormData();
    
    // 計算対象の個体(本人、親、祖父母)を取得
    const targetPositions = [31, 15, 30, 7, 14, 22, 29];
    
    // 計算結果を格納するオブジェクト
    const results = {
      individuals: {}, // 個体情報
      originalAptitudes: {}, // 元の適性
      correctedAptitudes: {}, // 補正後の適性
      changes: {}, // 変更があった項目
      genePotentials: {} // 遺伝子付与可能性を追加
    };
    
    // 各計算対象について処理
    targetPositions.forEach(pos => {
      const horseName = formData['individual_' + pos];
      if (!horseName) return;
      
      // 馬データを取得
      const horse = horseData.find(h => h.名前 === horseName);
      if (!horse) return;
      
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
      
      // 各適性項目について補正計算
      factorTypes.forEach(type => {
        const originalRank = results.originalAptitudes[pos][type];
        const boost = factorBoosts[type] || 0;
        
        // 補正適用(ランクを上昇させる、Aが上限)
        const correctedRank = applyBoostToRank(originalRank, boost);
        results.correctedAptitudes[pos][type] = correctedRank;
        
        // 変更があったかどうか記録
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
    let parentAndGrandparentPositions = [];
    
    if (targetPos === 31) { // 本人
      // 親と祖父母のポジション
      parentAndGrandparentPositions = [15, 30, 7, 14, 22, 29];
    } else if (targetPos === 15) { // 父
      // 父方祖父母とその親
      parentAndGrandparentPositions = [7, 14, 3, 6, 10, 13];
    } else if (targetPos === 30) { // 母
      // 母方祖父母とその親
      parentAndGrandparentPositions = [22, 29, 18, 21, 25, 28];
    } else if (targetPos === 7) { // 父方祖父
      // 父方祖父の親とその親
      parentAndGrandparentPositions = [3, 6, 1, 2, 4, 5];
    } else if (targetPos === 14) { // 父方祖母
      // 父方祖母の親とその親
      parentAndGrandparentPositions = [10, 13, 8, 9, 11, 12];
    } else if (targetPos === 22) { // 母方祖父
      // 母方祖父の親とその親
      parentAndGrandparentPositions = [18, 21, 16, 17, 19, 20];
    } else if (targetPos === 29) { // 母方祖母
      // 母方祖母の親とその親
      parentAndGrandparentPositions = [25, 28, 23, 24, 26, 27];
    }
    
    // 各ポジションの因子と☆数を集計
    parentAndGrandparentPositions.forEach(pos => {
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
      
      // ☆数に応じた補正段階
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
    
    // ランクのインデックスを取得
    const rankIndex = aptitudeRanks.indexOf(originalRank);
    if (rankIndex === -1) return originalRank;
    
    // 新しいインデックスを計算（上限は「A」）
    const newIndex = Math.min(rankIndex + boostLevel, aptitudeRanks.length - 1);
    
    // 新しいランクを返す
    return aptitudeRanks[newIndex];
  }
  
// 結果表示で使用する適性表示関数も同様に修正
function formatAptitudeTable(originalApt, correctedApt, changes) {
    let tableHTML = '<table class="aptitude-table">';
    
    // 第1段: 芝・ダート・短距離・マイル
    tableHTML += '<tr>';
    tableHTML += '<td><span class="aptitude-label">芝</span></td>';
    tableHTML += '<td><span class="aptitude-label">ダ</span></td>';
    tableHTML += '</tr>';
    
    tableHTML += '<tr>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['芝'] + (changes['芝'] ? ' aptitude-diff' : '') + '">' + correctedApt['芝'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['ダート'] + (changes['ダート'] ? ' aptitude-diff' : '') + '">' + correctedApt['ダート'] + '</span></td>';
    tableHTML += '</tr>';
    
    // 第2段: 中距離・長距離・逃げ・先行
    tableHTML += '<tr>';
    tableHTML += '<td><span class="aptitude-label">短</span></td>';
    tableHTML += '<td><span class="aptitude-label">マ</span></td>';
    tableHTML += '<td><span class="aptitude-label">中</span></td>';
    tableHTML += '<td><span class="aptitude-label">長</span></td>';
    tableHTML += '</tr>';
    
    tableHTML += '<tr>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['短距離'] + (changes['短距離'] ? ' aptitude-diff' : '') + '">' + correctedApt['短距離'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['マイル'] + (changes['マイル'] ? ' aptitude-diff' : '') + '">' + correctedApt['マイル'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['中距離'] + (changes['中距離'] ? ' aptitude-diff' : '') + '">' + correctedApt['中距離'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['長距離'] + (changes['長距離'] ? ' aptitude-diff' : '') + '">' + correctedApt['長距離'] + '</span></td>';
    tableHTML += '</tr>';
    
    // 第3段: 差し・追込
    tableHTML += '<tr>';
    tableHTML += '<td><span class="aptitude-label">逃</span></td>';
    tableHTML += '<td><span class="aptitude-label">先</span></td>';
    tableHTML += '<td><span class="aptitude-label">差</span></td>';
    tableHTML += '<td><span class="aptitude-label">追</span></td>';
    tableHTML += '</tr>';
    
    tableHTML += '<tr>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['逃げ'] + (changes['逃げ'] ? ' aptitude-diff' : '') + '">' + correctedApt['逃げ'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['先行'] + (changes['先行'] ? ' aptitude-diff' : '') + '">' + correctedApt['先行'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['差し'] + (changes['差し'] ? ' aptitude-diff' : '') + '">' + correctedApt['差し'] + '</span></td>';
    tableHTML += '<td><span class="aptitude-value rank-' + correctedApt['追込'] + (changes['追込'] ? ' aptitude-diff' : '') + '">' + correctedApt['追込'] + '</span></td>';
    tableHTML += '</tr>';
    
    tableHTML += '</table>';
    
    return tableHTML;
  }
    
// 個体から見て2代前までの先祖を取得する関数
function getAncestorsForGenePotential(pos) {
    let ancestors = [];
    
    // 本人(31)の場合: 親(15,30)と祖父母(7,14,22,29)
    if (pos === 31) {
      ancestors = [15, 30, 7, 14, 22, 29];
    }
    // 父(15)の場合: 祖父母(7,14)と曾祖父母(3,6,10,13)
    else if (pos === 15) {
      ancestors = [7, 14, 3, 6, 10, 13];
    }
    // 母(30)の場合: 祖父母(22,29)と曾祖父母(18,21,25,28)
    else if (pos === 30) {
      ancestors = [22, 29, 18, 21, 25, 28];
    }
    // 父方祖父(7)の場合: 曾祖父母(3,6)と高祖父母(1,2,4,5)
    else if (pos === 7) {
      ancestors = [3, 6, 1, 2, 4, 5];
    }
    // 父方祖母(14)の場合: 曾祖父母(10,13)と高祖父母(8,9,11,12)
    else if (pos === 14) {
      ancestors = [10, 13, 8, 9, 11, 12];
    }
    // 母方祖父(22)の場合: 曾祖父母(18,21)と高祖父母(16,17,19,20)
    else if (pos === 22) {
      ancestors = [18, 21, 16, 17, 19, 20];
    }
    // 母方祖母(29)の場合: 曾祖父母(25,28)と高祖父母(23,24,26,27)
    else if (pos === 29) {
      ancestors = [25, 28, 23, 24, 26, 27];
    }
    
    return ancestors;
  }
  
  // 同じ種類の因子を集計して遺伝子付与可能性を判定する関数
  function calculateGenePotential(pos, formData) {
    const ancestors = getAncestorsForGenePotential(pos);
    const factorCounts = {};
    
    // 因子タイプごとに初期化
    factorTypes.forEach(type => {
      factorCounts[type] = 0;
    });
    
    // 各先祖の因子と星数を集計
    ancestors.forEach(ancestorPos => {
      const factor = formData['factor_' + ancestorPos];
      const stars = parseInt(formData['stars_' + ancestorPos] || '0');
      
      if (factor && stars > 0) {
        factorCounts[factor] += stars;
      }
    });
    
    // 遺伝子付与可能性を判定
    const genePotentials = [];
    
    factorTypes.forEach(type => {
      const stars = factorCounts[type];
      if (stars >= 12) {
        genePotentials.push({type: type, status: 'confirmed', stars: stars}); // 確定
      } else if (stars >= 6) {
        genePotentials.push({type: type, status: 'potential', stars: stars}); // 獲得
      }
    });
    
    // スター数の多い順にソート
    genePotentials.sort((a, b) => b.stars - a.stars);
    
    // 最大3つまで返す
    return genePotentials.slice(0, 3);
  }
  
  // 遺伝子付与可能性の表示用HTML生成
  function generateGenePotentialHTML(genePotentials) {
    if (genePotentials.length === 0) return '';
    
    let html = '<div class="gene-potentials">';    
    genePotentials.forEach(gene => {
      if (gene.status === 'confirmed') {
        html += '<div class="gene-confirmed">' + gene.type + '遺伝子確定</div>';
      } else {
        html += '<div class="gene-potential">' + gene.type + '遺伝子獲得</div>';
      }
    });
    
    html += '</div>';
    return html;
  }
  

  function displayResults(results) {
    const resultDiv = document.getElementById('results');
    if (!resultDiv) return;
    
    // 結果表示用HTMLを生成
    let html = '<h2>計算結果</h2>';
    
    // 入力欄と同じレイアウトで結果を表示
    html += '<div class="pedigree-container">';
    
    // 各ポジションのセルを作成
    for (let i = 0; i < pedigreePositions.length; i++) {
      const position = pedigreePositions[i];
      const pos = position.pos;
      
      // 元のフォームからデータ取得
      const individualSelect = document.getElementById('individual_' + pos);
      const individualName = individualSelect ? individualSelect.value : '';
      
      // 因子情報取得
      let factorInfo = '';
      if (position.displayFactor) {
        const factorSelect = document.getElementById('factor_' + pos);
        const starRadio = document.querySelector('input[name="stars_' + pos + '"]:checked');
        const factorType = factorSelect ? factorSelect.value : '';
        const stars = starRadio ? starRadio.value : '0';
        
        if (factorType && stars > 0) {
          factorInfo = factorType + stars;
        }
      }
      
      // 結果セル生成
      html += '<div class="result-cell gen' + position.gen + '" style="grid-row: ' + position.row + ' / span ' + (position.gen === 1 ? 16 : position.gen === 2 ? 8 : position.gen === 3 ? 4 : position.gen === 4 ? 2 : 1) + ';">';
      
      // 馬名の短縮表示
      let displayName = individualName;
      if (displayName && displayName.includes('[')) {
      displayName = displayName.split('[')[0].trim();
      }      

        // 個体名
      html += '<div class="individual-name">' + (displayName || '未指定') + '</div>';
      
      // 因子情報
      if (factorInfo) {
        html += '<div class="factor-info">' + factorInfo + '</div>';
      }
      
      // 適性表示と遺伝子付与可能性
      const individual = results.individuals[pos];
      if (displayPositions.some(dp => dp.pos === pos) && individual) {
        const originalApt = results.originalAptitudes[pos];
        const correctedApt = results.correctedAptitudes[pos];
        const changes = results.changes[pos];
        const genePotentials = results.genePotentials[pos];
        
        if (originalApt && correctedApt) {
          html += formatAptitudeTable(originalApt, correctedApt, changes);
          
          // 遺伝子付与可能性の表示を追加
          html += generateGenePotentialHTML(genePotentials);
        }
      }
      
      html += '</div>';
    }
    
    html += '</div>';
    
    // 因子説明
    html += '<div class="calculation-info">';
    html += '<h3>因子による適性補正</h3>';
    html += '<p>1代目・2代目の因子：☆1個→1段階上昇、☆4個→2段階上昇、☆7個→3段階上昇、☆10個→4段階上昇</p>';
    html += '<p>※適性はG→F→E→D→C→B→Aの順に上昇し、Aが上限となります</p>';
    html += '<p>※赤字は因子による補正で上昇した項目</p>';
    html += '<p>※同じ種類の因子☆6以上で遺伝子獲得、☆12以上で遺伝子確定</p>';
    html += '</div>';
    
    // 表示
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
  }
  
  // ランダム入力でフォームを埋める関数
  function fillRandomData() {
    // 馬データが読み込まれているか確認
    if (!horseData || horseData.length === 0) {
      alert('馬データが読み込まれていません。ページを再読み込みしてください。');
      return;
    }
    
    // 全ての個体選択プルダウンをランダムに設定
    document.querySelectorAll('.individual-select, select[id^="individual_"]').forEach(select => {
      const options = select.querySelectorAll('option');
      if (options.length > 1) {
        // ランダムなインデックスを選択（0は「未指定」なので除外）
        const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
        select.selectedIndex = randomIndex;
        
        // 変更イベントを発火して適性表示などを更新
        const event = new Event('change');
        select.dispatchEvent(event);
      }
    });
    
    // 全ての因子選択プルダウンをランダムに設定
    document.querySelectorAll('.factor-select, select[id^="factor_"]').forEach(select => {
      const options = select.querySelectorAll('option');
      if (options.length > 1) {
        // ランダムなインデックスを選択（0は「未指定」なので除外）
        const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
        select.selectedIndex = randomIndex;
      }
    });
    
    // 全ての☆を☆3に設定
    document.querySelectorAll('input[type="radio"][value="3"]').forEach(radio => {
      radio.checked = true;
    });
    
    console.log('ランダム入力が完了しました。すべての因子は☆3に設定されています。');
  }
  