const Command = require(`${process.cwd()}/base/Command.js`);

class dog extends Command {
  constructor(client) {
    super(client, {
      name: "dog",
      description: "Grab a picture of a dog!",
      usage: "dog",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const { MessageEmbed } = require("discord.js");
    bot.apis.subredditPic("dogpics").then(url => {
      var puppy = new MessageEmbed()
        .setAuthor(
          "Random Dog Picture",
          "http://www.doomsteaddiner.net/blog/wp-content/uploads/2015/10/reddit-logo.png",
          url
        )
        .setImage(url)
        .setFooter("Pictures from /r/dogpics")
        .setColor(msg.guild.me.displayColor)
        .setTimestamp();
      msg.channel.send({ embed: puppy });
    });
  }
}

module.exports = dog;
