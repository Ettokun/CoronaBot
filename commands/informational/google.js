const Command = require(`${process.cwd()}/base/Command.js`);

class google extends Command {
  constructor(client) {
    super(client, {
      name: "google",
      description: "Returns Google search results for a query.",
      usage: "google <query>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var { MessageEmbed } = require("discord.js");
    bot.apis.google.build(
      {
        q: args.join(" "),
        num: 1,
        safe: "active"
      },
      (err, response) => {
        console.log(err);
        console.log(response);
        if (err) {
          console.error(err);
          msg.channel.send("ERROR: Search failed");
          return;
        }
        if (response.totalResults === 0 || response.items === undefined) {
          msg.channel.send("No results.");
        } else if (response.items !== undefined) {
          console.log(response);
          var results = new MessageEmbed();
          var link = response.items[0].link;
          var title = response.items[0].title;
          var desc = response.items[0].snippet;
          results
            .setAuthor(
              "Google",
              "https://maxcdn.icons8.com/Share/icon/Logos/google_logo1600.png",
              "https://www.google.com/"
            )
            .setTitle(title)
            .setURL(link)
            .setDescription(desc + " [more](" + link + ")")
            .setTimestamp()
            .setColor(msg.guild.me.displayColor)
            .setFooter("Powered by " + bot.user.username, bot.user.avatarURL());
          msg.channel.send({ embed: results });
        }
      }
    );
  }
}

module.exports = google;
