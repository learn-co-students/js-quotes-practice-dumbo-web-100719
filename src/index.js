// It might be a good idea to add event listener to make sure this file only runs after the DOM has finshed loading. 

//let element = document.createElement("div")
//element.id = "hello"
// element.setAttribut("class", "hello")

// everything that you grab from the existing DOM should go here in the global scope 

let quoteListUL = document.querySelector("#quote-list")
let newForm = document.querySelector("#new-quote-form")
fetch("http://localhost:3000/quotes?_embed=likes")
.then(r => r.json())
.then((quotesArray) => {
    //console.log( quotesArray)
    quotesArray.forEach((quoteObj) => {
        turnObjToLi(quoteObj)
        
    })
})

function turnObjToLi(quoteObj){
    

    /*
    //create all the elements
    let quoteLi = document.createElement("li")
        quoteLi.className = "quote-card"

    let blockquote = document.createElement("blockquote")
        blockquote.className = "blockquote"

    let quoteP = document.createElement("p")
        quoteP.innerText = quoteObj.quote
        quoteP.className = "mb-0"

    let authorFooter = document.createElement("footer")
        authorFooter.innerText = quoteObj.author
        authorFooter.className = "blockquote-footer"

    let lineBreak = document.createElement("br")

    let likeButton = document.createElement("button")

    let likesSpan = document.createElement("span")

    //append all the elements

     quoteLi.append(blockquote)
    blockquote.append(quoteP, authorFooter, linerBreak, likeButton)

    likeButton.append(likeSpan)

    */

    // make box, fill the box, grab element from the box
    //create all the elements
   let quoteLi = document.createElement("li")
       quoteLi.className = "quote-card"
   // quoteLi.dataset.keenan = quoteObj.id - if doing delegation



    quoteLi.innerHTML = ` <blockquote class="blockquote">
    <p class="mb-0">${quoteObj.quote}</p>
    <footer class="blockquote-footer">${quoteObj.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-change'>Edit</button>
  </blockquote>` 

    quoteListUL.append(quoteLi)

    //add event listener to like button
    // when using innerHTML querySelector inside of that box

    let deleteButton = quoteLi.querySelector(".btn-danger")
    let likeButton = quoteLi.querySelector(".btn-success")
    let likesSpan = quoteLi.querySelector("span")
    let editButton = quoteLi.querySelector(".btn-change")

    deleteButton.addEventListener("click", (evt) => {
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`,{
            method: "DELETE"
        })
        .then(r => r.json())
        .then((theActualResponse) => {
            
            quoteLi.remove()
        })
    })

    likeButton.addEventListener("click", (evt) => {
       // console.log(quoteObj)
       fetch("http://localhost:3000/likes", {
           method: "POST" ,
           headers: {
               'content-type': 'application/json',
               'accept': 'application/json'
           },

           body: JSON.stringify({
               quoteId: quoteObj.id
           })


       })
       .then(r => r.json())
       .then((like) =>{
           quoteObj.likes << like
           likesSpan.innerText ++
            
           //console.log(quoteObj) --console log original object
           //console.log(like) --console log response
           
       })
        
    })

    let editSubmitButton = document.createElement("button")
    let editInputField = document.createElement ("input")
    
    editButton.addEventListener("click", (evt) => {
        console.log("these quotes are whack")
        editInputField.placeholder = quoteObj.quote
        editInputField.name = "inputField"
        editSubmitButton.innerText = "Change Quote"
        quoteLi.append(editInputField, editSubmitButton)
        
    })

    editInputField.addEventListener("click", (evt) => {
    //    evt.preventDefault()
    //    updatedQuote = evt.target.inputField.value
       console.log(evt.target)

        // fetch(`http://localhost:3000/api/v1/calorie_entries/${quoteObj.id}`, {
        //     method:'PATCH',
        //    headers: { 
        //        'Content-type': 'application/json',
        //        'accept': 'application/json'
        //    },
        //    body: JSON.stringify({
        //   data_key: data_value
        //     })
        //   })
        //   .then(resp => resp.json())
        //   .then(json_resp => {function_for_resp(json_resp)})
      
      })
    }

   

newForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    debugger
    //console.log("hello")
    let newQuote = evt.target["new-quote"].value
    let newAuthor = evt.target.author.value



    fetch(`http://localhost:3000/quotes`, {
      method:'POST',
     headers: { 
         'Content-type': 'application/json',
         'accept': 'application/json'
     },
     body: JSON.stringify({
    quote: newQuote,
    author: newAuthor
      })
    })
    .then(resp => resp.json())
    .then(quoteObj => {
        
        console.log(quoteObj)
        quoteObj.likes = []
        turnObjToLi(quoteObj)
    })
    
})


// make label for form use label for and form id




//Bonus

let firstDiv = document.querySelector("div")
let searchInput = document.createElement ("input")
searchInput.type = "text"
searchInput.placeholder = "write a quote"
firstDiv.prepend(searchInput)

searchInput.addEventListener("input", (evt) => {
    let userInput = evt.target.value
    let allQuotes = document.querySelectorAll(".quote-card")
    allQuotes.forEach((quoteLi) => {

        let text = quoteLi.querySelector("p").innerText
        if(text.includes(userInput)){
            quoteLi.style.display = "block"
        }
        else {
            quoteLi.style.display = "none"}
    })

})
