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

    // 3. ボタンがクリックされたときの処理を設定する
    exportButton.addEventListener('click', function() {
        // 結果が表示される要素を取得
        const resultsElement = document.getElementById('resultsPedigree');

        // 結果がまだ表示されていない場合は処理を中断
        if (!resultsElement || resultsElement.children.length === 0) {
            alert('画像化する計算結果がありません。\n先に「計算する」ボタンで結果を表示してください。');
            return;
        }

        console.log('画像生成を開始します...');

        // 4. html2canvasを使って指定した要素を画像に変換
        html2canvas(resultsElement, {
            backgroundColor: '#f0f8ff', // CSSで指定されている背景色を適用
            useCORS: true,
            onclone: (document) => {
              // 画像化する際に一時的にスタイルを調整
              // 例: 結果が見切れないようにコンテナの幅を調整
              document.getElementById('resultsPedigree').style.width = 'auto';
            }
        }).then(canvas => {
            // 5. 生成されたCanvasをPNG形式のデータURLに変換
            const imageURL = canvas.toDataURL('image/png');

            // 6. ダウンロード用のリンクを生成して実行
            const downloadLink = document.createElement('a');
            downloadLink.href = imageURL;
            downloadLink.download = 'keisho-result.png'; // 保存するファイル名
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            console.log('画像がダウンロードされました。');
        }).catch(error => {
            console.error('画像生成中にエラーが発生しました:', error);
            alert('画像生成中にエラーが発生しました。コンソールを確認してください。');
        });
    });
});
