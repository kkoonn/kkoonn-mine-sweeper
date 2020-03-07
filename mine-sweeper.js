// まいんすいーぱー
const startButton = document.getElementById('start');
const gameDivided = document.getElementById('game-area');

const mineNum = 100;
const height = 16;
const width = 30;
const cellNum = height * width
var field = new Array()

var GAMEPLAY = 0;
var GAMEOVER = 1;
var gameState = GAMEPLAY;

/**
 * 指定した要素の子どもをすべて削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
    while (element.firstChild) {  // 子どもの要素がある限り削除
        element.removeChild(element.firstChild);
    }
}

// fieldの初期化
function initField() {
    // game-areaに描画されているfieldを消去
    removeAllChildren(gameDivided);

    // 新たなfield配列を生成
    let retField = new Array(cellNum);
    for (let i = 0; i < cellNum; i++) {
        // cellオブジェクトを生成
        let cell = {
            isMine: false,      // 地雷が設置されているかどうか
            isFlag: false,      // フラグが設置されているかどうか
            aroundMineNum: 0,   // 周囲の地雷の数
            isOpened: false,    // プレイヤーによって開けられているかどうか
            button: null        // HTML出力用変数
        }
        cell.button = document.createElement('button');
        cell.button.setAttribute("id", "cell-" + i);
        cell.button.innerText = '_';
        retField[i] = cell
    }
    return retField;
}
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
// Consoleでfieldを出力する
function displayFieldWithConsole() {
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
// game-areaにfieldを出力する
function displayFieldWithHTML() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            pos = i * width + j;
            gameDivided.appendChild(field[pos].button);
        }
        let br = document.createElement('br');
        gameDivided.appendChild(br);
    }
}
// マスのクリック処理を設定する
function bindClickEvent() {
    for (let i = 0; i < cellNum; i++) {
        let cell = field[i];
        // 左クリック
        cell.button.onclick = () => {
            console.log('left-click: ' + cell.button.id);
            cell.button.innerText = cell.aroundMineNum;
            cell.isOpened = true;
            if (cell.isMine) {
                gameState = GAMEOVER;
            }
        }
        // 右クリック
        cell.button.oncontextmenu = () => {
            console.log('right-click: ' + cell.button.id);
            if(cell.isOpened){      // すでにマスが開かれているとき
                // TODO フラグを十分な数置いているときまとめて開く処理     
            } else if(cell.isFlag){ // すでにフラグが置かれているとき
                cell.isFlag = false;
                cell.button.innerText = '_';
            } else{
                cell.isFlag = true;
                cell.button.innerText = 'F';
            }
            return false;   // contextmenuは表示させない
        }
    }
}

// ゲームの初期化
startButton.onclick = () => {
    console.log('ゲームを初期化します');
    gameState = GAMEPLAY;
    // field初期化
    field = initField();
    // 地雷の生成
    const mineMap = makeMineMap();
    console.log('mineNum: ' + mineNum);
    console.log(mineMap);
    // 地雷をfieldに設置
    for (let i = 0; i < cellNum; i++) {
        field[i].isMine = mineMap.get(i);
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
    // fieldの描画
    displayFieldWithConsole();
    displayFieldWithHTML();
    // TODO マスのクリック処理
    bindClickEvent();
}