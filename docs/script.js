// JSONデータをロードしてドロップダウンに反映
async function populateDropdowns() {
    const response = await fetch('umadata.json');
    const data = await response.json();

    // 各ドロップダウンにデータを追加
    const dropdowns = ['individual1', 'individual2', 'individual3'];
    
    dropdowns.forEach(dropdownId => {
        const selectElement = document.getElementById(dropdownId);
        data.forEach(individual => {
            const option = document.createElement('option');
            option.value = individual.名前; // 名前を値として設定
            option.textContent = individual.名前; // 名前を表示テキストとして設定
            selectElement.appendChild(option);
        });
    });
}

// 適性表を表示する関数
async function displayAptitude(dropdownId, displayId) {
    const response = await fetch('umadata.json');
    const data = await response.json();
    
    const selectedName = document.getElementById(dropdownId).value; // 選択された名前
    const displayElement = document.getElementById(displayId);

    // 選択された名前に一致するデータを検索
    const selectedIndividual = data.find(individual => individual.名前 === selectedName);

    if (selectedIndividual) {
        // 適性表を表示（罫線付き等幅表）
        displayElement.innerHTML = `
            <p><strong>${selectedIndividual.名前}</strong></p>
            <table>
                <!-- 芝・ダート -->
                <tr><th>芝</th><th>ダ</th></tr>
                <tr><td>${selectedIndividual.芝}</td><td>${selectedIndividual.ダート}</td></tr>

                <!-- 距離適性 -->
                <tr><th>短</th><th>マ</th><th>中</th><th>長</th></tr>
                <tr><td>${selectedIndividual.短距離}</td><td>${selectedIndividual.マイル}</td><td>${selectedIndividual.中距離}</td><td>${selectedIndividual.長距離}</td></tr>

                <!-- 脚質適性 -->
                <tr><th>逃</th><th>先</th><th>差</th><th>追</th></tr>
                <tr><td>${selectedIndividual.逃げ}</td><td>${selectedIndividual.先行}</td><td>${selectedIndividual.差し}</td><td>${selectedIndividual.追込}</td></tr>
            </table>`;
    } else {
        displayElement.innerHTML = '<p>選択された個体の情報が見つかりません。</p>';
    }
}

// ページロード時にドロップダウンを初期化
window.onload = populateDropdowns;
