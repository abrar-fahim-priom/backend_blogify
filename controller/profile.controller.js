const { DEFAULT_PROFILE_AVATAR } = require("../consts");
const { ProfileService } = require("../services/profile.service");
const deleteImage = require("../util/deleteImage");
const getAuthUser = require("../util/getAuthUser");

/**
 * Get user profile by user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The user profile.
 */
const getUserProfile = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}

	const user = await ProfileService.getUserById(userId);

	res.status(200).json(user);
};

/**
 * Updates the user profile.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The updated user profile.
 * @throws {Error} If the user ID is missing, email or ID is being updated, or invalid fields are being updated.
 */
const updateUserProfile = async (req, res) => {
	const user = await getAuthUser(req);
	const { body } = req;

	if (!user?.id) {
		return res.status(400).json({ message: "User Not Found with Acccess Token" });
	}

	if (req?.file) {
		body.avatar = req?.file?.filename;
	}

	if (body?.email) {
		throw new Error("Email cannot be updated");
	}

	if (body?.id) {
		throw new Error("User ID cannot be updated");
	}

	// Only Allowed to update name, avatar, bio, and socials. Throw an error if any other field is updated
	const allowedFields = ["firstName", "avatar", "bio", "lastName", "favourites"];
	const fields = Object.keys(body);
	const isAllowed = fields.every((field) => allowedFields.includes(field));

	if (!isAllowed) {
		throw new Error("Invalid field(s) to update");
	}

	const response = await ProfileService.updateUserProfile(user, body);

	if (body.avatar && user?.avatar !== DEFAULT_PROFILE_AVATAR) {
		deleteImage(user?.avatar, "avatar");
	}

	res.status(200).json({
		message: "User profile updated successfully",
		user: response,
	});
};

/**
 * Uploads an avatar for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters object.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} req.file - The uploaded file object.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated user profile.
 */
const uploadAvatar = async (req, res) => {
	const user = await getAuthUser(req);
	const { file } = req;

	if (!user) {
		return res.status(400).json({ message: "User Not Found" });
	}

	if (!file) {
		return res.status(400).json({ message: "Avatar is required" });
	}

	const response = await ProfileService.updateUserProfile(user, { avatar: file.filename });

	res.status(200).json({
		message: "Avatar uploaded successfully",
		user: response,
	});
};

module.exports.ProfileController = {
	getUserProfile,
	updateUserProfile,
	uploadAvatar,
};
