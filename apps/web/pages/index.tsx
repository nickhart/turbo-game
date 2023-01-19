import React, { MouseEvent } from 'react';
import ReactDOM from 'react-dom/client';


function Card(props: any) {
  return (
    <button className="card" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


interface BoardProps {
  cards: Array<number>;
  trick: Array<number>;
  onClick: (index: number) => void;
}

class Board extends React.Component<BoardProps, any> {
  renderCard(i: number) {
    return (
      <Card
        value={this.props.cards[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
        { 
          this.props.cards.map(item => {
            return this.renderCard(item);
          })
        }
        </div>
        <div className="board-row">
        { 
          this.props.trick.map(item => {
            return this.renderCard(item);
          })
        }
        </div>
      </div>
    );
  }
}
  
interface GameProps {
  history?: Array<Array<number>>;
  stepNumber?: number;
  xIsNext?: boolean;

}

class Game extends React.Component<GameProps, any> {
  constructor(props: any) {
      super(props);
      this.state = {
        history: [{
          cards: Array(26).fill(null),
          trick: Array(3).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i: number) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const cards = current.cards.slice();
          if (calculateWinner(cards) || cards[i]) {
        return;
      }
      const trick = current.trick.slice();
        // cards[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
              cards: cards,
              trick: trick,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step: number) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.cards);

      const moves = history.map((step: any, move: React.Key) => {
          const desc = move ?
            'Go to move #' + move :
            'Go to game start';
          return (
              <li key={move}>
              <button onClick={() => this.jumpTo(Number(move))}>{desc}</button>
            </li>
          );
        });
    
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
      <div className="game">
        <div className="game-board">
          <Board
              cards={current.cards}
              trick={current.trick}
              onClick={(i) => this.handleClick(i)}
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

function calculateWinner(cards: Array<number>) {
  return null;
}

// ========================================

function App() {
  return <Game />
}

export default App
