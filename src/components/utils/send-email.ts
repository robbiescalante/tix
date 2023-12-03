import { FormData } from "../Contactt"; 
import { toast } from "react-toastify";

export function sendEmail(data: FormData) {
    const apiEndpoint = '/api/email';

    fetch(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.statusText}`);
            }
            return res.json();
        })
        .then((response) => {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
        .catch((err) => {
            console.error('Error sending email:', err);
            toast.error('Error sending email. Please try again.');
        });
}