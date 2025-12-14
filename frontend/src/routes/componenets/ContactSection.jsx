

function Section({ title, data, isAdmin = false, onEdit, onDelete }) {
    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
                {title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">
                            {member.name}
                        </h3>

                        <p className="text-sm text-blue-600 font-medium mt-1">
                            {member.post}
                        </p>

                        <div className="mt-3 text-sm text-gray-600 space-y-1">
                            <p>📞 <span className="font-medium">{member.contact}</span></p>
                            {member.email && (
                                <p>✉️ <span className="font-medium">{member.email}</span></p>
                            )}
                        </div>

                        {/* ADMIN ACTIONS */}
                        {isAdmin && (
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => onEdit(member)}
                                    className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(member.id)}
                                        className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                )}

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Section;