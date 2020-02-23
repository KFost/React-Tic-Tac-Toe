import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){  
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {  
  renderSquare(i) {
    return (
      <Square 
       value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard(){
    var board = Array(this.props.boardSize).fill(null);
    var boardRows = Array(this.props.boardSize * this.props.boardSize).fill(null); 

    for(let i = 0; i < (this.props.boardSize); i++){
      let squares = Array(this.props.boardSize).fill(null);

      for(let y = 0; y < (this.props.boardSize); y++){
        squares[y] = this.renderSquare((i * this.props.boardSize) + (y));
      }

      boardRows[i] = squares;
      board[i] = <div className="board-row">{boardRows[i]}</div>;
    }
    return (
      board
    );
  }

  render() {
    
    return (
      <div>
          {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null), 
      }],
      xIsNext: true,
      stepNumber: 0,
      boardSize: 3,
      winLength: 3,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.state.boardSize, this.state.winLength) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares, 
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  newGame(){
    var newBoardSize = document.getElementById("bSize").value ? Number(document.getElementById("bSize").value) : 3;
    var newWinLength = document.getElementById("wLength").value ? Number(document.getElementById("wLength").value) : 3;

    const newBoard = Array(this.state.boardSize * this.state.boardSize).fill(null);
    this.setState({
      history: [{
        squares: newBoard, 
      }],
      xIsNext: true,
      stepNumber: 0,
      boardSize: newBoardSize,
      winLength: newWinLength,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.boardSize, this.state.winLength);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            boardSize={this.state.boardSize}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br/>
          Board Size: <input type="number" id="bSize"></input>
          <br/>
          Win Length: <input type="number" id="wLength"></input>
          <br/>
          <button value = "Submit" onClick={() => this.newGame()}>New Game</button>
          <br/>
          <ol>{moves}</ol>
        </div>
      </div>  
    );
  }
}
  
  // ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, boardLength, winLength) {
  for (let i = 0; i < squares.length; i++) {
    if(squares[i] !== null){

      let rightLink = 1;
      while(squares[i] === squares[i + rightLink] && (i + rightLink) % boardLength !== 0){
        rightLink++; 
        if(rightLink === winLength){
          return squares[i];
        }
      }

      let downRightLink = 1;
      while(squares[i] === squares[i + ((downRightLink * boardLength) + downRightLink)]){
        downRightLink++; 
        if(downRightLink === winLength){
          return squares[i];
        }
      }

      let upRightLink = 1;
      while(squares[i] === squares[i - ((upRightLink * boardLength) - upRightLink)]){
        upRightLink++; 
        if(upRightLink === winLength){
          return squares[i];
        }
      }

      let downLink = 1;
      while(squares[i] === squares[i + (downLink * boardLength)]){
        downLink++; 
        if(downLink === winLength){
          return squares[i];
        }
      }
    }
  }
  return null;
}