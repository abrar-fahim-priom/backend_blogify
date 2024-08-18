const mongoose = require("mongoose");
const { transformSchema } = require("../lib/transformSchema");

const blogSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		thumbnail: { type: String, default: "thumbnail-1708765297564-606798153.png" },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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
				author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

blogSchema.set("toJSON", transformSchema);

blogSchema.set("toObject", transformSchema);

const Blog = mongoose.model("Example", blogSchema);

module.exports = Blog;
