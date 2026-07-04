window.onload = function () {
    cargarUsuarios();
};
async function cargarUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            const select = document.getElementById('usuario');
            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario._id;
                option.textContent = usuario.nombre + " - " + usuario.rut;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.log('Error al cargar usuarios:', error);
    }
}
function guardarLibro() {
    const titulo = document.getElementById('titulo');
    const autor = document.getElementById('autor');
    const categoria = document.getElementById('categoria');
    const anio = document.getElementById('anio');
    const usuario = document.getElementById('usuario');
    let formularioValido = true;
    if (!validarInput(titulo)) formularioValido = false;
    if (!validarInput(autor)) formularioValido = false;
    if (!validarInput(categoria)) formularioValido = false;
    if (!validarInput(anio)) formularioValido = false;
    if (!validarInput(usuario)) formularioValido = false;

    if (formularioValido == true) {
        alert('Libro registrado correctamente.');
        const formulario = document.getElementById('formLibro');
        const datosLibro = Object.fromEntries(new FormData(formulario).entries());
        const enviarDatos = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarLibro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosLibro)
                });
                if (respuesta.ok) {
                    window.location.href = './datosLibros.html';
                } else {
                    console.log(await respuesta.json());
                }
            } catch (error) {
                console.log('Error al guardar libro:', error);
            }
        }
        enviarDatos();
    }
}
function validarInput(elemento) {
    if (elemento.value == '') {
        elemento.classList.add('alerta', 'is-invalid');
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid');
        elemento.classList.add('correcto', 'is-valid');
        return true;
    }
}