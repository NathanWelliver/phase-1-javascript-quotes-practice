document.addEventListener('DOMContentLoaded', () => {

    const quoteList = document.getElementById('quote-list');
    const quoteForm = document.getElementById('new-quote-form');

    // Function to render a single quote item
    function renderQuote(quote) {
        let listItem = document.createElement('li');
        listItem.className = 'quote-card';
        listItem.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success like-btn' data-id="${quote.id}">Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
                <button class='btn-danger delete-btn' data-id="${quote.id}">Delete</button>
            </blockquote>
        `;
        quoteList.appendChild(listItem);
    }

    // Function to fetch quotes from the server
    function fetchQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
        .then(res => res.json())
        .then(quoteData => {
            quoteData.forEach(quote => {
                renderQuote(quote);
            });
        });
    }

    // Function to handle quote submission
    quoteForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(quoteForm);
        const quote = formData.get('quote');
        const author = formData.get('author');

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quote, author })
        })
        .then(res => res.json())
        .then(newQuote => {
            renderQuote(newQuote);
            quoteForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Function to handle like button click
    quoteList.addEventListener('click', event => {
        if (event.target.classList.contains('like-btn')) {
            const id = event.target.dataset.id;
            const span = event.target.querySelector('span');
            const likes = parseInt(span.textContent);
            const newLikes = likes + 1;
            
            fetch(`http://localhost:3000/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quoteId: id })
            })
            .then(() => {
                span.textContent = newLikes;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Function to handle delete button click
    quoteList.addEventListener('click', event => {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.dataset.id;

            fetch(`http://localhost:3000/quotes/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                event.target.closest('.quote-card').remove();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Fetch quotes when the DOM content is loaded
    fetchQuotes();
});

