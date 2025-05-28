import { useEffect } from "react";


declare global {
    interface Window {
        Wompi: any;
    }
}

const SCRIPT_URL = "https://wompijs.wompi.com/libs/js/v1.js";

const PUBLIC_KEY_ACCESS = import.meta.env.VITE_PUBLIC_KEY_ACCESS;

function ScriptLoader() {
    try {

        useEffect(() => {
            if (!PUBLIC_KEY_ACCESS) {
                return;
            }
            if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
                if (window.Wompi) {
                    window.Wompi.setPublicKey(PUBLIC_KEY_ACCESS);
                }
                return;
            }
            const script = document.createElement('script');
            script.src = SCRIPT_URL;
            script.async = true;
            script.onload = () => {
                if (window.Wompi) {
                    window.Wompi.setPublicKey(PUBLIC_KEY_ACCESS);
                }
            };
            document.head.appendChild(script);
            return () => {
                if (document.head.contains(script)) {

                }
            };
        }, []);
        return null;
    } catch (error) {

    }
};



export default ScriptLoader;