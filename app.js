const QUOTE_API_URL = "https://api.quotable.io/random";
const USER_API_URL = "https://randomuser.me/api/";
const LOADER_MIN_TIME = 2500;

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

  quoteText.innerHTML = "";

  // Split the quote into individual characters and wrap each character in a span
  for (const char of quote.content) {
    const span = document.createElement("span");
    span.innerText = char;
    quoteText.appendChild(span);
  }

  // Show the quote character by character
  let index = 0;
  function showNextChar() {
    const spans = quoteText.querySelectorAll("#quoteText span");

    if (index < spans.length) {
      spans[index].style.opacity = 1;
      index++;
      setTimeout(showNextChar, 50);
    }
  }

  // wait until the loader is hidden
  while (!loader.classList.contains("hidden")) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  showNextChar();
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
