import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirigir si ya está autenticado
    React.useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!correo || !password) {
            toast.error('Por favor completa todos los campos', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#f59e0b'
                }
            });
            return;
        }

        setIsLoading(true);

        try {
            await login(correo, password);
            toast.success('¡Inicio de sesión exitoso!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#10b981'
                }
            });

            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#ef4444'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000080 0%, #1e3a8a 50%, #3b82f6 100%)',
        padding: '2rem'
    };

    const formContainerStyle: React.CSSProperties = {
        maxWidth: '420px',
        width: '100%',
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 128, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '0.5rem',
        color: '#000080',
        textShadow: '0 2px 4px rgba(0, 0, 128, 0.1)'
    };

    const subtitleStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#475569',
        marginBottom: '2.5rem',
        fontSize: '0.9rem',
        fontWeight: '500'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '0.5rem'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.875rem',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '0.875rem',
        marginBottom: '1.25rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        backgroundColor: '#f8fafc'
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.875rem',
        background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #000080 0%, #1e40af 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 128, 0.3)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <div>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #000080 0%, #3b82f6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 8px 20px rgba(0, 0, 128, 0.3)',
                        border: '3px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <span style={{ color: 'white', fontSize: '1.75rem' }}>🔐</span>
                    </div>
                    <h2 style={titleStyle}>Iniciar Sesión</h2>
                    <p style={subtitleStyle}>Sistema de Gestión de Guías de Lavandería</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" style={labelStyle}>
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            style={inputStyle}
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={labelStyle}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={buttonStyle}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #000066 0%, #1e3a8a 100%)';
                                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0, 0, 128, 0.4)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #000080 0%, #1e40af 100%)';
                                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 128, 0.3)';
                            }
                        }}
                    >
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>


            </div>
        </div>
    );
};

export default LoginForm;