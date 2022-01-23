# recipe-api
A backend API for recipe creation, fetching, and modification

Set your preferred port in `.env` along with username and password to your MongoDB database.

## Features
Features not yet implemented are marked as unfinished. Some type annotations are missing for MongoDB return values. Documentation on their exact type was lacking. No tests are present, but a fake test is in the GitHub workflow, where the implemented tests would be performed. Searching will come at another time, once I've read more on the MongoDB query syntax.

- [x] CRUD API for recipes
- [x] OpenAPI at root of API
- [x] Enable Docker build (Containerfile)
- [x] CI build
- [ ] CI test
- [ ] CI publish
- [ ] Test API
- [ ] Recipe search
- [ ] All variables type annotated

### API

- `GET /`: OpenAPI description of the API
- `GET /recipe`: Fetch all recipes
- `POST /recipe`: Create a new recipe
- `GET /recipe/{id}`: Fetch recipe with given id
- `PUT /recipe/{id}`: Update recipe with given id
- `DELETE /recipe/{id}`: Delete recipe with given id

## Building/running
The following needs to be defined in your `.env`:
- `PORT`: The port the API listens to, e.g. 8080
- `DB_CONN_STRING`: Database URL -> `mongodb://<database-username>:<database-password>@127.0.0.1`

### Development
Ensure you have `npm` installed, then run:
```shell
npm run dev
```
Now you can develop, and the API server should restart automatically.

### Production
With `npm`:
```shell
npm run build
npm run prod
```

With Docker/Podman (I use podman):
```shell
podman build . -t recipe-api
podman pod create --name recipe-pod -p 7000:7000
podman create --pod recipe-pod --name mongo --env-file .env mongo:latest
podman create --pod recipe-pod --name recipe-api --env-file .env recipe-api:latest
podman pod start recipe-pod
```

Now you can connect on `localhost:7000`
