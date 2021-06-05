"use strict";
/*
should implement "dealing cards" properly
since casual blackjack is not suite (diamond, club, etc) dependent,
implementation can be based off ace (1 or 10), 2-10, and face cards (being valued at 10)
*/

/*
since we technically only have 14 choices since ace can be used as 1 or 10 depending, we can have a random generator for ace (1 variation) being 1 roll and 2-10 being from 2-10 roll
11 can be queen (valued at 10)
12 can be jack (valued at 10)
and 13 can be king (valued at 10)
*/

let isGameBegun = false; //defaults to false without initializing
let firstMove = true; //this boolean is for the case of obtaining blackjack on first cards dealt on either player or dealers said
let isOver;
let isRevealing;
let playerFirstDealt = 0,
  playerSecondDealt = 0,
  dealerFirstDealt = 0,
  dealerSecondDealt = 0,
  playerSum = 0,
  dealerSum = 0;

/*
using an object as deck?
*/

/*
starting to implement the drawing phase at the beginning and in between player moves if hit is chosen
possibly implement a function for the entire move phase
<pseudoc-ode function implementation based on game rules and regulations i.e if they choose to hit or stand
pre: bets can be implemented at later time to keep count of money with what is lost and gained
1. the dealer deals each player two cards: player two cards : dealer two cards (one card still unknown/face down) 
2. current player(s) turn(s): choose options for move: hit : stand
3. current player(s) turn(s): if hit chosen: card is drawn and added to the current sum of the hand note: hit can be called as many times as player wants but over 22 is instant loss
4. current player(s) turn(s): if stand is chosen no card is drawn and turn is "skipped", then it is dealers turn
4.5 we also have other moves that could be later implemented: splitting, double down, surrendering
5.current dealer turn: dealer flips cards over, 16 over they hit until the sum is 17 or over
  5.5. if dealer is over 21, players are double their bet, otherwise go off the sum value of each player after dealer hits 17 or over to decide winner
  5.6. when dealer stops hit at 17 or over, if both sums(unless both player and dealer have a blackjack at start of dealing cards) are the same then house wins (dealer)
*/

/*
 array first to grab "key" then get the value from deck object
*/

/* TODO: completed -
storing html class's in variables project
const message = document.querySelector(".message");
const playerMessage = document.querySelector(".playerMessage");
const playerHand = document.querySelector(".playerHand");
const dealerMessage = document.querySelector(".dealerMessage");
*/
const body = document.querySelector("body");

const message = document.querySelector(".message");
const playerMessage = document.querySelector(".playerMessage");
const playerHand = document.querySelector(".playerHand");
const dealerMessage = document.querySelector(".dealerMessage");

const rules = document.querySelector(".rules");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");

let card = "";

const dealt = function () {
  let deck = {
    ace: 11,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 10,
    queen: 10,
    king: 10,
  };

  let deckArr = Object.keys(deck);
  card = deckArr[Math.ceil(Math.random() * 14) - 1];
  let hit = deck[card]; //this needs to be *14 to have ace included in the drawing

  return hit;
};

const dealerStands = function () {
  if (dealerSum > 21) {
    console.log(dealerSum);
    //if dealer hits over 21 case scenario, player wins
    dealerMessage.textContent = `the dealers sum is ${dealerSum}, dealer was last dealt a ${dealerSecondDealt}, dealer busted`; //TODO: "last dealt" for clarification until fix
    message.textContent = `dealer is over 21, dealer busted, player wins`;
    body.style.backgroundColor = "green";
  } else if (dealerSum > playerSum) {
    message.textContent = `dealer wins with hand of ${dealerSum} over the players hand of ${playerSum}`;
    body.style.backgroundColor = "maroon";
  } else if (dealerSum < playerSum) {
    message.textContent = `player wins with hand of ${playerSum} over the dealers hand of ${dealerSum}`;
    body.style.backgroundColor = "green";
  } else if (dealerSum === playerSum) {
    message.textContent = `both players stood with the same hand value, house wins`;
    body.style.backgroundColor = "maroon";
  }
};

const firstTurnBlackJackMessage = function () {
  document.querySelector(".dealerUnknownHand").textContent = dealerFirstDealt;
  dealerMessage.textContent = `the cards the dealer were dealt are ${dealerFirstDealt} & ${dealerSecondDealt}`;
  isOver = true;
};

const firstTurnBlackJack = function () {
  if ((dealerSum === 21) & (playerSum === 21)) {
    message.textContent = `both players drew a blackjack, nothing is won or lost`;
    firstTurnBlackJackMessage();
  } else if (playerSum === 21) {
    message.textContent = `player drew a blackjack, player wins`;
    firstTurnBlackJackMessage();
    body.style.backgroundColor = "green";
  } else if (dealerSum === 21) {
    message.textContent = `dealer drew a blackjack, dealer wins`;
    firstTurnBlackJackMessage();
    body.style.backgroundColor = "maroon";
  }
};

const aceDealt = function (activePlayerSum) {
  if (card === "ace" && activePlayerSum <= 10) {
    console.log(`ace and 10 under`);
    //we want to do nothing since an ace being an 11 will not cause the player to bust if 10 or below
    return (activePlayerSum += 11);
  } else if (card === "ace" && activePlayerSum > 10) {
    console.log(`ace and 11 over`);
    //if player is 11 over then we want ace to be 1 to avoid bust
    return (activePlayerSum += 1);
  }
};

document.querySelector(".begin").addEventListener("click", function () {
  playerFirstDealt = dealt();
  playerSecondDealt = dealt();
  dealerFirstDealt = dealt();
  dealerSecondDealt = dealt();

  playerSum = playerFirstDealt + playerSecondDealt;
  dealerSum = dealerFirstDealt + dealerSecondDealt;

  if (!isGameBegun) {
    playerMessage.textContent = `the cards you were dealt are ${playerFirstDealt} & ${playerSecondDealt}`;

    dealerMessage.textContent = `the cards the dealer were dealt are unknown & ${dealerSecondDealt}`;

    playerHand.textContent = playerSum;

    document.querySelector(".dealerKnownHand").textContent = dealerSecondDealt;

    message.textContent = `would you like to hit or stand at this point?`;

    isGameBegun = true;

    firstTurnBlackJack();
  }
});

document.querySelector(".hit").addEventListener("click", function () {
  if (isGameBegun && !isRevealing) {
    let hit = 0;
    if (!isOver && playerSum < 21) {
      message.textContent = `you chose to hit`;

      hit = dealt();

      playerMessage.textContent = `you drew a ${hit}`;

      if (card !== "ace") {
        playerSum += hit;
      } else {
        playerSum = aceDealt(playerSum);
      }

      playerHand.textContent = playerSum;
      if (playerSum > 21) {
        message.textContent = `you chose to hit and you hit over 21, you busted`;
        document.querySelector(".dealerUnknownHand").textContent =
          dealerFirstDealt;
        dealerMessage.textContent = `the cards the dealer were dealt are ${dealerFirstDealt} & ${dealerSecondDealt}`;
        body.style.backgroundColor = "maroon";
        isOver = true;
      } else if (playerSum === 21) {
        playerMessage.textContent = `you drew a ${hit}`;
        document.querySelector(".dealerUnknownHand").textContent =
          dealerFirstDealt;
        dealerMessage.textContent = `the cards the dealer were dealt are ${dealerFirstDealt} & ${dealerSecondDealt}`;
        message.textContent = `congratulations, you have won the game with 21 sum`;
        body.style.backgroundColor = "green";
        isOver = true;
      }
    }
  }
});

document.querySelector(".stand").addEventListener("click", function () {
  if (!isOver && playerSum < 21) {
    message.textContent = `the player chose to stand, proceeding to dealers move`;

    isRevealing = true;

    document.querySelector(".dealerUnknownHand").textContent = dealerFirstDealt;

    dealerMessage.textContent = `the cards the dealer were dealt are ${dealerFirstDealt} & ${dealerSecondDealt}, the dealers sum is now ${dealerSum}`;

    if (dealerSum >= 17) {
      dealerMessage.textContent = `the dealers sum is ${dealerSum}, dealer was dealt a ${dealerSecondDealt}, 17 over, dealer stands`;
      dealerStands();
    } else {
      dealerMessage.textContent = `dealer sum is ${dealerSum}, dealer is 16 under, dealer hits`;
      //FIXME: this code snippet works, but mostly as a test case. this should be modified at some point to print out the dealers hit onto the screen for more fair judgement instead of just console.log'ing the hits under 17
      while (dealerSum < 17) {
        //this means the dealer is less than 17 so they'd have to hit at least once regardless
        dealerSecondDealt = dealt();

        console.log(`while loop entered, card dealt was ${card}`);

        if (card !== "ace") {
          dealerSum += dealerSecondDealt;
        } else {
          dealerSum = aceDealt(dealerSum);
        }

        dealerMessage.textContent = `the dealers sum is ${dealerSum}, dealer was last dealt a ${dealerSecondDealt}, 17 over, dealer stands`; //TODO: "last dealt" for clarification until fix"
        dealerStands();
      }
    }
  }
});

document.querySelector(".again").addEventListener("click", function () {
  if (isGameBegun) {
    isOver = false;
    isGameBegun = false;
    isRevealing = false;
    playerSum = 0;
    dealerSum = 0;

    body.style.backgroundColor = "#222";

    message.textContent = `Click begin to start the card dealing`;
    dealerMessage.textContent = `dealer says...`;
    playerMessage.textContent = `you drew...`;
    document.querySelector(".dealerUnknownHand").textContent = `?`;
    document.querySelector(".dealerKnownHand").textContent = `?`;
    playerHand.textContent = `?`;
  }
});

/*
TODO: implement true blackjack, if player or dealer gets a ten || face card(values at 10) &&an ace, then its automatially a win for the person, if both obtain blackjack game is neutral, no chips are taken or given 

one way to account for an ace is to substract 10 when neccessary if an ace can be used as a one instead to save a bust
player ace conditions accounted for - complete
dealer ace conditions account for - complete, but might need more testing comment: looks good in all conditions checked so far

blackjack on first turn implementation - complete

TODO: completed - the html/css has the modal ready for implementation, behavior/responsiveness should be implemented in javascript based on the hidden class in html/display property in css

//TODO: one fun implementation to do is add a money system that the player can choose to start with and have it played around with (gained or lost) based on winning/losing

//TODO: challenging: add a way for people to see the dealers "hits" if under 17 to see a fairness instead of logging it to the console for testing purposes
//this will be do-able once I figure out the proper DOM manipulation technique, such as continiously manipulating the current HTML element text with additional text per execution concatenated

*/
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

rules.addEventListener("click", function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.querySelector("body").addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});
