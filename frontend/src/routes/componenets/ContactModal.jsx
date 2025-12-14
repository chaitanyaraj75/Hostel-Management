import axios from "axios";
import server_url from "./server_url";
import { useState } from "react";

function ContactModal({ editingMember, setShowModal,fetchMembers }) {
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    const handleSave = async (e) => {
        e.preventDefault();

        const formdata = e.target;
        // console.log(formdata);
        const data = {
            name: formdata.name.value,
            post: formdata.post.value,
            contact: formdata.contact.value,
            email: formdata.email.value || null,
            category: "staff",
        };

        try {
            setError(null);
            setLoading(true);
            if (editingMember) {
                data.category=editingMember.category;
                await axios.put(
                    `${server_url}/api/contacts/edit/${editingMember.id}`,
                    data
                );
            } else {
                await axios.post(`${server_url}/api/contacts/add`, data);
            }

            setShowModal(false);
            fetchMembers();
        } catch (err) {
            console.error("Save failed", err);
            setError("Failed Saving,Try again")
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form
                onSubmit={handleSave}
                className="bg-white rounded-xl p-6 w-96"
            >
                <h2 className="text-xl font-semibold mb-4">
                    {editingMember ? "Edit Staff" : "Add Staff"}
                </h2>

                <input
                    name="name"
                    defaultValue={editingMember?.name}
                    placeholder="Name"
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="post"
                    defaultValue={editingMember?.post}
                    placeholder="Post"
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="contact"
                    defaultValue={editingMember?.contact}
                    placeholder="Contact"
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="email"
                    defaultValue={editingMember?.email}
                    placeholder="Email (optional)"
                    className="w-full mb-4 p-2 border rounded"
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-3 py-1 border rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                        {loading?'Saving..':'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ContactModal;