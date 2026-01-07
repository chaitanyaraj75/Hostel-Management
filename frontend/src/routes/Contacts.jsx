import axios from "axios";
import { useState, useEffect } from "react";
import server_url from "./componenets/server_url.js";
import ContactModal from "./componenets/ContactModal.jsx";
import Section from "./componenets/ContactSection.jsx";
import PageLoader from "./componenets/PageLoader.jsx";

function Contacts({ user }) {
    const [members, setMembers] = useState({
        administration: [],
        student: [],
        staff: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const isAdmin = user?.user_type === "admin";

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${server_url}/api/contacts/contact_details`
            );

            setMembers({
                administration: res.data.administration || [],
                student: res.data.student || [],
                staff: res.data.staff || [],
            });
        } catch (err) {
            console.error("Error while fetching contacts", err);
            setError("Can't fetch contacts. Try later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this staff member?")) return;

        try {
            await axios.delete(`${server_url}/api/contacts/delete/${id}`);
            fetchMembers();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleEdit = (member) => {
        console.log(member)
        setEditingMember(member);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingMember(null);
        setShowModal(true);
    };

    if (loading) return <PageLoader />
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Hostel Members Directory
                </h1>

                <Section
                    title="Administration"
                    data={members.administration}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                />
                <Section
                    title="Student Committee"
                    data={members.student}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                />

                {/* ADMIN ADD BUTTON */}

                {isAdmin && (
                    <button
                        onClick={handleAdd}
                        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Staff Member(+)
                    </button>
                )}

                <Section
                    title="Hostel Staff"
                    data={members.staff}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/*---MODAL-------*/}

            {showModal && (
                <ContactModal
                    editingMember={editingMember}
                    setShowModal={setShowModal}
                    fetchMembers={fetchMembers}
                />
            )}
        </div>
    );
}

export default Contacts;
