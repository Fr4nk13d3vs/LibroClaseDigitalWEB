import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Profesores() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ rut: '', nombre: '', apellido: '', especialidad: '' });
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/api/profesores').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/api/profesores/${editId}`, form);
    } else {
      await api.post('/api/profesores', form);
    }
    setForm({ rut: '', nombre: '', apellido: '', especialidad: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ rut: item.rut, nombre: item.nombre, apellido: item.apellido, especialidad: item.especialidad || '' });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar este profesor?')) {
      await api.delete(`/api/profesores/${id}`);
      load();
    }
  };

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-person-video3"></i></div>
        <div>
          <h2>Profesores</h2>
          <p>Gestiona los datos del equipo docente y sus especialidades.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-person-plus'}`}></i>
          {editId ? 'Editar profesor' : 'Nuevo profesor'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-2">
              <input className="form-control" placeholder="RUT" value={form.rut}
                onChange={e => setForm({ ...form, rut: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Nombre" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Apellido" value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Especialidad" value={form.especialidad}
                onChange={e => setForm({ ...form, especialidad: e.target.value })} />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ rut: '', nombre: '', apellido: '', especialidad: '' }); }}>
                <i className="bi bi-x-lg"></i>
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-list-ul"></i>
          Equipo docente
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>RUT</th><th>Nombre</th><th>Apellido</th><th>Especialidad</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="text-muted">{item.rut}</td>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td className="fw-semibold">{item.apellido}</td>
                  <td>{item.especialidad && <span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">{item.especialidad}</span>}</td>
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
                <tr><td colSpan={6}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay profesores registrados.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
