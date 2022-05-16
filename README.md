# Blackjack-Pro
Card game built using card API, with draw, stand, and new hand mechanics. Fully-responsive on desktop as well as mobile.

Link to project: https://adamrathbun.github.io/Blackjack-Pro/
![blackjackdemo](https://user-images.githubusercontent.com/92285612/168513848-5ea0a056-7ccf-45fa-971d-ce57e2cd898d.gif)


How It's Made:
Tech used: HTML, CSS and JavaScript

I grabbed fresh decks and cards from the deckofcardsapi and used a mix of array and number counts to track dealer vs player hands. For aces, I used a separate counter that subtracted 10 from the player hand value if it went over 21. I tied event listeners to "Draw", "Stand", and "New Hand" buttons. I used async–await functions tied to each of the play buttons and wiped counts with the new game button.

Optimizations
I originally had a bad card hand system that had pre-designed boxes for the cards to populate but it was a lot better when I just auto created card elements and appended them to the DOM.

Lessons Learned:
There's always lots of fringe cases! It feels like plugging one side of a fish tank just to walk around and see the other side's also leaking. This was a good reminder in async–await as well. Without the async–await, the code would break just getting the data without updating my count. 
