# recipe-api
A backend API for recipe creation, fetching, and modification

Set your preferred port in `.env` along with username and password to your MongoDB database.

## Features
Implemented features are marked done, the rest is TBD. With only limited time, the missing features will not be complete before the next code review.

- [x] CRUD API for recipes
- [x] OpenAPI at root of API
- [x] Enable Docker build (Containerfile)
- [x] CI build
- [x] CI test (simulated)
- [ ] CI publish
- [ ] Test API
- [x] Recipe search
- [x] All variables type annotated

### Known limitations
These are currently knows limitations, which should be fixed before actual use.

- [ ] No tests: I need to read up on testing frameworks in TypeScript; a fake test is part of the GitHub CI Workflow.
- [ ] Searching: Only works if database has been set up with text indices for all fields, except `_id`

### API

- `GET /`: OpenAPI description of the API
- `GET /recipes`: Fetch all recipes
- `GET /recipes?text={term}`: Fetch recipes containing `term`
- `POST /recipe`: Create a new recipe
- `GET /recipe/{id}`: Fetch recipe with given id
- `PUT /recipe/{id}`: Update recipe with given id
- `DELETE /recipe/{id}`: Delete recipe with given id

## Building/running
The following needs to be defined in your `.env`:
- `PORT`: The port the API listens to, e.g. 8080
- `DB_CONN_STRING`: Database URL -> `mongodb://<database-username>:<database-password>@127.0.0.1`
- `RECIPES_COLLECTION_NAME`: Name of the recipe collection, e.g. `my-recipes`

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
