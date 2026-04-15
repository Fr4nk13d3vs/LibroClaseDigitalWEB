# Libro de Clases Digital — Frontend

Interfaz web para el sistema de gestion academica del Colegio Bernardo O'Higgins. Consume los microservicios del backend a traves del API Gateway.

## Tecnologias

- React 18
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- Nginx (produccion)

## Paginas

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| Asignaturas | `/` | CRUD de asignaturas |
| Cursos | `/cursos` | CRUD de cursos |
| Alumnos | `/alumnos` | CRUD de alumnos |
| Profesores | `/profesores` | CRUD de profesores |
| Evaluaciones | `/evaluaciones` | CRUD de evaluaciones |
| Asistencia | `/asistencia` | Registro de asistencia |
| Anotaciones | `/anotaciones` | Anotaciones de conducta |
| Mensajes | `/mensajes` | Envio y lectura de mensajes |

## Estructura

```
src/
├── api/
│   └── axios.js            Instancia Axios configurada
├── components/
│   └── Navbar.jsx           Navegacion principal
├── pages/
│   ├── Asignaturas.jsx
│   ├── Cursos.jsx
│   ├── Alumnos.jsx
│   ├── Profesores.jsx
│   ├── Evaluaciones.jsx
│   ├── Asistencia.jsx
│   ├── Anotaciones.jsx
│   └── Mensajes.jsx
├── App.jsx                  Rutas de la aplicacion
└── main.jsx                 Punto de entrada
```

## Desarrollo local

```bash
npm install
npm run dev
```

Configurar la URL del API Gateway con variable de entorno:

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

## Despliegue con Docker

El frontend se despliega como contenedor Nginx dentro del `docker-compose.yml` del backend.

```bash
# Clonar ambos repositorios en el mismo directorio
git clone https://github.com/Fr4nk13d3vs/LibroClaseDigital.git
git clone https://github.com/Fr4nk13d3vs/LibroClaseDigitalWEB.git

# Levantar todo (incluye frontend en puerto 3000)
cd LibroClaseDigital
docker compose up -d --build
```

Acceder desde el navegador: `http://IP_SERVIDOR:3000`

## Backend

El backend con los microservicios se encuentra en:
https://github.com/Fr4nk13d3vs/LibroClaseDigital
