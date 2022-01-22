import { Request, Response, NextFunction } from "express";
import { ObjectId, Document, Collection } from "mongodb";
import { collections } from "../services/database";

export class Recipe {
	constructor(
		public userId: Number,
		public title: String,
		public description: String,
		public time: String,
		public steps: Array<String>,
		public _id?: ObjectId,
	) {}
}

// Getting all recipes (GET)
const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
	// Get collection
	const collection = collections.recipes;
	if (collection === undefined) {
		return res.status(500).json({ message: "Internal collection initialization error" });
	}
	// Search for all recipes
	const recipes: Recipe[] = (await collection.find({}).toArray()) as Recipe[];
    // Return response
	return res.status(200).json({ recipes: recipes });
};

// Getting a single recipe by path (GET)
const getRecipe = async (req: Request, res: Response, next: NextFunction) => {
	// Get collection
	const collection = collections.recipes;
	if (!collection) {
		return res.status(500).json({ message: "Internal collection initialization error" });
	}
	// Search for id
	const search_res = await collection.findOne({_id: req.params.id});
	console.log(`Res: ${search_res}`);
	const recipe: Recipe = search_res as Recipe
	if (recipe === null) {
		return res.status(404).json({ message: `Could not find recipe with id ${req.body.id}` });
	}
	return res.status(200).json(recipe);
};

// Updating a recipe (PUT)
const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
    // Get the recipe from the request body
	const id = req.params.id;
	console.log(`Updating id ${id}`);
	const recipe: Recipe = {
		userId: req.body.userid as Number,
		title: req.body.title as String,
		description: req.body.description as String,
		time: req.body.time as String,
		steps: req.body.steps as String[]
	};
	const collection = collections.recipes;
	if (!collection) {
		return res.status(500).json({ message: "Internal collection initialization error" });
	}
    // Update the recipe
	if (await collection.updateOne({ _id: new ObjectId(id) }, { $set: recipe })) {
		return res.status(200).json({ message: `Successfully updated recipe with id ${id}` });
	} else {
		return res.status(304).json({ message: `Failed to updated recipe with id ${id}` });
	}

    // Unknown error
    return res.status(418).json({
        message: "Server has turned into a teapot"
    });
};

// Deleting a recipe (DELETE)
const deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    // Get the recipe id from req.params
	const id = req.params.id;
	const query = { _id: new ObjectId(id) };
	// Get collection
	const collection = collections.recipes;
	if (!collection) {
		return res.status(500).json({ message: "Internal collection initialization error" });
	}
    // Delete the recipe and respond
	const result = await collection.deleteOne(query);
	if (result && result.deletedCount > 0) {
		return res.status(202).json({ message: `Successfully removed recipe with id ${id}` });
	} else if (!result) {
		return res.status(400).json({ message: `Failed to remove recipe with id ${id}` });
	} else if (!result.deletedCount) {
		return res.status(404).json({ message: `recipe with id ${id} does not exist` });
	}

    // Unknown error
    return res.status(418).json({
        message: "Server has turned into a teapot"
    });
};

// Adding a recipe (POST)
const addRecipe = async (req: Request, res: Response, next: NextFunction) => {
    // Get the data from req.body
	const recipe: Recipe = {
		userId: req.body.userid as Number,
		title: req.body.title as String,
		description: req.body.description as String,
		time: req.body.time as String,
		steps: req.body.steps as String[]
	};
	// Get colleciton
	const collection = collections.recipes;
	if (!collection) {
		return res.status(500).json({ message: "Internal collection initialization error" });
	}
    // Add the recipe and return response
	if (await collection.insertOne(recipe)) {
		res.status(201).json({ message: `Recipe with id ${recipe._id} added` });
	} else {
		res.status(500).json({ message: "Failed to add recipe" });
	}
};

export default { getRecipes, getRecipe, updateRecipe, deleteRecipe, addRecipe };
