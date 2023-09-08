// script.js

// CSVデータをFetchを使用して読み込む処理
function fetchCSVData() {
    fetch('予定.csv')
        .then(response => response.text())
        .then(data => {
            processData(data, 'table1'); // 'table1' を指定してデータ処理
        })
        .catch(error => {
            console.error('CSVデータの読み込みエラー:', error);
        });
}

// 新しいテーブルのための関数
function fetchCSVData2() {
    fetch('予定2.csv')
        .then(response => response.text())
        .then(data => {
            processData(data, 'table2'); // 'table2' を指定してデータ処理
        })
        .catch(error => {
            console.error('CSVデータの読み込みエラー:', error);
        });
}

function convertTimeToMilliseconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    const milliseconds = targetTime.getTime();
    return milliseconds;
}

// 分単位の数値をミリ秒に変換する関数
function convertMinutesToMilliseconds(minutes) {
    return minutes * 60 * 1000;
}

// 時刻を "hh:mm" 形式から分単位の数値に変換する関数
function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// 行の背景色を更新する関数
function updateRowColors() {
    const now = new Date().getTime(); // 現在時刻をミリ秒で取得

    // テーブル内の各行を処理
    const tables = ['table1', 'table2'];
    tables.forEach(tableId => {
        const tableRows = document.querySelectorAll(`#${tableId} tbody tr`);
        tableRows.forEach((row, index) => {
            const timeText = row.querySelector('td:first-child').textContent; // 時刻のテキストを取得
            const rowTime = convertTimeToMilliseconds(timeText);
            const nextRow = row.nextElementSibling; // 次の行を取得

            // 現在時刻を過ぎており、かつ、次の行の時刻を過ぎていない場合、行の背景色を緑に変更
            if (rowTime <= now && (!nextRow || convertTimeToMilliseconds(nextRow.querySelector('td:first-child').textContent) > now)) {
                row.style.backgroundColor = '#99ffda';
            } else if (nextRow && convertTimeToMilliseconds(nextRow.querySelector('td:first-child').textContent) <= now) {
                row.style.backgroundColor = 'rgb(176, 194, 193)'; // 次の行の時刻を過ぎている場合はグレー
            } else {
                // その他の場合は背景色を交互に変更
                if (index % 2 === 0) {
                    row.style.backgroundColor = 'white';
                } else {
                    row.style.backgroundColor = '#dcf3fa';
                }
            }
        });
    });
}

// CSVデータを処理してテーブルに表示する関数
function processData(csvData, tableId) {
    const rows = csvData.trim().split('\n').slice(1); // ヘッダーを除いて各行を分割
    const tableBody = document.querySelector(`#${tableId} tbody`); // 対象のテーブルを選択

    rows.forEach(row => {
        const [time, name] = row.split(',');
        const rowElement = document.createElement('tr');
        const timeInMinutes = convertTimeToMinutes(time);
        const timeInMilliseconds = convertMinutesToMilliseconds(timeInMinutes);
        rowElement.setAttribute('data-time', timeInMilliseconds.toString());
        rowElement.innerHTML = `<td>${time}</td><td>${name}</td>`;
        tableBody.appendChild(rowElement);
    });
}

// 初回の呼び出し
fetchCSVData();
fetchCSVData2();
updateRowColors();

// 定期的に更新（例: 1秒ごとに更新）
setInterval(updateRowColors, 1000);
