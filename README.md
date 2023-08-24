# NestJS Test Response
## by Salik Sadruddin Merani

### Versions
**NodeJS:** 18<br>
**NestJS:** 10

### Steps to run
1. run `npm i`
2. copy `mikro-orm.config.ts.example` in `/src` directory to `mikro-orm.config.ts` and make the required changes to connect to your database.
3. run `npm run mikro-orm -- migration:up` to generate the tables
4. run `npm run mikro-orm -- seeder:run` to seed the database. The seeder has API key for Movie API hard coded for ease.
5. run `npm run start` to start the server. App is hosted on port `3000`
6. import the `insomnia.collection.json` file in Insomnia Rest Client to execute requests.

### Implementation
All the implementations are avialable via Swagger/OpenAPI document hosted at: <http://localhost:3000/doc>

