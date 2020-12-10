const encryptor = require("crypto");

const encrypt = (stringToEncrypt) => {
    return encryptor.createHash("sha256").update(stringToEncrypt).digest("hex");
}

module.exports = {
    encrypt
}