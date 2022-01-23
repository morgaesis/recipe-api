import { Request, Response, NextFunction } from "express";
import { ObjectId, Document, Collection, DeleteResult } from "mongodb";
import { collections } from "../services/database";

export class Recipe {
	constructor(
		public userId: number,
		public title: string,
		public description: string,
		public time: string,
		public steps: Array<string>,
		public _id?: ObjectId,
	) {}
}


// Getting all recipes (GET)
const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
	// Search for all recipes
	try {
		const recipes: Recipe[] = (await collections.recipes?.find({}).toArray()) as Recipe[];
		// Return response
		return res.status(200).json({ recipes: recipes });
	} catch(error: unknown) {
		console.log(`Error fetching all recipes: ${error}`);
	}
	return res.status(500).json({ message: "Internal database error" });
};

// Search for recipes by search term (GET)
const getRecipeText = async (req: Request, res: Response, next: NextFunction) => {
	// Search by text
	const text: string = req?.query?.text as string;
	if (text) {
		console.log(`Searching by text "${text}"`);
		try {
			const recipe: Recipe[] = (await collections.recipes?.find({ $text: { $search: text } }).toArray()) as Recipe[];
			if (recipe) {
				return res.status(200).json(recipe);
			}
			return res.status(404).json({ message: "No recipes found" });
		} catch(error: unknown) {
			console.log(`Error searching for text: ${error}`);
		}
		return res.status(500).json({ message: "Database index type error" });
	}
	return res.status(400).json({ message: "You must specify a search term with ?text={term}" });
};


// Getting a single recipe by path (GET)
const getRecipe = async (req: Request, res: Response, next: NextFunction) => {
	// Search for id
	const id: string = req?.params?.id;
	try {
		const recipe: Recipe = await collections.recipes?.findOne({ _id: new ObjectId(id) }) as Recipe
		if (recipe === null) {
			return res.status(404).json({ message: `Could not find recipe with id ${id}` });
		}
		return res.status(200).json(recipe);
	} catch(error: unknown) {
		console.log(`Error searching for ID: ${error}`);
	}
	return res.status(500).json({ message: "Invalid ID" });
};

// Updating a recipe (PUT)
const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
    // Get the recipe from the request body
	const id: string = req?.params?.id;
	console.log(`Updating id ${id}`);
	const recipe: Recipe = {
		userId: req?.body?.userid as number,
		title: req?.body?.title as string,
		description: req?.body?.description as string,
		time: req?.body?.time as string,
		steps: req?.body?.steps as string[]
	};
    // Update the recipe
	try {
		if (await collections.recipes?.updateOne({ _id: new ObjectId(id) }, { $set: recipe })) {
			return res.status(200).json({ message: `Successfully updated recipe with id ${id}` });
		} else {
			return res.status(304).json({ message: `Failed to updated recipe with id ${id}` });
		}
	} catch(error: unknown) {
		console.log(`Error updating: ${error}`);
	}

    // Unknown error
    return res.status(500).json({
        message: "Internal server error"
    });
};

// Deleting a recipe (DELETE)
const deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    // Get the recipe id from req.params
	const id: string = req?.params?.id;
	const query: object = { _id: new ObjectId(id) };
    // Delete the recipe and respond
	try {
		const result: DeleteResult|undefined = await collections.recipes?.deleteOne(query);
		if (result && result.deletedCount > 0) {
			return res.status(202).json({ message: `Successfully removed recipe with id ${id}` });
		} else if (!result) {
			return res.status(400).json({ message: `Failed to remove recipe with id ${id}` });
		} else if (!result.deletedCount) {
			return res.status(404).json({ message: `recipe with id ${id} does not exist` });
		}
	} catch(error: unknown) {
		console.log(`Error deleting: ${error}`);
	}

    // Unknown error
    return res.status(500).json({
        message: "Internal server error"
    });
};

// Adding a recipe (POST)
const addRecipe = async (req: Request, res: Response, next: NextFunction) => {
    // Get the data from req.body
	const recipe: Recipe = {
		userId: req?.body?.userid as number,
		title: req?.body?.title as string,
		description: req?.body?.description as string,
		time: req?.body?.time as string,
		steps: req?.body?.steps as string[]
	};
    // Add the recipe and return response
	try {
		if (await collections.recipes?.insertOne(recipe)) {
			return res.status(201).json({ message: `Recipe with id ${recipe._id} added` });
		} else {
			return res.status(500).json({ message: "Failed to add recipe" });
		}
	} catch(error: unknown) {
		console.log(`Error adding recipe: ${error}`);
	}
	return res.status(500).json({ message: "Invalid recipe" });
};

export default { getRecipes, getRecipe, getRecipeText, updateRecipe, deleteRecipe, addRecipe };
