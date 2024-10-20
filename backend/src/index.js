const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Rule = require("./models/Rule");
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
	.connect(
		"mongodb+srv://sarang:sarang123@cluster0.au98o.mongodb.net/zeotap-task",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

    const allowedOperators = ['>', '<', '>=', '<=', '=', '!=', 'AND', 'OR'];
    const allowedAttributes = ['age', 'salary', 'department', 'experience'];
    
    const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));
    
    const parseRuleString = (ruleString) => {
        const tokens = ruleString.match(/\(|\)|\w+|\S+/g);
    
        if (!tokens || tokens.length < 3) {
            throw new Error('Invalid rule format. Expected format: "<field> <operator> <value>" or more complex expression.');
        }
    
        const stack = [];
    
        const parseTokens = (tokens) => {
            let index = 0;
    
            const parseOperand = () => {
                const field = tokens[index++];
    
                if (!allowedAttributes.includes(field)) {
                    throw new Error(
                        `Invalid field: ${field}. Allowed fields are: ${allowedAttributes.join(', ')}`
                    );
                }
    
                const operator = tokens[index++];
    
                if (!allowedOperators.includes(operator)) {
                    throw new Error(
                        `Invalid operator: ${operator}. Allowed operators are: ${allowedOperators.join(', ')}`
                    );
                }
    
                const value = tokens[index++];
    
                const parsedValue = isNumeric(value) ? Number(value) : value;
    
                return {
                    type: 'operand',
                    condition: field,
                    value: parsedValue,
                    operator,
                };
            };
    
            const parseExpression = () => {
                const nodeStack = [];
                while (index < tokens.length) {
                    const token = tokens[index];
    
                    if (token === '(') {
                        index++; 
                        nodeStack.push(parseExpression()); 
                    } else if (token === ')') {
                        index++;
                        break; 
                    } else if (allowedOperators.includes(token)) {
                        nodeStack.push({
                            type: 'operator',
                            operator: token,
                        });
                        index++;
                    } else {
                        nodeStack.push(parseOperand());
                    }
                }
                return combineNodes(nodeStack); 
            };
    
            return parseExpression();
        };
    
        const combineNodes = (nodes) => {
            if (nodes.length === 1) return nodes[0]; 
    
            let rootNode = nodes[0];
    
            for (let i = 1; i < nodes.length - 1; i += 2) {
                rootNode = {
                    type: 'operator',
                    operator: nodes[i].operator, 
                    left: rootNode,
                    right: nodes[i + 1],
                };
            }
    
            return rootNode;
        };
    
        return parseTokens(tokens);
    };
    

const combineASTs = (astNodes) => {
	return {
		type: "operator",
		operator: "AND",
		left: astNodes[0],
		right: astNodes[1],
	};
};

const evaluateAST = (rootNode, data) => {
	if (rootNode.type === "operand") {
		const field = rootNode.condition;
		const value = data[field];
		const comparisonValue = rootNode.value;

		switch (rootNode.operator) {
			case ">":
				return value > comparisonValue;
			case "<":
				return value < comparisonValue;
			case ">=":
				return value >= comparisonValue;
			case "<=":
				return value <= comparisonValue;
			case "=":
				return value === comparisonValue;
			case "!=":
				return value !== comparisonValue;
			default:
				return false;
		}
	} else if (rootNode.type === "operator") {
		const leftResult = evaluateAST(rootNode.left, data);
		const rightResult = evaluateAST(rootNode.right, data);

		if (rootNode.operator === "AND") {
			return leftResult && rightResult;
		} else if (rootNode.operator === "OR") {
			return leftResult || rightResult;
		}
	}

	return false;
};

app.post("/api/create_rule", async (req, res) => {
	const { ruleString, ruleName, description } = req.body;

	try {
		const rootNode = parseRuleString(ruleString);
		const rule = new Rule({
			name: ruleName,
			description: description,
			root: rootNode,
		});
		await rule.save();

		return res.status(201).json({ message: "Rule created", rule });
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Error creating rule", error: err.message });
	}
});

app.put("/api/update_rule/:id", async (req, res) => {
	const { id } = req.params;
	const { ruleString } = req.body;

	try {
		const newRootNode = parseRuleString(ruleString);
		const updatedRule = await Rule.findByIdAndUpdate(
			id,
			{ root: newRootNode },
			{ new: true }
		);

		if (!updatedRule) {
			return res.status(404).json({ message: "Rule not found" });
		}

		return res
			.status(200)
			.json({ message: "Rule updated", rule: updatedRule });
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Error updating rule", error: err.message });
	}
});

app.get("/api/get_rules", async (req, res) => {
	try {
		const rules = await Rule.find();
		return res.status(200).json(rules);
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error fetching rules", error: err.message });
	}
});

app.post("/api/combine_rules", async (req, res) => {
	const { ruleIds } = req.body;

	try {
		const rules = await Rule.find({ _id: { $in: ruleIds } });

		const combinedRootNode = combineASTs(rules.map((rule) => rule.root));

		return res
			.status(200)
			.json({ message: "Rules combined", combinedRootNode });
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Error combining rules", error: err.message });
	}
});

app.post("/api/evaluate_rule", async (req, res) => {
	const { ruleId, data } = req.body;

	try {
		const rule = await Rule.findById(ruleId);
		if (!rule) {
			return res.status(404).json({ message: "Rule not found" });
		}

		const result = evaluateAST(rule.root, data);

		return res.status(200).json({ message: "Evaluation result", result });
	} catch (err) {
		return res
			.status(400)
			.json({ message: "Error evaluating rule", error: err.message });
	}
});

app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
