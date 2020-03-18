const Command = require(`${process.cwd()}/base/Command.js`);

class unmute extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Unmutes user(s) with specified reasons.",
      usage: "unmute <users> <reason>",
      aliases: [],
      permLevel: 2
    });
  }

  async run(bot, msg, args, level) {
    var { MessageEmbed } = require("discord.js");
    var mutee = msg.mentions.users.array();

    for (var k = 0; k < mutee.length; k++) {
      var reason = args.splice(mutee.length).join(" ");
      var user = bot.users.cache.get(mutee[k].id);
      var guild = msg.guild;
      var member = msg.guild.members.cache.get(mutee[k].id);

      if (member.hasPermission("ADMINISTRATOR")) {
        return msg.channel.send("I can't unmute " + user + "!");
      }

      await member.roles.remove("689688059872018518");

      msg.reply("<@" + member + "> has been unmuted.");

      var mute = new MessageEmbed()
        .setColor(0xffb200)
        .setAuthor(user.username, user.avatarURL())
        .addField(
          "Member Unuted",
          `**${user.username}#${user.discriminator} (${user.id}) was unmuted.**`
        )
        .addField("Responsible Moderator", msg.member.displayName)
        .addField("Reason", reason || "Not Specified")
        .setFooter(`${guild.name}`, `${guild.iconURL()}`)
        .setTimestamp();
      try {
        msg.guild.channels.cache.find(channel => channel.name === "mod-logs").send({ embed: mute });
      } catch (e) {
        msg.channel.send({ embed: mute });
      }
    }
  }
}

module.exports = unmute;
