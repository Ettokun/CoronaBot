const { MessageEmbed } = require("discord.js");

const Command = require(`${process.cwd()}/base/Command.js`);

class advice extends Command {
  constructor(client) {
    super(client, {
      name: "advice",
      description: "Pulls up an advice slip.",
      usage: "advice",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var res = await bot.apis.fetch("http://api.adviceslip.com/advice");
    var body = await res.json();

    var e = new MessageEmbed()
      .setFooter("Powered by adviceslip.com")
      .setTimestamp()
      .setColor(msg.guild.me.displayColor)
      .setTitle("Advice Slip #" + body.slip.slip_id)
      .setDescription(body.slip.advice)
      .setThumbnail(
        "https://www.horoscope.com/images-US/games/game-fortune-cookie-1.png"
      );

    msg.channel.send({ embed: e });
  }
}

module.exports = advice;
