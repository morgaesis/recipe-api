import express from 'express';
import controller from '../controllers/recipe';
const router = express.Router();

// OpenAPI root
router.get('/', (req,res,next) => {
	console.log("Got request to root");
	return res.status(200).json({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Recipe API",
			description: "A simple CRUD backend in TypeScript API",
		},
		servers: [{ url: "http://localhost:7000/" }],
		components: {
			securitySchemes: {
				MasicAuth: {
					type: "http",
					scheme: "basic",
				},
			},
		},
		security: [{ BasicAuth: [] }],
		paths: {
			"/recipe": {
				get: {
					description: "Get all recipes",
					parameters: [],
					responses: {
						200: {
							description: "Successfully fetched all recipes",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: [{
											_id: {
												type: "mongoDB.ObjecId",
											},
											title: {
												type: "String",
											},
											description: {
												type: "String",
											},
											time: {
												type: "String",
											},
											steps: {
												type: "String[]",
											},
											userId: {
												type: "Number",
											},
										}],
									},
								}
							},
						},
						500: {
							description: "Error getting DB",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
					},
				},
				post: {
					description: "Create a new recipe",
					parameters: [
						{
							name: "title",
							description: "Title of the recipe",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "description",
							description: "Description of the recipe",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "time",
							description: "Time it takes to complete the recipe (string), possibly an interval",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "steps",
							description: "A list of steps (strings) to take to complete the recipe",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "userId",
							description: "userId of the submitting user; empty is anonymous",
							in: "query",
							required: true,
							allowEmptyValue: true,
						},
					],
					responses: {
						201: {
							description: "Successfully added recipe",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
						500: {
							description: "Error adding recipe",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
					},
				},
			},
			"/recipe/{id}": {
				get: {
					description: "Fetch the recipe with the given id",
					parameters: [
						{
							name: "id",
							description: "ID of the recipe",
							in: "path",
							required: true,
							allowEmptyValue: false,
						},
					],
					responses: {
						200: {
							description: "Successfully fetched recipe",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											_id: {
												type: "mongoDB.ObjecId",
											},
											title: {
												type: "String",
											},
											description: {
												type: "String",
											},
											time: {
												type: "String",
											},
											steps: {
												type: "String[]",
											},
											userId: {
												type: "Number",
											},
										},
									},
								}
							},
						},
						404: {
							description: "Recipe not found",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
						500: {
							description: "Error getting DB",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
					},
				},
				delete: {
					description: "Delete the recipe with the given id",
					parameters: [
						{
							name: "id",
							description: "ID of the recipe",
							in: "path",
							required: true,
							allowEmptyValue: false,
						},
					],
					responses: {
						202: {
							description: "Recipe successfully deleted",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
						400: {
							description: "Failed to delete recipe",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
						404: {
							description: "Recipe not found",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
					},
				},
				update: {
					description: "Update the recipe with the given id",
					parameters: [
						{
							name: "id",
							description: "ID of the recipe",
							in: "path",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "title",
							description: "Title of the recipe",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "description",
							description: "Description of the recipe",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "time",
							description: "Time it takes to complete the recipe (string), possibly an interval",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "steps",
							description: "A list of steps (strings) to take to complete the recipe",
							in: "query",
							required: true,
							allowEmptyValue: false,
						},
						{
							name: "userId",
							description: "userId of the submitting user; empty is anonymous",
							in: "query",
							required: true,
							allowEmptyValue: true,
						},
					],
					responses: {
						200: {
							description: "Recipe successfully updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
						304: {
							description: "Failed to update recipe",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
						500: {
							description: "Error getting DB",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											message: {
												type: "String",
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});
});
router.get('/recipe', controller.getRecipes);
router.get('/recipe/:id', controller.getRecipe);
router.put('/recipe/:id', controller.updateRecipe);
router.delete('/recipe/:id', controller.deleteRecipe);
router.post('/recipe', controller.addRecipe);

export = router;
