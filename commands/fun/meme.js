const Command = require(`${process.cwd()}/base/Command.js`);

class meme extends Command {
  constructor(client) {
    super(client, {
      name: "meme",
      description: "Returns a Discord meme",
      usage: "meme",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var res = await bot.apis.fetch(
      "https://api.weeb.sh/images/random?type=discord_memes",
      {
        method: "GET",
        headers: {
          Authorization: "Wolke " + bot.config.APIKeys.WeebSh
        }
      }
    );
    var body = await res.json();

    msg.channel.send({
      embed: {
        image: {
          url: body.url
        },
        color: msg.guild.me.displayColor,
        footer: {
          text: "Powered by weeb.sh"
        },
        title: "Discord Meme",
        timestamp: new Date()
      }
    });
  }
}

module.exports = meme;
