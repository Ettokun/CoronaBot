const Command = require(`${process.cwd()}/base/Command.js`);

class xkcd extends Command {
  constructor(client) {
    super(client, {
      name: "xkcd",
      description: "Pulls up the current XKCD comic, or a specified one.",
      usage: "xkcd <optional-num>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    let xkcd = require("xkcd"),
      { MessageEmbed } = require("discord.js");

    var num = args[0];
    if (!isNaN(num)) {
      xkcd(num, data => {
        try {
          msg.channel.send(
            new MessageEmbed()
              .setAuthor(
                "XKCD #" +
                  data.num +
                  ': "' +
                  data.title +
                  '" (' +
                  data.month +
                  "/" +
                  data.day +
                  "/" +
                  data.year +
                  ")",
                "https://cdn.shopify.com/s/files/1/0149/3544/products/hoodie_1_7f9223f9-6933-47c6-9af5-d06b8227774a_large.png?v=1479786341",
                "https://xkcd.com/" + data.num
              )
              .setImage(data.img)
              .setDescription(data.alt)
              .setFooter("Powered by XKCD")
              .setTimestamp()
              .setColor(msg.color)
          );
        } catch (err) {
          msg.channel.send(err.stack);
        }
      });
    } else {
      xkcd(data => {
        try {
          msg.channel.send(
            new MessageEmbed()
              .setAuthor(
                "XKCD #" +
                  data.num +
                  ': "' +
                  data.title +
                  '" (' +
                  data.month +
                  "/" +
                  data.day +
                  "/" +
                  data.year +
                  ")",
                "https://cdn.shopify.com/s/files/1/0149/3544/products/hoodie_1_7f9223f9-6933-47c6-9af5-d06b8227774a_large.png?v=1479786341",
                "https://xkcd.com/" + data.num
              )
              .setImage(data.img)
              .setDescription(data.alt)
              .setFooter("Powered by XKCD")
              .setTimestamp()
              .setColor(msg.color)
          );
        } catch (err) {
          msg.channel.send(err.stack);
        }
      });
    }
  }
}

module.exports = xkcd;
