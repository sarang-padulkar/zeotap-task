import React, { useState } from "react";
import { post } from "../utils/apiHandler";

const RuleEvaluator = ({ selectedRule }) => {
	const [data, setData] = useState({});
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value });
	};

	const handleEvaluate = async () => {
		setLoading(true);
		try {
			const response = await post("/api/evaluate_rule", {
				ruleId: selectedRule._id,
				data,
			});
			setResult(response.data.result);
		} catch (error) {
			console.error("Error evaluating rule:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-white shadow-md rounded-md mt-4">
			<h2 className="text-xl font-bold mb-4">
				Evaluate Rule: {selectedRule.name}
			</h2>

			<div className="mb-4">
				<label className="block text-sm font-bold mb-2">
					Enter Data:
				</label>
				<input
					type="text"
					name="age"
					placeholder="Age"
					onChange={handleChange}
					className="w-full px-3 py-2 border rounded mb-2"
				/>
				<input
					type="text"
					name="salary"
					placeholder="Salary"
					onChange={handleChange}
					className="w-full px-3 py-2 border rounded"
				/>
			</div>

			<button
				onClick={handleEvaluate}
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				disabled={loading}
			>
				{loading ? "Evaluating..." : "Evaluate"}
			</button>

			{result !== null && (
				<div className="mt-4">
					<h3 className="text-lg">
						Evaluation Result: {result ? "True" : "False"}
					</h3>
				</div>
			)}
		</div>
	);
};

export default RuleEvaluator;
