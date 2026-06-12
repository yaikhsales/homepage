import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const Temperature = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Sample device data
    const devices = [
        { id: 1, name: 'Fabric Inspection', deviceId: 'a8fbe8708a8a49709c9b', price: '฿ 800.00' },
        { id: 2, name: 'Fabric WHD', deviceId: 'b9fce9819b9b59819d0c', price: '฿ 800.00' },
        { id: 3, name: 'QA room', deviceId: 'c0gdf0920c0c60920e1d', price: '฿ 800.00' },
        { id: 4, name: 'Cutting', deviceId: 'd1hef1a31d1d71a31f2e', price: '฿ 800.00' },
        { id: 5, name: 'Assembling Room', deviceId: 'e2ifg2b42e2e82b42g3f', price: '฿ 800.00' },
        { id: 6, name: 'Supervisor room', deviceId: 'f3jgh3c53f3f93c53h4g', price: '฿ 800.00' },
        { id: 7, name: 'Fabric folding', deviceId: 'a4khi4d64a4a04d64i5h', price: '฿ 800.00' },
        { id: 8, name: 'Fabric WHD', deviceId: 'b5lij5e75b5b15e75j6i', price: '฿ 800.00' },
        { id: 9, name: 'Deliverally Room', deviceId: 'c6mjk6f86c6c26f86k7j', price: '฿ 800.00' },
        { id: 10, name: 'Packing', deviceId: 'd7nkl7g97d7d37g97l8k', price: '฿ 800.00' },
        { id: 11, name: 'Sewing C', deviceId: 'e8olm8h08e8e48h08m9l', price: '฿ 800.00' },
        { id: 12, name: 'Winding Dept', deviceId: 'f9pmn9i19f9f59i19n0m', price: '฿ 800.00' },
        { id: 13, name: 'Assembling Room', deviceId: 'a0qno0j20a0a60j20o1n', price: '฿ 800.00' },
        { id: 14, name: 'Fabric Releasing', deviceId: 'b1rop1k31b1b71k31p2o', price: '฿ 800.00' },
        { id: 15, name: 'UGGIR Sewing B', deviceId: 'c2spq2l42c2c82l42q3p', price: '฿ 800.00' },
        { id: 16, name: 'RCC', deviceId: 'd3tqr3m53d3d93m53r4q', price: '฿ 800.00' },
        { id: 17, name: 'Sewing A', deviceId: 'e4urs4n64e4e04n64s5r', price: '฿ 800.00' },
        { id: 18, name: 'Finish Goods WHD', deviceId: 'f5vst5o75f5f15o75t6s', price: '฿ 800.00' },
        { id: 19, name: 'Example', deviceId: 'a6wtu6p86a6a26p86u7t', price: '฿ 800.00' },
        { id: 20, name: 'Office', deviceId: 'b7xuv7q97b7b37q97v8u', price: '฿ 800.00' },
        { id: 21, name: 'Carton Keeping Area', deviceId: 'c8yvw8r08c8c48r08w9v', price: '฿ 800.00' },
        { id: 22, name: 'Finishing', deviceId: 'd9zxw9s19d9d59s19x0w', price: '฿ 800.00' }
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleDeviceClick = (deviceId) => {
        console.log('View device details:', deviceId);
    };

    return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-slate-600 p-4 border-b flex items-center gap-4 flex-shrink-0 shadow-sm relative z-[201]">
                <div className="w-32"></div> {/* Left spacer */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleBack} 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-600 rounded transition-colors flex-shrink-0 bg-slate-700 text-white font-semibold text-sm"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={16} /> {t('back')}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title={t('home')}
                        >
                            <img 
                                src="/logo.jpg" 
                                alt={t('home')} 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">{t('temperatureHumiditySensorDeviceList')}</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Device Grid - No white background container */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {devices.map((device) => (
                            <div
                                key={device.id}
                                onClick={() => handleDeviceClick(device.deviceId)}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                {/* Device Icon */}
                                <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
                                    <img 
                                        src="/assets/icons/sub-icons/air.png" 
                                        alt="Air Sensor Icon"
                                        className="h-32 w-auto object-contain"
                                    />
                                </div>

                                {/* Device Information */}
                                <div className="px-4 pb-4 space-y-2">
                                    {/* Device Name */}
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        {device.name}
                                    </h3>

                                    {/* Device ID */}
                                    <div className="text-xs text-slate-500 font-mono">
                                        {device.deviceId}
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span className="text-green-700 text-xs font-semibold">{t('online')}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Temperature;

