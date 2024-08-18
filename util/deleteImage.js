const { unlinkSync } = require("node:fs");
const path = require("path");

const deleteImage = (filename) => {
	const filePath = path.join(__dirname, "../public/uploads/blog", filename);

	try {
		unlinkSync(filePath);
		console.log(`Blog's previous image: ${filename} was deleted successfully`);
	} catch (err) {
		console.error(`Error deleting file: ${err.message}`);
		throw new Error(err);
	}
};

module.exports = deleteImage;
