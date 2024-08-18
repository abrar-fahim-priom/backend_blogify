const { DEFAULT_BLOG_IMAGE } = require("../consts");
const Blog = require("../model/BlogModel");
const { BlogService } = require("../services/blog.service");
const deleteImage = require("../util/deleteImage");
const getAuthUser = require("../util/getAuthUser");

const getAllBlogs = async (req, res) => {
	//Query - limit, start, page
	const { limit, page } = req.query;

	// Handle if no query
	const query = {
		limit: 10,
		page: 1,
	};

	if (limit) {
		query.limit = parseInt(limit);
	}
	if (page) {
		query.page = parseInt(page);
	}

	const blogs = await BlogService.getBlogs(query);

	res.status(200).json(blogs);
};

const getSingleBlog = async (req, res) => {
	const { postId } = req.params;

	if (!postId) {
		return res.status(400).json({ message: "Blog postId is required" });
	}

	const blog = await BlogService.getSingleBlog(postId);

	if (!blog) {
		return res.status(404).json({ message: "Blog not found" });
	}

	if (req?.claims?.email) {
		const user = await getAuthUser(req);
		blog.isFavourite = user.favourites.some((fav) => fav.id == blog.id);
	}

	res.status(200).json(blog);
};

const createNewBlog = async (req, res) => {
	const { title, content, tags } = req?.body || {};

	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}

	if (!content) {
		return res.status(400).json({ message: "Content is required" });
	}

	if (!tags) {
		return res.status(400).json({ message: "Tags are required" });
	}

	const author = await getAuthUser(req);

	if (req?.file?.filename) {
		req.body.thumbnail = req?.file?.filename;
	}

	const newBlog = await BlogService.createNewBlog(req.body, author);

	res.status(201).json({
		status: "success",
		message: "Blog created successfully",
		blog: newBlog,
	});
};

const deleteBlog = async (req, res) => {
	const { postId } = req.params;

	if (!postId) {
		return res.status(400).json({ message: "Blog postId is required" });
	}

	const blog = await BlogService.getSingleBlog(postId);

	if (!blog) {
		return res.status(404).json({ message: "Blog not found" });
	}

	const deletedBlog = await Blog.findByIdAndDelete(postId);

	if (deletedBlog?.thumbnail !== DEFAULT_BLOG_IMAGE) {
		deleteImage(deletedBlog.thumbnail, "blog"); // delete the unused file
	}

	res.status(200).json({ message: "Blog deleted successfully" });
};

const updateBlog = async (req, res) => {
	const { postId } = req.params;

	if (!postId) {
		return res.status(400).json({ message: "Blog postId is required" });
	}

	if (req?.file?.filename) {
		req.body.thumbnail = req?.file?.filename;
	}

	const response = await BlogService.updateBlog(postId, req.body);

	res.status(200).json(response);
};

const getPopularBlogs = async (req, res) => {
	const { limit } = req?.query;

	const popularBlogs = await BlogService.popularBlogs(limit);
	return res.status(200).json(popularBlogs);
};
const getFavoriteBlogs = async (req, res) => {
	const user = await getAuthUser(req);

	const favoriteBlogs = await BlogService.favoriteBlogs(user);
	return res.status(200).json(favoriteBlogs);
};

const likeABlog = async (req, res) => {
	const { postId } = req.params;
	const user = await getAuthUser(req);

	const blog = await BlogService.likeABlog(postId, user);

	res.status(200).json(blog);
};

const commentBlog = async (req, res) => {
	const { postId } = req.params;
	const { content } = req.body;

	if (!postId) {
		return res.status(400).json({ message: "Blog postId is required" });
	}

	if (!content) {
		return res.status(400).json({ message: "Comment content is required" });
	}

	const { id, firstName, lastName, avatar } = await getAuthUser(req);
	const author = { id: String(id), firstName, lastName, avatar };
	const blog = await BlogService.commentAPost(postId, { content, author });

	res.status(200).json(blog);
};

const deleteComment = async (req, res) => {
	const { postId, commentId } = req.params;

	if (!postId) {
		return res.status(400).json({ message: "Blog postId is required" });
	}

	if (!commentId) {
		return res.status(400).json({ message: "Comment id is required" });
	}

	const blog = await BlogService.deleteComment(postId, commentId);

	res.status(200).json(blog);
};

const toggleFavourite = async (req, res) => {
	const { postId } = req.params;
	const user = await getAuthUser(req);

	const blog = await BlogService.toggleFavorite(postId, user);

	res.status(200).json(blog);
};

module.exports.BlogController = {
	getAllBlogs,
	getSingleBlog,
	createNewBlog,
	deleteBlog,
	updateBlog,
	getPopularBlogs,
	getFavoriteBlogs,
	likeABlog,
	commentBlog,
	toggleFavourite,
	deleteComment,
};
