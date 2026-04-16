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
    <div className="container lcd-page">
      <header className="lcd-page-header">
        <div className="lcd-page-icon"><i className="bi bi-envelope"></i></div>
        <div>
          <h2>Mensajeria</h2>
          <p>Comunicacion interna entre docentes, apoderados y personal.</p>
        </div>
      </header>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-pencil-square"></i>
          Redactar mensaje
        </div>
        <div className="lcd-card-body">
          <form onSubmit={handleSubmit} className="row g-2">
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
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-send"></i> Enviar
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="lcd-card">
        <div className="lcd-card-header">
          <i className="bi bi-inbox"></i>
          Bandeja de mensajes
          <span className="ms-auto badge bg-light text-dark border">{items.length}</span>
        </div>
        <div className="table-responsive-wrap">
          <table className="table table-hover">
            <thead><tr><th>ID</th><th>De</th><th>Para</th><th>Asunto</th><th>Contenido</th><th>Fecha</th><th>Estado</th><th className="text-end">Acciones</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={!item.leido ? 'fw-bold' : ''}>
                  <td className="lcd-id">#{item.id}</td>
                  <td className="text-muted">{item.remitenteId}</td>
                  <td className="text-muted">{item.destinatarioId}</td>
                  <td>{item.asunto}</td>
                  <td className="text-muted">{item.contenido}</td>
                  <td className="text-muted">{item.fecha}</td>
                  <td>
                    <span className={`badge ${item.leido ? 'bg-secondary' : 'bg-primary'}`}>
                      <i className={`bi ${item.leido ? 'bi-envelope-open' : 'bi-envelope-fill'}`}></i> {item.leido ? 'Leido' : 'No leido'}
                    </span>
                  </td>
                  <td className="text-end">
                    {!item.leido && <button className="btn btn-sm btn-success me-1" onClick={() => handleMarcarLeido(item.id)}>
                      <i className="bi bi-check2"></i> Marcar leido
                    </button>}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={8}><div className="lcd-empty"><i className="bi bi-inbox"></i>La bandeja esta vacia.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
