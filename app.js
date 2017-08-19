var fs = require('fs');
let yaml = require('js-yaml');
var mcauth = require("mcauth");

function parse(path, ymlpath) {
    let  yml = yaml.safeLoad(fs.readFileSync(ymlpath, 'utf8').toString());
    let json = JSON.parse(fs.readFileSync(path, 'utf8').toString());
    let list = Object.values(yml.users);
    json.forEach((o) => {
        let isThere = check(o.minecraft_username, list) != null;
        if (!isThere) {
            
            mcauth.getMojangProfile(o.minecraft_username, function(profile) {
                console.log(profile); 
            });
        }
    })
    //console.log(check("oriont", list));
    
}

function check(username, list) {
    return list.find(o => o.options.name == username);
}

parse(__dirname + "/test/ranks-latest.json", __dirname + "/test/permissions.yml");

