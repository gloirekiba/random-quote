const QUOTE_API_URL = "https://api.quotable.io/random";
const USER_API_URL = "https://randomuser.me/api/";
const LOADER_MIN_TIME = 2000;

// Select the DOM elements
const authorImg = document.getElementById("authorImg");
const authorName = document.getElementById("authorName");
const quoteText = document.getElementById("quoteText");
const loader = document.getElementById("loader");
const newQuoteBtn = document.getElementById("newQuote");
const tweetQuoteBtn = document.getElementById("tweetQuote");

// Add event listeners
newQuoteBtn.addEventListener("click", refreshQuote);
tweetQuoteBtn.addEventListener("click", tweetQuote);

async function refreshQuote() {
  // Show the loader
  loader.classList.remove("hidden");

  // Fetch the quote and user details from the API
  const [quote, user] = await Promise.all([
    fetchApi(QUOTE_API_URL),
    fetchApi(USER_API_URL),
  ]).catch((err) => {
    window.alert("Something went wrong! \n" + err);
    console.log(err);
    return;
  });

  // This is a hack to show the loader for 2 seconds even if the API is fast enough to respond in less than 2 seconds
  setTimeout(() => loader.classList.add("hidden"), LOADER_MIN_TIME);

  // Set the quote and author details
  authorImg.src = user.results[0].picture.large;
  authorName.innerText = quote.author;
  quoteText.innerText = quote.content;
}

// Call the function once to load the quote on page load
refreshQuote();

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorName.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

async function fetchApi(url) {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => Promise.reject(err));
}
