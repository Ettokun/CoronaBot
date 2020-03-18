const Command = require(`${process.cwd()}/base/Command.js`);
const moment = require("moment");

class profile extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      description: "Pull up your own, or someone else's profile!",
      usage: "profile <optional-mention>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    let { MessageEmbed } = require("discord.js");
    let user;
    let discorduser;
    let discordmember;
    let intro;
    let college;

    if (!msg.mentions.users.first()) {
      user = await bot.database.users.get(msg.author.id);
      discorduser = msg.author;
      discordmember = msg.member;
    } else {
      user = await bot.database.users.get(msg.mentions.users.first().id);
      discorduser = msg.mentions.users.first();
      discordmember = msg.mentions.members.first();
    }

    if (!user || !user.intro) intro = null;
    else intro = user.intro;

    if (user && user.college) college = user.college;
    else college = "Not Set";

    let roles = discordmember.roles.cache.filter((words) => {
      if (words.name != "@everyone") return words
    });

    let embed = new MessageEmbed()
    if (intro) {
      embed.setDescription(intro);
    }
    embed.setAuthor(
      "Profile: " + discorduser.tag,
      discorduser.avatarURL()
    )
      .setColor(
        discordmember.displayHexColor == "#000000"
          ? null
          : discordmember.displayHexColor
      )

    if (discordmember.roles.cache.has("688171216020045878")) {
      embed.addField("Pronouns", "she/her", true);
    } else if (discordmember.roles.cache.has("688171155655360521")) {
      embed.addField("Pronouns", "he/him", true);
    } else if (discordmember.roles.cache.has("688171238254051348")) {
      embed.addField("Pronouns", "they/them", true);
    }

    if (discordmember.roles.cache.has("688171054904246305")) {
      embed.addField("Year", "Senior", true);
    } else if (discordmember.roles.cache.has("688171092946321432")) {
      embed.addField("Year", "Junior", true);
    } else if (discordmember.roles.cache.has("688171113485828207")) {
      embed.addField("Year", "Sophomore", true);
    } else if (discordmember.roles.cache.has("688171133207576661")) {
      embed.addField("Year", "Freshman", true);
    } else if (discordmember.roles.cache.has("689309296160538671")) {
      embed.addField("Year", "High Schooler", true);
    }

    embed.addField("College", college, true)
      .addField("Roles: ", roles.array().join(" ") || "None")
      .addField("Joined: ", moment(discordmember.joinedAt).fromNow(), true)
      .setThumbnail(discorduser.avatarURL())
      .setTimestamp()
      .setFooter(msg.guild.name, msg.guild.iconURL());

    msg.channel.send({ embed: embed });
  }
}

module.exports = profile;
