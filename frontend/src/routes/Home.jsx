import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Header from "./componenets/Header";
import Sidebar from "./componenets/Sidebar";

const occupancyData = [
    { name: "Hostel 1", value: 50, color: "#2563EB" }, // Blue
    { name: "Hostel 2", value: 75, color: "#FACC15" }, // Yellow
    { name: "Hostel 3", value: 95, color: "#EC4899" }, // Pink
];

const feesData = [
    { name: "collected", value: 2600000 },
    { name: "remaining", value: 1560000 },
];

const complaintsData = [
    { name: "Resolved", value: 96 },
    { name: "Open", value: 62 },
];

const menu = ["Dashboard", "Rooms",, "Attendance", "Accounts", "Maintenance"];


export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <Header />
                {/* Dashboard Widgets */}
                <main className="p-6 grid grid-cols-12 gap-6 flex-1 overflow-y-auto">
                    {/* Occupancy (All Hostels in one field) */}
                    <section className="col-span-8 bg-white rounded-lg p-6 shadow">
                        <h2 className="font-bold mb-6">Occupancy</h2>
                        <div className="grid grid-cols-3 gap-6">
                            {occupancyData.map((hostel, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow-sm"
                                >
                                    <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie
                                                data={[{ value: hostel.value }, { value: 100 - hostel.value }]}
                                                dataKey="value"
                                                innerRadius={40}
                                                outerRadius={60}
                                            >
                                                <Cell fill={hostel.color} />
                                                <Cell fill="#B29B86" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p className="mt-2 font-semibold">{hostel.name}</p>
                                    <p className="text-lg font-bold" style={{ color: hostel.color }}>
                                        {hostel.value}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Student Updates */}
                    <aside className="col-span-4 bg-white rounded-lg p-4 shadow">
                        <h2 className="font-bold mb-4">Student Update</h2>
                        <ul className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                >
                                    <div>
                                        <p className="font-medium">Ramakanth Sharma</p>
                                        <p className="text-xs text-gray-500">12:30</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Fees Collection */}
                    <section className="col-span-6 bg-white rounded-lg p-6 shadow">
                        <h2 className="font-bold mb-4">Fees Collection</h2>
                        <div className="flex items-center space-x-6">
                            <ResponsiveContainer width="40%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={feesData}
                                        dataKey="value"
                                        innerRadius={50}
                                        outerRadius={70}
                                    >
                                        <Cell fill="#2563EB" />
                                        <Cell fill="#FACC15" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 text-sm">
                                <p>Expected: <span className="text-yellow-500">₹ 52,00,000</span></p>
                                <p>Collected: <span className="text-blue-600">₹ 26,00,000</span></p>
                                <p>Remaining: <span className="text-yellow-500">₹ 15,60,000</span></p>
                                <p>Overdue: <span className="text-pink-500">₹ 10,40,000</span></p>
                            </div>
                        </div>
                    </section>

                    {/* Complaints */}
                    <section className="col-span-6 bg-white rounded-lg p-6 shadow">
                        <h2 className="font-bold mb-4">Complaints</h2>
                        <ResponsiveContainer width="100%" height={100}>
                            <PieChart>
                                <Pie
                                    data={complaintsData}
                                    dataKey="value"
                                    outerRadius={50}
                                    label
                                >
                                    <Cell fill="#2563EB" />
                                    <Cell fill="#FACC15" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-around mt-4">
                            <p>Total: 158</p>
                            <p className="text-blue-600">Resolved: 96</p>
                            <p className="text-yellow-500">Open: 62</p>
                        </div>
                    </section>

                    {/* Emergency Button */}
                    <section className="col-span-12 flex justify-center">
                        <button className="px-8 py-4 bg-red-600 rounded-full text-lg font-bold hover:bg-red-700 text-white">
                            🚨 Emergency
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
}
