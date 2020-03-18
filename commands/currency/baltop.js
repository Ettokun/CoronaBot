const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class baltop extends Command {
  constructor(client) {
    super(client, {
      name: "baltop",
      description: "Check the balance leaderboard!",
      usage: "baltop",
      aliases: ["lb"],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    let topTwenty = await bot.database.users
      .orderBy(bot.database.r.desc("balance"))
      .limit(18);
    let lb = new MessageEmbed()
      .setTitle(bot.user.username + " Balance Leaderboard")
      .setColor(msg.guild.me.displayHexColor)
      .setFooter(msg.guild.name, msg.guild.iconURL());

    topTwenty.forEach(user => {
      lb.addField(
        bot.users.cache.get(user.id)
          ? bot.users.cache.get(user.id).username
          : "Uncached User",
        user.balance,
        true
      );
    });

    msg.channel.send({ embed: lb });
  }
}

module.exports = baltop;
