import { useState } from "react";

export default function BioEditor({ bio, onBioUpdate }) {
    const [isEditing, setEding] = useState(false);

    function onEditButtonClick() {
        console.log("BioEditor: onEditButtonClick");
        setEding(!isEditing);
    }

    async function onSubmit(event) {
        const newBio = event.target.bio.value;
        console.log("BioEditor:onSubmit", newBio);
        event.preventDefault();

        const response = await fetch("/api/users/me/bio", {
            method: "PUT",
            body: JSON.stringify({ bio: newBio }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            alert("You are a bad backend developer");
            return;
        }

        onBioUpdate(newBio);
        setEding(false);
    }

    function renderForm() {
        return (
            <form onSubmit={onSubmit}>
                <textarea name="bio" defaultValue={bio} />
                <button>Save Bio</button>
            </form>
        );
    }

    const buttonLabel = isEditing ? "Cancel" : "Edit bio";
    return (
        <div className="bio-editor">
            {isEditing ? renderForm() : <p>{bio}</p>}
            <button onClick={onEditButtonClick}>{buttonLabel}</button>
        </div>
    );
}
