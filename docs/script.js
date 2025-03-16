// グローバル変数
let horseData = []; // JSONから読み込んだ馬データ

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // JSONデータの読み込み
    const response = await fetch('umadata.json');
    horseData = await response.json();
    
    // プルダウンリストの初期化
    initializeIndividualDropdowns();
    initializeFactorDropdowns();
    
    // 計算ボタンのイベントリスナー設定
    document.getElementById('calculateButton').addEventListener('click', handleCalculate);
  } catch (error) {
    console.error('データ読み込みエラー:', error);
    alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
  }
});

// 個体名プルダウンの初期化
function initializeIndividualDropdowns() {
  // JSONデータから馬名のリストを作成
  const horseNames = horseData.map(horse => horse.名前);
  
  // 個体選択プルダウンを全て取得して初期化
  const individualSelects = document.querySelectorAll('.individual-select');
  individualSelects.forEach(select => {
    // 既存のオプションをクリア
    select.innerHTML = '<option value="">選択してください</option>';
    
    // 馬名をオプションとして追加
    horseNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  });
}

// 因子タイプのプルダウン初期化
function initializeFactorDropdowns() {
  const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
  
  const factorSelects = document.querySelectorAll('.factor-select');
  factorSelects.forEach(select => {
    select.innerHTML = '<option value="">選択してください</option>';
    
    factorTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      select.appendChild(option);
    });
  });
}

// 計算ボタンのクリックハンドラ
function handleCalculate() {
  // フォームからデータ収集
  const formData = collectFormData();
  
  // ポジション情報を作成 (GASコードから抽出)
  const positions = generatePositions();
  
  // 計算処理実行
  const results = processCalculation(formData, positions);
  
  // 結果の表示
  displayResults(results);
}

// フォームデータ収集
function collectFormData() {
  const formData = {};
  
  // 各個体選択フィールドの値を取得
  document.querySelectorAll('.individual-select').forEach(select => {
    const pos = select.dataset.position;
    formData[`individual_${pos}`] = select.value;
  });
  
  // 各因子フィールドの値を取得
  document.querySelectorAll('.factor-select').forEach(select => {
    const pos = select.dataset.position;
    formData[`factor_${pos}`] = select.value;
  });
  
  // 各因子の☆数を取得
  document.querySelectorAll('.stars-select').forEach(select => {
    const pos = select.dataset.position;
    formData[`stars_${pos}`] = select.value;
  });
  
  return formData;
}

// ポジション情報生成
function generatePositions() {
  // GASコードのpositionsオブジェクトを再現
  return [
    {pos: 31, sheetRow: 33, displayFactor: true}, // 本人
    {pos: 30, sheetRow: 32, displayFactor: true}, // 母
    // 他のポジションも同様に追加
    // ...
  ];
}

// 計算処理実行
function processCalculation(formData, positions) {
  // 入力データを処理
  const inputData = processInputData(formData, positions);
  
  // 適性計算 (スプレッドシートのロジックをJavaScriptで再現)
  const results = calculateAptitudes(inputData, positions);
  
  return results;
}

// 入力データ処理
function processInputData(formData, positions) {
  const inputData = {
    individuals: Array(31).fill(''),
    factors: Array(31).fill(''),
    stars: Array(31).fill('')
  };
  
  positions.forEach(position => {
    const idx = position.sheetRow - 3;
    
    // 個体名
    const individualKey = `individual_${position.pos}`;
    if (formData[individualKey]) {
      inputData.individuals[idx] = formData[individualKey];
    }
    
    // 因子情報
    if (position.displayFactor) {
      const factorKey = `factor_${position.pos}`;
      if (formData[factorKey]) {
        inputData.factors[idx] = formData[factorKey];
      }
      
      const starsKey = `stars_${position.pos}`;
      if (formData[starsKey]) {
        inputData.stars[idx] = formData[starsKey];
      }
    }
  });
  
  return inputData;
}

// 適性計算ロジック
function calculateAptitudes(inputData, positions) {
  // 計算結果格納用
  const names = {};
  const factors = {};
  const originalAptitudes = [];
  const correctedAptitudes = [];
  const inheritances = [];
  
  // 表示対象のポジション
  const displayPositions = [
    {pos: 31, sheetRow: 33}, // 本人
    {pos: 30, sheetRow: 32}, // 母
    {pos: 15, sheetRow: 17}, // 父
    {pos: 29, sheetRow: 31}, // 母方祖母
    {pos: 22, sheetRow: 24}, // 母方祖父
    {pos: 14, sheetRow: 16}, // 父方祖母
    {pos: 7, sheetRow: 9}    // 父方祖父
  ];
  
  // ポジションごとの処理
  positions.forEach(position => {
    const idx = position.sheetRow - 3;
    const name = inputData.individuals[idx];
    names[position.pos] = name;
    
    // 因子情報
    if (position.displayFactor) {
      factors[position.pos] = {
        factor: inputData.factors[idx],
        stars: inputData.stars[idx]
      };
    }
    
    // 選択された馬の適性データを取得
    if (name) {
      const horseAptitude = getHorseAptitude(name);
      if (horseAptitude) {
        // ここで適性値を処理
        // ...
      }
    }
  });
  
  // 各表示ポジションの適性と遺伝子情報を計算
  displayPositions.forEach(position => {
    // ここでスプレッドシートの計算ロジックを再現
    // 元の適性値、補正後適性値、遺伝子付与可能性を計算
    
    // サンプル (実際には正確な計算ロジックを実装する必要がある)
    originalAptitudes.push(Array(10).fill('G'));
    correctedAptitudes.push(Array(10).fill('F'));
    inheritances.push(Array(10).fill('50%'));
  });
  
  return {
    names: names,
    factors: factors,
    originalAptitudes: originalAptitudes,
    correctedAptitudes: correctedAptitudes,
    inheritances: inheritances
  };
}

// 馬名から適性データを取得
function getHorseAptitude(horseName) {
  return horseData.find(horse => horse.名前 === horseName);
}

// 計算結果表示
function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  
  // 結果表示用のHTMLを生成
  let html = '<h2>計算結果</h2>';
  
  // 表示対象のラベル
  const labels = ['本人', '母', '父', '母方祖母', '母方祖父', '父方祖母', '父方祖父'];
  const aptitudeLabels = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
  
  // 各ポジションの結果を表示
  html += '<table class="results-table">';
  html += '<tr><th>ポジション</th><th>名前</th>';
  aptitudeLabels.forEach(label => {
    html += `<th>${label}</th>`;
  });
  html += '</tr>';
  
  // 各行のデータを表示
  labels.forEach((label, index) => {
    html += `<tr><td>${label}</td>`;
    
    // ポジションID取得
    const posId = [31, 30, 15, 29, 22, 14, 7][index];
    
    // 名前
    html += `<td>${results.names[posId] || '-'}</td>`;
    
    // 適性値
    results.correctedAptitudes[index].forEach(value => {
      html += `<td class="rank-${value}">${value}</td>`;
    });
    
    html += '</tr>';
  });
  
  html += '</table>';
  
  resultsDiv.innerHTML = html;
}
