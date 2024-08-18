const User = require("../model/UserModel");

module.exports = async (req) => {
	const { email } = req?.claims || {};
	try {
		const user = (await User.findOne({ email }))?.toObject();

		if (!user) {
			throw new Error("User not found with the Token");
		}

		const newUserObj = Object.assign({}, user);
		delete newUserObj.password;

		return newUserObj;
	} catch (e) {
		console.error(e);
		throw new Error("User not found", e.message);
	}
};
