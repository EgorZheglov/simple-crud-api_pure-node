const http = require('http');
const uuid = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

let users = [];

const server = http.createServer(async (req, res) => {

    if (!req.url.startsWith('/person')) {
        res.writeHead(404);
        return res.end('error route');
    };

    if (req.url.startsWith('/person/')) {
        
        const personId = req.url.slice(8);

        if (!uuid.validate(personId)) {
            res.writeHead(400);
            return res.end('invalid id');;
        }

        if (!users.find(el => el.id === personId)) {
            res.writeHead(404);
            return res.end('user not found by id');
        }

        if (req.method === 'GET') {
            res.writeHead(200);

            let user = users.find((el) => el.id === personId)
            return res.end(JSON.stringify(user));
        } 

        if (req.method === 'DELETE') {
            users = users.filter(el => el.id !== personId);

            res.writeHead(204);
            return res.end();
        };

        if (req.method === 'PUT') {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk.toString();
            });
                    
            req.on('end', () => {
                data = JSON.parse(data);
                const newUser = updateUser(users.find((el) => el.id === personId), data);
                res.writeHead(200);
                return res.end(JSON.stringify(newUser));
            });
        };
    };

    if (req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify(users));
    } else {
        if (req.method === 'POST') {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk.toString();
            });
                    
            req.on('end', () => {
                data = JSON.parse(data);

                if(!checkValidity(data)){
                    res.writeHead(400);
                    return res.end('invalid user data');
                } else {
                    data.id = uuid.v4();


                    users.push(data);

                    res.writeHead(201);
                    return res.end(JSON.stringify(data));
                };
            });
        }
    }
});

console.log(`server is listening on port ${process.env.PORT}`)

function updateUser(oldUser, data) {
    Object.keys(data).forEach(key => oldUser[key] = data[key]);
    return oldUser;
};

const checkValidity = (data) => {
    if (!data.age || !data.hobbies || !data.name) {
        return false;
    } else {
        return true;
    }
}

module.exports = server;


