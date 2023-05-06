import React, { ReactNode } from 'react';
import { Card } from './card'
import { handNames, extractHands } from './zolite'

export interface BoardProps {
    cards: Array<number>;
    onClick: (card: Card) => void;
}

export class Board extends React.Component<BoardProps, any> {
    renderCard(card: Card, handName: string, index: number) {
        const cardKey = `${handName}_${index}`;
        return (
        <Card
            value={card.name}
            cardKey={cardKey}
            onClick={() => this.props.onClick(card)}
        />
        );
    }

    renderHand(hand: Array<Card>, handName: string) {
        console.log(`renderHand: name: ${handName}`)
        return (
        <div className="board-row" id={handName}>
            <h3>{handName}</h3>
        { 
            hand.map((card, index) => this.renderCard(card, handName, index))
        }
        </div>
        );
    }

    render() {
        const hands = extractHands(this.props.cards);
        return (
        <div>
            {
            hands.map((hand, index) => this.renderHand(hand, handNames[index]))
            }
        </div>
        );
    }
}