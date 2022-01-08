import { get } from "svelte/store"
import { comPlayer } from "../../data/GameData"
import { playerHand } from "../../data/PlayerData"
import { com1Player } from "../com-player-scripts/ComPlayerClass"
import { setDefaultMessageBoxProps } from "../global/MessageBox"

const promptPlayer = (type: "steal" | "favor") => {
    const comAmount  = get(comPlayer)
    switch(comAmount) {
        case "1-com-player":
            getCard(type, comAmount)

            break
        default:
            break
    }
}

const getCard = (type: "steal" | "favor", target: string) => {
    let card = ""
    let comPlayerName = ""

    switch(target) {
        case "1-com-player":
            comPlayerName = "Com 1"
            card = com1Player.cards[Math.floor(Math.random() * com1Player.cards.length)]

            break
    }

    const playerHandList = get(playerHand)
    playerHandList.push(card)
    playerHand.set(playerHandList)

    if(type === "favor") {
        setDefaultMessageBoxProps(`${comPlayerName} has given you their ${card} card`, `${comPlayerName} has given you their ${card} card`, `Thanks ${comPlayerName} for the ${card}!`)
    }
    else {
        setDefaultMessageBoxProps(`You have stolen ${comPlayerName}\'s ${card} card`, `You have stolen ${comPlayerName}\'s ${card} card`, `Play on`)
    }
}

const checkForMatchingCatCards = (query: string): boolean => {
    let cardAmount = 1
    for(const card of get(playerHand)) {
        if(card === query) {
            cardAmount++
        } 
    }

    if(cardAmount >= 2) {
        const playerHandList = get(playerHand)
        playerHandList.splice(playerHandList.indexOf(query), 1)
        playerHand.set(playerHandList)

        return true
    }
    else {
        setDefaultMessageBoxProps(`No two matching ${query} cards`, `There are no 2 matching ${query} cards in your hand`)
        return false
    }
}

export {
    promptPlayer,
    checkForMatchingCatCards
}