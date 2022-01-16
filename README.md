# Frontend Productos BSALE

## 1.	Descripción del proyecto

El proyecto a continuación es un simulador de tienda online, en la cual, se permiten listas productos, agrupar por categorías y buscar por nombre.
Este compuesto por una aplicación frontend, una api y una base de datos. 
A continuación, se muestra el diagrama de arquitectura del proyecto:

[Diagrama del Proyecto](https://desafio-bsale.vercel.app/assets/images/diagram_bsale.png)
![alt text](https://desafio-bsale.vercel.app/assets/images/diagram_bsale.png "Diagrama")

En los siguientes puntos se detalla cada uno de estos.

## 2.	Frontend
La aplicación Frontend esta creada con HTML5, CSS3 y VanillaJS.
En relación a las librerías utilizadas, en los estilos se implementó BulmaCSS, además, se utilizó FontAwesome para los iconos. Por otra parte, para realizar las peticiones a la API, se utilizó Axios. Todos estos fueron utilizados mediante CDN.

La pagina inicial muestra el listado de categorías y dos productos por cada una.

En la barra de navegación habrá un enlace Home la cual se redirigirá a la página
principal y mostrará las categorías con dos productos por cada una. También estará la opción de ver todos los productos y buscar por nombre o parte del nombre y devolverá los datos filtrados.

## 3.	Backend (API)

El Backend está creado con express.js para la creación de la API rest, la cual hace consultas a la base de datos.
En la API se crearon 4 endpoint para la consulta hacia la base de datos.
A continuación, se describirán los endpoint:

- Get:   /products  -> Se mostrara todos los productos de la base de datos.
- Get:  /category/name/:name. -> Se consultará por el nombre que se escribe en el buscador la cuál devolverá los productos filtrados.
- Get:   /category/products.  Mostrará las categorías con 2 productos por cada una.
- Get:  /product/category/:id  -> Se mostrara todos los productos de 1 categoría

Los endpoint tienen integrado límit y offset para paginar los resultados que se mostraran mas reflejados en /products y /product/category/:id.



## 4.	Base de datos

La base de datos utilizada es MySQL la cual fue entregada con datos para utilizarla en este ejercicio. A continuación, se muestra el modelo de la base de datos.

[Model BD](https://desafio-bsale.vercel.app/assets/images/model_bsale.jpg)
![alt text](https://desafio-bsale.vercel.app/assets/images/model_bsale.jpg "Diagrama")