import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Evaluaciones() {
  const [items, setItems] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [form, setForm] = useState({ nombre: '', tipo: '', fecha: '', nota: '', alumno: '', asignatura: '' });
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get('/api/evaluaciones').then(r => setItems(r.data));
    api.get('/api/alumnos').then(r => setAlumnos(r.data));
    api.get('/api/asignaturas').then(r => setAsignaturas(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombre: form.nombre, tipo: form.tipo, fecha: form.fecha,
      nota: parseFloat(form.nota),
      alumno: { id: parseInt(form.alumno) },
      asignatura: { id: parseInt(form.asignatura) }
    };
    if (editId) {
      await api.put(`/api/evaluaciones/${editId}`, data);
    } else {
      await api.post('/api/evaluaciones', data);
    }
    setForm({ nombre: '', tipo: '', fecha: '', nota: '', alumno: '', asignatura: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      nombre: item.nombre, tipo: item.tipo, fecha: item.fecha,
      nota: item.nota, alumno: item.alumno?.id || '', asignatura: item.asignatura?.id || ''
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar esta evaluacion?')) {
      await api.delete(`/api/evaluaciones/${id}`);
      load();
    }
  };

  const notaBadge = (n) => {
    if (n === null || n === undefined) return 'bg-secondary';
    if (n >= 6) return 'bg-success';
    if (n >= 4) return 'bg-warning text-dark';
    return 'bg-danger';
  };

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-clipboard-check"></i></div>
        <div>
          <h2>Evaluaciones</h2>
          <p>Registra pruebas, tareas y calificaciones de los estudiantes.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          {editId ? 'Editar evaluacion' : 'Nueva evaluacion'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-2">
              <input className="form-control" placeholder="Nombre" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} required>
                <option value="">Tipo...</option>
                <option value="Prueba">Prueba</option>
                <option value="Tarea">Tarea</option>
                <option value="Examen">Examen</option>
                <option value="Trabajo">Trabajo</option>
              </select>
            </div>
            <div className="col-md-1">
              <input className="form-control" type="date" value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            </div>
            <div className="col-md-1">
              <input className="form-control" type="number" step="0.1" min="1" max="7" placeholder="Nota" value={form.nota}
                onChange={e => setForm({ ...form, nota: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.alumno} onChange={e => setForm({ ...form, alumno: e.target.value })} required>
                <option value="">Alumno...</option>
                {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.asignatura} onChange={e => setForm({ ...form, asignatura: e.target.value })} required>
                <option value="">Asignatura...</option>
                {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ nombre: '', tipo: '', fecha: '', nota: '', alumno: '', asignatura: '' }); }}>
                <i className="bi bi-x-lg"></i>
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-list-ul"></i>
          Registro de evaluaciones
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>Nombre</th><th>Tipo</th><th>Fecha</th><th>Nota</th><th>Alumno</th><th>Asignatura</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td><span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">{item.tipo}</span></td>
                  <td className="text-muted">{item.fecha}</td>
                  <td><span className={`badge ${notaBadge(item.nota)}`}>{item.nota}</span></td>
                  <td>{item.alumno ? `${item.alumno.nombre} ${item.alumno.apellido}` : '-'}</td>
                  <td className="text-muted">{item.asignatura ? item.asignatura.nombre : '-'}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(item)}>
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={8}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay evaluaciones registradas.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
