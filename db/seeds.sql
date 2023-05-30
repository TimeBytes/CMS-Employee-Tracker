INSERT INTO department(name)
VALUES ("Cell Phone"),
       ("Customer Service"),
       ("Management");

INSERT INTO role (title,salary,department_id)
VALUES ("Customer Service",31200,2),
       ("Sales Representative",33280,1),
       ("Sales Manager",42000,1), 
       ("Operations Manager",42000,2), 
       ("General Manager",70000,3);

INSERT INTO employee (first_name, last_name,role_id,manager_id)
VALUES ("Luchi","Gool",5,null), 
       ("Andy","Zhong",3,1),
       ("Tai","Wong",4,1),
       ("Marie","Simbajo",1,3),
       ("Blake","Smith",2,2),
       ("Teasha","Poppy",2,2),
       ("Shelbie","Wicked",2,2);