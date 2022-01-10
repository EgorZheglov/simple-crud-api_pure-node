const axios = require('axios');
const server = require('../index');
const dotenv = require('dotenv');
dotenv.config();

describe('Test 3 scenarios from task', () => {
    const path = `http://localhost:${process.env.PORT}`;
    let id;

    beforeAll(async () => {
        server.listen(process.env.PORT);
    });
  
    afterAll(async () => {
        server.close();
    });   
  
    test('GET for empty array', async () => {
        const response = await axios.get(`${path}/person`);
        expect(response.data).toEqual([]);
    }); 

    test('POST to create new user', async () => {
        const response = await axios.post(`${path}/person`,
        {
            "name":"test",
            "age":1,
            "hobbies":"test"
        });

        id = response.data.id;

        expect(response.data.name).toEqual("test");
        expect(response.data.age).toEqual(1);
        expect(response.data.hobbies).toEqual("test");
    });

    test('PUT to update new user', async () => {
        const response = await axios.put(`${path}/person/${id}`,
        {
            "age":3,
        });

        expect(response.data.name).toEqual("test");
        expect(response.data.age).toEqual(3);
        expect(response.data.hobbies).toEqual("test");
    });

    test('DELETE created user', async () => {
        const response = await axios.delete(`${path}/person/${id}`);
        
        expect(response.status).toEqual(204);
    });
  });
  