//Get the elements from the page
var scanElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6 , p, strong, i, a")
var wordsArray = []

//Specifically grab the A-z text from the selected elements and push those words to an array 
for(i = 0; i < scanElements.length; i++) {
    let words = scanElements[i].innerText.toLowerCase()
    let trimmedWords = words.split(/[^a-z]+/g).filter((word) => word.length >= 8)
    for(word of trimmedWords) {
        wordsArray.push(word)
    }
}

//Cleans up the grabbed words while removing any copies and makes them a usable array for the extension
var uniqueWords = wordsArray.map(JSON.stringify)
var uniqueArray = new Set(uniqueWords)
finishedArray = Array.from(uniqueArray, JSON.parse)
chrome.runtime.sendMessage(finishedArray, function() {
    return;
})





