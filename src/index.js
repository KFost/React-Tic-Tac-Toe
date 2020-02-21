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
    var boardRows = Array(this.props.boardSize).fill(null);
    var boardSquares = Array(this.props.boardSize).fill(null); 

    for(let i = 0; i < (this.props.boardSize); i++){
      let str = Array(this.props.boardSize).fill(null);

      for(let y = 0; y < (this.props.boardSize); y++){
        str[y] = this.renderSquare((i * this.props.boardSize) + (y));
      }

      boardSquares[i] = str;
      boardRows[i] = <div className="board-row">{boardSquares[i]}</div>;
    }

    return (
      boardRows
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
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
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
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.boardSize);

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

function calculateWinner(squares, boardLength) {
  const winLength = 3; 
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