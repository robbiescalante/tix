import { FormData } from "../Contactt";
import { toast } from "react-toastify";

export function sendEmail(data: FormData, setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>) {
    const apiEndpoint = '/api/email2';

    return fetch(apiEndpoint, {
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
            toast.success(response.message);
        })
        .catch((err) => {
            console.error('Error sending email:', err);
            alert('Error sending email. Please try again.');
        })
        .finally(() => {
            setIsSubmitting(false);
        });
}