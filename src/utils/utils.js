import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

/**
 * @brief Pide un nuevo access token usando refresh token.
 * @fecha 2026-01-10
 * @returns {Promise<string|null>} Token nuevo o null si falla.
 */
export const renovarToken = async () => {
    try {
        let respuesta = await fetch('http://localhost:5000/refresh', {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
            const datos = await respuesta.json();
            
            if (datos.ok && datos.token) {
                // Guardar el nuevo access token
                localStorage.setItem('token', datos.token);
                console.log("Token nuevo que se guarda en el localStorage de nuevo: ",datos.token)
                return datos.token;
            }
        
        return null;
    } catch (error) {
        console.error('Error renovando token:', error);
        return null;
    }
};

const TEXTURA_TRANSPARENTE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

/**
 * @brief Renderiza un libro 3D con la portada como textura.
 * @fecha 2026-01-10
 * @returns {JSX.Element} Malla 3D del libro.
 */
export function Libro3D({ libro }) {
    const urlPortada = typeof libro?.url_imagen === "string" ? libro.url_imagen.trim() : "";
    const portadaSrc = urlPortada && !urlPortada.includes(",") ? urlPortada : TEXTURA_TRANSPARENTE;

    const portada = useLoader(TextureLoader, portadaSrc);

    // Orden de materiales en BoxGeometry:
    // 0: derecha, 1: izquierda, 2: arriba, 3: abajo, 4: frente, 5: atras
    return (
        <mesh rotation={[0, 0.5, 0]}>
            <boxGeometry args={[1.25, 1.9, 0.32]} />
            <meshStandardMaterial attach="material-0" color="#e9dec7" roughness={0.92} metalness={0.0} emissive="#2b261f" emissiveIntensity={0.08} />
            <meshStandardMaterial attach="material-1" map={portada} color="#ffffff" roughness={0.55} metalness={0.05} />
            <meshStandardMaterial attach="material-2" color="#efe5cf" roughness={0.95} metalness={0.0} emissive="#2d281f" emissiveIntensity={0.08} />
            <meshStandardMaterial attach="material-3" color="#e3d8bf" roughness={0.96} metalness={0.0} emissive="#29241c" emissiveIntensity={0.08} />
            <meshStandardMaterial attach="material-4" map={portada} color="#ffffff" roughness={0.5} metalness={0.05} />
            <meshStandardMaterial attach="material-5" map={portada} color="#ffffff" roughness={0.55} metalness={0.05} />
        </mesh>
    );
}
