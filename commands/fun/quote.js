const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class quote extends Command {
  constructor(client) {
    super(client, {
      name: "quote",
      description: "Grabs a random quote from a famous person!",
      usage: "quote",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var res = await bot.apis.fetch(
      "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1",
      {
        method: "GET",
        headers: {
          "X-Mashape-Key": bot.config.APIKeys.Mashape,
          Accept: "application/json"
        }
      }
    );
    var body = await res.json();

    var embed = new MessageEmbed()
      .setFooter("Powered by Random Famous Quotes")
      .setTimestamp()
      .setColor(msg.guild.me.displayColor)
      .setTitle("Random Quote")
      .setDescription(body[0].quote + "\n*- " + body[0].author + "*");

    msg.channel.send({ embed: embed });
  }
}

module.exports = quote;
