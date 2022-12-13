import { useState } from "react";
import {Link} from "react-router-dom";

export default function BioEditor({ bio, onBioUpdate }) {
    const [isEditing, setIsEditing] = useState(false);

    function onEditButtonClick() {
        // console.log("BioEditor: onEditButtonClick");
        setIsEditing(!isEditing);
    }

    async function onSubmit(event) {
        const newBio = event.target.bio.value;
        // console.log("BioEditor:onSubmit", newBio);
        event.preventDefault();

        const response = await fetch("/api/users/me/bio", {
            method: "post",
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
        setIsEditing(false);
    }

    function renderForm() {
        return (
            <form onSubmit={onSubmit}>
                <textarea
                    name="bio"
                    defaultValue={bio}
                    className="bioEditorText"
                />
                <button className="button">Save Bio</button>
            </form>
        );
    }
    const buttonLabel = isEditing ? "Cancel" : "Edit bio";

    function onUpdateDates() {
        console.log("new information 🥳", isEditing);
    }

    async function onDeleteUser() {
        if (!confirm("Are you sure?")) {
            return;
        }
        // console.log("teste de delete", response);
        try {
            await fetch("/api/delete", {
                method: "POST"
            });
            window.location.reload();
        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <div className="bio-editor">
            {isEditing ? renderForm() : <p></p>}
            <button className="button" onClick={onEditButtonClick}>
                {buttonLabel}
            </button>
            <Link to="/edit">
                <button className="button" onClick={onUpdateDates}>
                    Update Dates
                </button>
            </Link>
            <button className="button" onClick={onDeleteUser}>
                Delete Count
            </button>
        </div>
    );
}
