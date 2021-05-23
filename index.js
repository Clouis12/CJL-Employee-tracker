// Import our dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

// Connect to the running MySQL Instance
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Maddox2016@",
  database: "EmployeeTracker",
});

// node native promisify
const query = util.promisify(connection.query).bind(connection);

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
  // connect to our database
  await connection.connect();
  console.log("\n\nConnected to database at HOST:localhost PORT:3306\n\n");
  while (true) {
    const answer = await prompt_for_view_add_update();
    await process_user_answer(answer);
  }
};

const process_user_answer = async (answer) => {
  if (answer === "View All Employees") {
    // RUN SOME CODE
    await view_employees();
  }
  if (answer === "View All Roles") {
    // RUN SOME CODE
    await view_roles();
  }
  if (answer === "View All Departments") {
    // RUN SOME CODE
    await view_depos();
  }
  if (answer === "Add New Employee") {
    // RUN SOME CODE
    await add_new_employee();
  }
  if (answer === "Add New Role") {
    // RUN SOME CODE
    await add_new_role();
  }
  if (answer === "Add New Department") {
    // RUN SOME CODE
    await add_new_depo();
  }
  if (answer === "Update Employee's Role") {
    // RUN SOME CODE
    await update_employee_role();
  }
};

// ************ DEPARTMENT ***********

// inquires about the new department to add and then stores it into the db
const add_new_depo = async () => {
  // prompt the user for a new department name
  const answer = await inquirer.prompt([
    {
      name: "depoName",
      type: "input",
      message: "Enter the new department name: ",
    },
  ]);
  // add the department to the database
  const results = await connection.query(
    `INSERT INTO Department (name) VALUES ('${answer.depoName}');`
  );
};

// inquires about the new department to add and then stores it into the db
const view_depos = async () => {
  // add the department to the database
  const rows = await query(`SELECT * From Department`);
  console.log("\n");
  console.table(rows);
  console.log("\n");
};

// ******** ROLES ********

// inquires about the new role to add and then stores it into the db
const add_new_role = async () => {
  // get the departments
  const rows = await query(`SELECT * From Department`);
  const departments = rows.map((row) => row.name);
  const answers = await inquirer.prompt([
    {
      name: "title",
      message: "\n\nEnter the role title: ",
      type: "input",
    },
    {
      name: "salary",
      message: "Enter the salary for this role: ",
      type: "input",
    },
    {
      name: "depo",
      message: "Enter the department for this role: ",
      type: "list",
      choices: departments,
    },
  ]);
  // store data into db
  const results = await connection.query(
    `INSERT INTO Role (title, salary, departmant_id) VALUES ('${answers.title}','${answers.salary}', '${answers.depo}');`
  );
};

// print out the table for the roles
const view_roles = async () => {
  const rows = await query(`SELECT * From Role`);
  console.log("\n");
  console.table(rows);
  console.log("\n");
};

// ************** EMPLOYEES **************

// inquires about the new employee to add and then stores it into the db
const add_new_employee = async () => {
  // get the employees
  const e_rows = await query(`SELECT * From Employee`);
  const employees = e_rows.map((row) => `${row.first_name} ${row.last_name}`);

  // get the roles
  const r_rows = await query(`SELECT * From Role`);
  const roles = r_rows.map((row) => `${row.title}`);
  let answers = await inquirer.prompt([
    {
      name: "first_name",
      message: "\n\nEnter the employee's first name: ",
      type: "input",
    },
    {
      name: "last_name",
      message: "Enter the employee's last name: ",
      type: "input",
    },
    {
      name: "role",
      message: "Choose the employee's role: ",
      type: "list",
      choices: roles,
    },
    {
      name: "manager_id",
      message: "Choose the employee's manager: ",
      type: "list",
      choices: employees,
      default: "N/A",
    },
  ]);
  // store data into db
  const index = r_rows.findIndex((role) => role.title === answers.role);
  answers.role = r_rows[index].Id;
  await connection.query(
    `INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}','${answers.last_name}', ${answers.role}, '${answers.manager_id}');`
  );
};

// inquires about the new department to add and then stores it into the db
const view_employees = async () => {
  // add the department to the database
  const rows = await query(`SELECT * From Employee`);
  console.log("\n");
  console.table(rows);
  console.log("\n");
};

// update the employee role
const update_employee_role = async () => {
  // get the roles
  const r_rows = await query(`SELECT * From Role`);
  const roles = r_rows.map((row) => `${row.title}`);
  // get the employees
  const e_rows = await query(`SELECT * From Employee`);
  const employees = e_rows.map((row) => `${row.first_name}`);
  // prompt user for choice of new role
  const answer = await inquirer.prompt([
    {
      name: "employeeToUpdate",
      message: "Select the employee you want to update the role for: ",
      type: "list",
      choices: employees,
    },
    {
      name: "updatedName",
      message: "Select the role you want to update the role to: ",
      type: "list",
      choices: roles,
    },
  ]);
  // convert text answer to role_id
  const index = r_rows.findIndex((role) => role.title === answer.updatedName);

  answer.role = r_rows[index].Id;
  await connection.query(
    `UPDATE employee SET role_id = ${answer.role} WHERE (first_name = '${answer.employeeToUpdate}');`
  );
};

run_program();
