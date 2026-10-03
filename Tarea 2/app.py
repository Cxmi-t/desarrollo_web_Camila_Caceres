from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
import re
from flask_sqlalchemy import SQLAlchemy
import os
from werkzeug.utils import secure_filename
app = Flask(__name__)
app.secret_key = "tarea2-clave-secreta"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
class Region(db.Model):
    __tablename__ = "region"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)

class Comuna(db.Model):
    __tablename__ = "comuna"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey("region.id"), nullable=False)

class Voluntario(db.Model):
    __tablename__ = "voluntario"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    rut = db.Column(db.String(12), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False)
    comuna_id = db.Column(db.Integer, db.ForeignKey("comuna.id"), nullable=False)
    direccion = db.Column(db.String(200), nullable=True)

    comuna = db.relationship("Comuna")

class Ave(db.Model):
    __tablename__ = "ave"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    tipo = db.Column(db.String(30), nullable=True)

class Avistamiento(db.Model):
    __tablename__ = "avistamiento"

    id = db.Column(db.Integer, primary_key=True)
    voluntario_id = db.Column(db.Integer, db.ForeignKey("voluntario.id"), nullable=False)
    ave_id = db.Column(db.Integer, db.ForeignKey("ave.id"), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    lugar = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(30), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

    voluntario = db.relationship("Voluntario")
    ave = db.relationship("Ave")
    registros = db.relationship("Registro", backref="avistamiento")

class Registro(db.Model):
    __tablename__ = "registro"

    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    avistamiento_id = db.Column(
        db.Integer,
        db.ForeignKey("avistamiento.id"),
        nullable=False
    )

@app.route("/")
def inicio():
    ultimos_avistamientos = (
        Avistamiento.query
        .order_by(Avistamiento.fecha_hora.desc())
        .limit(2)
        .all()
    )

    return render_template(
        "index.html",
        ultimos_avistamientos=ultimos_avistamientos
    )

@app.route("/voluntario", methods=["GET", "POST"])
def voluntario():
    if request.method == "POST":
        nombre = request.form.get("nombre", "").strip()
        apellido = request.form.get("apellido", "").strip()
        rut = request.form.get("rut", "").strip()
        email = request.form.get("email", "").strip()
        telefono = request.form.get("telefono", "").strip()
        region_id = request.form.get("region", "").strip()
        comuna_nombre = request.form.get("comuna", "").strip()
        direccion = request.form.get("direccion", "").strip()

        errores = []

        # Nombre
        if not re.fullmatch(r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]{2,50}", nombre):
            errores.append("El nombre debe tener entre 2 y 50 caracteres.")

        # Apellido
        if not re.fullmatch(r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]{2,50}", apellido):
            errores.append("El apellido debe tener entre 2 y 50 caracteres.")

        # RUT
        rut_limpio = rut.replace(".", "").replace("-", "").upper()
        if not re.fullmatch(r"\d{7,8}[0-9K]", rut_limpio):
            errores.append("El RUT no tiene un formato válido.")

        # Email
        if not re.fullmatch(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
            errores.append("El correo electrónico no es válido.")

        # Teléfono
        if not re.fullmatch(r"(\+?56)?9\d{8}", telefono):
            errores.append("El teléfono no tiene un formato válido.")

        # Región
        region = None
        if not region_id.isdigit():
            errores.append("Debes seleccionar una región.")
        else:
            region = db.session.get(Region, int(region_id))
            if region is None:
                errores.append("La región seleccionada no existe.")

        # Comuna
        comuna = None
        if len(comuna_nombre) < 2 or len(comuna_nombre) > 60:
            errores.append("La comuna debe tener entre 2 y 60 caracteres.")
        
        elif region is not None:
            comuna = Comuna.query.filter(
                Comuna.region_id == region.id,
                db.func.lower(db.func.trim(Comuna.nombre)) == comuna_nombre.lower().strip()
            ).first()

            if comuna is None:
                errores.append("La comuna no pertenece a la región seleccionada.")

        # Dirección opcional
        if direccion and len(direccion) < 5:
            errores.append("La dirección debe tener al menos 5 caracteres.")

        # RUT duplicado
        if not errores and Voluntario.query.filter_by(rut=rut_limpio).first():
            errores.append("Ya existe un voluntario registrado con ese RUT.")

        if errores:
            for error in errores:
                flash(error, "error")

            return render_template(
                "voluntario.html",
                datos=request.form
            )

        nuevo_voluntario = Voluntario(
            nombre=nombre,
            apellido=apellido,
            rut=rut_limpio,
            email=email,
            telefono=telefono,
            fecha_registro=datetime.now(),
            comuna_id=comuna.id,
            direccion=direccion if direccion else None
        )

        db.session.add(nuevo_voluntario)
        db.session.commit()

        flash("¡Voluntario registrado correctamente!", "exito")

        return redirect(url_for("voluntario"))

    return render_template("voluntario.html")

@app.route("/avistamiento", methods=["GET", "POST"])
def avistamiento():
    voluntarios = Voluntario.query.order_by(Voluntario.nombre).all()
    aves = Ave.query.order_by(Ave.nombre).all()

    if request.method == "POST":
        voluntario_id = request.form.get("voluntario", "").strip()
        tipo = request.form.get("tipoAve", "").strip()
        nombre_ave = request.form.get("nombreAve", "").strip()
        lugar = request.form.get("lugar", "").strip()
        fecha = request.form.get("fecha", "").strip()
        hora = request.form.get("hora", "").strip()
        descripcion = request.form.get("descripcion", "").strip()

        errores = []

        # Voluntario
        voluntario = None
        if not voluntario_id.isdigit():
            errores.append("Debes seleccionar un voluntario.")
        else:
            voluntario = db.session.get(Voluntario, int(voluntario_id))
            if voluntario is None:
                errores.append("El voluntario seleccionado no existe.")

        # Tipo de ave
        tipos_validos = [
            "rapaz",
            "marina",
            "acuática",
            "terrestre",
            "urbana",
            "migratoria",
            "otro"
        ]

        if tipo not in tipos_validos:
            errores.append("Debes seleccionar un tipo de ave.")

        # Nombre del ave
        if not re.fullmatch(r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]{2,80}", nombre_ave):
            errores.append("El nombre del ave no es válido.")

        # Lugar
        if len(lugar) < 3 or len(lugar) > 200:
            errores.append("El lugar debe tener entre 3 y 200 caracteres.")

        # Fecha y hora
        fecha_hora = None

        try:
            fecha_hora = datetime.strptime(
                f"{fecha} {hora}",
                "%Y-%m-%d %H:%M"
            )
        except ValueError:
            errores.append("La fecha y hora no son válidas.")

        if fecha_hora:
            ahora = datetime.now()

            if fecha_hora > ahora:
                errores.append("La fecha y hora no pueden estar en el futuro.")

            if fecha_hora.year < ahora.year - 10:
                errores.append("El avistamiento no puede tener más de 10 años.")

        # Archivos
        archivos = request.files.getlist("evidencia")

        if not archivos or all(archivo.filename == "" for archivo in archivos):
            errores.append("Debes adjuntar al menos una evidencia.")

        if errores:
            for error in errores:
                flash(error, "error")

            return render_template(
                "avistamiento.html",
                voluntarios=voluntarios,
                aves=aves,
                datos=request.form
            )

        # Buscar ave por nombre
        ave = Ave.query.filter(
            db.func.lower(Ave.nombre) == nombre_ave.lower()
        ).first()

        # Si no existe, crearla
        if ave is None:
            ave = Ave(
                nombre=nombre_ave,
                tipo=None
            )
            db.session.add(ave)
            db.session.flush()

        nuevo_avistamiento = Avistamiento(
            voluntario_id=voluntario.id,
            ave_id=ave.id,
            fecha_hora=fecha_hora,
            lugar=lugar,
            tipo=tipo,
            descripcion=descripcion if descripcion else None
        )

        db.session.add(nuevo_avistamiento)
        db.session.flush()

        for archivo in archivos:
            if archivo and archivo.filename:
                nombre_original = archivo.filename
                nombre_seguro = secure_filename(nombre_original)

                ruta = os.path.join(
                    app.config["UPLOAD_FOLDER"],
                    nombre_seguro
                )

                archivo.save(ruta)

                nuevo_registro = Registro(
                    ruta_archivo=ruta,
                    nombre_archivo=nombre_original,
                    avistamiento_id=nuevo_avistamiento.id
                )

                db.session.add(nuevo_registro)

        db.session.commit()

        flash("¡Avistamiento registrado correctamente!", "exito")

        return redirect(url_for("inicio"))

    return render_template(
        "avistamiento.html",
        voluntarios=voluntarios,
        aves=aves
    )

@app.route("/avistamientos")
def avistamientos():
    pagina = request.args.get("pagina", 1, type=int)

    paginacion = (
        Avistamiento.query
        .order_by(Avistamiento.fecha_hora.desc())
        .paginate(
            page=pagina,
            per_page=10,
            error_out=False
        )
    )

    return render_template(
        "avistamientos.html",
        avistamientos=paginacion.items,
        paginacion=paginacion
    )

@app.route("/avistamiento/<int:id>")
def detalle_avistamiento(id):
    avistamiento = db.session.get(Avistamiento, id)

    if avistamiento is None:
        return "Avistamiento no encontrado", 404

    return render_template(
        "detalle_avistamiento.html",
        avistamiento=avistamiento
    )

if __name__ == "__main__":
    app.run(debug=True)