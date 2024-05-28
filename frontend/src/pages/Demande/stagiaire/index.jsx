import { useState, useEffect } from 'react';
import axios from 'axios';
import { PiCertificateThin } from "react-icons/pi";
import { GiDiploma } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { TbCertificateOff } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineDownload } from "react-icons/ai";
import { jsPDF } from "jspdf";

const MyComponent = () => {
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newType, setNewType] = useState('');
    const [description, setDescription] = useState('');
    const [nextId, setNextId] = useState(1);  // Start with 1 or fetch the next available ID

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:3000/tableData')
            .then(response => {
                setTableData(response.data);
                const maxId = Math.max(...response.data.map(row => parseInt(row.id, 10)), 0);
                setNextId(maxId + 1);  // Set the next ID to be one greater than the highest current ID
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const addRow = (type) => {
        const newRow = {
            id: nextId.toString(),
            type,
            date: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        axios.post('http://localhost:3000/tableData', newRow)
            .then(() => {
                setNextId(nextId + 1);  // Increment the next ID
                fetchData();
            })
            .catch(error => console.error('Error adding row:', error));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        addRow(newType);
        setShowModal(false);
        setNewType('');
        setDescription('');
    };

    const deleteRow = (id) => {
        axios.delete(`http://localhost:3000/tableData/${id}`)
            .then(() => {
                fetchData();
            })
            .catch(error => console.error('Error deleting row:', error));
    };

    const downloadPDF = (row) => {
        const doc = new jsPDF();
        doc.text(`ID: ${row.id}`, 10, 10);
        doc.text(`Type: ${row.type}`, 10, 20);
        doc.text(`Date: ${row.date}`, 10, 30);
        doc.text(`Status: ${row.status}`, 10, 40);
        doc.save(`document_${row.id}.pdf`);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 w-full max-w-4xl p-4">
                <div className="flex gap-2 mb-4">
                    <button onClick={() => addRow('Attestation scolaire')} className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 w-56 h-16 rounded">
                        <PiCertificateThin className="text-4xl" />
                        <span>Attestation scolaire</span>
                    </button>
                    <button onClick={() => addRow('Baccalauréat Définitivement')} className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 w-56 h-16 rounded">
                        <TbCertificateOff className="text-4xl" />
                        <span>Baccalauréat Définitivement</span>
                    </button>
                    <button onClick={() => addRow('Baccalauréat Temporaire')} className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2 w-56 h-16 rounded">
                        <GiDiploma className="text-4xl" />
                        <span>Baccalauréat Temporaire</span>
                    </button>
                    <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 w-56 h-16 rounded">
                        <FaPlus className="text-4xl" />
                        <span>Autre</span>
                    </button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
                            <h2 className="text-xl mb-4">Ajouter une demande</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-2">
                                    <label htmlFor="type" className="block text-gray-700">Genre de demande:</label>
                                    <input
                                        type="text"
                                        id="type"
                                        value={newType}
                                        onChange={(e) => setNewType(e.target.value)}
                                        className="mt-1 block w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="description" className="block text-gray-700">Description:</label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1 block w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <table className="w-full bg-white shadow-md rounded">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="py-2 px-4 text-center">ID</th>
                            <th className="py-2 px-4 text-center">Type</th>
                            <th className="py-2 px-4 text-center">Date</th>
                            <th className="py-2 px-4 text-center">Status</th>
                            <th className="py-2 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(row => (
                            <tr key={row.id} className="border-t">
                                <td className="py-2 px-4 text-center">{row.id}</td>
                                <td className="py-2 px-4 text-center">{row.type}</td>
                                <td className="py-2 px-4 text-center">{row.date}</td>
                                <td className="py-2 px-4 text-center">{row.status}</td>
                                <td className="py-2 px-4 text-center flex justify-center items-center gap-2">
                                    <button onClick={() => downloadPDF(row)} className="text-blue-600 hover:text-blue-800">
                                        <AiOutlineDownload className="text-2xl" />
                                    </button>
                                    <button onClick={() => deleteRow(row.id)} className="text-red-600 hover:text-red-800">
                                        <AiOutlineDelete className="text-2xl" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tableData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyComponent;
