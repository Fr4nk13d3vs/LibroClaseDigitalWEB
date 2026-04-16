import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Asistencia() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ alumnoId: '', fecha: '', presente: true, justificacion: '' });
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/api/asistencias').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, alumnoId: parseInt(form.alumnoId), presente: form.presente === true || form.presente === 'true' };
    if (editId) {
      await api.put(`/api/asistencias/${editId}`, data);
    } else {
      await api.post('/api/asistencias', data);
    }
    setForm({ alumnoId: '', fecha: '', presente: true, justificacion: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ alumnoId: item.alumnoId, fecha: item.fecha, presente: item.presente, justificacion: item.justificacion || '' });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar este registro?')) {
      await api.delete(`/api/asistencias/${id}`);
      load();
    }
  };

  return (
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-calendar-check"></i></div>
        <div>
          <h2>Registro de Asistencia</h2>
          <p>Controla la asistencia diaria y las justificaciones de los alumnos.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className={`bi ${editId ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
          {editId ? 'Editar registro' : 'Nuevo registro'}
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-2">
              <input className="form-control" type="number" placeholder="ID Alumno" value={form.alumnoId}
                onChange={e => setForm({ ...form, alumnoId: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="date" value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.presente.toString()} onChange={e => setForm({ ...form, presente: e.target.value })}>
                <option value="true">Presente</option>
                <option value="false">Ausente</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Justificacion (opcional)" value={form.justificacion}
                onChange={e => setForm({ ...form, justificacion: e.target.value })} />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-plus-lg'}`}></i>
                {editId ? 'Actualizar' : 'Registrar'}
              </button>
              {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ alumnoId: '', fecha: '', presente: true, justificacion: '' }); }}>
                <i className="bi bi-x-lg"></i> Cancelar
              </button>}
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-list-ul"></i>
          Registros
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>Alumno ID</th><th>Fecha</th><th>Estado</th><th>Justificacion</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="text-muted">{item.alumnoId}</td>
                  <td>{item.fecha}</td>
                  <td>
                    <span className={`badge ${item.presente ? 'bg-success' : 'bg-danger'}`}>
                      <i className={`bi ${item.presente ? 'bi-check-circle' : 'bi-x-circle'}`}></i> {item.presente ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                  <td className="text-muted">{item.justificacion || '-'}</td>
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
                <tr><td colSpan={6}><div className="lcd-empty"><i className="bi bi-inbox"></i>No hay registros de asistencia.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
