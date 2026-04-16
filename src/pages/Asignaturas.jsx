import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Asignaturas() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', descripcion: '' });
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/api/asignaturas').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/api/asignaturas/${editId}`, form);
    } else {
      await api.post('/api/asignaturas', form);
    }
    setForm({ codigo: '', nombre: '', descripcion: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ codigo: item.codigo, nombre: item.nombre, descripcion: item.descripcion || '' });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar esta asignatura?')) {
      await api.delete(`/api/asignaturas/${id}`);
      load();
    }
  };

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-journal-bookmark"></i></div>
        <div>
          <h2>Asignaturas</h2>
          <p>Administra las materias impartidas en la institucion.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          {editId ? 'Editar asignatura' : 'Nueva asignatura'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-2">
              <input className="form-control" placeholder="Codigo" value={form.codigo}
                onChange={e => setForm({ ...form, codigo: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Nombre" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Descripcion" value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ codigo: '', nombre: '', descripcion: '' }); }}>
                <i className="bi bi-x-lg"></i> Cancelar
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-list-ul"></i>
          Listado de asignaturas
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>Codigo</th><th>Nombre</th><th>Descripcion</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td><span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">{item.codigo}</span></td>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td className="text-muted">{item.descripcion}</td>
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
                <tr><td colSpan={5}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay asignaturas registradas.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
