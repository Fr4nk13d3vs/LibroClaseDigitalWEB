import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Asignaturas', icon: 'bi-journal-bookmark' },
    { to: '/cursos', label: 'Cursos', icon: 'bi-collection' },
    { to: '/alumnos', label: 'Alumnos', icon: 'bi-mortarboard' },
    { to: '/profesores', label: 'Profesores', icon: 'bi-person-video3' },
    { to: '/evaluaciones', label: 'Evaluaciones', icon: 'bi-clipboard-check' },
    { to: '/asistencia', label: 'Asistencia', icon: 'bi-calendar-check' },
    { to: '/anotaciones', label: 'Anotaciones', icon: 'bi-journal-text' },
    { to: '/mensajes', label: 'Mensajes', icon: 'bi-envelope' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark lcd-navbar mb-4">
      <div className="container-fluid px-lg-4">
        <Link className="navbar-brand" to="/">
          <span className="lcd-brand-badge"><i className="bi bi-book-half"></i></span>
          <span>
            Libro de Clases Digital
            <small>Plataforma educativa</small>
          </span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {links.map(link => (
              <li className="nav-item" key={link.to}>
                <Link
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                  to={link.to}
                >
                  <i className={`bi ${link.icon}`}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
