# Avistamientos de Aves de Chile

**Estudiante:** Camila Cáceres

## Descripción

Este proyecto corresponde a un prototipo web desarrollado para la Unión de Ornitólogos de Chile. Su objetivo es permitir el registro de voluntarios, el ingreso de avistamientos de aves y la consulta de los avistamientos registrados.

El proyecto fue desarrollado utilizando únicamente HTML5, CSS3 y JavaScript, sin utilizar servidor ni base de datos.

## Funcionalidades

- Registro de voluntarios.
- Validación de los datos ingresados mediante JavaScript.
- Validación del RUT chileno mediante su dígito verificador.
- Registro de avistamientos.
- Validación de fecha, hora y evidencia fotográfica o de vídeo.
- Consulta de avistamientos mediante una tabla.
- Filtrado de avistamientos por tipo de ave.
- Ordenamiento por fecha y lugar.
- Paginación de los resultados.
- Indicadores y gráficos simples sobre voluntarios y avistamientos.

## Decisiones de diseño e implementación

Una de las decisiones tomadas fue utilizar el RUT como identificador del voluntario, ya que permite identificar de manera más precisa a cada persona registrada. Además, se incluyeron correo electrónico y teléfono como datos de contacto.

Otra decisión fue realizar las validaciones mediante JavaScript en lugar de utilizar únicamente la validación automática de HTML. Esto permite controlar de forma explícita las reglas de validación solicitadas para el prototipo, como la comprobación del dígito verificador del RUT, el formato del correo y teléfono, y las restricciones de fecha para los avistamientos.

Para la consulta de avistamientos se utilizaron datos ficticios almacenados temporalmente en JavaScript, ya que el enunciado no requiere implementar un servidor ni una base de datos.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript

## Estructura del proyecto

- `index.html`: página principal.
- `voluntario.html`: formulario de registro de voluntarios.
- `avistamiento.html`: formulario de registro de avistamientos.
- `avistamientos.html`: consulta, filtrado, ordenamiento y paginación.
- `indicadores.html`: indicadores y gráficos.
- `css/estilos.css`: estilos visuales del sitio.
- `js/validaciones.js`: validaciones y funcionalidades dinámicas.