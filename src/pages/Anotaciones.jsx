import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Anotaciones() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ alumnoId: '', tipo: '', descripcion: '', fecha: '', profesorId: '' });
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/api/anotaciones').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, alumnoId: parseInt(form.alumnoId), profesorId: parseInt(form.profesorId) };
    if (editId) {
      await api.put(`/api/anotaciones/${editId}`, data);
    } else {
      await api.post('/api/anotaciones', data);
    }
    setForm({ alumnoId: '', tipo: '', descripcion: '', fecha: '', profesorId: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ alumnoId: item.alumnoId, tipo: item.tipo, descripcion: item.descripcion, fecha: item.fecha, profesorId: item.profesorId });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar esta anotacion?')) {
      await api.delete(`/api/anotaciones/${id}`);
      load();
    }
  };

  const tipoIcon = (t) => t === 'Positiva' ? 'bi-hand-thumbs-up' : t === 'Negativa' ? 'bi-exclamation-triangle' : 'bi-info-circle';
  const tipoClass = (t) => t === 'Positiva' ? 'bg-success' : t === 'Negativa' ? 'bg-danger' : 'bg-info';

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-journal-text"></i></div>
        <div>
          <h2>Anotaciones de Conducta</h2>
          <p>Registra observaciones positivas, negativas y generales sobre los alumnos.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          {editId ? 'Editar anotacion' : 'Nueva anotacion'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-1">
              <input className="form-control" type="number" placeholder="Alumno ID" value={form.alumnoId}
                onChange={e => setForm({ ...form, alumnoId: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} required>
                <option value="">Tipo...</option>
                <option value="Positiva">Positiva</option>
                <option value="Negativa">Negativa</option>
                <option value="Observacion">Observacion</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Descripcion" value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="date" value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            </div>
            <div className="col-md-1">
              <input className="form-control" type="number" placeholder="Prof ID" value={form.profesorId}
                onChange={e => setForm({ ...form, profesorId: e.target.value })} required />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Crear'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ alumnoId: '', tipo: '', descripcion: '', fecha: '', profesorId: '' }); }}>
                <i className="bi bi-x-lg"></i> Cancelar
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-list-ul"></i>
          Bitacora de anotaciones
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>Alumno ID</th><th>Tipo</th><th>Descripcion</th><th>Fecha</th><th>Profesor ID</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="text-muted">{item.alumnoId}</td>
                  <td><span className={`badge ${tipoClass(item.tipo)}`}><i className={`bi ${tipoIcon(item.tipo)}`}></i> {item.tipo}</span></td>
                  <td>{item.descripcion}</td>
                  <td className="text-muted">{item.fecha}</td>
                  <td className="text-muted">{item.profesorId}</td>
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
                <tr><td colSpan={7}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay anotaciones registradas.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
