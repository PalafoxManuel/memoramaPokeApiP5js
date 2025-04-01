const totalPairs = 10
let cards = []
let matchedCount = 0
let firstFlippedIndex = -1
let secondFlippedIndex = -1
let lockBoard = false
let gameReady = false
let loadedPairs = 0
let btn

function setup() {
  createCanvas(800, 600)
  textAlign(CENTER, CENTER)
  textSize(20)
  btn = createButton("Volver a jugar")
  btn.mousePressed(restartGame)
  btn.hide()
  loadPokemons()
}

function draw() {
  background(220)
  if (!gameReady) {
    fill(0)
    text(`Cargando... ${loadedPairs}/${totalPairs}`, width / 2, height / 2)
    return
  }
  if (matchedCount === totalPairs) {
    fill(0)
    text("¡Juego terminado! Encontraste todas las parejas.", width / 2, height / 2)
    btn.size(200, 40)
    btn.position((width - 200) / 2, (height / 2) + 50)
    btn.show()
    return
  }
  let cols = 5
  let rows = 4
  let cardWidth = width / cols
  let cardHeight = height / rows
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i]
    let col = i % cols
    let row = floor(i / cols)
    let x = col * cardWidth
    let y = row * cardHeight
    stroke(0)
    fill(255)
    rect(x, y, cardWidth, cardHeight)
    if (card.faceUp || card.matched) {
      image(card.img, x, y, cardWidth, cardHeight)
    } else {
      fill(100)
      text("?", x + cardWidth / 2, y + cardHeight / 2)
    }
  }
}

function mousePressed() {
  if (!gameReady || lockBoard) return
  let cols = 5
  let rows = 4
  let cardWidth = width / cols
  let cardHeight = height / rows
  let colClic = floor(mouseX / cardWidth)
  let rowClic = floor(mouseY / cardHeight)
  let indexClic = rowClic * cols + colClic
  if (indexClic < 0 || indexClic >= cards.length) return
  let clickedCard = cards[indexClic]
  if (clickedCard.faceUp || clickedCard.matched) return
  clickedCard.faceUp = true
  if (firstFlippedIndex === -1) {
    firstFlippedIndex = indexClic
  } else if (secondFlippedIndex === -1) {
    secondFlippedIndex = indexClic
    lockBoard = true
    setTimeout(compareCards, 1000)
  }
}

function compareCards() {
  let cardA = cards[firstFlippedIndex]
  let cardB = cards[secondFlippedIndex]
  if (cardA.id === cardB.id) {
    cardA.matched = true
    cardB.matched = true
    matchedCount++
  } else {
    cardA.faceUp = false
    cardB.faceUp = false
  }
  firstFlippedIndex = -1
  secondFlippedIndex = -1
  lockBoard = false
}

function loadPokemons() {
  cards = []
  loadedPairs = 0
  matchedCount = 0
  gameReady = false
  let randomIDs = []
  for (let i = 0; i < totalPairs; i++) {
    randomIDs.push(floor(random(1, 1011)))
  }
  for (let id of randomIDs) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`
    loadJSON(url, (data) => {
      let spriteUrl = data.sprites.front_default
      if (!spriteUrl) {
        spriteUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
      }
      loadImage(spriteUrl, (img) => {
        cards.push({ id, img, faceUp: false, matched: false })
        cards.push({ id, img, faceUp: false, matched: false })
        loadedPairs++
        if (loadedPairs === totalPairs) {
          shuffle(cards, true)
          gameReady = true
        }
      })
    })
  }
}

function restartGame() {
  btn.hide()
  firstFlippedIndex = -1
  secondFlippedIndex = -1
  lockBoard = false
  loadPokemons()
}
