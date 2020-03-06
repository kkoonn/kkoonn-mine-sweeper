// まいんすいーぱー
const startButton = document.getElementById('start');

const mineNum = 100;
const height = 16;
const width = 30;
const cellNum = height * width
var field = new Array(cellNum);

// 地雷の生成
function makeMineMap() {
    // 連番リスト・地雷の連想配列を生成
    let retMap = new Map();
    let arr = new Array(cellNum);
    for (let i = 0; i < cellNum; i++) {
        retMap.set(i, false);
        arr[i] = i;
    }
    // シャッフル
    let a = cellNum;
    while (a) {
        let j = Math.floor(Math.random() * a);
        let t = arr[--a];
        arr[a] = arr[j];
        arr[j] = t;
    }
    // 0 ~ mineNum を返す
    for (let i = 0; i < mineNum; i++) {
        retMap.set(arr[i], true);
    }
    return retMap;
}

// ゲームの初期化
startButton.onclick = () => {
    // 地雷の生成
    const mineMap = makeMineMap();
    console.log('mineNum: ' + mineNum + ' mineMapLength: ' + Object.keys(mineMap));
    console.log(mineMap);
    // 地雷をfieldに設置
    for(let i=0;i<cellNum;i++){
        let cell = {
            isMine: null,           // 地雷が設置されているかどうか
            aroundMineNum: null,    // 周囲の地雷の数
            isOpened: null         // プレイヤーによって開けられているかどうか
        }
        cell.isMine = mineMap.get(i);
        cell.isOpened = false;
        field[i] = cell
    }
    console.log('field');
    console.log(field);
    // TODO 周囲8マスの地雷数のカウント
    // TODO fieldの描画
}