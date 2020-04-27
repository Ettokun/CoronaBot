const Command = require(`${process.cwd()}/base/Command.js`);

class take extends Command {
  constructor(client) {
    super(client, {
      name: "take",
      description: "take <mentions> <role-names>",
      usage: "take",
      aliases: [],
      permLevel: 2
    });
  }

  async run(bot, msg, args, level) {
    if (!msg.guild.me.hasPermission("MANAGE_ROLES")) {
      return msg.channel.send(
        ":x: I can't assign or deassign roles in this server!"
      );
    }

    var users = msg.mentions.users.array(),
      roles = args
        .splice(msg.mentions.users.size)
        .join(" ")
        .trim()
        .split(",");

    for (var r = 0; r < roles.length; r++) {
      let role = msg.guild.roles.cache.find(role => role.name == roles[r].trim());

      if (!role) {
        msg.channel.send(":x: Role `" + roles[r] + "` does not exist!");
      } else if (
        msg.guild.members.cache
          .get(bot.user.id)
          .roles.highest.comparePositionTo(role) < 1
      ) {
        msg.channel.send(
          ":x: I don't have permissions to edit the role `" +
          roles[r] +
          "`, please check the role order!"
        );
      } else if (msg.member.roles.highest.comparePositionTo(role) < 1) {
        msg.channel.send(
          ":x: Your highest role is lower than the role `" +
          roles[r] +
          "`, so you cannot remove it!"
        );
      } else {
        for (var i = 0; i < users.length; i++) {
          msg.guild.members.cache
            .get(users[i].id)
            .roles.remove(role)
            .then(m => {
              msg.channel.send(
                "Removed role `" +
                role.name +
                "` from " +
                m.user.username +
                "."
              );
            });
        }
      }
    }
  }
}

module.exports = take;
