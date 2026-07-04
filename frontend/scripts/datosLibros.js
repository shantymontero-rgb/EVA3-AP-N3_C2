window.onload = function () {
    obtenerDataLibros();
};
async function obtenerDataLibros() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerLibros');
        if (respuesta.ok) {
            const libros = await respuesta.json();
            console.log(libros);
            new DataTable('#tablaLibros', {
                data: libros,
                columns: [
                    { data: 'titulo' },
                    { data: 'autor' },
                    { data: 'categoria' },
                    { data: 'anio' },
                    { data: 'datosUsuario[0].nombre' }
                ]
            });
        }
    } catch (error) {
        console.log('Error al cargar los datos:', error);
    }
}