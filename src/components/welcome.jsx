import { useState, useEffect } from 'react';

function Welcome({ onFinish }) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onFinish(), 500);
        }, 2000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#fff',
                color: '#333',
                textAlign: 'center',
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.5s ease'
            }}
        >
            <div style={{ marginBottom: '20px' }}>
                <img
                    src="https://cdn-icons-gif.flaticon.com/14164/14164962.gif"
                    alt="Engranaje animado"
                    style={{ width: '300px' }}
                />
            </div>
            <h1 style={{ fontSize: '32px', maxWidth: '600px' }}>
                Bienvenido a su aplicación de cálculo de horas trabajadas
            </h1>
        </div>
    );
}

export default Welcome;
