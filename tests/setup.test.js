require('./test-setup');

const request = require('supertest');
const app = require('../app');
const db = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config()

describe('POST /setup', () => {
    test('Checks if database is populated, makes API call to Noroff API, and populates empty database.', async () => {
        const count = await db.Item.count();
        if (count == 0) {
        const setup = await request(app).post('/setup');
        expect(setup.statusCode).toBe(200);
        expect(setup.body).toEqual({ result: 'Database populated'});
        } else {
            const setup = await request(app).post('/setup');
            expect(setup.statusCode).toBe(400);
            expect(setup.body).toEqual({ result: 'Database allready populated' }); 
        }
    });
});

describe('POST /signup', () => {
    test('registers a new user.', async () => {
        let newUser = {
            username: 'Johndoe',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@doe.com',
            password: 'johndoe'
        };

        const duplicateUsername = await db.User.findOne({ where: {username: newUser.username } })
        if (!duplicateUsername) {
            const signup = await request(app)
                .post('/signup')
                .send(newUser);

            expect(signup.statusCode).toBe(200);
            expect(signup.body).toEqual({ Successful: 'Account created succesfully'})
        } else {
            const signup = await request(app)
                .post('/signup')
                .send(newUser);

            expect(signup.statusCode).toBe(409);
            expect(signup.body).toEqual({ Conflict: 'Username allready in use, try another one'})
        }
    });
});

describe('POST /login', () => {
    test('logs in with previous testcreated user ', async () => {
        let Login = {
            username: 'Johndoe',
            password: 'johndoe'
        };

        const login = await request(app)
            .post('/login')
            .send(Login);
        expect(login.statusCode).toBe(200);
        expect(login.body).toHaveProperty('token');
    });
});

describe('POST /category', () => {
    
    beforeAll(async () => {
        let adminLogin = {
            username: 'Admin',
            password: 'P@ssword2023'
        };

        const login = await request(app)
            .post('/login')
            .send(adminLogin);
        expect(login.statusCode).toBe(200);
        expect(login.body).toHaveProperty('token');

        adminToken = login.body.token;
    })
    
    test('creates a new CAT_TEST, category', async () => {
        let categoryData = {
            categoryname: 'CAT_TEST'
        };

        const duplicateCategory = await db.Category.findOne({ where: { categoryname: categoryData.categoryname}})
        const response = await request(app)
            .post('/category')
            .send(categoryData)
            .set('Authorization', `Bearer ${adminToken}`); 
        if(!duplicateCategory) {
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ Successful: 'Category succesfully created and added to database' });
        } else {
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ message: 'A category with that name allready exists'})
        }
    });
});

describe('POST /item', () => {
    beforeAll(async () => {
        let adminLogin = {
            username: 'Admin',
            password: 'P@ssword2023'
        };

        const login = await request(app)
            .post('/login')
            .send(adminLogin);
        expect(login.statusCode).toBe(200);
        expect(login.body).toHaveProperty('token');

        adminToken = login.body.token;
    })

    test('creates a new item with CAT_TEST category + ITEM_TEST, name', async () => {
        const findCategoryId = await db.Category.findOne({ where: { categoryname: 'CAT_TEST' } })
        const categoryId = findCategoryId.id;

        let itemData = {
            CategoryId: categoryId,
            name: 'ITEM_TEST',
            price: 100,
            SKU: 'TEST123',
            Quantity: 25
        };

        const duplicateItemName = await db.Item.findOne({ where: { name: itemData.name}})
        const duplicateSKU = await db.Item.findOne({ where: { SKU: itemData.SKU}})
        const response = await request(app)
            .post('/item')
            .send(itemData)
            .set('Authorization', `Bearer ${adminToken}`);
        if(duplicateItemName) {
            expect(response.statusCode).toBe(409);
            expect(response.body).toEqual({ Conflict: 'An item with that name allready exists' });
        } else if(duplicateSKU) {
            expect(response.statusCode).toBe(409);
            expect(response.body).toEqual({ Conflict: 'An item with that SKU allready exists'})
        } else {
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ Succesful: "Item succesfully created and added to database"}) 
        }
    })
})

describe('POST /search', () => {
    test('search for items with "mart"', async () => {
        const itemName = 'mart';

        const response = await request(app)
            .post('/search')
            .send({ itemName })

        expect(response.statusCode).toBe(200);
        expect(response.body.searchResult).toHaveLength(3);
    })
})

describe('POST /search', () => {
    test('search for items named "Laptop"', async () => {
        const itemName = 'Laptop';

        const response = await request(app)
            .post('/search')
            .send({ itemName })

        expect(response.statusCode).toBe(200);
        expect(response.body.searchResult).toHaveLength(1);
    })
})

describe('GET /allcarts, PUT /item/:id, PUT /category/:id tests (3x admin endpoint as user)', () => {
    beforeAll(async () => {
        let userLogin = {
            username: 'Johndoe',
            password: 'johndoe'
        };

        const login = await request(app)
            .post('/login')
            .send(userLogin);
        expect(login.statusCode).toBe(200);
        expect(login.body).toHaveProperty('token');

        userToken = login.body.token;
    })
    test('GET /allcarts - admin route, user credentials', async () => {
        const response = await request(app)
            .get('/allcarts')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ "message": "Only admins can use this endpoint"})
    })
    test('PUT /item/:id - admin route, user credentials', async () => {
        let itemUpdate = {
            name: "SofaNew",
            price: 800,
            SKU: "FR123",
            Quantity: 2,
            CategoryId: 1
        }
        const response = await request(app)
            .put('/item/1')
            .send( itemUpdate )
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ "message": "Only admins can use this endpoint"})
    })
    test('PUT /category/:id - admin route, user credentials', async () => {
        let categoryUpdate = {
            categoryname: "FurnitureNew"
        }
        const response = await request(app)
            .put('/category/1')
            .send( categoryUpdate )
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ "message": "Only admins can use this endpoint"})
    })
})

describe('Delete CAT_TEST, ITEM_TEST, and johndoe user', () => {
    beforeAll(async () => {
        let adminLogin = {
            username: 'Admin',
            password: 'P@ssword2023'
        };

        const login = await request(app)
            .post('/login')
            .send(adminLogin);
        expect(login.statusCode).toBe(200);
        expect(login.body).toHaveProperty('token');

        adminToken = login.body.token;
    })
    test('DELETE /item/:id, ITEM_TEST', async () => {
        const findItem = await db.Item.findOne({ where: {name: 'ITEM_TEST'}})
        const response = await request(app)
            .delete(`/item/${findItem.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({Succesful: "Item successfully deleted"});
    })
    test('DELETE /category/:id - CAT_TEST', async () => {
        const findCategory = await db.Category.findOne({ where: {categoryname: 'CAT_TEST'}})
        const response = await request(app)
            .delete(`/category/${findCategory.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({result: "Category successfully deleted"});
    })
    test('Delete created user johndoe', async () => {
        const createdUser = await db.User.findOne({ where: { username: 'Johndoe'}})
        await db.User.destroy({ where: { id: createdUser.id}});
        const deletedUser = await db.User.findOne({ where: {id: createdUser.id}});
        expect(deletedUser).toBeNull();
    })
})

describe('POST /setup', () => {
    test('Checks if database is populated, makes API call to Noroff API, and populates empty database.', async () => {
        const count = await db.Item.count();
        if (count == 0) {
        const setup = await request(app).post('/setup');
        expect(setup.statusCode).toBe(200);
        expect(setup.body).toEqual({ result: 'Database populated'});
        } else {
            const setup = await request(app).post('/setup');
            expect(setup.statusCode).toBe(400);
            expect(setup.body).toEqual({ result: 'Database allready populated' }); 
        }
    });
});