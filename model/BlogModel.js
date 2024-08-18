const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		thumbnail: { type: String, default: "thumbnail-1708765297564-606798153.png" },
		author: {
			id: String,
			firstName: String,
			lastName: String,
			avatar: String,
		},
		tags: [String],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				content: { type: String, required: true },
				author: { id: String, firstName: String, lastName: String, avatar: String },
			},
		],
		isFavourite: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true, getters: true },
		toObject: { virtuals: true, getters: true },
		timestamps: true,
	}
);

blogSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

blogSchema.set("toObject", {
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
