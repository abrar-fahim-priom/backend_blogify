require("colors");
const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		mongoose.set("strictQuery", false);

		const url = process.env.MONGODB_URI;

		const con = await mongoose.connect(url);

		console.info(`MongoDB connected: ${con.connection.host}`.yellow.underline);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

module.exports = connectDB;
