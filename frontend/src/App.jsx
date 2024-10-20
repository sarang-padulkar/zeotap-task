import React, { useState } from "react";
import CreateRuleForm from "./components/CreateRuleForm";
import RuleList from "./components/RuleList";
import RuleEvaluator from "./components/RuleEvaluator";
import EditRuleForm from "./components/EditRuleForm";
function App() {
	const [selectedRule, setSelectedRule] = useState(null);
	const [editingRule, setEditingRule] = useState(null); 
	const [rules, setRules] = useState([]);

	const handleRuleCreated = (newRule) => {
		setRules([...rules, newRule]);
	};

	const handleRuleSelected = (rule) => {
		setSelectedRule(rule);
	};

	const handleRuleEdit = (rule) => {
		setEditingRule(rule); 
	};

	const handleRuleUpdated = (updatedRule) => {
		setRules(
			rules.map((rule) =>
				rule._id === updatedRule._id ? updatedRule : rule
			)
		);
		setEditingRule(null);
	};

	const handleCancelEdit = () => {
		setEditingRule(null); 
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Rule Engine App
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{!editingRule && (
					<CreateRuleForm onRuleCreated={handleRuleCreated} />
				)}
				{editingRule ? (
					<EditRuleForm
						rule={editingRule}
						onRuleUpdated={handleRuleUpdated}
						onCancel={handleCancelEdit}
					/>
				) : (
					<RuleList
						onRuleSelected={handleRuleSelected}
						onRuleEdit={handleRuleEdit}
					/>
				)}
			</div>

			{selectedRule && <RuleEvaluator selectedRule={selectedRule} />}
		</div>
	);
}

export default App;
