const Command = require(`${process.cwd()}/base/Command.js`);

class stats extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      description: "View various statistics about the bot's functionality.",
      usage: "stats",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const os = require("os"),
      { MessageEmbed } = require("discord.js"),
      osu = require("os-utils");

    osu.cpuUsage(async v => {
      var vals = {},
        date = new Date(bot.uptime);

      vals.memory = Math.round((os.totalmem() - os.freemem()) / 1000000);
      vals.totalmem = Math.round(os.totalmem() / 1000000);
      vals.strDate =
        date.getUTCDate() -
        1 +
        "d " +
        date.getUTCHours() +
        "h " +
        date.getUTCMinutes() +
        "m " +
        date.getUTCSeconds() +
        "s";
      vals.owner = bot.users.cache.get(bot.config.Discord.ownerID);
      vals.guilds = bot.guilds.cache.size;
      vals.channels = bot.channels.cache.size;
      vals.users = bot.users.cache.size;


      var stats = new MessageEmbed()
        .setAuthor(bot.user.username + " Stats", bot.user.avatarURL())
        .setFooter("Powered by " + bot.user.username, bot.user.avatarURL())
        .setTimestamp()
        .setColor(msg.guild.me.displayColor)
        .addField(
          ":man_with_gua_pi_mao: Owner",
          vals.owner.username +
          "#" +
          vals.owner.discriminator +
          "\n(" +
          vals.owner.id +
          ")",
          true
        )
        .addField(
          ":book: Library",
          "discord.js (v" + require("discord.js").version + ")",
          true
        )
        .addField(":speaking_head: Servers", vals.guilds, true)
        .addField(":keyboard: Channels", vals.channels, true)
        .addField(":man: Users Served", vals.users, true)
        .addField(":clock1: Uptime", vals.strDate, true)
        .addField(
          ":floppy_disk: System RAM Usage",
          vals.memory + "MB / " + vals.totalmem + " MB",
          true
        )
        .addField(":desktop: System CPU Usage", v.toFixed(2) * 100 + "%", true)
        .addField(":map: Host", os.hostname() + " (" + os.type() + ")", true);

      msg.channel.send({ embed: stats });
    });
  }
}

module.exports = stats;
