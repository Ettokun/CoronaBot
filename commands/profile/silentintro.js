const Command = require(`${process.cwd()}/base/Command.js`);

class silentintro extends Command {
    constructor(client) {
        super(client, {
            name: 'silentintro',
            description: 'Add an introduction silently if you like that better! Or edit it on your profile :)',
            usage: 'silentintro <intro-here>',
            aliases: ['silentintroduction'],
            permLevel: 1
        });
    }

    async run(bot, msg, args, level) {
        let introduction = args.join(' ');
        let { MessageEmbed } = require('discord.js');

        if (introduction == '') return msg.reply('please include an intro!');
        if (introduction.length > 1000)
            return msg.reply('your intro is too long >:(');

        bot.database.update(
            'users',
            { intro: introduction, id: msg.author.id },
            bot.logger
        );

        if (msg.channel.id == "688042000204693518") msg.delete();
        else msg.reply('successfully set your intro!');
    }
}

module.exports = silentintro;
