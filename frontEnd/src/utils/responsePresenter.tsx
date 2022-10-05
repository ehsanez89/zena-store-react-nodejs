import { toast, ToastOptions } from 'react-toastify';

export class ResponsePresenter {
    private static DEFAULT_CONF: ToastOptions = {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    public static success(msg: string, conf?: ToastOptions): void {
        toast.success(msg, conf || ResponsePresenter.DEFAULT_CONF);
    }

    public static error(msg: string, conf?: ToastOptions): void {
        toast.error(msg, conf || ResponsePresenter.DEFAULT_CONF);
    }
}
