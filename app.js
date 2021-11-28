const server = require("./index");
const dotenv = require('dotenv');
dotenv.config();

server.listen(process.env.PORT);