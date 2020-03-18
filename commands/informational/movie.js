var { MessageEmbed } = require("discord.js");

const Command = require(`${process.cwd()}/base/Command.js`);

class movie extends Command {
  constructor(client) {
    super(client, {
      name: "movie",
      description: "Gives you information on a movie from IMDB.",
      usage: "movie <movie-name>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const opts = {
      apiKey: bot.config.APIKeys.IMDB
    };
    bot.apis.imdb
      .get({ name: args.join(" ") }, opts)
      .then(d => {
        if (!d) return msg.channel.send("No results were found!");
        var m = new MessageEmbed();
        if (d.type === "movie") {
          if (d.poster !== "N/A") {
            m.setThumbnail(d.poster);
          }

          m.setTitle(`${d.title} (${d.year})`)
            .setDescription("Movie Information")
            .setURL(d.imdburl)
            .setColor(msg.guild.me.displayColor)
            .addField("Director", d.director, true)
            .addField("Producer", d.production, true)
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
            .addField(
              "Release Date",
              new Date(d.released).toLocaleDateString("en-US"),
              true
            )
            .addField("Rated", d.rated, true)
            .addField("Genres", d.genres, true)
            .addField("Duration", d.runtime, true)
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
        } else {
          return null;
        }
      })
      .catch(console.log);
  }
}

module.exports = movie;
