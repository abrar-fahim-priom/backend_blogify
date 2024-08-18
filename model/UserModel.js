const mongoose = require("mongoose");
const { transformSchema } = require("../lib/transformSchema");

const userSchema = new mongoose.Schema(
	{
		email: { type: String, unique: true, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		avatar: {
			type: String,
			default: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
		},
		bio: {
			type: String,
			default:
				"A Full Stack Web Application Developer from Bangladesh 🇧🇩 & a Programming Content Creator. Spend most of time coding outstanding projects or creating contents",
		},
		password: {
			type: String,
			required: true,
		},
		favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
	},
	{
		toJSON: { virtuals: true, getters: true },
		toObject: { virtuals: true, getters: true },
		timestamps: true,
	}
);

userSchema.set("toJSON", transformSchema);

userSchema.set("toObject", transformSchema);

const User = mongoose.model("User", userSchema);

module.exports = User;
