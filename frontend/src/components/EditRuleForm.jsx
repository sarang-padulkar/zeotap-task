import React, { useState, useEffect } from "react";
import { put } from "../utils/apiHandler";

const buildRuleString = (node) => {
	if (!node) return "";

	if (node.type === "operand") {
		return `${node.condition} ${node.operator} ${node.value}`;
	}

	if (node.type === "operator") {
		const left = buildRuleString(node.left);
		const right = buildRuleString(node.right);
		return `(${left} ${node.operator} ${right})`;
	}

	return "";
};

const EditRuleForm = ({ rule, onRuleUpdated, onCancel }) => {
	const [ruleString, setRuleString] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (rule && rule.root) {
			const initialRuleString = buildRuleString(rule.root);
			setRuleString(initialRuleString);
		}
	}, [rule]);

	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await put(`/api/update_rule/${rule._id}`, {
				ruleString,
			});
			onRuleUpdated(response.data.rule);
		} catch (error) {
			setError(
				error.response?.data?.error || "Failed to update the rule"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleUpdate}
			className="p-6 bg-white shadow-md rounded-md"
		>
			<div className="mb-4">
				<label className="block text-sm font-bold mb-2">
					Edit Rule String
				</label>
				<textarea
					value={ruleString}
					onChange={(e) => setRuleString(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>

			{error && <p className="text-red-500">{error}</p>}

			<button
				type="submit"
				className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
				disabled={loading}
			>
				{loading ? "Updating..." : "Update Rule"}
			</button>
			<button
				type="button"
				className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
				onClick={onCancel}
			>
				Cancel
			</button>
		</form>
	);
};

export default EditRuleForm;
