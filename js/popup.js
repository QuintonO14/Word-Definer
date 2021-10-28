
/* Send requested word to dictionaryapi to get the full definition, including the parts of speech. If there is no
    definition for the word in the api, a Google search link is attached to the 404 response. */
const defineWord = async(word, id) => {
    document.getElementById(id).classList.add("defined")
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => {
        if(response.status == 404) {
            document.getElementById(id).children[0].innerHTML = `Unable to retrieve a definition for <strong id="strong">
            ${word}.
            </strong><a id="link">Try this</a>`
            document.getElementById("strong").style.padding = "0"
            document.getElementById("link").addEventListener("click", () => {
            let url = `https://www.google.com/search?q=${word}`
            chrome.tabs.create({url : url})
            })

            //Resets the li to original format
            setTimeout(() => {
                let item = document.getElementById(id)
            item.classList.remove("defined")
            item.setAttribute("defined", "false")
            item.children[0].innerHTML = word
            }, 60000)
            
        } else {
            return response.json()
        }
        }).then((res) => {
            for (result of res) {
                let definition = document.createElement("div")
                document.getElementById(id).appendChild(definition)
                document.getElementById(word).style.fontWeight = "bold"
                document.getElementById(word).style.alignSelf = "center"
                result.meanings.map((meaning) => {
                    let partOfSpeech = document.createElement("small")
                    partOfSpeech.style.fontStyle = "italic"
                    partOfSpeech.innerHTML = meaning.partOfSpeech
                    definition.appendChild(partOfSpeech)
                    meaning.definitions.map((def) => {
                        let diction = def.definition
                        let defTag = document.createElement("p")
                        defTag.innerHTML = diction
                        definition.append(defTag)
                    })
                })
            }
        }).catch((err) => {
            return null;
        });
    

    //Resets li to original format
    setTimeout(() => {
        let resetEl = document.getElementById(id)
        resetEl.classList.remove("defined")
        resetEl.setAttribute("defined", "false")
        resetEl.children[0].setAttribute("id", word)
        resetEl.children[0].innerHTML = word
        document.getElementById(word).style.removeProperty("font-weight")
        while(resetEl.childNodes.length > 1) {
            resetEl.removeChild(resetEl.lastChild)
        }
    }, 60000)
}

window.addEventListener('DOMContentLoaded', () => {
    var message = document.createElement("div")
    message.style.padding = "1rem"
    message.innerHTML = "Unable to get words for this page."
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        var currentTab = tabs[0]
        if(currentTab.url.includes("https://chrome") || currentTab.url.includes("chrome://")) {
            document.body.children[0].replaceWith(message)
        }
    })
    let bg = chrome.extension.getBackgroundPage()
    var words = bg.words

    //Create li containing each word from the words array
    if(!words) {
        document.body.children[0].replaceWith(message)
    } else {
    for(i = 0; i < words.length; i++) {
        let item = document.createElement("li")
        let word = document.createElement("p")
        let button = document.createElement("button")
        button.setAttribute("id", "define")
        button.innerHTML = "Define"
        word.innerHTML = words[i]
        word.setAttribute("id", words[i])
        item.setAttribute("id", i)
        item.setAttribute("defined", "false")
        item.appendChild(word)
        document.getElementById("words").appendChild(item)
        item.addEventListener("mouseenter", () => {
            if(item.getAttribute("defined") === "false") {
            item.appendChild(button)
            button.style.display = "block"
            } 
        }) 
        item.addEventListener("mouseleave", () => {
            button.style.display = "none"
        })
        button.addEventListener("click", () => {
            defineWord(word.innerText, item.id)
            item.setAttribute("defined", "true")            
            button.style.display = "none"
        })
        }
    }    
})


