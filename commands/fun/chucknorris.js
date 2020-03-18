const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class chucknorris extends Command {
  constructor(client) {
    super(client, {
      name: "chucknorris",
      description: "Grab a Chuck Norris joke!",
      usage: "chucknorris",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var res = await bot.apis.fetch("https://api.chucknorris.io/jokes/random");
    var body = await res.json();

    var e = new MessageEmbed()
      .setFooter("Powered by chucknorris.io")
      .setTimestamp()
      .setColor(msg.guild.me.displayColor)
      .setAuthor("Chuck Norris Joke", body.icon_url, body.url)
      .setDescription(body.value);

    msg.channel.send({ embed: e });
  }
}

module.exports = chucknorris;
