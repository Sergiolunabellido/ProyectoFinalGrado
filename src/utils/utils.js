import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";


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


export function Libro3D({ libro }) {
    const portada = useLoader(TextureLoader, libro.url_imagen);

    return (
        <mesh rotation={[0, 0.5, 0]}>
            <boxGeometry args={[1.25, 1.9, 0.32]} />
            <meshStandardMaterial color="#303030" roughness={0.65} />
            <meshStandardMaterial color="#303030" roughness={0.65} />
            <meshStandardMaterial color="#191919" roughness={0.9} />
            <meshStandardMaterial color="#191919" roughness={0.9} />
            <meshStandardMaterial map={portada} roughness={0.5} />
        </mesh>
    );
}