const Command = require(`${process.cwd()}/base/Command.js`);

class wolfram extends Command {
  constructor(client) {
    super(client, {
      name: "wolfram",
      description: "Queries the WolframAlpha API for information.",
      usage: "wolfram <query>",
      aliases: ["wolf"],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const wolfram = require("wolfram").createClient(bot.config.APIKeys.Wolfram),
      { MessageEmbed } = require("discord.js");

    msg.channel.send("Loading...").then(m => {
      wolfram.query(args.join(" "), (err, result) => {
        if (err) console.log(err);
        // if (result) console.log(result);
        if (err || !result) return m.edit("No results.");
        var goodresults = result.reduce(function iter(r, a) {
          if (a === null) {
            return r;
          }
          if (Array.isArray(a)) {
            return a.reduce(iter, r);
          }
          if (typeof a === "object") {
            return Object.keys(a)
              .map(k => a[k])
              .reduce(iter, r);
          }
          return r.concat(a);
        }, []);

        const embed = new MessageEmbed()
          .setTitle("WolframAlpha API")
          .setColor(0x00ae86)
          .setThumbnail(
            "http://collegian.com/wp-content/uploads/2015/08/wolfram-alpha.png"
          )
          .setFooter(
            "Powered by Wolfram Alpha | Written by KhryptK",
            "http://collegian.com/wp-content/uploads/2015/08/wolfram-alpha.png"
          )
          .setTimestamp();
        if (goodresults[0] === undefined) {
          embed.setDescription(
            "Sorry, that input isn't in the WolframAlpha Database."
          );
        } else {
          // console.log(goodresults);
          embed.setURL(goodresults[3].toString());
          embed.addField(
            goodresults[0].toString(),
            goodresults[2].toString(),
            true
          );
          embed.addField(
            goodresults[5].toString(),
            goodresults[7].toString() || goodresults[8].toString(),
            true
          );
          try {
            embed.setImage(goodresults[8].toString());
          } catch (err) {}
        }

        return m.edit({ embed });
      });
    });
  }
}

module.exports = wolfram;
