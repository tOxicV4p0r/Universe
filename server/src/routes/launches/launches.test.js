const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisConnect } = require('../../services/mongo');
const { loadPlanetData } = require('../../models/planets.model')

describe('Launch Test', () => {
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetData();
    })

    afterAll(async () => {
        await mongoDisConnect();
    });

    // group test
    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const res = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);

            // expect(res.statusCode).toBe(200);
        })
    })

    describe('Test POST /launches', () => {
        const launchDataWithOutDate = {
            mission: "BK156",
            rocket: "Aspace IS3",
            target: "Kepler-442 b",
        };

        const launchDataComplete = {
            ...launchDataWithOutDate,
            launchDate: "January 17, 2030",
        };

        const launchDataWithInvalidDate = {
            ...launchDataWithOutDate,
            launchDate: "helloworld",
        }

        test('It should respond with 201 created and return value', async () => {
            const res = await request(app)
                .post('/v1/launches')
                .send(launchDataComplete)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(res.body).toMatchObject(launchDataWithOutDate);
            // handle date
            const reqDate = new Date(launchDataComplete.launchDate).valueOf();
            const resDate = new Date(res.body.launchDate).valueOf();
            expect(resDate).toBe(reqDate);
        })

        test('should catch missing required properties', async () => {
            const res = await request(app)
                .post('/v1/launches')
                .send(launchDataWithOutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(res.body).toStrictEqual({
                error: 'Missing required launch property'
            })
        })

        test('should catch invalid dates', async () => {
            const res = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(res.body).toStrictEqual({
                error: 'Invalid launch date'
            })
        })


    })

});