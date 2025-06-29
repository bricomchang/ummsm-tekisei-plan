document.addEventListener('DOMContentLoaded', function() {
    // 1. 画像保存ボタンを生成する
    const exportButton = document.createElement('button');
    exportButton.id = 'exportImage';
    exportButton.textContent = '結果を画像で保存';
    // style.cssのボタンスタイルを適用（任意）
    // exportButton.style.backgroundColor = '#17a2b8'; 

    // 2. 既存の操作ボタンの前に、生成したボタンを追加する
    const controlsContainer = document.querySelector('.top-controls-container');
    const calculateButton = document.getElementById('calculate');
    if (controlsContainer && calculateButton) {
        controlsContainer.insertBefore(exportButton, calculateButton.nextSibling);
    }