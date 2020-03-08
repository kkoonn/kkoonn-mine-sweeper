// まいんすいーぱー
const startButton = document.getElementById('start');
const gameDivided = document.getElementById('game-area');
const stateDivided = document.getElementById('game-state-area');

const mineNum = 100;
const height = 16;
const width = 30;
const cellNum = height * width
var field = new Array()

var countIsOpened = 0;
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
    // game-state-areaの内容を消去
    removeAllChildren(stateDivided);

    // 新たなfield配列を生成
    let retField = new Array(cellNum);
    for (let i = 0; i < cellNum; i++) {
        // cellオブジェクトを生成
        let cell = {
            isMine: false,      // 地雷が設置されているかどうか
            isFlag: false,      // フラグが設置されているかどうか
            aroundMineNum: 0,   // 周囲の地雷の数
            isOpened: false,    // プレイヤーによって開けられているかどうか
            isSpread: false,    // 左クリックでまとめて開くかどうか
            position: i,        // cellの場所
            button: null        // HTML出力用変数
        }
        cell.button = document.createElement('button');
        cell.button.setAttribute("id", "cell-" + i);
        cell.button.classList.add("cell");
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
function countAroundMineNum() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // 添え字i,jが配列をはみ出さないようにする
            startI = Math.max(0, i - 1);
            endI = Math.min(i + 1, height - 1);
            startJ = Math.max(0, j - 1);
            endJ = Math.min(j + 1, width - 1);
            let count = 0
            for (let I = startI; I <= endI; I++) {
                for (let J = startJ; J <= endJ; J++) {
                    if (field[I * width + J].isMine) {
                        count = count + 1;
                    }
                }
            }
            field[i * width + j].aroundMineNum = count;
            if (count === 0) {
                field[i * width + j].isSpread = true;
            }
        }
    }
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
// jsからHTMLに出力する
function displayFieldWithHTML() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            pos = i * width + j;
            gameDivided.appendChild(field[pos].button);
        }
        let br = document.createElement('br');
        gameDivided.appendChild(br);
    }
    stateHTML = document.createElement('p');
    stateHTML.innerText = 'プレイ中 です...';
    stateDivided.appendChild(stateHTML);
}
// マスのクリック処理を設定する
function bindClickEvent() {
    for (let i = 0; i < cellNum; i++) {
        let cell = field[i];
        // 左クリック
        cell.button.onclick = () => {
            console.log('left-click: ' + cell.button.id);
            if (gameState === GAMEOVER) {
                return;
            }
            if (!cell.isFlag && !cell.isOpened) {
                cell.button.innerText = cell.aroundMineNum;
                cell.isOpened = true;
                if (cell.isSpread) {
                    let stackVariables = new Array();
                    openGroupCellWithLeftClick(cell.position, stackVariables);
                }
                if (cell.isMine) {
                    cell.button.innerText = 'B';
                    gameState = GAMEOVER;
                    finishGame();
                }
            }
            // isOpened のマスの数を数える
            for (let cellI = 0; cellI < cellNum; cellI++) {
                if (field[cellI].isOpened) {
                    countIsOpened = countIsOpened + 1;
                }
            }
            if (countIsOpened === (height * width - mineNum)) {
                finishGame();
            }
        }
        // 右クリック
        cell.button.oncontextmenu = () => {
            console.log('right-click: ' + cell.button.id);
            if (gameState === GAMEOVER) {
                return false;
            }
            if (cell.isOpened) {      // すでにマスが開かれているとき
                openGroupCellWithRightClick(cell.position);
            } else if (cell.isFlag) { // すでにフラグが置かれているとき
                cell.isFlag = false;
                cell.button.innerText = '_';
            } else {
                cell.isFlag = true;
                cell.button.innerText = 'F';
            }
            return false;   // contextmenuは表示させない
        }
    }
}
// 左クリックでマスをまとめて開く処理
function openGroupCellWithLeftClick(cellPosition, stackVariables) {
    field[cellPosition].isSpread = false;
    let I = Math.floor(cellPosition / width);
    let J = cellPosition % width;
    console.log(cellPosition);
    console.log('I: ' + I + ' J: ' + J);
    // 添え字i,jがfield配列をはみ出さないようにする
    startI = Math.max(0, I - 1);
    endI = Math.min(I + 1, height - 1);
    startJ = Math.max(0, J - 1);
    endJ = Math.min(J + 1, width - 1);
    for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
            if (i === I && j === J) {
                continue;
            }
            pos = i * width + j;
            field[pos].isOpened = true;
            field[pos].button.innerText = field[pos].aroundMineNum
            if (field[pos].isSpread) {
                let variables = [cellPosition, I, J, startI, endI, startJ, endJ, i, j, pos];
                stackVariables.unshift(variables);
                openGroupCellWithLeftClick(pos, stackVariables);
                variables = stackVariables[0];
                cellPosition = variables[0];
                I = variables[1];
                J = variables[2];
                startI = variables[3];
                endI = variables[4];
                startJ = variables[5];
                endJ = variables[6];
                i = variables[7];
                j = variables[8];
                pos = variables[9];
                stackVariables.shift();
            }
            console.log('i: ' + i + ' j: ' + j);
        }
    }
    console.log('end');
}
// 右クリックでマスをまとめて開く処理
function openGroupCellWithRightClick(cellPosition) {
    let I = Math.floor(cellPosition / width);
    let J = cellPosition % width;
    console.log(cellPosition);
    console.log('I: ' + I + ' J: ' + J);
    // 添え字i,jがfield配列をはみ出さないようにする
    startI = Math.max(0, I - 1);
    endI = Math.min(I + 1, height - 1);
    startJ = Math.max(0, J - 1);
    endJ = Math.min(J + 1, width - 1);

    let countFlag = 0;
    for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
            pos = i * width + j;
            if (field[pos].isFlag) {
                countFlag = countFlag + 1;
            }
        }
    }

    if (countFlag === field[cellPosition].aroundMineNum) {
        for (let i = startI; i <= endI; i++) {
            for (let j = startJ; j <= endJ; j++) {
                pos = i * width + j;
                field[pos].button.onclick();
            }
        }
    }
}
// GAMEOVER処理
function finishGame() {
    removeAllChildren(stateDivided);
    stateHTML = document.createElement('p');
    if (gameState === GAMEOVER) {
        stateHTML.innerText = 'ゲームオーバー です...';
    } else {
        stateHTML.innerText = 'ゲームクリア です!!! おめでとうございます!!!';
    }
    stateDivided.appendChild(stateHTML);
    gameState = GAMEOVER;
}

// ゲームの初期化
startButton.onclick = () => {
    console.log('ゲームを初期化します');
    gameState = GAMEPLAY;
    countIsOpened = 0;
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
    countAroundMineNum();
    console.log('field(周囲の地雷カウント後)');
    console.log(field);
    // fieldの描画
    displayFieldWithConsole();
    displayFieldWithHTML();
    // TODO マスのクリック処理
    bindClickEvent();
}