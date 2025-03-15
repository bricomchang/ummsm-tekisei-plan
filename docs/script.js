// JSONデータをロードして各世代に個体情報を表示
async function loadData() {
    const response = await fetch('output.json'); // JSONファイル名
    const data = await response.json();

    // 各世代のデータを分割
    const highGreatGrandparents = data.slice(0, 8); // 高祖父母
    const greatGrandparents = data.slice(8, 12);   // 曾祖父母
    const grandparents = data.slice(12, 14);       // 祖父母
    const parent = data.slice(14, 15);             // 親

    // 各世代に個体情報を表示する関数
    function populateGeneration(generationId, individuals) {
        const container = document.getElementById(generationId);
        individuals.forEach(individual => {
            const div = document.createElement('div');
            div.className = 'individual';
            div.innerHTML = `
                <p><strong>${individual.名前}</strong></p>
                <table>
                    <!-- 芝・ダート -->
                    <tr><th>芝</th><th>ダ</th></tr>
                    <tr><td>${individual.芝}</td><td>${individual.ダート}</td></tr>

                    <!-- 距離適性 -->
                    <tr><th>短</th><th>マ</th><th>中</th><th>長</th></tr>
                    <tr><td>${individual.短距離}</td><td>${individual.マイル}</td><td>${individual.中距離}</td><td>${individual.長距離}</td></tr>

                    <!-- 脚質適性 -->
                    <tr><th>逃</th><th>先</th><th>差</th><th>追</th></tr>
                    <tr><td>${individual.逃げ}</td><td>${individual.先行}</td><td>${individual.差し}</td><td>${individual.追込}</td></tr>
                </table>`;
            container.appendChild(div);
        });
    }

    // 各世代にデータを反映
    populateGeneration('high-great-grandparents', highGreatGrandparents);
    populateGeneration('great-grandparents', greatGrandparents);
    populateGeneration('grandparents', grandparents);
    populateGeneration('parent', parent);
}

// ページロード時にデータを読み込む
window.onload = loadData;
