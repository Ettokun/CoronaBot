const Command = require(`${process.cwd()}/base/Command.js`);

class tvshow extends Command {
  constructor(client) {
    super(client, {
      name: "tvshow",
      description: "Displays various information about a TV show.",
      usage: "tvshow <query>",
      aliases: ["show", "tv"],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const { MessageEmbed } = require("discord.js");

    const opts = {
      apiKey: bot.config.APIKeys.IMDB
    };
    bot.apis.imdb
      .get({ name: args.join(" ") }, opts)
      .then(d => {
        if (!d) return msg.channel.send("No results were found!");
        var m = new MessageEmbed();
        if (d.type === "series") {
          if (d.poster !== "N/A") {
            m.setThumbnail(d.poster);
          }

          m.setTitle(`${d.title} (${d.year || d._year_data})`)
            .setDescription("Show Information")
            .setURL(d.imdburl)
            .setColor(msg.guild.me.displayColor)
            .addField(
              "Writer(s)",
              d.writer.split(", ").join("\n") || "None",
              true
            )
            .addField(
              "Featuring",
              d.actors.split(", ").join("\n") || "None",
              true
            )
            .addField("Seasons", d.totalseasons, true)
            .addField(
              "Release Date",
              new Date(d.released).toLocaleDateString("en-US"),
              true
            )
            .addField("Rated", d.rated, true)
            .addField("Genres", d.type, true)
            .addField("Type", d.runtime, true)
            .addField("Rating", d.rating + "/10", true)
            .addField("Votes", d.votes, true)
            .addField("Awards", d.awards || "None", true)
            .setFooter("Powered by IMDB")
            .setTimestamp();

          if (d.plot.length > 1024 && d.plot.length < 2000) {
            m.addField(
              "Description (1/2)",
              d.plot.substring(0, d.plot.indexOf(" ", 1010)) + "..."
            );
            m.addField(
              "Description (1/2)",
              "..." + d.plot.substring(d.plot.indexOf(" ", 1010) + 1, d.length)
            );
          } else {
            m.addField("Description", d.plot);
          }
          return msg.channel.send({ embed: m });
        }
        return msg.channel.send("No results were found!");
      })
      .catch(console.log);
  }
}

module.exports = tvshow;
