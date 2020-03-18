const Command = require(`${process.cwd()}/base/Command.js`);
const fs = require('fs');
const stringSimilarity = require('string-similarity');

class addcollege extends Command {
    constructor(client) {
        super(client, {
            name: 'addcollege',
            description: '',
            usage: 'addcollege <college>',
            aliases: [],
            permLevel: 2,
        });
    }

    async run(bot, msg, args, level) { // eslint-disable-line no-unused-vars
        let colleges = JSON.parse(fs.readFileSync('data/roles.json').toString());

        if (msg.flags && msg.flags[0] == "confirm") {
            colleges.push(args.join(" "));
            fs.writeFile('data/roles.json', JSON.stringify(colleges, null, "\t"), (err) => {
                if (err) throw err;
                msg.reply("successfully added " + args.join(" ") + " to the colleges database!");
            });
        } else {
            let college = args.join(" ");

            let found = -1;

            for (var i = 0; i < colleges.length; i++) {
                if (colleges[i].toLowerCase() == college.toLowerCase()) {
                    found = i;
                }
            }

            if (found < 1) {
                let matches = [stringSimilarity.findBestMatch(college, colleges).bestMatch.target]
                let similar = stringSimilarity.findBestMatch(college, colleges).ratings;
                for (var i = 0; i < similar.length; i++) {
                    if (similar[i] && similar[i].rating > 0.6 && matches.indexOf(similar[i].target) < 0) {
                        matches.push(similar[i].target);
                    }
                }
                return msg.reply("Similar colleges found: `" + matches.join(", ") + "`? If none of these match, run the command again with the `-confirm` flag to add it :)");
            } else {
                return msg.reply("Match found in database: " + colleges[found]);
            }
        }
    }
}

module.exports = addcollege;
