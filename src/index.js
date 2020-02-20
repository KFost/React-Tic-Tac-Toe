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

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
    const winner = calculateWinner(current.squares);

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

function calculateWinner(squares) {
  const winLength = 3; 
  const boardLength = 3;
  for (let i = 0; i < squares.length; i++) {
    let rightLink = 1;
    while(squares[i + rightLink] === squares[i]){
      rightLink++; 
      if(rightLink === winLength){
        return squares[i];
      }
    }

    let downRightLink = 1;
    while(squares[i + (downRightLink * (boardLength + 1))] === squares[i]){
      downRightLink++; 
      if(downRightLink === winLength){
        return squares[i];
      }
    }

    let upRightLink = 1;
    while(squares[i - (upRightLink * (boardLength - 1))] === squares[i]){
      upRightLink++; 
      if(upRightLink === winLength){
        return squares[i];
      }
    }

    let downLink = 1;
    while(squares[i + (downLink * boardLength)] === squares[i]){
      downLink++; 
      if(downLink === winLength){
        return squares[i];
      }
    }
  }
  return null;
}