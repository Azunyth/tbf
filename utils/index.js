var formats = require('./dateFormat');
var fs = require('fs');

module.exports.shuffleArray = function(array) {
    var i = 0
    , j = 0
    , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array;
}

module.exports.getMatches = function (string, regex, index) {
    index = index === undefined ? 1 : index;
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

module.exports.getDateFormat = function(format, date) {
    var d = (date) ? new Date(date) : new Date();

    var dateFormat = format;
    for(var i = 0, len = formats.length; i < len; i++) {
        dateFormat = dateFormat.replace(formats[i].regex, d[formats[i].func]());
    }

    return dateFormat;
}

module.exports.log = function(msg) {
    var currentDate = this.getDateFormat("dd-mm-yyyy hh:ii:ss");
    var logDir = process.cwd() + "/log";
    var fileName = this.getDateFormat("dd-mm-yyyy") + ".txt";

    fs.access(logDir, (err) => {
        if(err) {
            fs.mkdirSync(logDir)
        }

        var trace = "["+currentDate+"] " + msg + "\n";

        fs.appendFile(process.cwd()+'/log/'+this.getDateFormat("dd-mm-yyyy")+".txt", trace, 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

}
