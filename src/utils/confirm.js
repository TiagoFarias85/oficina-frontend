import Swal from "sweetalert2";

export async function confirmar(mensagem) {

    const result = await Swal.fire({
        title: "Confirmação",
        text: mensagem,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545"
    });

    return result.isConfirmed;
}