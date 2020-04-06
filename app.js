const eris = require('eris');

// Create a Client instance with our bot token.
const bot = new eris.Client('Njk2NzYzMzQzNDk4OTAzNjgy.XouBNA.Vb_7uCsBBNZvrPRVj7RIfO3rHmY');

const PREFIX = '!';
const InvalidMsg = 'Hi there! The Paddle channel "Gameplay Requests" is only for posting game requests and expressing interest by reacting to them with emojis. If you would like to post a game request, please use the command "!GameRequest". If I am having issues, please let Nat know so he can fix me!';

const commandHandlerForCommandName = {};
commandHandlerForCommandName['GameRequest'] = (msg) => {
    if (bot.channel) {
        const message = msg.content.slice(13);
        const mention = msg.author.mention;
        return bot.channel.createMessage(mention + ' has posted the following game request:' + '```' + message + '```');
    }

    return msg.channel.createMessage('Error. Could not create message! Please notify Nat.');
};

commandHandlerForCommandName['SetServer'] = (msg, args) => {
    bot.guild = msg.channel.guild;

    bot.guild.channels.forEach(myFunc);
    function myFunc(channel) {
        if (channel.name == args[0] || channel.mention == args)
        {
            bot.channel = channel;
        }
    }

    if (!bot.channel)
    {
        bot.channel === args.slice(1);
        if (!bot.Channel) {
            return msg.channel.createMessage('Error. Could not find channel! Please notify Nat.');
        }
    }

    return msg.channel.createMessage(`Channel set to ${bot.guild.name}:> ${args}!`);
};

bot.on('messageCreate', async (msg) => {
    const content = msg.content;

    // Ignore DMs
    if (!msg.channel.guild) {
        return;
    }

    // Ignore messages not in the bot's set channel
    if (bot.channel && !bot.channel) {
        return;
    }

    // Ignore messages from self or bots
    if (msg.author.bot) {
        return;
    }
    else
    {
        msg.delete();
        if (!content.startsWith(PREFIX))
        {
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


