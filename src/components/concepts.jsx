import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

function ConceptsList({ concepts, setConcepts }) {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 2;

    const handleEditConcept = (index, field, value) => {
        const updatedConcepts = concepts.map((concept, i) => {
            if (i === index) {
                return { ...concept, [field]: value };
            }
            return concept;
        });
        setConcepts(updatedConcepts);
    };

    const handleRemoveConcept = (indexToRemove) => {
        setConcepts(concepts.filter((_, index) => index !== indexToRemove));
        toast.info('Concepto eliminado');
    };

    if (concepts.length === 0) {
        return null;
    }

    const offset = currentPage * itemsPerPage;
    const currentItems = concepts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(concepts.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div>
            <h4>Conceptos Configurados ({concepts.length})</h4>
            <div>
                {currentItems.map((concept, index) => (
                    <div key={offset + index} className="concept-card">
                        <form className="form">
                            <div className="concept-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5em' }}>
                                <div className="form-group" style={{ gridColumn: '1 / 3' }}>
                                    <label>Nombre del concepto:</label>
                                    <input
                                        type="text"
                                        value={concept.name}
                                        onChange={(e) => handleEditConcept(offset + index, 'name', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Inicio:</label>
                                    <input
                                        type="time"
                                        value={concept.start}
                                        onChange={(e) => handleEditConcept(offset + index, 'start', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fin:</label>
                                    <input
                                        type="time"
                                        value={concept.end}
                                        onChange={(e) => handleEditConcept(offset + index, 'end', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <small style={{ color: '#666', fontSize: '12px' }}>
                                    ID: {concept.id}
                                </small>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveConcept(offset + index);
                                    }}
                                    className="text-red"
                                >
                                    Eliminar concepto
                                </a>
                            </div>

                        </form>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
            />
        </div>
    );
}

export default ConceptsList;