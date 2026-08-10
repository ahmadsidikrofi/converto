import { create } from 'zustand'
import { toast } from 'sonner'

export const useToastStore = create((set) => ({
    // Global toast position
    position: 'bottom-center',

    // Action to change position easily
    setPosition: (position) => set({ position }),

    // Wrappers for calling toast so we don't need to import toast from sonner everywhere
    showSuccess: (message, options = {}) => {
        toast.success(message, options)
    },

    showError: (message, options = {}) => {
        toast.error(message, options)
    },

    showInfo: (message, options = {}) => {
        toast.info(message, options)
    },

    showWarning: (message, options = {}) => {
        toast.warning(message, options)
    },

    show: (message, options = {}) => {
        toast(message, options)
    }
}))

// Helper untuk mendeteksi legacy format Radix UI (object: {title, description})
// dan mengubahnya ke format Sonner (string, {description})
const formatToastArgs = (messageOrObj, options = {}) => {
    if (typeof messageOrObj === 'object' && messageOrObj !== null) {
        const { title, description, ...rest } = messageOrObj;
        // Jika ada title, gunakan sebagai judul, description masuk ke options
        const message = title || description || "Notification";
        const newOptions = {
            ...(title && description ? { description } : {}),
            ...rest,
            ...options
        };
        return [message, newOptions];
    }
    return [messageOrObj, options];
}

export const appToast = Object.assign(
    (message, options) => useToastStore.getState().show(...formatToastArgs(message, options)),
    {
        success: (message, options) => useToastStore.getState().showSuccess(...formatToastArgs(message, options)),
        error: (message, options) => useToastStore.getState().showError(...formatToastArgs(message, options)),
        info: (message, options) => useToastStore.getState().showInfo(...formatToastArgs(message, options)),
        warning: (message, options) => useToastStore.getState().showWarning(...formatToastArgs(message, options)),
    }
)
