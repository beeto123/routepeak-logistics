const { randomUUID } = require("crypto");

module.exports = () => {

    const code = randomUUID()
        .replace(/-/g, "")
        .substring(0, 10)
        .toUpperCase();

    return `RPL${code}US`;

};