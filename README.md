# ECOMMERCE APP by Lucas Ariel Rotta

## Ejecutar proyecto con docker
0. Ejecutar el comando npm install.
1. Ejecutar el comando docker-compose up -d.
2. Ejecutar el comando docker-compose up.
3. Ingresar a la ruta /login para obtener un JWT válido con el usuario de prueba que se encuentra en el postman, si no se encuentra utilizar uno ya registrado como "email":"lucas100@lucas.com",
"password":"prueba".
4. Recordar que la aplicación utilizar bearer token como validación.
5. Al ejectutar la aplicación se cargan datos mock. 

## Ejecutar proyecto localmente
Modificar el las variables .env deben quedar de la siguiente manera: MYSQL_PASSWORD= MYSQL_HOST='127.0.0.1'.
1. Ejecutar el comando npm install.
2. Ejecutar el comando npm run start para ejecutar la aplicación.
3. Ingresar a la ruta /login para obtener un JWT válido con el usuario de prueba que se encuentra en el postman, si no se encuentra utilizar uno ya registrado como "email":"lucas100@lucas.com",
"password":"prueba".
4. Recordar que la aplicación utilizar bearer token como validación.
5. Al ejectutar la aplicación se cargan datos mock. 

## Los endpoints de la API son los siguientes:

### Usuarios
- GET /usuarios: Obtiene todos los usuarios existentes. 
- GET /usuarios/?type=1: Obtiene todos los usuarios que sean buyers y sellers. 
- GET /usuarios/{id}: Obtiene un usuario por ID. 
- POST /usuarios: Crea un usuario. 
- PUT /usuarios/{id}: Modifica un usuario por ID. 
- DELETE /usuarios/{id}: Elimina un usuario por ID. 

### Productos
- GET /productos: Obtiene todos los productos existentes. 
- GET /productos/{id}: Obtiene un producto por ID. 
- POST /productos: Crea un producto. 
- PUT /productos/{id}: Modifica un producto por ID. 
- DELETE /productos/{id}: Elimina un producto por ID. 

### Transacciones
- GET /transacciones: Obtiene todas las transacciones existentes. 
- GET /transacciones/?type=1: Obtiene todas las transacciones con sus usuarios relacionados. 
- GET /transacciones/{id}: Obtiene una transaccion por ID. 
- POST /transacciones: Obtiene todas las transacciones existentes. 
- PUT /transacciones{id}: Modifica una transaccion por ID. 
- DELETE /transacciones{id}: Elimina una transaccion por ID. 

### Categorias
- GET /categorias: Obtiene todas las categorias existentes. 
- GET /categorias/?user={id}: Obtiene todas las categorias relacionadas a un usuario si este es un buyer user. 
- GET /categorias/{id}: Obtiene una categoria por ID. 
- POST /categorias: Crea una categoria. 
- PUT /categorias/{id}: Modifica una categoria por ID. 
- DELETE /categorias/{id}: Elimina una categoria por ID. 
