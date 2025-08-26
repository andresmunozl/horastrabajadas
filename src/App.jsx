import { useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  const [formData, setFormData] = useState({
    concepts: '',
    attendanceIn: '',
    attendanceOut: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.concepts.trim()) newErrors.concepts = 'El concepto es obligatorio';
    if (!formData.attendanceIn) newErrors.attendanceIn = 'La hora de entrada es obligatoria';
    if (!formData.attendanceOut) newErrors.attendanceOut = 'La hora de salida es obligatoria';
    return newErrors;
  };

  const conceptsTemplate = `[{"id":"HO","name":"HO","start":"08:00","end":"17:59"},{"id":"HED","name":"HED","start":"18:00","end":"20:59"},{"id":"HEN","name":"HEN","start":"21:00","end":"05:59"}]`;
  const handleLoadTemplate = () => {
    setFormData({
      ...formData,
      concepts: conceptsTemplate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const parsedConcepts = parseConcepts(formData.concepts);
    if (!parsedConcepts) return;

    const payload = buildPayload(parsedConcepts);

    await submitForm(payload);
  };

  const isFormValid = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const parseConcepts = (conceptsString) => {
    const cleanedString = conceptsString.replace(/[\t\r\n]+/g, '').trim();

    try {
      const parsed = JSON.parse(cleanedString);
      if (!Array.isArray(parsed)) {
        throw new Error('El campo "concepts" debe ser un array de objetos');
      }
      return parsed;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        concepts: 'El campo "Configuración de conceptos" debe ser un JSON válido (ej. [{...}, {...}])'
      }));
      return null;
    }
  };

  const buildPayload = (parsedConcepts) => ({
    concepts: parsedConcepts,
    attendanceIn: formData.attendanceIn,
    attendanceOut: formData.attendanceOut
  });

  const submitForm = async (payload) => {
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('https://falconcloud.co/site_srv10_ph/site/api/qserv.php/13465-770721', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (Object.keys(data).length === 0) {
        toast('El servidor no devolvió resultados. Verifica la información enviada.');
      } else {
        toast('Formulario enviado con éxito');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al enviar los datos');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>Calcular Horas Trabajadas</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>

        <div>
          <label>Configuración de conceptos (JSON):</label>
          <textarea
            name="concepts"
            value={formData.concepts}
            onChange={handleChange}
            rows="6"
            placeholder='Ejemplo: [{"id":"HO","name":"HO","start":"08:00","end":"17:59"}]'
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.concepts && <p style={{ color: 'red', fontSize: '14px' }}>{errors.concepts}</p>}
          <p>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLoadTemplate(); }}>
              Usar plantilla por defecto
            </a>
          </p>
        </div>

        <div>
          <label>Hora de entrada:</label>
          <input
            type="time"
            name="attendanceIn"
            value={formData.attendanceIn}
            onChange={handleChange}
          />
          {errors.attendanceIn && <p style={{ color: 'red', fontSize: '14px' }}>{errors.attendanceIn}</p>}
        </div>

        <div>
          <label>Hora de salida:</label>
          <input
            type="time"
            name="attendanceOut"
            value={formData.attendanceOut}
            onChange={handleChange}
          />
          {errors.attendanceOut && <p style={{ color: 'red', fontSize: '14px' }}>{errors.attendanceOut}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      <div>
        <ToastContainer autoClose={3000} />
      </div>

    </div>
  );
}

export default App;
