// import dependencies
const inquirer = require("inquirer");
const db = require("../config/db_connection");
const cTable = require("console.table");

// display query results
class Query {
  // view all departments
  async viewAllDepartments() {
    let query = "SELECT * FROM department";
    await displayQuery(query);
  }
  // view all roles
  async viewAllRoles() {
    let query =
      "SELECT role.id AS role_id, title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;";
    await displayQuery(query);
  }
  // view all employees
  async viewAllEmployees() {
    let query =
      "SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;";
    await displayQuery(query);
  }
  // add department
  async addDepartment() {
    const userInput = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "department",
      },
    ]);
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO department(name) VALUES(?)",
        userInput.department,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Added ${userInput.department} to the database`);
            resolve();
          }
        }
      );
    });
  }
  // add role
  async addRole() {
    try {
      let departmentList;
      await new Promise((resolve, reject) => {
        db.query("SELECT * FROM department", (err, result) => {
          if (err) {
            reject(err);
          } else {
            departmentList = result;
            resolve();
          }
        });
      });
      const userInput = await inquirer.prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "role",
        },
        {
          type: "input",
          message: "What is the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          message: "Which department does the role belong to?",
          name: "department",
          choices: departmentList,
        },
      ]);

      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO role (title, salary, department_id) SELECT ?, ?, department.id FROM department WHERE department.name = ?;",
          [userInput.role, userInput.salary, userInput.department],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              console.log(`Added ${userInput.role} to the database`);
              resolve();
            }
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
  // add employee
  async addEmployee() {
    try {
      let roleList;
      let managerList;
      await new Promise((resolve, reject) => {
        db.query("SELECT title FROM role", (err, result) => {
          if (err) {
            reject(err);
          } else {
            roleList = result.map((row) => row.title);
            resolve();
          }
        });
      });
      await new Promise((resolve, reject) => {
        db.query(
          "SELECT CONCAT(first_name, ' ', last_name) as name FROM employee",
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              managerList = result.map((row) => row.name);
              managerList.unshift("None");
              resolve();
            }
          }
        );
      });
      const userInput = await inquirer.prompt([
        {
          type: "input",
          message: "What is the employee's first name",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the employee's last name",
          name: "lastName",
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "role",
          choices: roleList,
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "manager",
          choices: managerList,
        },
      ]);
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) SELECT ?, ?, r.id, CASE WHEN ? = 'none' THEN NULL ELSE m.id END FROM role AS r LEFT JOIN employee AS m ON CONCAT(m.first_name, ' ', m.last_name) = ? WHERE r.title = ?;",
          [
            userInput.firstName,
            userInput.lastName,
            userInput.manager,
            userInput.manager,
            userInput.role,
          ],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              console.log(
                `Added ${userInput.firstName} ${userInput.lastName} to the database`
              );
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
  // update employee role
  async updateEmployeeRole() {
    try {
      let employeeList;
      let roleList;
      await new Promise((resolve, reject) => {
        db.query(
          "SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;",
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              employeeList = result.map((row) => row.name);
              resolve();
            }
          }
        );
      });
      await new Promise((resolve, reject) => {
        db.query("SELECT title FROM role", (err, result) => {
          if (err) {
            reject(err);
          } else {
            roleList = result.map((row) => row.title);
            resolve();
          }
        });
      });
      const userInput = await inquirer.prompt([
        {
          type: "list",
          message: "Which employee's role do you want to update?",
          name: "employee",
          choices: employeeList,
        },
        {
          type: "list",
          message: "Which role do you want to assign the selected employee?",
          name: "role",
          choices: roleList,
        },
      ]);
      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE CONCAT(first_name, ' ', last_name) = ?;",
          [userInput.role, userInput.employee],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              console.log(
                `Updated ${userInput.employee}'s role to ${userInput.role}`
              );
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// display query
async function displayQuery(query) {
  await new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        table = cTable.getTable(result);
        console.table(table);
        resolve();
      }
    });
  });
}

// export query
module.exports = Query;
