import { removeDrawnCardFromDeck, turnsNeedToPlay, updateVariable } from "../gameFunctions.js";
import { displayMessageBox } from "../messageBox.js";
import { cards } from "../messages.js";
import { card, catCard } from "../models/cards.interface";
import { checkForNopeCardInHand, checkIfNopeCardPlayed, nopePlayedCard } from "../nopePlayedCard.js";
import { updateDiscardPile } from "../updateDiscardPile.js";

interface comPlayerInterface {
    hand: card[],
    checkForPlayableCard: Function,
    dealInitialHand: Function,
    playAttackCard: Function,
    playSkipCard: Function
}

const playableCards:card[] = ['attack',
'skip', 'favor', 'shuffle', 'see the future', 'potato cat',
'taco cat', 'rainbow ralphing cat', 'beard cat', 'cattermellon']

const catCard: catCard[] = ["potato cat", "taco cat", "rainbow ralphing cat", "beard cat", "cattermellon"]

/** Class holds reusable functions from the com players 
 * 
 * @param comPlayerName Takes the name of the current com player 
*/
class comPlayerClass implements comPlayerInterface {
    hand = []
    private comPlayerName: "Com 1" | "Com 2" | "Com 3"
    private cardsToPlayList: card[] = []
    
    constructor(comName: "Com 1" | "Com 2" | "Com 3", ) { this.comPlayerName = comName }

    checkForPlayableCard(card: any) {
        for(const e of this.hand) {
            if(playableCards.includes(e) && e === card) {
                if(catCard.includes(card) && e === card) {
                    // If a com player wants to steal a card checks if there are 2 matching cat cards
                    if(this.checkForMatchingCatCards(card)) {
                        return true
                    }
                    else {
                        return false
                    }
                }
                return true
            }
        }
        return false
    }

    /** Checks if there are 2 or more matching car cards.
     * 
     * Counts how many times a cat card appears in the current com player hand
     * 
     * @param {card} catCardToPlay Takes the cat card that the com player wants to play
     * 
     * @returns {boolean} Returns true if there is 2 or more matching cat cards.
     * Returns false if there is only 1 cat card.
     */
    checkForMatchingCatCards(catCardToPlay: card): boolean {
        let countOfMatchingCatCards = 0

        for(let i = 0; i > this.hand.length; i++) {
            if(this.hand[i] === catCardToPlay) {
                countOfMatchingCatCards++
            }
        }

        if(countOfMatchingCatCards >= 2) {
            return true
        }
        else {
            return false
        }
    }

    /** Decides how many cards a com player should play */
    decideHowManyCardsToPlay() {
        const amountOfCardsToPlay = Math.floor(Math.random() * this.hand.length)

        for(let i = 0; i < amountOfCardsToPlay; i++) {
            if(this.checkForPlayableCard(this.hand[i])) {
                this.cardsToPlayList.push(this.hand[i])
            }
        }
    }

    dealInitialHand() {
        // Deals the 7 cards to the player
        for (let i = 0; i < 7; i++) {
            // Choses a card
            const cardIndex = Math.floor(Math.random() * cards.length)
            const card = cards[cardIndex];

            // Adds the drawn card the the list
            this.hand.push(card)

            // Removes the drawn card from the deck
            removeDrawnCardFromDeck(card)
        }

        // Deals the defuse card to com 1 
        this.hand.push("defuse")

        // Removes the defuse card from the 
        removeDrawnCardFromDeck("defuse")
    }

    /** Attacks the next player 
     * 
     * Checks if to target the player or not
     * 
     * @param skipToNextComPlayer - Stores if to pass the turn to the next com player
     * 
     * @param choseCardForNextComPlayer - The choseCard function for the next com player
    */
    playAttackCard(skipToNextComPlayer: boolean, nextComPlayer?: string, choseCardForNextComPlayer?: Function) {
        updateVariable("turnsNeedToPlay")

        switch(skipToNextComPlayer) {
            case true:
                // Makes the next com player have 2 turns 

                // Displays the amount of turns Com 2 has 
                displayMessageBox(`${this.comPlayerName} has played an attack`, `It's now ${nextComPlayer}'s turn, ${nextComPlayer} has ${turnsNeedToPlay} turns`)

                const setCom2Turn = setInterval(() => {
                    // Checks if the player has closed the #message_box
                    if ($("#message_box").is(":hidden")) {
                        clearInterval(setCom2Turn)

                        // Makes it be com 2's turn
                        choseCardForNextComPlayer()
                    }
                }, 100);

                break
            
            // Runs when com 1 or com 3 has played an attack card
            case false:
                // Makes the player have 2 turns

                // Displays that it's now the player's turn and how many turns that they have
                displayMessageBox(`${this.comPlayerName} has played an attack`, `It's now you turn, you have ${turnsNeedToPlay} turns`)

                // Makes it be the player's turn
                updateVariable("isPlayerTurn", true)

                break
        }
    }

    /** Skips to the next player 
     * 
     * Checks if to target the player or not
     * 
     * @param skipToNextComPlayer - Stores if to pass the turn to the next com player
     * 
     * @param choseCardForNextComPlayer - The choseCard function for the next com player
    */
    playSkipCard(skipToNextComPlayer: boolean, nextComPlayer?: string, choseCardForNextComPlayer?: Function) {
        if(turnsNeedToPlay === 1) {
            displayMessageBox(`${this.comPlayerName} has skipped 1 of their turns`, `${this.comPlayerName} has ${turnsNeedToPlay} more turn(s) to play. It's now ${this.comPlayerName}'s turn`)
            choseCardForNextComPlayer()    
        }

        // Checks if there are more then 1 com player to pass turn to the right player
        
        switch(skipToNextComPlayer) {
            case true:
                // Tells the player that 
                displayMessageBox(`${this.comPlayerName} has skipped there turn`, `It's now ${nextComPlayer}'s turn.`)

                const waitUntilMessageBoxClosed = setInterval(() => {
                    // Checks if the player has closed the #message_box
                    if ($("#message_box").is(":hidden")) {
                        clearInterval(waitUntilMessageBoxClosed)
                        // Makes it be com 2's turn
                        choseCardForNextComPlayer()
                    }
                }, 100);

                    
            case false:
                displayMessageBox(`${this.comPlayerName} has skipped there turn`, "It's now your turn.")

                // Makes it be the players turn
                updateVariable("isPlayerTurn", true)
        }
    }

    /** Tells the player that the deck has been shuffled */
    playShuffleCard(drawCardFunction, playCardFunction) {
        // Card is a placebo, this card really dose nothing
        displayMessageBox("The deck has been shuffled", `${this.comPlayerName} has shuffled the deck`)

        const waitUntilMessageBoxIsClosed = setInterval(() => {
            // Checks if the player has closed the #message_box
            if ($("#message_box").is(":hidden")) {
                clearInterval(waitUntilMessageBoxIsClosed)

                // Checks if there are any more cards to card
                if(this.cardsToPlayList.length > 0) {
                    // Plays the card
                    playCardFunction()
                
                    return ""
                }
                else {
                    // Draws the card
                    drawCardFunction()
                    
                    return ""
                }
            }
        }, 100);
    }
    
    /** Choses the top three cards */
    playSeeTheFutureCard(drawCardFunction, playCardFunction) {
        displayMessageBox(`${this.comPlayerName} has played a see the future card`, `${this.comPlayerName} has seen the top 3 cards of the deck`)

        updateVariable("seeTheFutureCards")

        const waitUntilMessageBoxIsClosed = setInterval(() => {
            // Checks if the player has closed the #message_box
            if ($("#message_box").is(":hidden")) {
                clearInterval(waitUntilMessageBoxIsClosed)
                
                // Checks if there are any more cards to card
                if(this.cardsToPlayList.length > 0) {
                    // Plays the card
                    playCardFunction()
                }
                else {
                    // Draws the card
                    drawCardFunction()        
                }}
        }, 100);
    }

    /** Ask the player or a com player for a favor card */
    playFavorCard(askFavorCardFunction: Function, drawCardFunction) {
        // Choses which player to ask for a favor
        // 1 - The Player
        // 2 - Com 2
        // 3 - Com 3

        let favorCardTarget: number

        // Check how many com players were selected 
        switch (localStorage.getItem("comAmount")) {
            case "1comPlayer":
                favorCardTarget = 1

                break
            case "2comPlayer":
                favorCardTarget = Math.floor(Math.random() * 3)

                break
            case "3comPlayer":
                favorCardTarget = Math.floor(Math.random() * 4)

                break
        }

        // Checks if selected target has a return in switch statement 
        if (favorCardTarget == 1) {
            askFavorCardFunction(favorCardTarget)
        }
        else {
            // Ask for a card from the player of choice
            const givenCard: card = askFavorCardFunction(favorCardTarget)

            // Adds the given card to Com 1's hand
            this.hand.push(givenCard)

            // Draws the card
            drawCardFunction()
            return ""
        }
    }

   /** Choses a card to play, checks if that card is playable, and checks if the player wants to nope it 
    * 
    * @param {Function} playCardForComPlayer Takes the playCard function for the current com player
    * 
    * @param {Function} drawCardForComPlayer Takes the drawCard function for the current com player
    */ 
    chooseCardToPlay(playCardForComPlayer: Function, drawCardForComPlayer: Function) {
        // Checks if there are no cards in the cardToPlayList list
        if(this.cardsToPlayList.length <= 0) {
            this.decideHowManyCardsToPlay()
        }

        // Choses a card to play from the com players's hand
        const cardToPlay: card = this.cardsToPlayList[0]
        // Removes the played card from the com players's hand
        const cardIndex = this.hand.indexOf(cardToPlay)

        // Checks if the chosen card is a playable card
        if(this.checkForPlayableCard(cardToPlay)) {
            updateDiscardPile(cardToPlay)

            if(checkForNopeCardInHand()) {
                nopePlayedCard(cardToPlay, this.comPlayerName)
            
                const waitUntilMessageBoxClosed = setInterval(() => {
                    // Checks if the player has closed the #message_box
                    if ($("#message_box").is(":hidden")) {
                        clearInterval(waitUntilMessageBoxClosed)
    
                        if (!checkIfNopeCardPlayed()) {
                            const waitUntilMessageBoxClosed = setInterval(() => {
                                if ($("#message_box").is(":hidden")) {
                                    clearInterval(waitUntilMessageBoxClosed)

                                    this.hand.splice(cardIndex, 1)
                                    this.cardsToPlayList.splice(0, 1)
                                    
                                    playCardForComPlayer(cardToPlay)
                                    
                                    return ""
                                }
                            }, 100)
                        }
                        else {
                            this.cardsToPlayList.splice(0, 1)
                            this.hand.splice(cardIndex, 1)
                            
                            drawCardForComPlayer()
                            
                            return ""
                        }
                    }
                }, 100);
            }
            else {
                playCardForComPlayer(cardToPlay)
                
                return ""
            }
        }
        else {
            this.chooseCardToPlay(playCardForComPlayer, drawCardForComPlayer)
        }
    }
}

const com1Player = new comPlayerClass("Com 1")
const com2Player = new comPlayerClass("Com 2")
const com3Player = new comPlayerClass("Com 3")

export {
    com1Player,
    com2Player,
    com3Player
}