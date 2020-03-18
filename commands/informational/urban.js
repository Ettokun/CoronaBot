const Command = require(`${process.cwd()}/base/Command.js`);

class urban extends Command {
  constructor(client) {
    super(client, {
      name: "urban",
      description: "Look up a word on the Urban Dictionary.",
      usage: "urban <word>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    if (!msg.channel.nsfw) {
      msg.channel.send(
        "Sorry, but this command can only be run in NSFW-marked channels."
      );
      return;
    }

    var definition = bot.apis.urban(args.join(" "));
    try {
      definition.first(def => {
        if (def !== undefined) {
          const { MessageEmbed } = require("discord.js");
          const embed = new MessageEmbed()
            .setTitle(def.word)
            .setColor(0x1675db)
            .setDescription("Urban Dictionary")
            .setFooter(
              "Triggered by " + msg.author.username,
              msg.author.avatarURL
            )
            .setThumbnail(
              "https://lh5.googleusercontent.com/-rY97dP0iEo0/AAAAAAAAAAI/AAAAAAAAAGA/xm1HYqJXdMw/s0-c-k-no-ns/photo.jpg"
            )
            .setTimestamp()
            .addField("Definition", def.definition, false)
            .addField("Example", def.example, false)
            .addField(
              "Other Information",
              def.thumbs_up +
                " :thumbsup: | " +
                def.thumbs_down +
                " :thumbsdown: \nAuthor: " +
                def.author,
              false
            );
          msg.channel.send({ embed: embed });
        } else {
          msg.channel.send("Could not find word.");
        }
      });
    } catch (err) {
      msg.channel.send("An error occurred.");
    }
  }
}

module.exports = urban;
