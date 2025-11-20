function Header() {
    return (
        <header className="flex justify-end px-6 py-3 bg-white border-b shadow-sm">
            {/* <nav className="flex space-x-6">
                        {menu.map((tab) => (
                            <a key={tab} href="#" className="hover:text-blue-600 font-medium">
                            {tab}
                            </a>
                            ))}
                            </nav> */}
            <div className="flex  items-center space-x-4">
                <span className="cursor-pointer">📅</span>
                <span className="cursor-pointer">🔔</span>
                <span className="cursor-pointer">👤</span>
            </div>
        </header>
    )
}

export default Header;