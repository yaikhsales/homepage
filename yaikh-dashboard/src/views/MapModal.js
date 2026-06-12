import React from 'react';
import { Search, MapPin, X } from 'lucide-react';

const MapModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[600px] overflow-hidden animate-in zoom-in duration-200 flex">
            {/* Form Side */}
            <div className="w-1/3 bg-slate-50 p-6 border-r flex flex-col gap-4">
                <h3 className="font-bold text-xl mb-4">New Car Booking</h3>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                        Destination
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="w-full border rounded-lg p-2 text-sm"
                            placeholder="Search location..."
                        />
                        <button className="bg-blue-600 text-white p-2 rounded-lg">
                            <Search size={16} />
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                        Date & Time
                    </label>
                    <input type="datetime-local" className="w-full border rounded-lg p-2 text-sm" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                        Reason
                    </label>
                    <textarea
                        className="w-full border rounded-lg p-2 text-sm h-24"
                        placeholder="Client meeting, site visit..."
                    />
                </div>
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 py-3 rounded-xl font-bold hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                    >
                        Confirm
                    </button>
                </div>
            </div>
            <div className="w-2/3 bg-blue-50 relative">
                <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <MapPin size={48} className="text-red-500 drop-shadow-2xl animate-bounce" />
                </div>
                <div className="absolute bottom-6 right-6 bg-white p-2 rounded shadow text-xs">
                    Map Data © 2024 Google
                </div>
            </div>
        </div>
    </div>
);

export default MapModal;

