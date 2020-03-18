const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class country extends Command {
  constructor(client) {
    super(client, {
      name: "country",
      description: "Pull up information about a country",
      usage: "country <search-term>",
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args, level) {
    if (args.join(" ") == "" || args.join(" ") == null) {
      return msg.reply("please specify a country!");
    }
    if (
      args
        .join(" ")
        .trim()
        .toLowerCase() === "north dumpling island"
    ) {
      msg.channel.send(
        "All hail our glorious leader, Dean Kamen!\nhttp://3.bp.blogspot.com/-SUNDyBLeen0/UA1gikP_2AI/AAAAAAAAEDs/32CU65woD-A/s1600/Dean_Kamen_FIRST.png"
      );
    } else {
      var res = await bot.apis.fetch(
        "https://restcountries.eu/rest/v2/name/" + args.join(" ")
      );
      var body = await res.json();
      if (!res) return msg.channel.send("Country not found.");
      for (var i = 0; i < body.length; i++) {
        var capital = body[i].capital || "N/A";
        var country = new MessageEmbed()
          .setTitle(body[i].name)
          .setDescription("Country Information")
          .addField("Capital", capital, true)
          .addField("Region", body[i].region, true)
          .addField("Population", body[i].population, true)
          .addField("Area", body[i].area + " Square Kilometers", true)
          .addField("Native Name", body[i].nativeName, true)
          .addField("Alternate Names", body[i].altSpellings.join(", "), true)
          .addField("Demonym", body[i].demonym, true)
          .setFooter(
            "Triggered by " + msg.author.username,
            msg.author.avatarURL
          )
          .setColor(msg.guild.me.displayColor)
          .setTimestamp();
        msg.channel.send({ embed: country });
      }
    }
    return null;
  }
}

module.exports = country;
