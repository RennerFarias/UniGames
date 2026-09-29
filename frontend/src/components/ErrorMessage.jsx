function ErrorMessage({ message }) {
    return (
        <div className="error">
            <strong>Erro:</strong> {message}
        </div>
    );
}

export default ErrorMessage;