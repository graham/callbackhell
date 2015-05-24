var Contract = require('./callbackhell.js').Contract;

var test1 = new Contract(function(c) {
    setTimeout(function() {
        c.resolve("hello world");
    }, 1000);
}, 5000);

test1.then(function(contract, data, err) {
    if (err) {
        console.log("Error: " + JSON.stringify(err));
    } else {
        console.log("Correct: " + JSON.stringify(data));
    }
});
