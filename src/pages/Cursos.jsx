import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Cursos() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: '', nivel: '', seccion: '', anio: new Date().getFullYear() });
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/api/cursos').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, anio: parseInt(form.anio) };
    if (editId) {
      await api.put(`/api/cursos/${editId}`, data);
    } else {
      await api.post('/api/cursos', data);
    }
    setForm({ nombre: '', nivel: '', seccion: '', anio: new Date().getFullYear() });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ nombre: item.nombre, nivel: item.nivel, seccion: item.seccion, anio: item.anio });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar este curso?')) {
      await api.delete(`/api/cursos/${id}`);
      load();
    }
  };

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-collection"></i></div>
        <div>
          <h2>Cursos</h2>
          <p>Organiza los cursos por nivel, seccion y ano academico.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          {editId ? 'Editar curso' : 'Nuevo curso'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="Nombre (ej: 1ro Basico)" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Nivel" value={form.nivel}
                onChange={e => setForm({ ...form, nivel: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Seccion (A, B)" value={form.seccion}
                onChange={e => setForm({ ...form, seccion: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="number" placeholder="Anio" value={form.anio}
                onChange={e => setForm({ ...form, anio: e.target.value })} required />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ nombre: '', nivel: '', seccion: '', anio: new Date().getFullYear() }); }}>
                <i className="bi bi-x-lg"></i> Cancelar
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-list-ul"></i>
          Listado de cursos
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>Nombre</th><th>Nivel</th><th>Seccion</th><th>Ano</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td>{item.nivel}</td>
                  <td><span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">{item.seccion}</span></td>
                  <td className="text-muted">{item.anio}</td>
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
                <tr><td colSpan={6}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay cursos registrados.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
