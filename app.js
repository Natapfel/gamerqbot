const eris = require('eris');

// Create a Client instance with our bot token.
const bot = new eris.Client('Njk2NzYzMzQzNDk4OTAzNjgy.XouBNA.Vb_7uCsBBNZvrPRVj7RIfO3rHmY');

const PREFIX = '!';
const InvalidMsg = 'Hi there! The Paddles __**#gameplay-requests**__ channel is only for posting game requests and expressing interest by reacting to them with emojis. If you would like to post a game request, please use the command "!gamereq". If I am having issues, please let Nat know so he can fix me!';
var botguild;
var botchannel;
const channeltouse = "gameplay-requests";

const commandHandlerForCommandName = {};
commandHandlerForCommandName['gamereq'] = (msg) => {
    if (msg.channel != botchannel) {
        return;
    }

    if (botchannel) {
        const message = msg.content.slice(9);
        const mention = msg.author.mention;
        return botchannel.createMessage(mention + ' has posted the following game request:' + '**```' + message + '```**' + 'If you are interested react to this post with emojis to let them know!!');
    }

    return msg.channel.createMessage('Error. Could not create message! Please notify Nat.');
};

commandHandlerForCommandName['getserver'] = (msg) => {
    if (msg.channel != botchannel) {
        return;
    }

    if (!botchannel) {
       return msg.channel.createMessage('Error. Could not find channel! Please notify Nat.');
    }
    return msg.channel.createMessage('My channel is currently set to: ' + botchannel.mention);
};

commandHandlerForCommandName['setserver'] = (msg, args) => {
    if (msg.channel != botchannel) {
        return;
    }

    botguild = msg.channel.guild;

    botguild.channels.forEach(myFunc);
    function myFunc(channel) {
        if (channel.name == args[0] || channel.mention == args)
        {
            botchannel = channel;
        }
    }

    if (!botchannel)
    {
        botchannel === args.slice(1);
        if (!botchannel) {
            return msg.channel.createMessage('Error. Could not find channel! Please notify Nat.');
        }
    }

    return msg.channel.createMessage(`Channel set to ${botguild.name}:> ${args}!`);
};

bot.on('messageCreate', async (msg) => {
    const content = msg.content;

    // Ignore DMs
    if (!msg.channel.guild) {
        return;
    }

    // Ignore messages from self or bots
    if (msg.author.bot) {
        return;
    }
    else
    {
        if (botguild != msg.channel.guild)
        {
            botguild = msg.channel.guild;
        }

        if (!botchannel && botguild)
        {
            botguild.channels.forEach(myFunc);
            function myFunc(channel) {
                if (channel.name == channeltouse) {
                    botchannel = channel;
                }
            }
        }

        if (botchannel === msg.channel)
        {
            msg.delete();
            if (!content.startsWith(PREFIX)) {
                try {
                    (await msg.author.getDMChannel()).createMessage(InvalidMsg);
                } catch (err) {
                    // There are various reasons why sending a message may fail.
                    // The API might time out or choke and return a 5xx status,
                    // or the bot may not have permission to send the
                    // message (403 status).
                    console.warn('Failed to respond to msg.');
                    console.warn(err);
                }
            }
        }
    }

    // Ignore any message that doesn't start with the correct prefix.
    if (!content.startsWith(PREFIX))
    {
        return;
    }

    // Extract the parts of the command and the command name
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);
    const args = parts.slice(1);

    // Get the appropriate handler for the command, if there is one.
    const commandHandler = commandHandlerForCommandName[commandName];
    if (!commandHandler)
    {
        return;
    }

    try
    {
        await commandHandler(msg, args);
    } catch (err) {
        // There are various reasons why sending a message may fail.
        // The API might time out or choke and return a 5xx status,
        // or the bot may not have permission to send the
        // message (403 status).
        console.warn('Failed to respond at all.');
        console.warn(err);
    }
});

bot.on('error', err => {
    console.warn(err);
});

bot.connect();


