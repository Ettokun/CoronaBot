const Command = require(`${process.cwd()}/base/Command.js`);
var hugs = require("../../data/hugs.json");

class hug extends Command {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Sends some love to someone if they need it!",
      usage: "hug <optional-mention>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var min = 0,
      max = hugs.length - 1,
      user = null;
    if (msg.mentions.users.array()[0]) user = msg.mentions.users.array()[0];
    else user = msg.author;

    var res = await bot.apis.fetch(
      "https://api.weeb.sh/images/random?filetype=gif&type=hug",
      {
        method: "GET",
        headers: {
          Authorization: "Wolke " + bot.config.APIKeys.WeebSh
        }
      }
    );
    var body = await res.json();

    msg.channel.send(
      "<@" +
        user +
        ">, " +
        hugs[Math.floor(Math.random() * (max - min + 1)) + min],
      {
        embed: {
          image: {
            url: body.url
          },
          color: msg.guild.me.displayColor,
          footer: {
            text: "Powered by weeb.sh"
          },
          timestamp: new Date()
        }
      }
    );
  }
}

module.exports = hug;
