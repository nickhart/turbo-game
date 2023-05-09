##

Game state is encoded into an aray of ints, one per card.
Each index represents an index (0-25) into a static array of cards.
The value at each index represents the state of that card.
The state of a card contains both location and history.
The current state of the game can be 100% inferred by the state of the cards.
One could even imaging encoding some sort of "checksum" state derived from the actual state and the deduced state.

##

A card state can be thought of a part location and part history.
Quite simply, a card can be in one of several locations, each with its own significance

* the deck
* p1's hand
* p2's hand
* p3's hand
* (unused)
* p1's trick card
* p2's trick card
* p3's trick card
* small ones' won cards
* p1's (bigone) won cards
* p2's (bigone) won cards
* p3's (bigone) won cards
* (unused)
* p1's zole cards
* p2's zole cards
* p3's zole cards

Each card starts at the first state (in the deck).
Each card can transition to a higher location, but never lower. eg: deck -> hand -> trick -> won cards, or deck -> zole card.

ultimately this could also been seen as some state/lifecycle of a card and its location. Imagine instead using some bits to track this, and a bit of reorganization along some bit boundaries.

bits 0-1: assigned? 0 = unassigned, 1 = p1, 2 = p2, 3 = p3
bits 2-3: location? 0 = dealt, 1 = trick, 2 = won, 3 = zole
bits 4-7: seen? p1 thru p3

##




