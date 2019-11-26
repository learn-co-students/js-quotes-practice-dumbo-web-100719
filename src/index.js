document.addEventListener('DOMContentLoaded',() => {
    console.log('done')
    fetchQuotes()
    createQuote()
})

let fetchQuotes = () => {
    const url = `http://localhost:3000/quotes?_embed=likes`
    fetch(url, {
      method:'GET',
     headers: { 
         'Content-type': 'application/json',
         'accept': 'application/json'
     }
    })
    .then(resp => resp.json())
    .then(renderQuoteCard)
    .catch((error) => {console.error(error);})
}

let renderQuoteCard = (quoteObj) => {
    quoteObj.forEach(buildQuoteCard)
}

let buildQuoteCard = (quoteObj) => {
    let quoteUl = document.querySelector('#quote-list')

    let quoteLi = document.createElement('li')
    quoteLi.className = 'quote-card'
    quoteLi.setAttribute('id', quoteObj.id)
    quoteLi.dataset.id = `${quoteObj.id}`
    let quoteBlock = document.createElement('blockquote')
    quoteBlock.className = 'blockquote'
    quoteBlock.setAttribute('id', quoteObj.id)
    let quoteP = document.createElement('p')
    quoteP.className = 'mb-0'
    quoteP.innerText = quoteObj.quote
    let quoteFooter = document.createElement('footer')
    quoteFooter.className ='blockquote-footer'
    quoteFooter.innerText = quoteObj.author
    let quoteBreak = document.createElement('br')
    let quoteLike = document.createElement('button')
    quoteLike.className = 'btn-success'
    quoteLike.innerHTML = `Likes: ${quoteObj.likes.length}` 
    let quoteDelete = document.createElement('button')
    quoteDelete.className = 'btn-danger'
    quoteDelete.innerText = 'Delete'
    let quoteEdit = document.createElement('button')
    quoteEdit.innerText = 'Edit'
    quoteEdit.className = 'btn-primary'


    quoteLike.addEventListener('click', () => {
        fetchPostLike(quoteObj)
    })

    quoteDelete.addEventListener('click', () => {
        
        fetchDeleteQuote(quoteObj)
    })

    quoteEdit.addEventListener('click', () => {
        
        console.log('edit button')
    })

    quoteBlock.append(quoteP,quoteFooter,quoteBreak,quoteLike,quoteDelete,quoteEdit)
    quoteLi.append(quoteBlock)
    quoteUl.append(quoteLi)
    

}

let createQuote = () => {
    let quoteForm = document.querySelector('#new-quote-form')

    quoteForm.addEventListener('submit', (event) => {
        event.preventDefault()
        fetchPostQuote(quoteForm)
    })
}

let fetchPostQuote = (quoteForm) => {

    const url = `http://localhost:3000/quotes`
    fetch(url, {
      method:'POST',
     headers: { 
         'Content-type': 'application/json',
         'accept': 'application/json'
     },
     body: JSON.stringify({
        quote: quoteForm['new-quote'].value,
        author: quoteForm.author.value
      })
    })
    .then(resp => resp.json())
    .then(json_resp => {
        buildQuoteCard(json_resp)

    })
    .catch((error) => {console.error(error);})
    quoteForm.reset()
}

let fetchPostLike = (quoteObj) => {
   
    let likeButton = document.querySelector('.btn-success')
    
    const url = `http://localhost:3000/likes`
    fetch(url, {
      method:'POST',
     headers: { 
         'Content-type': 'application/json',
         'accept': 'application/json'
     },
     body: JSON.stringify({
     quoteId: quoteObj.id,
     createdAt: Date.now()
      })
    })
    .then(resp => resp.json())
    .then((resp_json) => {
        quoteObj.likes.push(resp_json)
        likeButton.innerText = `Likes: ${quoteObj.likes.length}`
    })
    .catch((error) => {console.error(error);})
}

let fetchDeleteQuote = (quoteObj) => {
    let quoteLi = document.getElementById(`${quoteObj.id}`)
 
   console.log('line 126',quoteLi)
    const url = `http://localhost:3000/quotes/${quoteObj.id}`
    fetch(url, {
      method:'DELETE',
     headers: { 
         'Content-type': 'application/json',
         'accept': 'application/json'
     }
    })
    .then(resp => resp.json())
    .then(json_resp => {
        quoteLi.remove()
    })
    .catch((error) => {console.error(error);})
}