const Blog = require("../model/BlogModel");
const User = require("../model/UserModel");

/**
 * Retrieves a user by their ID and returns their profile information along with their blogs.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Object} - The user's profile information and blogs.
 * @throws {Error} - If the user is not found.
 */
const getUserById = async (userId) => {
	const data = (await User.findById(userId).populate("favourites"))?.toObject();

	if (!data) {
		throw new Error("User not found");
	}

	// get users blogs
	const blogs = (await Blog.find({ "author.id": userId })).map((blog) => blog.toObject());

	const userObj = Object.assign({}, data);
	delete userObj.password;

	return {
		...userObj,
		blogs,
	};
};

/**
 * Updates the user profile with the given userId and body.
 * @param {string} userId - The ID of the user.
 * @param {object} body - The updated profile data.
 * @returns {object} - The updated user profile.
 * @throws {Error} - If the user is not found.
 */
const updateUserProfile = async (user, body) => {
	const data = (await User.findByIdAndUpdate(user.id, body, { new: true }))?.toObject();

	if (!data) {
		throw new Error("User not found");
	}

	const userObj = Object.assign({}, data);
	delete userObj.password;

	return userObj;
};

module.exports.ProfileService = { getUserById, updateUserProfile };
