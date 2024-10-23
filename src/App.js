import { useState } from "react";

function Square({value, onSquareClick, isWinSquare}) {
  return <button className={isWinSquare ? "win-square" : "square"} onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
  const winner = calculateWinner(squares);
  const winnerValue = winner[0];
  const winnerPathIndexes = winner[1] 

  function handleClick(index) {
    const nextSquares = squares.slice();
    if (winnerValue || squares[index]) {
      return;
    }
    if(xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }
    onPlay(nextSquares, index)
  }

  let status;

  if (winnerValue) {
    status = "Winner: " + winnerValue;
  } else if(!squares.includes(null)){
    status = "its a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const squaresElements = []
  for(let i=0; i < 3; i++) {
    const rowElements = [];
    for(let j=0; j < 3; j++) {
      const squareIndex = 3*i+j;
      rowElements.push(<Square isWinSquare={winnerPathIndexes.includes(squareIndex) ? true : false} key={j} value={squares[squareIndex]} onSquareClick={() => {handleClick(squareIndex)}}/>)
    }
    squaresElements.push(<div key={i} className="board-row">{rowElements}</div>)
  } 
  
  return (
    <>
      <div className="status">{status}</div>
      {squaresElements}
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], [a, b, c]];
      }
    }
    return [null, Array(3).fill(null)];
  }
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [movesIndexes, setMovesIndexes] = useState([null]); 
  const currentSquares = history[history.length - 1];
  const [descendingMovesOrder, setdescendingMovesOrder] = useState(false)
  function handlePlay(nextSquares, index) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
    setMovesIndexes([...movesIndexes, index])
  }

  function jumpTo(nextMove) {
    setHistory(history.slice(0,nextMove));
    nextMove - 1 % 2 === 0 ? setXIsNext(true) : setXIsNext(false);
    setMovesIndexes(movesIndexes.slice(0,nextMove))
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0){
      const row = Math.floor(movesIndexes[move] / 3) + 1;
      const col = movesIndexes[move] % 3 + 1;
      description = 'Go to move #' + move + ` (${row}, ${col})` ;
    } else {
      description = 'Go to game start';
    }
      
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move + 1)}>{description}</button>
      </li>
    );
  });

  descendingMovesOrder ? moves.reverse() : moves


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <label className="switch">
          <input type="checkbox" checked={descendingMovesOrder} onChange={() => setdescendingMovesOrder(!descendingMovesOrder)}/>
          <span className="slider round"></span>
        </label>
        <ol>{moves}</ol>  
      </div>
      <div>You are at move #{history.length - 1}</div>
    </div>
  );
}