'use client'
import { PageNotFound } from "@/components/ui";

interface Props {
    error: Error
}

// Este componente se usa como 404 cuando se genera una excepción
// El parámetro recibido tiene el mensaje de error enviado desde
// el servidor
export default function ({ error }: Props) {
    const { message } = error;
    return (
        <PageNotFound message={message} />
    );
}