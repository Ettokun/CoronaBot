const { MessageEmbed } = require("discord.js");

const Command = require(`${process.cwd()}/base/Command.js`);

class actor extends Command {
  constructor(client) {
    super(client, {
      name: "actor",
      description:
        "Queries the Online Movie Database for information on an actor.",
      usage: "actor <actor-name>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const query = encodeURIComponent(args.join(" "));
    var res = await bot.apis.fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${
        bot.config.APIKeys.OMDB
      }&language=en-US&query=${query}&page=1&include_adult=false`
    );
    var body = await res.json();

    // console.log(res.body);
    if (!body.results || !body.results[0])
      return msg.reply("there are no actors that match that query!");
    const r = body.results[0];
    var knownFor = "";
    for (var i = 0; i < r.known_for.length; i++) {
      knownFor += `- ${r.known_for[i].title || r.known_for[i].name} (${
        r.known_for[i].media_type
      })\n`;
    }
    const actor = new MessageEmbed()
      .setTitle(r.name)
      .setThumbnail(
        `https://image.tmdb.org/t/p/w600_and_h900_bestv2${r.profile_path}`
      )
      .addField(`Known For`, knownFor)
      .setFooter(`Powered by OMDB`)
      .setColor(msg.guild.me.displayColor)
      .setTimestamp();
    return msg.channel.send({ embed: actor });
  }
}

module.exports = actor;
