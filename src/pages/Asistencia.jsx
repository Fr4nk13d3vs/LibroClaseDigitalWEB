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
    <div className="container">
      <h2>Registro de Asistencia</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
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
        <div className="col-md-3">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Registrar'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ alumnoId: '', fecha: '', presente: true, justificacion: '' }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Alumno ID</th><th>Fecha</th><th>Estado</th><th>Justificacion</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.alumnoId}</td><td>{item.fecha}</td>
              <td><span className={`badge ${item.presente ? 'bg-success' : 'bg-danger'}`}>{item.presente ? 'Presente' : 'Ausente'}</span></td>
              <td>{item.justificacion || '-'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(item)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
