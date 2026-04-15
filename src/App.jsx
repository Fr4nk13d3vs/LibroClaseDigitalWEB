import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Asignaturas from './pages/Asignaturas'
import Cursos from './pages/Cursos'
import Alumnos from './pages/Alumnos'
import Profesores from './pages/Profesores'
import Evaluaciones from './pages/Evaluaciones'
import Asistencia from './pages/Asistencia'
import Anotaciones from './pages/Anotaciones'
import Mensajes from './pages/Mensajes'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Asignaturas />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/alumnos" element={<Alumnos />} />
        <Route path="/profesores" element={<Profesores />} />
        <Route path="/evaluaciones" element={<Evaluaciones />} />
        <Route path="/asistencia" element={<Asistencia />} />
        <Route path="/anotaciones" element={<Anotaciones />} />
        <Route path="/mensajes" element={<Mensajes />} />
      </Routes>
    </>
  )
}
