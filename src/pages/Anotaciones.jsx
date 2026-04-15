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

  return (
    <div className="container">
      <h2>Anotaciones de Conducta</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
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
        <div className="col-md-3">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ alumnoId: '', tipo: '', descripcion: '', fecha: '', profesorId: '' }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Alumno ID</th><th>Tipo</th><th>Descripcion</th><th>Fecha</th><th>Profesor ID</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.alumnoId}</td>
              <td><span className={`badge ${item.tipo === 'Positiva' ? 'bg-success' : item.tipo === 'Negativa' ? 'bg-danger' : 'bg-info'}`}>{item.tipo}</span></td>
              <td>{item.descripcion}</td><td>{item.fecha}</td><td>{item.profesorId}</td>
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
