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
// 周囲8マスの地雷の数を数える
function countAroundMineNum(I, J) {
    // 添え字i,jが配列をはみ出さないようにする
    startI = Math.max(0, I - 1);
    endI = Math.min(I + 1, height - 1);
    startJ = Math.max(0, J - 1);
    endJ = Math.min(J + 1, width - 1);

    let count = 0
    for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
            if (field[i * width + j].isMine) {
                count = count + 1;
            }
        }
    }
    return count;
}
// Consoleにfieldを出力する
function displayFieldAtConsole(){
    for (let i = 0; i < height; i++) {
        let string = "";
        for (let j = 0; j < width; j++) {
            pos = i * width + j;
            if (field[pos].isMine) {
                string = string + '*';
            } else {
                string = string + field[pos].aroundMineNum;
            }
        }
        console.log(string);
    }
}

// ゲームの初期化
startButton.onclick = () => {
    // 地雷の生成
    const mineMap = makeMineMap();
    console.log('mineNum: ' + mineNum + ' mineMapLength: ' + Object.keys(mineMap));
    console.log(mineMap);
    // 地雷をfieldに設置
    for (let i = 0; i < cellNum; i++) {
        let cell = {
            isMine: false,      // 地雷が設置されているかどうか
            aroundMineNum: 0,   // 周囲の地雷の数
            isOpened: false     // プレイヤーによって開けられているかどうか
        }
        cell.isMine = mineMap.get(i);
        field[i] = cell
    }
    console.log('field(周囲の地雷カウント前)');
    console.log(field);
    // 周囲8マスの地雷数のカウント
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            field[i * width + j].aroundMineNum = countAroundMineNum(i, j);
        }
    }
    console.log('field(周囲の地雷カウント後)');
    console.log(field);
    // TODO fieldの描画
    displayFieldAtConsole();
}