const Command = require(`${process.cwd()}/base/Command.js`);

class fact extends Command {
  constructor(client) {
    super(client, {
      name: "fact",
      description: "Returns a random interesting fact.",
      usage: "fact",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var request = require("request");
    var xml2js = require("xml2js");
    var { MessageEmbed } = require("discord.js");

    request("http://www.fayd.org/api/fact.xml", (error, response, body) => {
      if (response.statusCode === 200) {
        xml2js.parseString(body, (err, result) => {
          if (err) throw err;
          try {
            var embed = new MessageEmbed()
              .setFooter("Powered by fayd.org")
              .setTimestamp()
              .setColor(msg.guild.me.displayColor)
              .setTitle("Fact of the Day")
              .setDescription(result.facts.fact[0]);
            msg.channel.send({ embed: embed });
          } catch (e) {
            msg.channel.send(
              "The API returned an unconventional response.\n" + e
            );
          }
        });
      }
    });
  }
}

module.exports = fact;
