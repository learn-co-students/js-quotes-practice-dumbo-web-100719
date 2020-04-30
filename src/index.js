let quotesUl = document.getElementById("quote-list")
let newQuoteForm = document.getElementById("new-quote-form")

function getAllQuotes(){
    quotesUl.innerText = ""
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(resp => resp.json())
    .then(quotes => {
        quotes.forEach(quote => {
        displayQuote(quote)
    })
    })
}
getAllQuotes()

function displayQuote(quote){
        if(!quote.quoteId){
        let quoteLi = document.createElement("li")
        quoteLi.classList = 'quote-card'
        let blockquote = document.createElement("blockquote")
        blockquote.classList = 'blockquote'
        let quoteP = document.createElement("p")
        quoteP.classList = "mb-0"
        quoteP.innerText = quote.quote
        let authorName = document.createElement("footer")
        authorName.classList = "blockquote-footer"
        authorName.innerText = quote.author
        let lineBreak = document.createElement("br")
        let likeButton = document.createElement("button")
        likeButton.classList = 'btn-success'
        likeButton.innerText = `Likes: `
        let likeSpan = document.createElement("span")
        likeSpan.id = `quote-${quote.id}`
        likeSpan.innerText = quote.likes.length
        likeButton.append(likeSpan)
        let deleteButton = document.createElement("button")
        deleteButton.classList = 'btn-danger'
        deleteButton.innerText ="Delete"
        let editButton = document.createElement("button")
        editButton.classList = 'btn-success'
        editButton.innerText ="Edit"

        likeButton.addEventListener("click", ()=>{
            // console.log(parseInt(likeSpan.innerText++))
            fetch(`http://localhost:3000/likes`, {
                method:'POST',
                headers: { 
                    'Content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    quoteId: quote.id,
                    createdAt: Date.now()
                })
            })
            .then(resp => resp.json())
            .then(()=>{
                parseInt(likeSpan.innerText++)
            })
        })

        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
              method:'DELETE'
            })
            .then(resp => resp.json())
            .then(() => {
                quoteLi.remove()
            })
        })

        editButton.addEventListener("click", ()=>{
            // console.log(quoteP.innerText)
            let editForm = document.createElement("form")
            let editedQuote = document.createElement("input")
            editedQuote.id = "quote"
            editedQuote.value = quoteP.innerText
            let editedAuthor = document.createElement("input")
            editedAuthor.value = authorName.innerText
            editedAuthor.id = "author"
            let editSubmit =document.createElement("button")
            editSubmit.innerText = "Submit Changes"

            editForm.append(editedQuote, editedAuthor, lineBreak, editSubmit)
            quoteLi.append(editForm)

            editForm.addEventListener("submit", (evt)=>{
                evt.preventDefault()
                // console.log(evt.target.quote.value)
                fetch(`http://localhost:3000/quotes/${quote.id}`, {
                  method:'PATCH',
                  headers: { 
                     'Content-type': 'application/json',
                     'accept': 'application/json'
                  },
                  body: JSON.stringify({
                    quote: evt.target.quote.value,
                    author: evt.target.author.value
                  })
                })
                .then(resp => resp.json())
                .then(json_resp => {
                    editForm.remove()
                    quoteP.innerText = json_resp.quote
                    authorName.innerText = json_resp.author
                })
            })

        })

        
        blockquote.append(quoteP, authorName, lineBreak, likeButton, deleteButton, editButton)
        quoteLi.append(blockquote)
        quotesUl.append(quoteLi)
    
    };
}

function handleSubmit(e){
    e.preventDefault()
    fetch(`http://localhost:3000/quotes`, {
      method:'POST',
      headers: { 
         'Content-type': 'application/json',
         'accept': 'application/json'
      },
      body: JSON.stringify({
        quote: e.target.quote.value,
        author: e.target.author.value,
        likes: []
      })
    })
    .then(resp => resp.json())
    .then(newQuote => {
        e.target.quote.value = ""
        e.target.author.value = ""
        displayQuote(newQuote)
    })
}

newQuoteForm.addEventListener("submit", (e) => handleSubmit(e))
