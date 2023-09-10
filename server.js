const express = require('express');
const app = express();
const port = 3000; // 使用するポート番号を指定

app.use(express.static(__dirname)); // プロジェクトディレクトリを静的ファイルのルートとして設定

app.listen(port, () => {
    console.log(`サーバーがポート ${port} で起動しました。`);
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

