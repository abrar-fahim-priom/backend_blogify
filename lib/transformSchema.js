const transformSchema = () => ({
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

module.exports = { transformSchema };
