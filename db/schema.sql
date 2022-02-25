CREATE table department (
    id integer primary key not null auto_increment,
    name varchar(30) not null
);

CREATE table role (
    id integer primary key not null auto_increment,
    title varchar(30),
    salary decimal,
    department_id integer,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE table employee (
    id integer primary key not null auto_increment,
    first_name varchar(30),
    last_name varchar(30),
    role_id integer,
    manager_id integer,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) on delete set null
)