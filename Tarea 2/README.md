# Tarea 2 - Desarrollo de Aplicaciones Web

## Descripción

Implementación de la segunda tarea del curso utilizando Flask, Python, MySQL y SQLAlchemy.

La aplicación permite:

- Registrar voluntarios.
- Registrar avistamientos.
- Asociar cada avistamiento a un voluntario.
- Adjuntar fotografías o videos como evidencia.
- Consultar los avistamientos registrados.
- Ver el detalle de cada avistamiento.
- Navegar entre los avistamientos mediante paginación.

## Tecnologías utilizadas

- Python
- Flask
- SQLAlchemy
- MySQL
- HTML5
- CSS3
- JavaScript

## Decisión de implementación

Para almacenar las fotografías y videos asociados a los avistamientos se decidió guardar los archivos en la carpeta `static/uploads/` del proyecto y almacenar en la base de datos la ruta y el nombre original de cada archivo.

Esta decisión permite que los archivos puedan ser mostrados posteriormente en la página de detalle del avistamiento, mientras que la tabla `registro` mantiene la relación entre cada evidencia y su correspondiente avistamiento.

## Validaciones

Se implementaron validaciones tanto en JavaScript como en Flask.

Las validaciones del lado del cliente permiten entregar mensajes inmediatos al usuario, mientras que las validaciones del servidor permiten verificar nuevamente los datos antes de almacenarlos en la base de datos.

## Base de datos

La aplicación utiliza MySQL mediante SQLAlchemy. La información de voluntarios, aves, avistamientos y registros de archivos se almacena en las tablas correspondientes.

La tabla `avistamiento` mantiene la relación con el voluntario y el ave, mientras que la tabla `registro` permite asociar una o más evidencias a cada avistamiento.