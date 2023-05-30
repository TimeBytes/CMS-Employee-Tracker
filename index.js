const inquirer = require("inquirer");
// const cTable = require("console.table");
const QD = require("./helpers/query");
const Query = new QD();

async function promptUser() {
  const actionSelected = await inquirer.prompt([
    {
      type: "list",
      message: "What action would you like to perform?",
      name: "action",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Quit",
      ],
    },
  ]);

  switch (actionSelected.action) {
    case "View all departments":
      await Query.viewAllDepartments();
      break;
    case "View all roles":
      await Query.viewAllRoles();
      break;
    case "View all employees":
      await Query.viewAllEmployees();
      break;
    case "Add a department":
      await Query.addDepartment();
      break;
    case "Add a role":
      await Query.addRole();
      break;
    case "Add an employee":
      await Query.addEmployee();
      break;
    case "Update an employee role":
      await Query.updateEmployeeRole();
      break;
    case "Quit":
      return; // Exit the loop
    default:
      break;
  }

  await promptUser(); // Prompt again after executing the action
}

promptUser();
