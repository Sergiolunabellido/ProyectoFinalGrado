/**
 * @brief Cierra sesion en backend y limpia el token local.
 * @fecha 2026-02-05
 * @returns {Promise<void>} No devuelve datos.
 */
export async function CerrarSesion(){    

    //Peticion al backend para borrar refreshtoken de la base de datos y borrar refreshtoken de la cookie.
    try {
        await fetch('http://localhost:5000/cerrarSesion', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        });
    } catch (e) {
        console.error('Error al cerrar sesión:', e);
    } finally {
        localStorage.removeItem('token');
    }
}
