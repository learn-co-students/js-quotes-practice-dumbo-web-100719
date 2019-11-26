// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

let quoteList = document.querySelector('#quote-list')
let form = document.querySelector('#new-quote-form')

fetch(`http://localhost:3000/quotes?_embed=likes`)
.then(resp => resp.json())
.then(quoteArr => {
    quoteArr.forEach((quoteObj) => {
        makeQuoteLi(quoteObj)
    })
})

function makeQuoteLi(quoteObj) {
    let quoteLi = document.createElement('li')
    quoteLi.className = 'quote-card'
    quoteLi.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quoteObj.quote}</p>
    <footer class="blockquote-footer">${quoteObj.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>`

    quoteList.append(quoteLi)

    let likeButton = quoteLi.querySelector('.btn-success')
    let deleteButton = quoteLi.querySelector('.btn-danger')
    let likeSpan = quoteLi.querySelector('span')

    likeButton.addEventListener('click', (event) => {
        fetch(`http://localhost:3000/likes`, {
          method:'POST',
         headers: { 
             'Content-type': 'application/json',
             'accept': 'application/json'
         },
         body: JSON.stringify({
        quoteId: quoteObj.id
          })
        })
        .then(resp => resp.json())
        .then(likeObj => {
            quoteObj.likes.push(likeObj)
            likeSpan.innerText = quoteObj.likes.length

        }) 
    })

    deleteButton.addEventListener('click', (event) => {
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: 'DELETE'
        })
        .then(r => r.json())
        .then(resp => {
            quoteLi.remove()
        })
    })
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    let newQuote = event.target['new-quote'].value
    let author = event.target['author'].value

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            author: author
        })
    })
        .then(r => r.json())
        .then(resp => {
            resp.likes = []
            makeQuoteLi(resp)

            event.target.reset()
        })
})