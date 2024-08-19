const { DEFAULT_BLOG_IMAGE } = require("../consts");
const Blog = require("../model/BlogModel");
const User = require("../model/UserModel");
const deleteImage = require("../util/deleteImage");

/**
 * Creates a new blog.
 * @param {Object} body - The body of the blog containing title, content, and tags.
 * @param {Object} author - The author of the blog containing id, firstName, lastName, and avatar.
 * @returns {Object} - The newly created blog.
 */
const createNewBlog = async (body, author) => {
	const { title, content, tags, thumbnail } = body;
	const { id, firstName, lastName, avatar } = author;

	//Create a new blog
	const newBlog = await Blog.create({
		title,
		content,
		thumbnail: thumbnail || DEFAULT_BLOG_IMAGE,
		author: { id, firstName, lastName, avatar },
		tags: tags?.split(",").map((tag) => tag.trim()),
		likes: [],
		comments: [],
	});

	return newBlog;
};

/**
 * Retrieves a paginated list of blogs based on the provided query parameters.
 *
 * @param {Object} query - The query parameters for pagination (limit, page).
 * @param {number} query.limit - The maximum number of blogs to retrieve per page.
 * @param {number} query.page - The page number to retrieve.
 * @returns {Object} - An object containing the total number of blogs, current page number, limit, and the paginated blogs.
 */
const getBlogs = async (query) => {
	const blogs = (await Blog.find()).map((blog) => blog.toObject());
	const { limit, page } = query;

	if (blogs.length === 0) {
		return { total: 0, blogs: [] };
	}

	const start = (page - 1) * limit;
	const end = start + limit;
	const paginatedBlogs = blogs.slice(start, end);

	// Make short blog descriptions
	const shortBlogs = paginatedBlogs.map((blog) => {
		return { ...blog, content: blog.content.slice(0, 180) + "..." };
	});

	return { total: blogs.length, page, limit, blogs: shortBlogs };
};

/**
 * Retrieves a single blog by its ID.
 * @param {string} id - The ID of the blog.
 * @returns {Object} - The blog object.
 */
const getSingleBlog = async (id) => {
	const blog = (await Blog.findById(id))?.toObject();

	return blog;
};

const updateBlog = async (postId, body) => {
	const blog = await getSingleBlog(postId);

	if (!blog) {
		throw new Error("Blog not found");
	}

	if (body.tags) {
		body.tags = body.tags?.split(",").map((tag) => tag.trim());
	}

	const updatedBlog = (await Blog.findByIdAndUpdate(postId, body, { new: true }))?.toObject();

	if (body?.thumbnail && blog?.thumbnail !== DEFAULT_BLOG_IMAGE) {
		deleteImage(blog.thumbnail, "blog"); // delete the previous image
	}

	return updatedBlog;
};

const popularBlogs = async (limit = 5) => {
	const blogs = (await Blog.find()).map((blog) => blog.toObject());
	const popularBlogs = blogs.sort((a, b) => b.likes.length - a.likes.length).slice(0, limit);

	if (popularBlogs.length === 0) {
		return { total: 0, blogs: [] };
	} else {
		return { total: popularBlogs.length, blogs: popularBlogs };
	}
};

const favoriteBlogs = async (user) => {
	const blogs = (await User.findById(user.id).populate("favourites"))?.toObject()?.favourites;
	if (!blogs || blogs.length === 0) {
		return { total: 0, blogs: [] };
	}
	return { total: blogs.length, blogs };
};

const toggleFavorite = async (postId, user) => {
	const blog = await getSingleBlog(postId);
	if (!blog) {
		throw new Error("Blog not found");
	}

	// Toogle on User's favorite list
	const index = user.favourites?.findIndex((fav) => fav.toString() === postId);
	if (index === -1) {
		user.favourites.push(postId);
	} else {
		user.favourites?.splice(index, 1);
	}

	// Update user's favorite list
	await User.findByIdAndUpdate(user.id, { favourites: user.favourites });

	// Return blog with property of isFavorite
	return { ...blog, isFavourite: index === -1 };
};

const commentAPost = async (postId, body) => {
	const blog = await getSingleBlog(postId);

	if (!blog) {
		throw new Error("Blog not found");
	}

	const newComment = {
		content: body.content,
		author: body.author,
	};

	blog.comments.push(newComment);

	const updatedBlog = (
		await Blog.findByIdAndUpdate(postId, { comments: blog.comments }, { new: true })
	)?.toObject();
	return updatedBlog;
};

const deleteComment = async (postId, commentId) => {
	const blog = await getSingleBlog(postId);

	if (!blog) {
		throw new Error("Blog not found");
	}

	console.log(blog.comments);

	const index = blog.comments.findIndex((comment) => comment._id?.toString() === commentId);
	if (index === -1) {
		throw new Error("Comment not found");
	}

	blog.comments.splice(index, 1);
	const updatedBlog = (await Blog.findByIdAndUpdate(postId, blog, { new: true }))?.toObject();
	return updatedBlog;
};

const likeABlog = async (postId, user) => {
	const blog = await getSingleBlog(postId);

	if (!blog) {
		throw new Error("Blog not found");
	}

	const index = blog.likes.findIndex((like) => String(like) === String(user.id));
	if (index === -1) {
		blog.likes.push(user.id);
	} else {
		blog.likes.splice(index, 1);
	}

	const updatedBlog = await Blog.findByIdAndUpdate(postId, blog, { new: true });
	return { isLiked: index === -1, likes: updatedBlog.likes };
};

module.exports.BlogService = {
	createNewBlog,
	getBlogs,
	getSingleBlog,
	updateBlog,
	popularBlogs,
	favoriteBlogs,
	toggleFavorite,
	commentAPost,
	deleteComment,
	likeABlog,
};
