import toast from "react-hot-toast";

export const toastSucesso = (msg) => toast.success(msg, { duration: 4000 });
export const toastErro = (msg) => toast.error(msg, { duration: 5000 });
export const toastInfo = (msg) => toast(msg, { duration: 4000 });