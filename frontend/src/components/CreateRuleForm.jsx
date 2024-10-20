import React, { useState } from "react";
import { post } from "../utils/apiHandler";

const CreateRuleForm = ({ onRuleCreated }) => {
	const [ruleName, setRuleName] = useState("");
	const [ruleString, setRuleString] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null); 

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null); 
		try {
			const data = {
				ruleName,
				ruleString,
				description,
			};
			const response = await post("/api/create_rule", data);
			onRuleCreated(response.data.rule);
			setRuleName("");
			setRuleString("");
			setDescription("");
		} catch (error) {
			setError(error.response.data.error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="p-6 bg-white shadow-md rounded-md"
		>
			<div className="mb-4">
				<label className="block text-sm font-bold mb-2">
					Rule Name
				</label>
				<input
					type="text"
					value={ruleName}
					onChange={(e) => setRuleName(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-bold mb-2">
					Rule String
				</label>
				<textarea
					value={ruleString}
					onChange={(e) => setRuleString(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>
			<div className="mb-4">
				<label className="block text-sm font-bold mb-2">
					Description
				</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full px-3 py-2 border rounded"
				/>
			</div>
			{error && <p className="text-red-500">{error}</p>}{" "}
			<button
				type="submit"
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				disabled={loading}
			>
				{loading ? "Creating..." : "Create Rule"}
			</button>
		</form>
	);
};

export default CreateRuleForm;
