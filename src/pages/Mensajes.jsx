import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Mensajes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ remitenteId: '', destinatarioId: '', asunto: '', contenido: '', fecha: '' });

  const load = () => api.get('/api/mensajes').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      remitenteId: parseInt(form.remitenteId),
      destinatarioId: parseInt(form.destinatarioId)
    };
    await api.post('/api/mensajes', data);
    setForm({ remitenteId: '', destinatarioId: '', asunto: '', contenido: '', fecha: '' });
    load();
  };

  const handleMarcarLeido = async (id) => {
    await api.patch(`/api/mensajes/${id}/leer`);
    load();
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar este mensaje?')) {
      await api.delete(`/api/mensajes/${id}`);
      load();
    }
  };

  return (
    <div className="container">
      <h2>Mensajeria</h2>
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-1">
          <input className="form-control" type="number" placeholder="De (ID)" value={form.remitenteId}
            onChange={e => setForm({ ...form, remitenteId: e.target.value })} required />
        </div>
        <div className="col-md-1">
          <input className="form-control" type="number" placeholder="Para (ID)" value={form.destinatarioId}
            onChange={e => setForm({ ...form, destinatarioId: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Asunto" value={form.asunto}
            onChange={e => setForm({ ...form, asunto: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Contenido" value={form.contenido}
            onChange={e => setForm({ ...form, contenido: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="date" value={form.fecha}
            onChange={e => setForm({ ...form, fecha: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" type="submit">Enviar</button>
        </div>
      </form>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>De</th><th>Para</th><th>Asunto</th><th>Contenido</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className={!item.leido ? 'fw-bold' : ''}>
              <td>{item.id}</td><td>{item.remitenteId}</td><td>{item.destinatarioId}</td>
              <td>{item.asunto}</td><td>{item.contenido}</td><td>{item.fecha}</td>
              <td><span className={`badge ${item.leido ? 'bg-secondary' : 'bg-primary'}`}>{item.leido ? 'Leido' : 'No leido'}</span></td>
              <td>
                {!item.leido && <button className="btn btn-sm btn-success me-1" onClick={() => handleMarcarLeido(item.id)}>Marcar leido</button>}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
