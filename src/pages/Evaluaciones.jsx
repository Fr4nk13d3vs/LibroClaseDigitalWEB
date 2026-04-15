import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Evaluaciones() {
  const [items, setItems] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [form, setForm] = useState({ nombre: '', tipo: '', fecha: '', nota: '', alumno: '', asignatura: '' });
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get('/api/evaluaciones').then(r => setItems(r.data));
    api.get('/api/alumnos').then(r => setAlumnos(r.data));
    api.get('/api/asignaturas').then(r => setAsignaturas(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombre: form.nombre, tipo: form.tipo, fecha: form.fecha,
      nota: parseFloat(form.nota),
      alumno: { id: parseInt(form.alumno) },
      asignatura: { id: parseInt(form.asignatura) }
    };
    if (editId) {
      await api.put(`/api/evaluaciones/${editId}`, data);
    } else {
      await api.post('/api/evaluaciones', data);
    }
    setForm({ nombre: '', tipo: '', fecha: '', nota: '', alumno: '', asignatura: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      nombre: item.nombre, tipo: item.tipo, fecha: item.fecha,
      nota: item.nota, alumno: item.alumno?.id || '', asignatura: item.asignatura?.id || ''
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar esta evaluacion?')) {
      await api.delete(`/api/evaluaciones/${id}`);
      load();
    }
  };

  return (
    <div className="container">
      <h2>Evaluaciones</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-2">
          <input className="form-control" placeholder="Nombre" value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} required>
            <option value="">Tipo...</option>
            <option value="Prueba">Prueba</option>
            <option value="Tarea">Tarea</option>
            <option value="Examen">Examen</option>
            <option value="Trabajo">Trabajo</option>
          </select>
        </div>
        <div className="col-md-1">
          <input className="form-control" type="date" value={form.fecha}
            onChange={e => setForm({ ...form, fecha: e.target.value })} required />
        </div>
        <div className="col-md-1">
          <input className="form-control" type="number" step="0.1" min="1" max="7" placeholder="Nota" value={form.nota}
            onChange={e => setForm({ ...form, nota: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={form.alumno} onChange={e => setForm({ ...form, alumno: e.target.value })} required>
            <option value="">Alumno...</option>
            {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={form.asignatura} onChange={e => setForm({ ...form, asignatura: e.target.value })} required>
            <option value="">Asignatura...</option>
            {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary me-2" type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ nombre: '', tipo: '', fecha: '', nota: '', alumno: '', asignatura: '' }); }}>Cancelar</button>}
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Nombre</th><th>Tipo</th><th>Fecha</th><th>Nota</th><th>Alumno</th><th>Asignatura</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td><td>{item.nombre}</td><td>{item.tipo}</td><td>{item.fecha}</td><td>{item.nota}</td>
              <td>{item.alumno ? `${item.alumno.nombre} ${item.alumno.apellido}` : '-'}</td>
              <td>{item.asignatura ? item.asignatura.nombre : '-'}</td>
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
