const generateHeadHTML = () => {
    return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reading List</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            width: 90%;
            max-width: 600px;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
        }

        .card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .card a {
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
            font-size: 14px;
            text-align: left;
            max-width: 500px;
        }

        .card a:hover {
            text-decoration: underline;
        }

        .card .close-btn {
            background-color: black;
            color: white;
            border: none;
            border-radius: 25%;
            width: 28px;
            height: 28px;
            font-size: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .card .close-btn:hover {
            background-color: #333;
        }
    </style>
</head>`
}

const generateBodyHTML = async () => {
    let listHTML = await getList();
    let message = "";

    if (listHTML) {
        message += "You've still got items on your reading list"
    } else {
        message += "Why not find a new article to read?"
    }

    return `<body onload="myFunc()">
    <div class="container">
        <h1>${message}</h1>
        ${listHTML}
    </div>
</body>`
}

const getList = async () => {
    let listHTML = ""
    let localKeys = await chrome.storage.local.getKeys()

    for (key of localKeys) {
        if (key.slice(0,12) != "blocked_site") {
            let readingListElement = await chrome.storage.local.get(key)
            listHTML += `<div class="card">
                            <a href="${key}" target="_self">${readingListElement[key]}</a>
                            <button class="close-btn">x</button>
                        </div>`
        }
    }
    
    return listHTML
}

const blockSite = async (name) => {
    let siteKey = "blocked_site." + name
    let blocked = await chrome.storage.local.get(siteKey)

    let listHTML = ""
    let localKeys = await chrome.storage.local.getKeys()

    for (key of localKeys) {
        if (key.slice(0,12) != "blocked_site") {
            let readingListElement = await chrome.storage.local.get(key)
            listHTML += `<div class="card">
                            <a href="${key}" target="_self">${readingListElement[key]}</a>
                            <button class="close-btn">X</button>
                        </div>`
        }
    }

    if (blocked[siteKey] && listHTML) {
        document.head.innerHTML = generateHeadHTML();
        document.body.innerHTML = await generateBodyHTML();

        const closeButtons = document.querySelectorAll('.close-btn');

        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.card'); // Get the closest card
                const anchor = card.querySelector('a');
                const link = anchor.getAttribute('href');
                chrome.runtime.sendMessage({"delete": link})
                card.remove(); // Remove the card from the DOM
            });
        }); 
    }
}


const blockAllSites = async () => {
    switch (window.location.hostname) {
        case "www.youtube.com":
            blockSite("youtube")
            break;
        
        case "www.facebook.com":
            blockSite("facebook")
            break;
        
        case "www.instagram.com":
            blockSite("instagram")
            break;
            
        case "www.linkedin.com":
            blockSite("linkedin")
            break;

        case "x.com":
            blockSite("X")
            break;
    }
}

blockAllSites()

