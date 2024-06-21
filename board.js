class Carousel {
  
  constructor(element) {
    
    this.board = element
    this.onPan = this.onPan.bind(this)
    this.counter = 0
    this.amountPictures = 5
    this.headlines = ["Beautiful Things", "The Craving", "Houdini", "Espresso", "Birds of a feather"]
    this.subheadlines = ["Benson Boone", "Twenty One Pilots", "Dua Lipa", "Sabrina Carpenter", "Billie Eilish"]

    this.push()
    this.push()
    
    // handle gestures
    this.handle()

  }
  
  handle() {
    
    // list all cards
    this.cards = this.board.querySelectorAll('.card')
    
    // get top card
    this.topCard = this.cards[this.cards.length-1]
    
    if (this.cards.length > 0) {

      // destroy previous Hammer instance, if present
      if (this.hammer) this.hammer.destroy()
      
      // listen for pan gesture on top card
      this.hammer = new Hammer(this.topCard)
      this.hammer.add(new Hammer.Pan({
        position: Hammer.position_ALL, threshold: 0
      }))
      
      // pass event data to custom callback
      this.hammer.on('pan', this.onPan)
      
    }
    
  }
  
  onPan(e) {
  
    if (!this.isPanning) {
      
      this.isPanning = true
      
      // remove transition property
      this.topCard.style.transition = null
      
      // get starting coordinates
      let style = window.getComputedStyle(this.topCard)
      let mx = style.transform.match(/^matrix\((.+)\)$/)
      this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0
      this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0

      // get card bounds
      let bounds = this.topCard.getBoundingClientRect()
    
      // get finger position, top (1) or bottom (-1) of the card
      this.isDraggingFrom =
        (e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1
    }
    
    // get new coordinates
    let posX = e.deltaX + this.startPosX
    let posY = e.deltaY + this.startPosY

    // get ratio between swiped pixels and X axis
    let propX = e.deltaX / this.board.clientWidth
    
    // get swipe direction, left (-1) or right (1)
    let dirX = e.deltaX < 0 ? -1 : 1
    
    // get degrees of rotation (between 0 and +/- 45)
    let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45
    
    // move card
    this.topCard.style.transform =
      'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

    var image = this.topCard.querySelector("img");  

    if (dirX == -1){
      image.classList.remove('like')
      image.src = "images/Nope.png"
      image.classList.add('nope')
    } else if (dirX == 1) {
      image.classList.remove('nope')
      image.src = "images/Like.png"
      image.classList.add('like')
    }

    if (e.isFinal) {
  
      this.isPanning = false
      let successful = false

      // check threshold
      if (propX > 0.25) {

        successful = true
        // get right border position
        posX = this.board.clientWidth

      } else if (propX < -0.25) {

        successful = true
        // get left border position
        posX = - (this.board.clientWidth + this.topCard.clientWidth)
      
        } 

        if (successful) {

          // throw card in the chosen direction
          this.topCard.style.transform = 
            'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'
      
          // wait transition end
          setTimeout(() => {
            // remove swiped card
            this.board.removeChild(this.topCard)
            // add new card
            this.push()
            // handle gestures on new top card
            this.handle()
          }, 500)
      
        } else {
    
          // reset card position
          this.topCard.style.transform =
            'translateX(-50%) translateY(-50%) rotate(0deg)'

          this.topCard.style.backgroundImage = "url('images/0"+ (this.counter-1) +".png')";
      
        }

    }
    
  }

  push() {
    this.counter = this.counter + 1

    if(this.counter <= this.amountPictures) {
      var card = document.createElement('div')
      card.classList.add('card')

      card.style.backgroundImage = "url('images/0"+ this.counter +".png')"

      var headline = document.createElement('div')
      headline.classList.add('headline')
      headline.textContent = this.headlines[this.counter-1]
      card.appendChild(headline)

      var subheadline = document.createElement('div')
      subheadline.classList.add('subheadline')
      subheadline.textContent = this.subheadlines[this.counter-1]
      card.appendChild(subheadline)

      let emotion = document.createElement('img')
      card.appendChild(emotion)

      this.board.insertBefore(card, this.board.firstChild)
    }
  }
  
}

let board = document.querySelector('#board')

let carousel = new Carousel(board)