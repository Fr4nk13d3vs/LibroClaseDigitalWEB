import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Alumnos() {
  const [items, setItems] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ rut: '', nombre: '', apellido: '', fechaNacimiento: '', curso: null });
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get('/api/alumnos').then(r => setItems(r.data));
    api.get('/api/cursos').then(r => setCursos(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, curso: form.curso ? { id: parseInt(form.curso) } : null };
    if (editId) {
      await api.put(`/api/alumnos/${editId}`, data);
    } else {
      await api.post('/api/alumnos', data);
    }
    setForm({ rut: '', nombre: '', apellido: '', fechaNacimiento: '', curso: null });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ rut: item.rut, nombre: item.nombre, apellido: item.apellido, fechaNacimiento: item.fechaNacimiento || '', curso: item.curso ? item.curso.id : null });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar este alumno?')) {
      await api.delete(`/api/alumnos/${id}`);
      load();
    }
  };

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-mortarboard"></i></div>
        <div>
          <h2>Alumnos</h2>
          <p>Registra y administra la informacion de los estudiantes.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-person-plus'}`}></i>
          {editId ? 'Editar alumno' : 'Nuevo alumno'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-2">
              <input className="form-control" placeholder="RUT" value={form.rut}
                onChange={e => setForm({ ...form, rut: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Nombre" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Apellido" value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="date" value={form.fechaNacimiento}
                onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.curso || ''} onChange={e => setForm({ ...form, curso: e.target.value || null })}>
                <option value="">Sin curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.seccion}</option>)}
              </select>
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ rut: '', nombre: '', apellido: '', fechaNacimiento: '', curso: null }); }}>
                <i className="bi bi-x-lg"></i>
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-people"></i>
          Listado de alumnos
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>RUT</th><th>Nombre</th><th>Apellido</th><th>Nacimiento</th><th>Curso</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="text-muted">{item.rut}</td>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td className="fw-semibold">{item.apellido}</td>
                  <td className="text-muted">{item.fechaNacimiento}</td>
                  <td>{item.curso ? <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">{item.curso.nombre}</span> : <span className="text-muted">-</span>}</td>
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
                <tr><td colSpan={7}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay alumnos registrados.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
