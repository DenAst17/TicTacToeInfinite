<script lang="ts">
let X_SIZE = 20, O_SIZE = 20;
const Border = 4;
let CELL_SIZE = 50;
let board_size = 150;

var canvas: HTMLCanvasElement;
var cx: CanvasRenderingContext2D;

import { defineComponent } from 'vue'
import { mainStore } from '../stores/store';
import { mapStores } from 'pinia';

export default defineComponent({
    data() {
        return {
            isX: true,
            winner: 0,
            gameTable: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
            movesCount: 0,
            size: 5,
            firstPlayerWinnerCounter: 0,
            secondPlayerWinnerCounter: 0,
            isMobileDevice: false
        };
    },
    computed: {
        ...mapStores(mainStore)
    },
    methods: {
        restartGame() {
            let details = navigator.userAgent;

            let regexp = /android|iphone|kindle|ipad/i;

            this.isMobileDevice = regexp.test(details);

            if (this.isMobileDevice) {
                let windowWidth = window.innerWidth;
                CELL_SIZE = windowWidth / this.size - 0.5;
                console.log(CELL_SIZE);
                X_SIZE = O_SIZE = CELL_SIZE / 2.5;
            }
            
            this.isX = true;
            this.winner = 0;
            this.gameTable = [];
            this.movesCount = 0;

            board_size = this.size * CELL_SIZE;

            canvas.width = canvas.height = board_size;

            cx.clearRect(0, 0, canvas.width, canvas.height);

            cx.strokeStyle = "black";
            cx.lineWidth = 5;

            this.drawTable();

            for (let i = 0; i < Number(this.size) + 8; i++) {
                this.gameTable[i] = [];
                for (let j = 0; j < Number(this.size) + 8; j++) {
                    this.gameTable[i][j] = 0;
                }
            }

            const getCursorPosition = (canvas: { getBoundingClientRect: () => any; }, event: { clientX: number; clientY: number; }) => {
                const rect = canvas.getBoundingClientRect()
                const x = event.clientX - rect.left
                const y = event.clientY - rect.top
                return { x, y };
            }

            canvas.addEventListener('mousedown', (e: any) => {

                const cursorPos = getCursorPosition(canvas, e);
                const rowNum = Math.floor(cursorPos.y / CELL_SIZE);
                const colNum = Math.floor(cursorPos.x / CELL_SIZE);
                //console.log(cursorPos);
                if (this.gameTable[rowNum + Border][colNum + Border] == 0 && !this.winner) { // check if the cell is not marked in this game
                    if (this.isX) {
                        this.drawX(colNum * CELL_SIZE + CELL_SIZE / 2, rowNum * CELL_SIZE + CELL_SIZE / 2);
                        this.gameTable[rowNum + Border][colNum + Border] = 1;
                    }
                    else {
                        this.drawO(colNum * CELL_SIZE + CELL_SIZE / 2, rowNum * CELL_SIZE + CELL_SIZE / 2);
                        this.gameTable[rowNum + Border][colNum + Border] = 2;
                    }

                    this.movesCount++; // + 1 move done

                    if (this.checkWinner(rowNum + Border, colNum + Border)) {
                        if (this.isX) {
                            this.winner = 1;
                            this.firstPlayerWinnerCounter++;
                        }
                        else {
                            this.winner = 2;
                            this.secondPlayerWinnerCounter++;
                        }
                    }
                    else if (this.movesCount == Math.pow(this.size, 2)) { // Tie condition
                        this.winner = 3;
                    }
                    this.isX = !this.isX;
                }
            })
        },
        forfeitGame() {
            if (this.isX) {
                this.secondPlayerWinnerCounter++;
            }
            else {
                this.firstPlayerWinnerCounter++;
            }
            this.restartGame();
        },
        resetScore() {
            this.firstPlayerWinnerCounter = this.secondPlayerWinnerCounter = 0;
        },
        drawLine(xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
            cx.beginPath();
            cx.moveTo(xBegin, yBegin);
            cx.lineTo(xEnd, yEnd);
            cx.closePath();
            cx.stroke();
        },
        drawTable() {
            for (let i = 1; i < this.size; i++) {
                this.drawLine(CELL_SIZE * i, 0, CELL_SIZE * i, board_size);
            }
            for (let i = 1; i < this.size; i++) {
                this.drawLine(0, CELL_SIZE * i, board_size, CELL_SIZE * i);
            }
        },
        drawX(x: number, y: number) {
            const XHALFSIZE = X_SIZE / 2;
            cx.beginPath();
            cx.moveTo(x - XHALFSIZE, y - XHALFSIZE);
            cx.lineTo(x + XHALFSIZE, y + XHALFSIZE);
            cx.moveTo(x - XHALFSIZE, y + XHALFSIZE);
            cx.lineTo(x + XHALFSIZE, y - XHALFSIZE);
            cx.closePath();
            cx.stroke();
        },
        drawO(x: number, y: number) {
            const OHALFSIZE = O_SIZE / 2;
            cx.beginPath();
            cx.ellipse(x, y, OHALFSIZE, OHALFSIZE, 0, 0, 2 * Math.PI);
            cx.closePath();
            cx.stroke();
        },
        drawLine1(arrayRowNum: number, arrayColNum: number) { // this type of line in cell: \
            const colNum = arrayColNum - Border;
            const rowNum = arrayRowNum - Border;
            this.drawLine(colNum * CELL_SIZE, rowNum * CELL_SIZE, (colNum + 1) * CELL_SIZE, (rowNum + 1) * CELL_SIZE);
        },
        drawLine2(arrayRowNum: number, arrayColNum: number) { // this type of line in cell: /
            const colNum = arrayColNum - Border;
            const rowNum = arrayRowNum - Border;
            this.drawLine(colNum * CELL_SIZE, (rowNum + 1) * CELL_SIZE, (colNum + 1) * CELL_SIZE, rowNum * CELL_SIZE);
        },
        drawLine3(arrayRowNum: number, arrayColNum: number) { // this type of line in cell: -
            const colNum = arrayColNum - Border;
            const rowNum = arrayRowNum - Border;
            this.drawLine(colNum * CELL_SIZE, (rowNum + 0.5) * CELL_SIZE, (colNum + 1) * CELL_SIZE, (rowNum + 0.5) * CELL_SIZE);
        },
        drawLine4(arrayRowNum: number, arrayColNum: number) { // this type of line in cell: |
            const colNum = arrayColNum - Border;
            const rowNum = arrayRowNum - Border;
            this.drawLine((colNum + 0.5) * CELL_SIZE, rowNum * CELL_SIZE, (colNum + 0.5) * CELL_SIZE, (rowNum + 1) * CELL_SIZE);
        },
        checkWinner(arrayRowNum: number, arrayColNum: number) {
            let isWinner = false;
            const winnerCandidate = this.gameTable[arrayRowNum][arrayColNum];

            for (let i = -4; i <= 0; i++) { // left diagonal check
                if (
                    this.gameTable[arrayRowNum + i][arrayColNum + i] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 1][arrayColNum + i + 1] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 2][arrayColNum + i + 2] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 3][arrayColNum + i + 3] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 4][arrayColNum + i + 4] == winnerCandidate
                ) {
                    this.drawLine1(arrayRowNum + i, arrayColNum + i);
                    this.drawLine1(arrayRowNum + i + 1, arrayColNum + i + 1);
                    this.drawLine1(arrayRowNum + i + 2, arrayColNum + i + 2);
                    this.drawLine1(arrayRowNum + i + 3, arrayColNum + i + 3);
                    this.drawLine1(arrayRowNum + i + 4, arrayColNum + i + 4);
                    isWinner = true;
                }
            }

            for (let i = -4; i <= 0; i++) { // right diagonal check
                if (
                    this.gameTable[arrayRowNum + i][arrayColNum - i] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 1][arrayColNum - i - 1] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 2][arrayColNum - i - 2] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 3][arrayColNum - i - 3] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 4][arrayColNum - i - 4] == winnerCandidate
                ) {
                    this.drawLine2(arrayRowNum + i, arrayColNum - i);
                    this.drawLine2(arrayRowNum + i + 1, arrayColNum - i - 1);
                    this.drawLine2(arrayRowNum + i + 2, arrayColNum - i - 2);
                    this.drawLine2(arrayRowNum + i + 3, arrayColNum - i - 3);
                    this.drawLine2(arrayRowNum + i + 4, arrayColNum - i - 4);
                    isWinner = true;
                }
            }

            for (let i = -4; i <= 0; i++) { // gorizontal check
                if (
                    this.gameTable[arrayRowNum][arrayColNum + i] == winnerCandidate &&
                    this.gameTable[arrayRowNum][arrayColNum + i + 1] == winnerCandidate &&
                    this.gameTable[arrayRowNum][arrayColNum + i + 2] == winnerCandidate &&
                    this.gameTable[arrayRowNum][arrayColNum + i + 3] == winnerCandidate &&
                    this.gameTable[arrayRowNum][arrayColNum + i + 4] == winnerCandidate
                ) {
                    this.drawLine3(arrayRowNum, arrayColNum + i);
                    this.drawLine3(arrayRowNum, arrayColNum + i + 1);
                    this.drawLine3(arrayRowNum, arrayColNum + i + 2);
                    this.drawLine3(arrayRowNum, arrayColNum + i + 3);
                    this.drawLine3(arrayRowNum, arrayColNum + i + 4);
                    isWinner = true;
                }
            }

            for (let i = -4; i <= 0; i++) { // vertical check
                if (
                    this.gameTable[arrayRowNum + i][arrayColNum] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 1][arrayColNum] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 2][arrayColNum] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 3][arrayColNum] == winnerCandidate &&
                    this.gameTable[arrayRowNum + i + 4][arrayColNum] == winnerCandidate
                ) {
                    this.drawLine4(arrayRowNum + i, arrayColNum);
                    this.drawLine4(arrayRowNum + i + 1, arrayColNum);
                    this.drawLine4(arrayRowNum + i + 2, arrayColNum);
                    this.drawLine4(arrayRowNum + i + 3, arrayColNum);
                    this.drawLine4(arrayRowNum + i + 4, arrayColNum);
                    isWinner = true;
                }
            }

            return isWinner;
        }
    },
    mounted() {
        canvas = document.querySelector('canvas') as any; // possible ts fix
        cx = canvas.getContext("2d") as any;
        this.restartGame();
        this.mainStore.$subscribe((mutation, state) => {
            this.size = this.mainStore.size;
            this.restartGame();
            console.log(this.size);
        })
    }
});
</script>

<template>
    <div class="wrapper">
        <aside class = "info" v-if="isMobileDevice">We don't recommend playing on field more than 20x20 on mobile device</aside>
        <div class="scoreWrapper">
            <button class="gameButton" @click="resetScore">Reset scores</button>
            <h1 class="score"> {{ firstPlayerWinnerCounter }}:{{ secondPlayerWinnerCounter }}</h1>
        </div>
        <div class="infoWrapper">
            <div v-if="winner == 0 && isX">
                <h1 class="info">Player 1 move</h1>
            </div>
            <div v-if="winner == 0 && !isX">
                <h1 class="info">Player 2 move</h1>
            </div>
            <div v-if="winner == 1">
                <h1 class="info">Player 1 Wins!</h1>
            </div>
            <div v-if="winner == 2">
                <h1 class="info">Player 2 Wins!</h1>
            </div>
            <div v-if="winner == 3">
                <h1 class="info">Tie!</h1>
            </div>
        </div>
        <div v-if="winner" class="gameButtonWrapper">
            <button class="gameButton" @click="restartGame">Restart</button>
        </div>
        <div v-else class="gameButtonWrapper">
            <button class="gameButton" @click="forfeitGame">Forfeit</button>
        </div>
        <canvas width="150" height="150"></canvas>
        <article class = "info researchInfo">Due to math researches, 15x15 field and more is a win for 1st player, but can you make this up?</article>
    </div>
</template>

<style>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20px;
}

.info {
    color: #111;
    font-family: 'Open Sans', sans-serif;
    font-size: 30px;
    font-weight: 300;
    line-height: 32px;
    text-align: center;
}

.gameButton {
    color: #111;
    font-family: 'Open Sans', sans-serif;
    font-size: 30px;
    font-weight: normal;
    line-height: 48px;
    margin: 0;
}

.gameButtonWrapper {
    margin-bottom: 20px;
    height: 50px;
    justify-items: center;
}

.infoWrapper {
    display: flex;
    margin-bottom: 20px;
}

.score {
    font-weight: 500;
    font-size: 5rem;
    top: -5px;
    display: flex;
    justify-content: center;
}

.scoreWrapper {
    display: flex;
    flex-direction: column;
}

.researchInfo {
    top: 10px;
}
</style>
