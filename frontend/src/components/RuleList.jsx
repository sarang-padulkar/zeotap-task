import React, { useEffect, useState } from "react";
import { get } from "../utils/apiHandler";

const RuleList = ({ onRuleSelected, onRuleEdit }) => {
	const [rules, setRules] = useState([]);

	useEffect(() => {
		const fetchRules = async () => {
			try {
				const response = await get("/api/get_rules");
				setRules(response.data);
			} catch (error) {
				console.error("Error fetching rules:", error);
			}
		};

		fetchRules();
	}, []);

	return (
		<div className="p-6 bg-white shadow-md rounded-md">
			<h2 className="text-xl font-bold mb-4">All Rules</h2>
			{rules.length > 0 ? (
				<ul>
					{rules.map((rule) => (
						<li key={rule._id} className="border-b py-2">
							<span>{rule.name}</span>
							<button
								onClick={() => onRuleSelected(rule)}
								className="ml-4 text-blue-500"
							>
								Evaluate
							</button>
							<button
								onClick={() => onRuleEdit(rule)}
								className="ml-4 text-green-500"
							>
								Edit
							</button>
						</li>
					))}
				</ul>
			) : (
				<p>No rules found</p>
			)}
		</div>
	);
};

export default RuleList;
