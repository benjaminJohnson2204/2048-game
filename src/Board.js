import Constants from "./Constants";
import React from 'react';
import Box from "./Box";

class Direction {
    static UP = 0;
    static DOWN = 1;    
    static LEFT = 2;
    static RIGHT = 3;
}

class GameState {
    static DEFAULT = 0;
    static SHOWING_2048 = 1;
    static ACHIEVED_2048 = 2;
    static LOST = 3;
}

export default class Board extends React.Component {
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;

    constructor(props) {
        super(props);
        this.state = {
            numbers : this.getInitialNumbers(),
            currentScore : 0,
            bestScore : 0,
            gameState : GameState.DEFAULT
        };

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                    this.handleKeyPress(this.state, Direction.UP);
                    this.upPressed = true;
                    break;
                case "ArrowDown":
                case "s":
                    this.handleKeyPress(this.state, Direction.DOWN);
                    this.downPressed = true;
                    break;
                case "ArrowLeft":
                case "a":
                    this.handleKeyPress(this.state, Direction.LEFT);
                    this.leftPressed = true;
                    break;
                case "ArrowRight":
                case "d":
                    this.handleKeyPress(this.state, Direction.RIGHT);
                    this.rightPressed = true;
                    break;
                default:

            }
        });

        document.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                    this.upPressed = false;
                    break;
                case "ArrowDown":
                case "s":
                    this.downPressed = false;
                    break;
                case "ArrowLeft":
                case "a":
                    this.leftPressed = false;
                    break;
                case "ArrowRight":
                case "d":
                    this.rightPressed = false;
                    break;
                default:
            }
        });
    }

    getRandomNumber() {
        return Math.floor(Math.random() * Constants.boardDimension);
    }

    getInitialNumbers() {
        let nums = [];
        for (let i = 0; i < Constants.boardDimension; i++) {
            let row = [];
            for (let j = 0; j < Constants.boardDimension; j++) {
                row.push(0);
            }
            nums.push(row);
        }

        return this.addRandomNumber(this.addRandomNumber(nums));
    }

    addRandomNumber(nums) {
        let row, col;
        do {
            row = this.getRandomNumber();
            col = this.getRandomNumber();
        } while (nums[row][col] !== 0);
        nums[row][col] = 2;
        return nums;
    }

    restartGame(game) {
        game.setState({
            numbers : this.getInitialNumbers(),
            currentScore : 0,
            bestScore : this.state.bestScore,
            gameState : GameState.DEFAULT
        });
    }

    handleKeyPress(state, direction) {
        if (state.gameState === GameState.SHOWING_2048 || state.gameState === GameState.LOST) {
            return;
        }
        let moved = false; // Whether any number has moved
        switch (direction) {
            case Direction.UP:
                for (let col = 0; col < Constants.boardDimension; col++) {
                    let row;
                    for (row = Constants.boardDimension - 1; row > 0; row--) {
                        if (state.numbers[row - 1][col] === 0 && state.numbers[row][col] !== 0) {
                            for (let m_row = row - 1; m_row < Constants.boardDimension - 1; m_row++) {
                                let tempNum = state.numbers[m_row][col];
                                state.numbers[m_row][col] = state.numbers[m_row + 1][col];
                                state.numbers[m_row + 1][col] = tempNum;
                            }
                            if (row < Constants.boardDimension - 1) {
                                state.numbers[Constants.boardDimension - 1][col] = 0;
                            }
                            moved = true;
                        }
                    }
                    for (row = 1; row < Constants.boardDimension; row++) {
                        if (state.numbers[[row - 1]][col] === state.numbers[row][col] && state.numbers[row][col] !== 0) {
                            state.numbers[row - 1][col] *= 2;
                            state.numbers[row][col] = 0;
                            state.currentScore += state.numbers[row - 1][col];
                            for (let m_row = row; m_row < Constants.boardDimension - 1; m_row++) {
                                let tempNum = state.numbers[m_row][col];
                                state.numbers[m_row][col] = state.numbers[m_row + 1][col];
                                state.numbers[m_row + 1][col] = tempNum;
                            }
                            if (row < Constants.boardDimension - 1) {
                                state.numbers[Constants.boardDimension - 1][col] = 0;
                            }
                            moved = true;
                        }
                    }
                }
                break;

            case Direction.DOWN:
                for (let col = 0; col < Constants.boardDimension; col++) {
                    let row;
                    for (row = 0; row < Constants.boardDimension - 1; row++) {
                        if (state.numbers[row + 1][col] === 0 && state.numbers[row][col] !== 0) {
                            for (let m_row = row + 1; m_row > 0; m_row--) {
                                let tempNum = state.numbers[m_row][col];
                                state.numbers[m_row][col] = state.numbers[m_row - 1][col];
                                state.numbers[m_row - 1][col] = tempNum;
                            }
                            if (row > 0) {
                                state.numbers[0][col] = 0;
                            }
                            moved = true;
                        }
                    }
                    for (row = Constants.boardDimension - 2; row >= 0; row--) {
                        if (state.numbers[row + 1][col] === state.numbers[row][col] && state.numbers[row][col] !== 0) {
                            state.numbers[row + 1][col] *= 2;
                            state.numbers[row][col] = 0;
                            state.currentScore += state.numbers[row + 1][col];
                            for (let m_row = row; m_row > 0; m_row--) {
                                let tempNum = state.numbers[m_row][col];
                                state.numbers[m_row][col] = state.numbers[m_row - 1][col];
                                state.numbers[m_row - 1][col] = tempNum;
                            }
                            if (row > 1) {
                                state.numbers[0][col] = 0;
                            }
                            moved = true;
                        }
                    }
                }
                break;

            case Direction.LEFT:
                for (let row = 0; row < Constants.boardDimension; row++) {
                    let col;
                    for (col = Constants.boardDimension - 1; col > 0; col--) {
                        if (state.numbers[row][col - 1] === 0 && state.numbers[row][col] !== 0) {
                            state.numbers[row].splice(col - 1, 1);
                            state.numbers[row].push(0);
                            moved = true;
                        }
                    }
                    for (col = 1; col < Constants.boardDimension; col++) {
                        if (state.numbers[row][col - 1] === state.numbers[row][col] && state.numbers[row][col] !== 0) {
                            state.numbers[row][col - 1] *= 2;
                            state.numbers[row][col] = 0;                            
                            state.currentScore += state.numbers[row][col - 1];
                            state.numbers[row].splice(col, 1);
                            state.numbers[row].push(0);
                            moved = true;
                        }
                    }
                }
                break;
            
            case Direction.RIGHT:
            default:
                for (let row = 0; row < Constants.boardDimension; row++) {
                    let col;
                    for (col = 0; col < Constants.boardDimension - 1; col++) {
                        if (state.numbers[row][col + 1] === 0 && state.numbers[row][col] !== 0) {
                            state.numbers[row].splice(col + 1, 1);
                            state.numbers[row].unshift(0);
                            moved = true;
                        }
                    }
                    for (col = Constants.boardDimension - 2; col >= 0; col--) {
                        if (state.numbers[row][col + 1] === state.numbers[row][col] && state.numbers[row][col] !== 0) {
                            state.numbers[row][col + 1] *= 2;
                            state.numbers[row][col] = 0;   
                            state.currentScore += state.numbers[row][col + 1];
                            state.numbers[row].splice(col, 1);
                            state.numbers[row].unshift(0);
                            moved = true;
                        }
                    }
                }
                break;
        }

        if (moved) {
            state.numbers = this.addRandomNumber(state.numbers);
        }
        if (state.currentScore > state.bestScore) {
            state.bestScore = state.currentScore;
        }
        this.setState(state);
        this.checkWinLoss(state);
    }

    checkWinLoss(state) {
        let lost = true;
        for (let row = 0; row < Constants.boardDimension; row++) {
            for (let col = 0; col < Constants.boardDimension; col++) {
                let currentNum = state.numbers[row][col];
                if (state.gameState === GameState.DEFAULT && currentNum === 2048) {
                    state.gameState = GameState.SHOWING_2048;
                }
                if (lost && (
                    currentNum === 0 ||
                    (row < Constants.boardDimension - 1 && state.numbers[row + 1][col] === currentNum) ||
                    (col < Constants.boardDimension - 1 && state.numbers[row][col + 1] === currentNum)
                )) {
                    lost = false;
                }
            }
        }
        if (lost) {
            state.gameState = GameState.LOST;
        }
        this.setState(state);
    }

    exitAchieving2048(state) {
        state.gameState = GameState.ACHIEVED_2048;
        this.setState(state);
    }

    render() {
        return (
            <div>
                <p></p>
                Score: {this.state.currentScore}
                <p></p>
                Best: {this.state.bestScore}
                <p></p>
                {(this.state.gameState === GameState.DEFAULT || this.state.gameState === GameState.ACHIEVED_2048) ? null :
                    (this.state.gameState === GameState.LOST ? "Game Over" :
                    (<div>
                        Congratulations on achieving 2048!
                        <p></p>
                        <button onClick={() => this.exitAchieving2048(this.state)}>
                            Keep Going
                        </button>
                    </div>))
                }
                <p></p>
                <button onClick={() => this.restartGame(this)}>
                    New Game
                </button>
                <p></p>
            {this.state.numbers.map((row) => <div className="boxes-row"> {row.map((num) => <Box number={num}/>)} </div>)}
            </div>
        )
    }
}