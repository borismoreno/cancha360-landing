// src/components/ContactForm.jsx
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Reemplaza esto con tu endpoint REAL de AWS Lambda
// const LAMBDA_ENDPOINT = 'api/prod/subscriber'; // ¡¡¡CAMBIAR ESTO!!!
// const LAMBDA_ENDPOINT = 'http://localhost:3000/dev/subscriber'; // ¡¡¡CAMBIAR ESTO!!!
const LAMBDA_ENDPOINT = 'https://o5pu7k2pie.execute-api.us-east-1.amazonaws.com/prod/subscriber'; // ¡¡¡CAMBIAR ESTO!!!

// Regex simple para validación de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        if (!email) {
            setError('El correo electrónico es obligatorio.');
            toast.error('Por favor, ingresa tu correo electrónico.');
            return;
        }

        if (!emailRegex.test(email)) {
            setError('El formato del correo electrónico no es válido.');
            toast.error('Por favor, ingresa un correo válido.');
            return;
        }

        setIsLoading(true);
        const loadingToastId = toast.loading('Enviando...'); // Mostrar toast de carga

        try {
            const response = await fetch(LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    fechaRegistro: new Date().toISOString(), // Fecha de registro
                    planInteres: 'free', // Campo oculto enviado
                }),
            });
            toast.dismiss(loadingToastId); // Ocultar toast de carga

            if (response.ok) {
                // Éxito
                const result = await response.json(); // Asumiendo que Lambda devuelve JSON
                if (result.success) {
                    toast.success('¡Gracias por registrarte! Pronto recibirás noticias.');
                    setEmail(''); // Limpiar el campo
                } else {
                    if (result.message) {
                        setError(result.message);
                        toast.error(result.message);
                    } else {
                        setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
                        toast.error('No pudimos registrarte. Inténtalo más tarde.');
                    }
                }
            } else {
                // Error desde el servidor (Lambda)
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
                console.error('Server error:', response.status, errorData);
                setError(errorData.message || 'Ocurrió un error al registrarte. Inténtalo de nuevo.');
                toast.error(errorData.message || 'No pudimos registrarte. Inténtalo más tarde.');
            }
        } catch (err) {
            // Error de red o fetch
            toast.dismiss(loadingToastId);
            console.error('Fetch error:', err);
            setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
            toast.error('Error de conexión. Inténtalo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="registro" className="py-16 lg:py-24 bg-gradient-to-br from-green-600 to-teal-600">
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000 }} />
            <div className="container mx-auto px-6 max-w-xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    ¿Listo para Jugar? ¡Regístrate Gratis!
                </h2>
                <p className="text-lg text-green-100 mb-8">
                    Déjanos tu correo y sé el primero en saber cuándo lanzamos oficialmente y accede a beneficios exclusivos.
                </p>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto" noValidate>
                    <input
                        type="hidden"
                        name="plan_interes"
                        value="free"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                        <label htmlFor="email-input" className="sr-only">Correo Electrónico</label>
                        <input
                            id="email-input"
                            type="email"
                            name="email"
                            value={email}
                            autoComplete='off'
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu.correo@ejemplo.com"
                            required
                            aria-required="true"
                            aria-invalid={!!error}
                            aria-describedby={error ? "email-error" : undefined}
                            className={`flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 ${error ? 'border-2 border-red-500' : 'border border-transparent'}`}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-white text-green-700 font-semibold rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : (
                                '¡Quiero Acceso!'
                            )}
                        </button>
                    </div>
                    {error && (
                        <p id="email-error" className="text-red-200 text-sm mt-2 text-left">{error}</p>
                    )}
                </form>
            </div>
        </section>
    );
}

export default ContactForm;