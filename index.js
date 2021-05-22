// Import our dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

// 1. Prompt the user for what would you like to do

// This func will prompt the user to view tables, add items (employee, role, etc), and update info
const prompt_for_view_add_update = async () => {
  const answers = await inquirer.prompt([
    {
      // this is a question
      name: "wwydAnswer",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add New Employee",
        "Add New Role",
        "Add New Department",
        "Update Employee's Role",
      ],
    },
  ]);
  return answers.wwydAnswer;
};

const run_program = async () => {
  while (true) {
    const answer = await prompt_for_view_add_update();
    if (answer === "View All Employees") {
      // RUN SOME CODE
      console.log("\nView All Employees was chosen\n");
    }
    if (answer === "View All Roles") {
      // RUN SOME CODE
      console.log("\nView All Roles was chosen\n");
    }
    if (answer === "View All Departments") {
      // RUN SOME CODE
      console.log("\nView All Departments was chosen\n");
    }
    if (answer === "Add New Employee") {
      // RUN SOME CODE
      console.log("\nAdd New Employee was chosen\n");
    }
    if (answer === "Add New Role") {
      // RUN SOME CODE
      console.log("\nAdd New Role was chosen\n");
    }
    if (answer === "Add New Department") {
      // RUN SOME CODE
      console.log("\nAdd New Department was chosen\n");
    }
    if (answer === "Update Employee's Role") {
      // RUN SOME CODE
      console.log("\nUpdate Employee's Role was chosen\n");
    }
  }
};

run_program();
