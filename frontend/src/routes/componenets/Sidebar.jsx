function Sidebar() {
    const sidebarItems = ["Dashboard", "Rooms", "Allotment", "Students", "Complaints", "Meals"];

    return (
        <aside className="w-60 h-screen bg-white border-r p-4 flex flex-col shadow">
            <h1 className="text-2xl font-bold text-blue-600 mb-8">HMS</h1>
            <nav className="flex-1 space-y-4">
                {sidebarItems.map((item) => (
                    <a
                        key={item}
                        href={item === "Dashboard" ? "/" : `/${item.toLowerCase()}`}
                        className="block py-2 px-3 rounded hover:bg-blue-100"
                    >
                        {item}
                    </a>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar;