import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import "./Deck.css"

function Deck() {
    const initialDrawn = []
    const [drawn, setDrawn] = useState(initialDrawn)
    const [isShuffling, setIsShuffling] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const deckId = useRef()

    useEffect(function initializeDeck() {
        async function getDeck() {
           const ajaxDeck = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
           deckId.current = ajaxDeck.data.deck_id
        }
        getDeck()
    }, [])

    async function drawCard() {
        setIsDrawing(true)
        const deckResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`)
        const draw = deckResponse.data
        if(draw.success) {
            const card = draw.cards[0]
            const newCard = {code: card.code, image: card.image, value: card.value, suit: card.suit}
            setDrawn([...drawn, newCard])
        } else {
            if(draw.remaining === 0){
                alert("Error: no cards remaining!")
            } else {
                alert("An error has occured with the api, please try again later")
            }
        }
        setIsDrawing(false)
    }

    async function shuffleDeck() {
        setIsShuffling(true)
        await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/shuffle`)
        setDrawn(initialDrawn)
        setIsShuffling(false)
    }

    return(
        <div className="deck">
            <h1>Deck of Cards</h1>
            {!isDrawing && <button onClick={drawCard}>Draw Card</button>}
            {isDrawing && <b>Please Wait</b>}
            <hr />
            <div className="drawn">
                {drawn.map((card) => 
                  <img className="card" alt={`${card.value} OF ${card.suit}`} key={card.code} src={card.image}/>
                )}
            </div>
            <hr />
            {!isShuffling && <button onClick={shuffleDeck}>Shuffle Deck</button>}
        </div>
    )
}

export default Deck