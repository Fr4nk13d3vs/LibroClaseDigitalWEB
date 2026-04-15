import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Asignaturas' },
    { to: '/cursos', label: 'Cursos' },
    { to: '/alumnos', label: 'Alumnos' },
    { to: '/profesores', label: 'Profesores' },
    { to: '/evaluaciones', label: 'Evaluaciones' },
    { to: '/asistencia', label: 'Asistencia' },
    { to: '/anotaciones', label: 'Anotaciones' },
    { to: '/mensajes', label: 'Mensajes' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Libro de Clases Digital</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {links.map(link => (
              <li className="nav-item" key={link.to}>
                <Link
                  className={`nav-link ${location.pathname === link.to ? 'active fw-bold' : ''}`}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
