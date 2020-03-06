// まいんすいーぱー
const startButton = document.getElementById('start');

const mineNum = 100;
const height = 16;
const width = 30;
var field = new Array(height * width);

// 地雷の生成
function makeMineArray() {
    // 連番リストを生成
    let arr = new Array(height * width);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = i;
    }
    // シャッフル
    let a = arr.length;
    while (a) {
        let j = Math.floor(Math.random() * a);
        let t = arr[--a];
        arr[a] = arr[j];
        arr[j] = t;
    }
    // 0 ~ mineNum を返す
    let retArray = new Array(mineNum)
    for (let i = 0; i < mineNum; i++) {
        retArray[i] = arr[i];
    }
    return retArray;
}

// ゲームの初期化
startButton.onclick = () => {
    // TODO 地雷の生成・設置
    const mineArray = makeMineArray();
    console.log('mineNum: ' + mineNum + ' mineArray.length: ' + mineArray.length);
    console.log(mineArray);
    // TODO 周囲8マスの地雷数のカウント
    // TODO fieldの描画
}