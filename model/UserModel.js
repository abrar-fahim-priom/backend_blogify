const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		email: { type: String, unique: true, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		avatar: {
			type: String,
			default: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
		},
		bio: String,
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

userSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

userSchema.set("toObject", {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
