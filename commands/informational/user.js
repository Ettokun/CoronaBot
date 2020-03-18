const Command = require(`${process.cwd()}/base/Command.js`);

class user extends Command {
  constructor(client) {
    super(client, {
      name: "user",
      description: "Returns information on a specific user.",
      usage: "user <optional-mention>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const { MessageEmbed } = require("discord.js");
    let presences = {
      WATCHING: "Watching",
      PLAYING: "Playing",
      LISTENING: "Listening to",
      STREAMING: "Streaming"
    };

    var member = msg.member;
    if (msg.mentions.users.array()[0]) {
      member = msg.guild.members.cache.get(msg.mentions.users.array()[0].id);
    }
    var user = member.user;
    var roles = member.roles.cache.size;

    var info = new MessageEmbed()
      .setAuthor(user.username + "#" + user.discriminator, user.avatarURL())
      .setColor(member.displayHexColor)
      .setFooter("Triggered by " + msg.author.username, msg.author.avatarURL())
      .setTimestamp()
      .setThumbnail(user.avatarURL())
      .addField("Username", user.tag, true)
      .addField("Display Name", member.displayName, true)
      .addField("ID", user.id, true)
      .addField("Account Created", new Date(user.createdAt).toUTCString(), true)
      .addField("Join Date", new Date(member.joinedAt).toUTCString(), true)

    var description = "";

    if (user.id == msg.guild.ownerID) {
      console.log("owner");
      description += "<:owner:689496646618579031> **Server Owner**\n";
    } else if (member.premiumSince) {
      description += "<:booster:689500892550004751> **Server Booster**\n"
    } else if (user.bot) {
      description += "<:bot:689496646609797165> **Bot**\n";
    }

    if (user.presence.activities) {
      for (var i = 0; i < user.presence.activities.length; i++) {
        if (user.presence.activities[i].type == "CUSTOM_STATUS") {
          description += "**Custom Status:** " + user.presence.activities[i].state + "\n";
        } else if (user.presence.activities[i].type == "PLAYING") {
          if (user.presence.activities[i].details) {
            description += "**Playing** " + user.presence.activities[i].name + " (" + user.presence.activities[i].details + ")\n";
          } else {
            description += "**Playing** " + user.presence.activities[i].name;
          }
        } else if (user.presence.activities[i].type == "LISTENING") {
          description += "**Listening to** " + user.presence.activities[i].details + " by " + user.presence.activities[i].state + "\n";
        }
      }
    }

    info.setDescription(description);

    if (user.presence.status === "offline") {
      info.addField("Status", "<:offline:689496646576242750> Offline", true);
    } else if (user.presence.status === "idle") {
      info.addField("Status", "<:idle:689496646677299224> Idle", true);
    } else if (user.presence.status === "online") {
      info.addField("Status", "<:online:689496646542688415> Online", true);
    } else if (user.presence.status === "dnd") {
      info.addField("Status", "<:dnd:689496646354075702> Do Not Disturb", true);
    }

    if (member.roles.hoist) {
      var hoist = member.roles.hoist.name;
    } else {
      hoist = "None";
    }

    if (member.roles.color) {
      var colorR = member.roles.color.name;
    } else {
      colorR = "None";
    }
    info
      .addField("Roles", roles, true)
      .addField("Color", member.displayHexColor, true)
      .addField("Highest Role", member.roles.highest.name, true)
      .addField("Hoist Role", hoist, true)
      .addField("Color Role", colorR, true)
      .addField("Avatar Link", "[Here](" + user.avatarURL() + ")", true);

    msg.channel.send({ embed: info });
  }
}

module.exports = user;
