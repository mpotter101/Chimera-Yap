class ChatTemplates {
    userMessage = 
`<article class="message" id="chat-message-example">
    <div class="avatar">
        <img class="avatar image" src="Img/default-avatar.png" />
    </div>
    <div class="content">
        <div class="meta">
            <label class="display name">Black Mage</label>
            <label class="post date"> 10:00 am Feb 11, 2026</label>
        </div>
        <div class="body">
            <p></p>
        </div>
    </div>
</article>`

    systemMessage =
`<article class="system message" id="chat-system-message-example">
    <div class="content">
        <div class="body">
        </div>
        <div class="meta">
            <label class="post date"> 10:00 am Feb 11, 2026</label>
        </div>
    </div>
</article>`

    systemMessagePerson = '<p class="person">John Message</p>'
    systemMessageVerb = '<p class="verb">BOPPED</p>'
    systemMessageArticle = '<p></p>'
    systemMessageImportant = '<p class="important">23</p>'
}

class Message {
    postTime
    displayName
    avatar
    message
    isSystemMessage
    html
    images

    constructor({
        displayName = "System",
        avatar = "Img/default-avatar.png",
        message = "Lorem Ipsum",
        isSystemMessage = false,
        postTime = Date.now().toString(),
        images = [""] // expecting an array of SRCs for an image e.g. ["/Img/Default-avatar.png", "/Img/Coolio.png"]
    }) {
        this.postTime = postTime;
        this.displayName = displayName;
        this.avatar = avatar;
        this.message = message;
        this.isSystemMessage = isSystemMessage
        this.html = this.GetHtml();
    }

    GetHtml() {
        let template;

        if (this.isSystemMessage) {
            template = $(ChatTemplates.systemMessage)
            template.find ('.meta > .post.date').html (this.postTime)
            template.find ('.content > .body').html (this.message)
        }
        else {
            template = $(ChatTemplates.userMessage)
            template.find ('.avatar.image').html (this.avatar)
            template.find ('.display.name').html (this.displayName)
            template.find ('.post.date').html (this.postTime)
            template.find ('.body > p').html (this.message)

            for(var src in this.images)
            {
                let img = $('<img src="' + src + '"/>')
                template.find ('.body').append(img)
            }
        }

        return template
    }
}

class ChatHistory {
    historyLimit = 50;
    messageHistory = []; // a series of message objects
    chatLog = []; // the html nodes viewed in chat history area

    AddMessageToHistory({
        displayName = "System",
        avatar = "Img/default-avatar.png",
        message = "Lorem Ipsum",
        isSystemMessage = false,
        postTime = Date.now().toString(),
        images = [""]
    }) {
        var msg = new Message({displayName, avatar, message, isSystemMessage, postTime, images}); 
        this.history.push(msg);
        var newListItem = $('<li></li>');
        newListItem.append (msg.html);
        this.chatLog.push (newListItem);
    }
    // TODO:
    // Paginate history via server queries
    // Update order of chat messages based on post time each time a message is added
    // API call to server for getting chat history
    // API call to server for adding message to chat history
    
    // Design Thoughts:
    // Chat history is a fluid place. Instead of storing a history for each Group channel and DM,
    // it instead is updated based on which one you want to view. 
    // Less immediate feedback, sure, but also storing significantly less stuff.
}

export default class Messenger {
    chatHistory
    currentChannel // some kind of id to denote a Direct Message channel or Group Chat channel
    nodes = {}

    constructor ({
        selectors = {
            textarea: "#message-input",
            history: "#chat-history"
        }
    } = {}) {
        this.chatHistory = new ChatHistory();
        this.nodes.chatInput = $(selectors.textarea)
        this.nodes.history = $(selectors.history)

        console.log (selectors)
    }



    // TODO:
    // Attach event to message input for sending contents to chat
    // Clear content when a message is created
    // Prevent empty message from being sent (all whitespace is okay)
    // If a user is typing, give focus to chat input
    // Add event so that if the current channel changes we clear the history and request the new channel's history
    // Pull the known active channel from user session to the initial chat history
        // Fallback to pick the Group Chat's first channel in case of failure
}