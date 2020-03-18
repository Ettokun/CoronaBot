const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class dogfact extends Command {
  constructor(client) {
    super(client, {
      name: "dogfact",
      description: "Grabs a dog fact!",
      usage: "dogfact",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var res = await bot.apis.fetch("https://dog-api.kinduff.com/api/facts");
    var body = await res.json();
    var e = new MessageEmbed()
      .setFooter("Powered by kinduff.com")
      .setTimestamp()
      .setTitle("Dog Fact")
      .setColor(msg.guild.me.displayColor)
      .setDescription(body.facts[0]);

    msg.channel.send({ embed: e });
  }
}

module.exports = dogfact;
