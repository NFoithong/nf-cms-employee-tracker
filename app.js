const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const db = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 8080;

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (NOT FOUND)
app.use((req, res) => { res.status(404).end() });

//Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    start();
    // app.listen(PORT, () => {
    //     console.log(`Server running on port ${PORT}`);
    // });
});

// Basic function of application
function start() {
    inquirer.prompt([{
            type: "list",
            name: "start",
            message: "We have information on employee, department, and employee role. What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee role",
                "Eixt"
            ]
        }])
        .then((answer) => {
            switch (answer.start) {
                case "View all departments":
                    ViewAllDepartments();
                    break;
                case "View all roles":
                    ViewAllRoles();
                    break;
                case "View all employees":
                    ViewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update employee role":
                    update();
                    break;
                case "Exit":
                    console.log("All done")
                    break;
                default:
                    console.log("default")
            }
        });
}

// function to view all departments
function ViewAllDepartments() {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(`==========================`);
        console.log("Displaying all departments");
        console.log(`==========================`);
        console.table(results);
        start();
    });
}

// function to view all roles
function ViewAllRoles() {
    db.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        console.log(`=====================`);
        console.log("Displaying all roles");
        console.log(`=====================`);
        console.table(results);
        start();
    });
}

// function to view all employees
function ViewAllEmployees() {
    db.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        console.log(`========================`);
        console.log("Displaying all employees");
        console.log(`========================`);
        console.table(results);
        start();
    });
}

// function to add a department
function addDepartment() {
    inquirer.prompt([{
            type: "input",
            name: "department",
            message: "What is the new department name?",
            validate: (value) => {
                if (value) {
                    return true;
                } else {
                    console.log("Please enter deaprtment name");
                }
            }
        }])
        .then(answer => {
            db.query(
                "INSERT INTO department SET ?", {
                    name: answer.department
                },
                (err) => {
                    if (err) throw err;
                    console.log(`=============================`);
                    console.log(`New department ${answer.department} has been added!`);
                    console.log(`=============================`);
                    start();
                }
            )
        });
}

// function to add a role, prompt role, salary and department
function addRole() {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, results) => {
        if (err) throw err;

        inquirer.prompt([{
                    type: "input",
                    name: "title",
                    message: "What is the title for the new role?",
                    validate: (value) => {
                        if (value) {
                            return true;
                        } else {
                            console.log("Please enter the title.")
                        }
                    }
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the new role's salary?",
                    validate: (value) => {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log("Please enter a number");
                    }
                },
                {
                    type: "rawlist",
                    name: "department",
                    choices: () => {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "What department is this new role under?"
                }
            ])
            .then(answer => {
                let chosenDept;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].name === answer.department) {
                        chosenDept = results[i];
                    }
                }

                db.query(
                    "INSERT INTO role SET ?", {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: chosenDept.id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`=============================`);
                        console.log(`New role ${answer.title} has beend added!`);
                        console.log(`=============================`);
                        start();
                    }
                )
            });
    });
}

// function to add an employee
function addEmployee() {
    const sql = "SELECT * FROM employee, role";
    db.query(sql, (err, results) => {
        if (err) throw err;

        inquirer.prompt([{
                    type: "input",
                    name: "firstName",
                    message: "What is the first name?",
                    validate: (value) => {
                        if (value) {
                            return true;
                        } else {
                            console.log("Please enter the first name.")
                        }
                    }
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the last name?",
                    validate: (value) => {
                        if (value) {
                            return true;
                        } else {
                            console.log("Please enter the last name.")
                        }
                    }
                },
                {
                    type: "rawlist",
                    name: "role",
                    choices: () => {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        // remove duplicates
                        let cleanChoiceArray = [...new Set(choiceArray)];
                        return cleanChoiceArray;
                    },
                    message: "What is the role?"
                }
            ])
            .then(answer => {
                let chosenRole;

                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answer.role) {
                        chosenRole = results[i];
                    }
                }

                db.query(
                    "INSERT INTO employee SET ?", {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: chosenRole.id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`=========================================`);
                        console.log(`New role ${answer.firstName} ${answer.lastName} has beend added! as a ${answer.role}`);
                        console.log(`=========================================`);
                        start();
                    }
                )
            });
    });
}

// function to update employee role
function update() {
    db.query("SELECT * FROM employee, role", (err, results) => {
        if (err) throw err;

        inquirer.prompt([{
                type: "rawlist",
                name: "employee",
                choices: () => {
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].last_name);
                    }
                    // remove duplicates
                    let cleanChoiceArray = [...new Set(choiceArray)];
                    return cleanChoiceArray;
                },
                message: "What is the employee's new role"
            }])
            .then(answer => {
                let chosenEmployee;
                let chosenRole;

                for (let i = 0; i < results.length; i++) {
                    if (results[i].last_name === answer.employee) {
                        chosenEmployee = results[i];
                    }
                }

                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answer.role) {
                        chosenRole = results[i];
                    }
                }

                db.query(
                    "UPDATE employee SET ? WHERE ?", [{
                            role_id: chosenRole,
                        },
                        {
                            last_name: chosenEmployee,
                        }
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log(`=======================`);
                        console.log(`Role has been updated!`);
                        console.log(`=======================`);
                        start();
                    }
                )
            });
    });
}