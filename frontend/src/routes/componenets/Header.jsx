function Header() {
    return (
        <header className="flex justify-between w-screen px-6 py-3 bg-white border-b shadow-sm">
            <h1 className="text-2xl font-bold text-blue-600 ">HMS</h1>
            <div className="flex items-center space-x-4">
                <span className="cursor-pointer">📅</span>
                <span className="cursor-pointer">🔔</span>
                <span className="cursor-pointer">👤</span>
            </div>
        </header>
    )
}

export default Header;