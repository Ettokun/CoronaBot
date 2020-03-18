const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require('discord.js');

class corona extends Command {
    constructor(client) {
        super(client, {
            name: 'corona',
            description: 'Check statistics on COVID-19 from around the world',
            usage: 'corona',
            aliases: ["covid19", "voronavirus"],
            permLevel: 1,
        });
    }

    async run(bot, msg, args, level) { // eslint-disable-line no-unused-vars
        let res = await bot.apis.fetch("https://coronavirus-tracker-api.herokuapp.com/v2/locations");
        let body = (await res.json()).locations;
        let location = args.join(" ").toLowerCase();
        let prettyLocation = "";
        let cases = 0, deaths = 0, recovered = 0;

        if (msg.flags && msg.flags.indexOf("state") > -1) {
            for (var i = 0; i < body.length; i++) {
                if (body[i].province.toLowerCase() == location) {
                    prettyLocation = body[i].province + ", " + body[i].country;
                    cases = body[i].latest.confirmed;
                    deaths = body[i].latest.deaths;
                    recovered = body[i].latest.recovered;
                }
            }
        } else if (location == "united states" || location == "us" || location == "usa") {
            prettyLocation = "United States";
            for (var i = 0; i < body.length; i++) {
                if (body[i].country.toLowerCase() == "us" && body[i].province.indexOf(", ") < 0) {
                    cases += body[i].latest.confirmed;
                    deaths += body[i].latest.deaths;
                    recovered += body[i].latest.recovered;
                }
            }
        } else if (location == "china") {
            prettyLocation = "China";
            for (var i = 0; i < body.length; i++) {
                if (body[i].country.toLowerCase() == "china" && body[i].province.indexOf(", ") < 0) {
                    cases += body[i].latest.confirmed;
                    deaths += body[i].latest.deaths;
                    recovered += body[i].latest.recovered;
                }
            }
        } else if (location == "england" || location == "uk" || location == "united kingdom" || location == "great britain") {
            prettyLocation = "United Kingdom";
            for (var i = 0; i < body.length; i++) {
                if (body[i].country.toLowerCase() == "united kingdom" && body[i].province.indexOf(", ") < 0) {
                    cases += body[i].latest.confirmed;
                    deaths += body[i].latest.deaths;
                    recovered += body[i].latest.recovered;
                }
            }
        } else if (location == "france") {
            prettyLocation = "France";
            for (var i = 0; i < body.length; i++) {
                if (body[i].country.toLowerCase() == "france" && body[i].province.indexOf(", ") < 0) {
                    cases += body[i].latest.confirmed;
                    deaths += body[i].latest.deaths;
                    recovered += body[i].latest.recovered;
                }
            }
        } else {
            for (var i = 0; i < body.length; i++) {
                if ((body[i].country.toLowerCase() == location || body[i].country_code.toLowerCase() == location) && body[i].province == "") {
                    prettyLocation = body[i].country;
                    cases = body[i].latest.confirmed;
                    deaths = body[i].latest.deaths;
                    recovered = body[i].latest.recovered;
                }
            }
        }

        if (prettyLocation == "") return msg.reply("location not found! If you are trying to look up a state or province try including the `-state` option!");

        var embed = new MessageEmbed()
            .setFooter("Powered by coronavirus-tracker-api", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
            .setTimestamp()
            .setColor(msg.guild.me.displayColor)
            .setTitle("COVID-19 Statistics for " + prettyLocation)
            .addField("Confirmed Cases", cases, true)
            .addField("Deaths", deaths, true)
            .addField("Recovered", recovered, true);

        msg.channel.send({ embed: embed });
    }
}

module.exports = corona;
