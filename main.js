/* Blackjack 
steps I want:

on load, reset hands values to 0
fetch a new deck (shuffle)

on first hit, deal 2 cards to player and dealer (can check for playerArr.length===0)
put the value of each card into an array as array values for playerArr and dealerArr
make playerSum and dealerSum for the total values of each hand from adding the array
there's two counters when an ace comes up. one counter treats the ace as 1 and one as 11: 
    aceCounter1 and aceCounter2 (for 11). if aceCounter2's total value exceeds 21, somehow make it die
the player hand is shown as images while the dealer hand only shows the back of the cards

on subsequent hit, deal one card to player and IF, dealerSum<17, deal one card to dealer
again add the value(s) to playerArr and dealerArr
repeat step with aceCounter1 & 2

on stand, show dealer card images and determine winner
also get a new deck ID

*/

let playerArr=[]
let dealerArr=[]
let playerSum=0
let dealerSum=0

let deckId=''
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
/*
function cardValue(value){  //data.cards[0].value and data.cards[1].value
    if (value==='ACE'){
        return '1' || '11'
    }else if (value ==='KING' || value ==='QUEEN' || value ==='JACK'){
        return '10'
    }else {
        return value
    }
}*/
function getCardDetails(){
        const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
        return fetch(url)
        .then(res => res.json()) 
        .then(data => {
        console.log(data)
        return data
        
        })
        .catch(err => {
        console.log(`error ${err}`)
        });
}

function getHandValue(arr){
    let aceConverted=0     //counting number of aces that turn from 11 to 1
    let sum=0
    for (let i=0; i<arr.length; i++){
        if (arr[i]==='ACE'){
            sum+=11
        }else if (arr[i] ==='KING' || arr[i] ==='QUEEN' || arr[i] ==='JACK'){
            sum+=10
        }else {
            sum+=Number(arr[i])
        }
        if (sum>21){
            aceTotal=0      //note that I have to have aceConverted at the top, outside of this
            for (let j=0; j<arr.length; j++){   //note I use j instead of i here b.c they have to be diff variables
                if (arr[j]==='ACE') {     
                    aceTotal+=1
                }
                if (aceTotal>aceConverted) {
                    aceConverted+=1
                    sum-=10
                    break;
                }
            }
        }
    }
    return sum
}

document.querySelector('.hitBtn').addEventListener('click', hit)

async function hit(){
    if (playerArr.length===0){
      /*
      let card1=Number(getHandValue(data.cards[0].value))
      let card2=Number(getHandValue(data.cards[1].value))
      let card3=Number(getHandValue(data.cards[2].value))
      let card4=Number(getHandValue(data.cards[3].value))

      
      playerSum+=card1 + card3   
      dealerSum+=card2 + card4   
      //console.log (playerSum)
      */
      let data= await getCardDetails()
      playerArr.push(data.cards[0].value,data.cards[2].value)
      dealerArr.push(data.cards[1].value,data.cards[3].value)
      playerSum=getHandValue(playerArr)
      dealerSum=getHandValue(dealerArr)

      const imgA=document.createElement('img')                   // new
      imgA.src=data.cards[0].image
      imgA.class='playerCard'
      document.querySelector('.player-hand').appendChild(imgA)
      const imgA2=document.createElement('img')                   
      imgA2.src=data.cards[2].image
      imgA2.class='playerCard'
      document.querySelector('.player-hand').appendChild(imgA2)

      const imgA3=document.createElement('img')                   
      imgA3.src=data.cards[1].image
      document.getElementById('dhand').appendChild(imgA3)
      //document.querySelector(imgA3).style.display='none'
      const imgA4=document.createElement('img')                   
      imgA4.src=data.cards[3].image
      document.getElementById('dhand').appendChild(imgA4)
      //document.querySelector(imgA4).style.display='none'

    }else if (playerArr.length!==0 && playerSum<21){
      let data= await getCardDetails()
      playerArr.push(data.cards[0].value)
    
      playerSum=getHandValue(playerArr)

      const imgA=document.createElement('img')                   
      imgA.src=data.cards[0].image
      imgA.class='playerCard'
      document.querySelector('.player-hand').appendChild(imgA)

    }else if (playerArr.length!==0 && playerSum>21){
        alert('You already busted, idiot.')
    }
    console.log(`Player hand is ${playerSum}`) 
}

document.querySelector('.standBtn').addEventListener('click', stand)

async function stand(){
/*
    document.querySelector(imgA3).style.display='block'
    document.querySelector(imgA4).style.display='block'
*/

    document.getElementById('jb').classList.add('dealer-hand')
    document.getElementById('dhand').classList.remove('dealer-hand')

    while (dealerSum<17){
        let data= await getCardDetails()   //look up at this function but basically it is forcing the async API data to complete and then move onto the next thing (before, with a while loop, it just kept giving me the data before implementing any change and thereby causing an infinite loop)
        dealerArr.push(data.cards[0].value) //this data is referring to the local variable data
        dealerSum=getHandValue(dealerArr)

        const imgA3=document.createElement('img')                   
        imgA3.src=data.cards[0].image
        document.getElementById('dhand').appendChild(imgA3)

    }
    console.log(`Dealer hand is ${dealerSum}`)
    if (playerSum<=21 && (21-playerSum)<(21-dealerSum)){   //should this be just an "if" statement?
        alert('Player wins')
    }else if (dealerSum<=21 && (21-playerSum)>(21-dealerSum)){
        alert('Jack Blackjack wins')
    }else if (playerSum===dealerSum && (playerArr.length===dealerArr.length)){
        alert('You drawed')
    }else if (playerSum===dealerSum && (playerArr.length<dealerArr.length)){
        alert('Player wins')
    }else if (playerSum===dealerSum && (playerArr.length>dealerArr.length)){
        alert('Jack Blackjack wins')
    }else if (playerSum===dealerSum && (playerSum>21 && dealerSum>21)){
        alert('You both busted')
    }else if (playerSum>21 && dealerSum<=21){
        alert('Jack Blackjack wins')
    }else if (playerSum<=21 && dealerSum>21){
        alert('Player wins')
    }
}

document.querySelector('.newBtn').addEventListener('click', newHand)

function newHand(){
    playerArr=[]
    dealerArr=[]
    playerSum=0
    dealerSum=0
    document.getElementById('phand').innerHTML=''
    document.getElementById('dhand').innerHTML=''
    document.getElementById('jb').classList.remove('dealer-hand')
    document.getElementById('dhand').classList.add('dealer-hand')
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

/*
        const li = document.createElement('li')
       li.textContent=obj.name           //this the template for new text content for each li
       document.querySelector('ul').appendChild(li)
*/