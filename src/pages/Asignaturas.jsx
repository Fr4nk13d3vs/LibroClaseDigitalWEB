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
    <div className="container">
      <h2>Asignaturas</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
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
        <div className="col-md-3">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ codigo: '', nombre: '', descripcion: '' }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Codigo</th><th>Nombre</th><th>Descripcion</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.codigo}</td><td>{item.nombre}</td><td>{item.descripcion}</td>
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
