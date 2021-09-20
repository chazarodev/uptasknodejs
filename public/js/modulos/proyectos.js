import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl; //Accediendo al atributo personalidao en el boton eliminar

        Swal.fire({
            title: 'Seguro de querer eliminar el proyecto?',
            text: "Una vez eliminado no se podrá recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                //Enivar petción a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                // console.log(url); 
                // return;
                axios.delete(url, {params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta);
                        Swal.fire(
                          'Eliminado!',
                          respuesta.data, //Proviene de res.send del proyyecto controller
                          'success'
                        );
                        //Redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        })
                    })
            }
          })
    })
}

export default btnEliminar;