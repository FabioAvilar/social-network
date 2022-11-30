import { useState } from "react";

export default function BioEditor({ bio, onBioUpdate }) {
    const [isEditing, setEding] = useState(false);

    async function onSubmit(event) {
        const newBio = event.target.bio.value;
        console.log("BioEditor:onSubmit", newBio);
        event.preventDefault();
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
            <button>{buttonLabel}</button>
        </div>
    );
}
