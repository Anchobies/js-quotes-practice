document.addEventListener("DOMContentLoaded", () => {
    getQuotes();

    document.getElementById("new-quote-form").addEventListener("submit", e => {
        e.preventDefault();

        const newQuote = {
            quote: e.target[0].value,
            author: e.target[1].value
        }

        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newQuote)
        })
            .then(res => res.json())
            .then(quote => renderQuote(quote));
    })
})

const getQuotes = () => {
    document.getElementById("quote-list").innerHTML = "";

    fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then(quotes => quotes.forEach(renderQuote));
}

const renderQuote = quote => {
    const content = document.createElement("h4");
    const author = document.createElement("h5");
    const likes = document.createElement("p");
    const likeButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const listItem = document.createElement("li");
    const quoteList = document.getElementById("quote-list");
    const quoteId = quote.id;
    const likesId = (quote.likes.length === 0) ? null : quote.likes[0].id;
    

    content.textContent = quote.quote;
    author.textContent = quote.author;
    likes.textContent = (quote.likes.length === 0) ? null : quote.likes[0].likes + " likes";
    likeButton.textContent = "Like";
    deleteButton.textContent = "Delete";

    listItem.append(content, author, likes, likeButton, deleteButton);
    quoteList.appendChild(listItem);

    likeButton.addEventListener("click", () => {
        if (quote.likes.length !== 0) {
            let currentLikes = quote.likes[0].likes;

            fetch(`http://localhost:3000/likes/${likesId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    likes: ++currentLikes
                })        
            })
                .then(() => getQuotes());
        } else {
            const newLike = {
                quoteId: quoteId,
                likes: 1,
                createdAt: Math.round(Date.now() / 1000)
            }
    
            fetch("http://localhost:3000/likes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newLike)
            })
                .then(() => getQuotes());
        }
    })

    deleteButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => getQuotes());
    })
}