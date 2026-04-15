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
    <div className="container">
      <h2>Profesores</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
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
        <div className="col-md-2">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ rut: '', nombre: '', apellido: '', especialidad: '' }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>RUT</th><th>Nombre</th><th>Apellido</th><th>Especialidad</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.rut}</td><td>{item.nombre}</td><td>{item.apellido}</td><td>{item.especialidad}</td>
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
