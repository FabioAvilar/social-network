import { useState } from "react";

export default function PictureProfile({
    modalVisible,
    setModalVisible,
    setUser,
}) {
    const [uploadedPicture, setUploadedPicture] = useState("");

    const handleClose = () => {
        setModalVisible(false);
    };

    const populateUploadedPicture = (event) => {
        setUploadedPicture(event.target.files[0].name);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const file = event.target.image.files[0];
        const body = new FormData();

        body.append("profile_picture_url", file);

        fetch(`/api/users/me/picture`, {
            method: "POST",
            body,
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    console.log(
                        "🚗🚗 error da funçao handleFormSubmit",
                        response.error
                    );
                    return;
                }
                console.log("log do response 🎮🎮🎮", response);
                setUser((prevState) => ({
                    ...prevState,
                    profile_picture_url: response.profile_picture_url,
                }));
                setModalVisible(false);
            });
    };

    return (
        <>
            <div onChange={modalVisible} onClick={handleClose}>
                <header>
                    <h3>Change profile picture</h3>
                </header>

                <p>You can a profile picture here</p>
                <form className="form" onSubmit={handleFormSubmit}>
                    <p>
                        Uploaded file:{" "}
                        {uploadedPicture ? uploadedPicture : "None"}
                    </p>
                    <label htmlFor="form-upload">Select File</label>
                    <input
                        type="file"
                        id="form-upload"
                        accept="image/*"
                        name="image"
                        onChange={populateUploadedPicture}
                        required
                    />
                    <button type="submit" disabled={!uploadedPicture}>
                        Upload
                    </button>
                </form>
            </div>
        </>
    );
}
