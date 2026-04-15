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
    <div className="container">
      <h2>Cursos</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
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
        <div className="col-md-3">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ nombre: '', nivel: '', seccion: '', anio: new Date().getFullYear() }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Nombre</th><th>Nivel</th><th>Seccion</th><th>Anio</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.nombre}</td><td>{item.nivel}</td><td>{item.seccion}</td><td>{item.anio}</td>
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
