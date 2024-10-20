const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nodeSchema = new Schema({
	type: {
		type: String,
		required: true,
		enum: ["operator", "operand"],
	},
	operator: {
		type: String,
		enum: ["AND", "OR", ">", "<", ">=", "<=", "=", "!="],
		required: function () {
			return this.type === "operator";
		},
	},
	condition: {
		type: String,
		required: function () {
			return this.type === "operand";
		},
	},
	value: {
		type: Schema.Types.Mixed,
		required: function () {
			return this.type === "operand";
		},
	},
	left: {
		type: Schema.Types.Mixed,
		default: null,
		required: function () {
			return this.type === "operator";
		},
	},
	right: {
		type: Schema.Types.Mixed,
		default: null,
		required: function () {
			return this.type === "operator";
		},
	},
});

const ruleSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	root: { type: nodeSchema, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	status: {
		type: String,
		enum: ["active", "inactive"],
		default: "active",
	},
});

ruleSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("Rule", ruleSchema);
