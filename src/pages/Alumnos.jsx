import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Alumnos() {
  const [items, setItems] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ rut: '', nombre: '', apellido: '', fechaNacimiento: '', curso: null });
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get('/api/alumnos').then(r => setItems(r.data));
    api.get('/api/cursos').then(r => setCursos(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, curso: form.curso ? { id: parseInt(form.curso) } : null };
    if (editId) {
      await api.put(`/api/alumnos/${editId}`, data);
    } else {
      await api.post('/api/alumnos', data);
    }
    setForm({ rut: '', nombre: '', apellido: '', fechaNacimiento: '', curso: null });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({ rut: item.rut, nombre: item.nombre, apellido: item.apellido, fechaNacimiento: item.fechaNacimiento || '', curso: item.curso ? item.curso.id : null });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar este alumno?')) {
      await api.delete(`/api/alumnos/${id}`);
      load();
    }
  };

  return (
    <div className="container">
      <h2>Alumnos</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-2">
          <input className="form-control" placeholder="RUT" value={form.rut}
            onChange={e => setForm({ ...form, rut: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Nombre" value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Apellido" value={form.apellido}
            onChange={e => setForm({ ...form, apellido: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="date" value={form.fechaNacimiento}
            onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={form.curso || ''} onChange={e => setForm({ ...form, curso: e.target.value || null })}>
            <option value="">Sin curso</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.seccion}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ rut: '', nombre: '', apellido: '', fechaNacimiento: '', curso: null }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>RUT</th><th>Nombre</th><th>Apellido</th><th>Nacimiento</th><th>Curso</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.rut}</td><td>{item.nombre}</td><td>{item.apellido}</td>
              <td>{item.fechaNacimiento}</td><td>{item.curso ? item.curso.nombre : '-'}</td>
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
