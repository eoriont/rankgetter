var fs = require('fs');
var yaml = require('js-yaml');
var mojang = require('mojang');
var request = require('request-promise');

async function parse(path, ymlpath) {
    let url = await request(path);
    let yml = yaml.safeLoad(fs.readFileSync(ymlpath, 'utf8').toString());
    let json = JSON.parse(url);
    let list = Object.values(yml.users);
    for (let j = 0; j < json.length; j++) {
        let o = json[j];
        let name = o.minecraft_username
        let isThere = check(name, list) != null;
        if (!isThere) {
            let i = await mojang.username(name)
            let uuid = i.id;
            yml.users[uuid] = {options: {name}, group: [o.rank, convertLocation(o.location)]};
        }
    }

    console.log(yaml.safeDump(yml));
    fs.writeFileSync(ymlpath, yaml.safeDump(yml));
}

function convertLocation(loc) {
    let newloc;

    if (loc == "mill-valley") {
        newloc = "MV"
    } else {
        newloc = "NONE";
    }

    return newloc;
}

function check(username, list) {
    return list.find(o => o.options.name == username);
}

let ranksLink = "https://www.mvcodeclub.com/students/ranks";
let permissionsFile = __dirname + "/../server/plugins/PermissionsEx/permissions.yml";
let permissionsFile2 = __dirname + "/../permissions/permissions.yml";
parse(ranksLink, permissionsFile);

