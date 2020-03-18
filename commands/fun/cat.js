const Command = require(`${process.cwd()}/base/Command.js`);

class cat extends Command {
  constructor(client) {
    super(client, {
      name: "cat",
      description: "Pulls up a cute picture of a cat!",
      usage: "cat",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const { MessageEmbed } = require("discord.js");

    var res = await bot.apis.fetch("http://aws.random.cat/meow");
    var body = await res.json();

    var cat = new MessageEmbed()
      .setTitle("Random Cat")
      .setURL(body.file)
      .setImage(body.file)
      .setFooter("Powered by random.cat")
      .setColor(msg.guild.me.displayColor)
      .setTimestamp();
    msg.channel.send({ embed: cat });
  }
}

module.exports = cat;
