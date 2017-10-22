// LICENSE : MIT
"use strict";
process.env.DEBUG = true;
require("./handler").create(require("./event.json"), {}, function cb(error, response) {
    if (error) {
        throw error;
    }
    console.log(response);
});