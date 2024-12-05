# car_management

Live link : https://neon-kringle-c37282.netlify.app/

Description : Car Management Application where users can create, view, edit, and delete cars. Each car can
contain up to 10 images (specifically of a car), a title, a description and tags - car_type, company,
dealer...etc .

The application primarily focuses on backend concepts like user authentication , Role based access control , Image upload using cloudinary.

Roles:
* Admin => Has all the access, can view create , update or delete any product on the application
* Manager => Has access to Products created by him only,Cannot access products of other manager
* viewer or customer=> Has only view access of all products , Cannot create , update or delete products
