export default function Modal({ onClose, onUpload }) {
    async function onSubmit(event) {
        event.preventDefault();

        const response = await fetch("/api/users/me/picture", {
            method: "POST",
            body: new FormData(event.target),
        });
        const newImage = await response.json();

        onUpload(newImage.profile_picture_url);
    }

    return (
        <div className="modal">
            <button onClick={onClose} className="modalButton">
                X
            </button>
            <div className="modal-content">
                <h2 className="loginTitle">Upload picture</h2>

                <form className="loginForm" onSubmit={onSubmit}>
                    <input
                        className="input"
                        type="file"
                        name="image"
                        required
                        accept="image/*"
                    />
                    <button className="button">Upload</button>
                </form>
            </div>
        </div>
    );
}
