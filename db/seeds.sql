USE employee_db;

INSERT INTO department(name)
VALUES
    ('Sales'),
    ('Engineer'),
    ('Finance'),
    ('UX/UI'),
    ('Marketing');

INSERT INTO role(title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant', 120000, 3),
    ('Lead UX/UI', 250000, 4),
    ('Marekting Director', 90000, 4),
    ('Assistant Marketing', 65000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Frank', 'Freeman', 1, NULL),
    ('John', 'Allgood', 2, 1),
    ('Natt', 'Foithong', 3, NULL),
    ('Note', 'DDD', 4, 3),
    ('Sara', 'Brown', 5, NULL),
    ('James', 'Carry', 6, NULL),
    ('Tammy', 'Boona', 7, NUll),
    ('Boom', 'Pattama', 8, 7);