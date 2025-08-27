import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Welcome from './components/welcome';
import Results from './components/results';
import ConceptsList from './components/concepts';
import './App.css';


function App() {

  const [formData, setFormData] = useState({
    attendanceIn: '',
    attendanceOut: ''
  });

  const [concepts, setConcepts] = useState([]);
  const [newConcept, setNewConcept] = useState({
    name: '',
    start: '',
    end: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rawData, setRawData] = useState({});

  const generateUniqueId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    do {
      result = '';
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (concepts.some(concept => concept.id === result));
    return result;
  };

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewConceptChange = (e) => {
    setNewConcept({
      ...newConcept,
      [e.target.name]: e.target.value
    });
  };

  const handleAddConcept = (e) => {
    e.preventDefault();

    if (!newConcept.name.trim() || !newConcept.start || !newConcept.end) {
      toast.error('Todos los campos del concepto son requeridos');
      return;
    }

    const uniqueId = generateUniqueId();
    
    setConcepts([...concepts, { 
      id: uniqueId,
      ...newConcept 
    }]);
    setNewConcept({
      name: '',
      start: '',
      end: ''
    });

    toast.success('Concepto agregado correctamente');
  };

  const validate = () => {
    const newErrors = {};
    if (concepts.length === 0) newErrors.concepts = 'Debe agregar al menos un concepto';
    if (!formData.attendanceIn) newErrors.attendanceIn = 'La hora de entrada es requerida';
    if (!formData.attendanceOut) newErrors.attendanceOut = 'La hora de salida es requerida';
    return newErrors;
  };

  // Plantilla por defecto
  const defaultConcepts = [
    { "id": "HO", "name": "HO", "start": "08:00", "end": "17:59" },
    { "id": "HED", "name": "HED", "start": "18:00", "end": "20:59" },
    { "id": "HEN", "name": "HEN", "start": "21:00", "end": "05:59" }
  ];

  const handleLoadTemplate = () => {
    setConcepts(defaultConcepts);
    toast.success('Plantilla por defecto cargada');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const payload = buildPayload();
    await submitForm(payload);
  };

  const isFormValid = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const buildPayload = () => ({
    concepts: concepts,
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
        toast.warn('El servidor no devolvió resultados. Verifica la información enviada.');
      } else {
        toast.success('Formulario enviado con éxito');
        setRawData(data);
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error al enviar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {showWelcome ? (
        <Welcome onFinish={handleWelcomeFinish} />
      ) : (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100px',
              background: 'linear-gradient(90deg, #007bff, #66b2ff)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 1000,
              boxShadow: '0 5px 10px rgba(0,0,0,0.2)'

            }}
          >
            <h2>¡Bienvenido! Calcula tus horas trabajadas</h2>
          </div>


          <div className="responsive-container" style={{ marginTop: '50px', marginBottom: '30px' }}>
            <div>
              <h4>Configura tus conceptos y horas trabajadas</h4>

              <div className="container" style={{ maxWidth: '500px' }}>
                <h4>Agregar Nuevo Concepto</h4>
                <form onSubmit={handleAddConcept} className="form">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5em' }}>
                    <div className="form-group" style={{ gridColumn: '1 / 3' }}>
                      <label>Nombre del concepto:</label>
                      <input
                        type="text"
                        name="name"
                        value={newConcept.name}
                        onChange={handleNewConceptChange}
                        placeholder="ej: Horas Ordinarias"
                      />
                    </div>

                    <div className="form-group">
                      <label>Hora de inicio:</label>
                      <input
                        type="time"
                        name="start"
                        value={newConcept.start}
                        onChange={handleNewConceptChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Hora de fin:</label>
                      <input
                        type="time"
                        name="end"
                        value={newConcept.end}
                        onChange={handleNewConceptChange}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        width: '40px',
                        height: '40px',
                        padding: '0',
                        borderRadius: '50%',
                        backgroundColor: '#28a745',
                        fontSize: '20px'
                      }}
                      title="Agregar concepto"
                    >
                      +
                    </button>
                  </div>
                </form>

                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLoadTemplate(); }}>
                    Usar una plantilla por defecto
                  </a>
                </p>
                <ConceptsList concepts={concepts} setConcepts={setConcepts} />
                <h4>Información de Asistencia</h4>
                <form onSubmit={handleSubmit} className="form">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5em' }}>
                    <div className="form-group">
                      <label>Hora de entrada:</label>
                      <input
                        type="time"
                        name="attendanceIn"
                        value={formData.attendanceIn}
                        onChange={handleChange}
                      />
                      {errors.attendanceIn && <p className="error">{errors.attendanceIn}</p>}
                    </div>

                    <div className="form-group">
                      <label>Hora de salida:</label>
                      <input
                        type="time"
                        name="attendanceOut"
                        value={formData.attendanceOut}
                        onChange={handleChange}
                      />
                      {errors.attendanceOut && <p className="error">{errors.attendanceOut}</p>}
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                    {loading ? 'Enviando...' : 'Enviar'}
                  </button>
                </form>
              </div>

              {errors.concepts && <p className="error" style={{ textAlign: 'center', margin: '10px 0' }}>{errors.concepts}</p>}
            </div>

            <div>
              {Object.keys(rawData).length > 0 && (
                <div>
                  <Results rawData={rawData} />
                </div>
              )}
            </div>
          </div>

          <div>
            <ToastContainer />
          </div>
        </>
      )}
    </div>
  );
}

export default App;