const Command = require(`${process.cwd()}/base/Command.js`);

class wikipedia extends Command {
  constructor(client) {
    super(client, {
      name: "wikipedia",
      description: "Look up a page on Wikipedia.",
      usage: "wikipedia",
      aliases: ["wiki"],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    const { MessageEmbed } = require("discord.js"),
      wiki = require("wikijs").default;
    msg.content = args.join(" ");
    msg.content = msg.content.replace(/ /g, "_");
    if (msg.content.toLowerCase().indexOf("discord") > -1) {
      msg.content = msg.content
        .toLowerCase()
        .replace("discord", "Discord_(software)");
    }
    wiki()
      .page(msg.content)
      .then(async function(page) {
        const info = await page.summary();
        const image = await page.mainImage();
        msg.channel.send({
          embed: new MessageEmbed()
            .setAuthor(
              "Wikipedia: " + page.raw.title,
              "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/220px-Wikipedia-logo-v2.svg.png",
              page.raw.fullurl
            )
            .setFooter("Powered by wikijs")
            .setDescription(
              info.substring(
                0,
                info.length > 2000 ? info.indexOf(". ", 1850) : info.length
              ) + `...\n\n**Read More -> ${page.raw.fullurl}**`
            )
            .setImage(image)
            .setTimestamp()
            .setColor(msg.color)
        });
      });
  }
}

module.exports = wikipedia;
