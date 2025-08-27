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

    // Calcular los elementos a mostrar en la página actual
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
                            <div className="concept-grid">
                                <div className="form-group">
                                    <label>Identificador:</label>
                                    <input
                                        type="text"
                                        value={concept.id}
                                        onChange={(e) => handleEditConcept(offset + index, 'id', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Nombre:</label>
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
