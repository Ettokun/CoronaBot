const Command = require(`${process.cwd()}/base/Command.js`);

class npm extends Command {
  constructor(client) {
    super(client, {
      name: "npm",
      description: "Pulls up information on a specified NPM package.",
      usage: "npm <package>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    var info = require("package-info"),
      { MessageEmbed } = require("discord.js");

    if (args.join(" ") == "" || args.join(" ") == null) {
      return msg.reply("please specify a package name!");
    }
    var pkg = await info(args.join(" "));
    msg.channel.send({
      embed: new MessageEmbed()
        .setAuthor(
          pkg.name,
          "https://authy.com/wp-content/uploads/npm-logo.png",
          `https://npmjs.com/package/${pkg.name}`
        )
        .setDescription(pkg.description)
        .setFooter("Powered by package-info")
        .setTimestamp()
        .setColor(msg.color)
        .addField("Author", pkg.author, true)
        .addField("Version", pkg.version, true)
        .addField("License", pkg.license || "None", true)
    });
  }
}

module.exports = npm;
