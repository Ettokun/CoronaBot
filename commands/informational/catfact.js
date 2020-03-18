const Command = require(`${process.cwd()}/base/Command.js`);

class catfact extends Command {
  constructor(client) {
    super(client, {
      name: "catfact",
      description: "Returns a random fact about cats.",
      usage: "catfact",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const { MessageEmbed } = require("discord.js");

    var res = await bot.apis.fetch(
      "http://www.animalplanet.com/xhr.php?action=get_facts&limit=500&page_id=37397&module_id=cfct-module-bdff02c2a38ff3c34ce90ffffce76104"
    );
    var body = await res.json();

    var num = Math.round(Math.random() * body.length);
    var e = new MessageEmbed()
      .setFooter("Powered by animalplanet.com")
      .setTimestamp()
      .setTitle("Cat Fact #" + num)
      .setColor(msg.guild.me.displayColor)
      .setDescription(body[num].description);

    msg.channel.send({ embed: e });
  }
}

module.exports = catfact;
