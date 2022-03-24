// define variabels
const remainingCards = document.getElementById('remaining-cards')
const statusText = document.getElementById('status-text')
const computersScore = document.getElementById('computer-score')
const playersScore = document.getElementById('player-score')
const newDeckBtn = document.getElementById('new-deck')
const newCardsBtn = document.getElementById('draw-cards')
const cardOne = document.getElementById('card-1')
const cardTwo = document.getElementById('card-2')

const cardValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'JACK', 'QUEEN', 'KING', 'ACE']

let deckId
let cardOneValue, cardTwoValue
let playerName
let remCards = 0, compScore = 0, userScore = 0

function getPlayersName() {

    let name = prompt("Please enter your name:", "Player 1")
    name == "" ? name = "Player 1" : playerName = `${name}`
    if (name.length > 12) {
        playerName = name.slice(0, 12)
    }
    document.getElementById('players-name').textContent = playerName
}

document.addEventListener("DOMContentLoaded", getPlayersName, false)

async function newDeck() {
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    const data = await res.json()

    // adds back of the cards
    cardOne.classList.add('card-1')
    cardTwo.classList.add('card-2')

    // removes green background space holder 
    cardOne.style.backgroundColor = 'transparent'
    cardTwo.style.backgroundColor = 'transparent'

    deckId = data.deck_id
    remainingCards.textContent = data.remaining
    statusText.innerText = "Draw A Card"
    newCardsBtn.disabled = false;

    // resetting
    statusText.classList.remove('the-end')
    cardOne.innerHTML = ""
    cardTwo.innerHTML = ""
    compScore = 0
    userScore = 0
    computersScore.textContent = compScore
    playersScore.textContent = userScore
}

newDeckBtn.addEventListener('click', newDeck)

function evaluateCards(computersCard, playersCard) {
    if (computersCard > playersCard) {
        statusText.innerText = "Computer Gets 1 Point"
        compScore += 1
        computersScore.textContent = compScore
    } else if (computersCard  < playersCard) {
        statusText.innerText = `${playerName} Gets 1 Point`
        userScore += 1
        playersScore.textContent = userScore
    } else {
        statusText.innerText = "It's A Tie"
    }
}

async function drawCards() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
    
    // remove card background
    cardOne.classList.remove('card-1')
    cardTwo.classList.remove('card-2')

    // add card image from restapi data
    cardOne.innerHTML = `
        <img 
            src="${data.cards[0].image}" 
            alt="${data.cards[0].value}" 
            style="width: 100%; height: 100%;"
            />
    `

    cardTwo.innerHTML = `
        <img 
            src="${data.cards[1].image}" 
            alt="${data.cards[1].value}" 
            style="width: 100%; height: 100%;"
            />
    `

    remCards = data.remaining
    remainingCards.textContent = remCards
    cardOneValue = data.cards[0].value 
    cardTwoValue = data.cards[1].value

    evaluateCards(cardOneValue, cardTwoValue)

    if(remCards === 0) {
        newCardsBtn.disabled = true;

        if(compScore > userScore) {
            statusText.innerText = "COMPUTER WINS"
        } else if (compScore < userScore) {
            statusText.innerText = `${playerName.toUpperCase()} WINS`
        } else {
            statusText.innerText = "IT'S A DRAW"
        }
        statusText.classList.add('the-end')
    }
}

newCardsBtn.addEventListener('click', drawCards)