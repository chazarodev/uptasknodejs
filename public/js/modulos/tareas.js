import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        // console.log(e.target.classList)
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: 'Seguro de querer eliminar la tarea?',
                text: "Una vez eliminado no se podrá recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'cancelar'
              }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/tareas/${idTarea}`;
                //enviar el delete por medio de axios
                axios.delete(url, {params: {idTarea}})
                    .then(function(respuesta){
                        if (respuesta.status === 200) {
                            console.log(respuesta);
                            //Eliminar el nodo
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            //Alerta opcional
                            Swal.fire(
                                'Tarea eliminada',
                                respuesta.data,
                                'success'
                            )
                            actualizarAvance();
                        }
                    })
                }
            })
        }
    })
}

export default tareas;