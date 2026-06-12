import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import GeneralAIAgent from '../general-ag';

const EInvoice = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [selectedImagePath, setSelectedImagePath] = useState('');

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleCambodiaEInvoice = () => {
        window.open('https://einvoice.ggmt.sg/login', '_blank');
    };

    const handleSupplierManagement = () => {
        setSelectedImagePath('/assets/e-invoice/supplier-management.jpg');
        setShowImageViewer(true);
    };

    const handleIEWS = () => {
        setSelectedImagePath('/assets/e-invoice/IEWS.jpg');
        setShowImageViewer(true);
    };

    return (
        <>
            <div className="fixed inset-0 flex flex-col animate-in fade-in duration-500 z-10 overflow-hidden">
                {/* Background with winter/aurora scene */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(/assets/e-invoice/winter-background.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Header with Back Button and Home Button */}
                <div className="relative z-10 p-4 sm:p-6">
                    <div className="flex items-center justify-center gap-3">
                        <button 
                            onClick={handleBack} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 text-white hover:text-cyan-400 font-bold rounded-lg backdrop-blur-sm transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title="Home"
                        >
                            <img 
                                src="/logo.jpg" 
                                alt="Home" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </div>

                {/* Main Title */}
                <div className="relative z-10 flex justify-center mt-4 sm:mt-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wide drop-shadow-2xl">
                        E-INVOICING
                    </h1>
                </div>

                {/* Three Module Buttons */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12">
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {/* Cambodia E Invoice - Green Button */}
                        <button
                            onClick={handleCambodiaEInvoice}
                            className="bg-green-600 hover:bg-green-700 rounded-lg p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-4 sm:gap-6 transition-all hover:scale-105 shadow-2xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-green-300 bg-white flex items-center justify-center">
                                <div className="text-green-600 text-2xl sm:text-3xl md:text-4xl font-bold">
                                    E
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-white text-xs sm:text-sm mb-1">E-Invoicing</div>
                                <div className="text-white text-[10px] sm:text-xs opacity-80">Caminv</div>
                            </div>
                            <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight">
                                Cambodia<br />E Invoice
                            </div>
                        </button>

                        {/* Supplier Management - Blue Button */}
                        <button
                            onClick={handleSupplierManagement}
                            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-4 sm:gap-6 transition-all hover:scale-105 shadow-2xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-blue-300 bg-white flex items-center justify-center relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black rounded-full flex items-center justify-center relative">
                                        <div className="absolute -right-2 top-2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight">
                                Supplier<br />Management
                            </div>
                        </button>

                        {/* IEWS - Purple Button */}
                        <button
                            onClick={handleIEWS}
                            className="bg-purple-600 hover:bg-purple-700 rounded-lg p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-4 sm:gap-6 transition-all hover:scale-105 shadow-2xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border-4 border-purple-300 bg-purple-200 flex items-center justify-center">
                                <div className="text-purple-800 text-xs sm:text-sm font-bold text-center">
                                    IEWS<br />AI<br />Accounting
                                </div>
                            </div>
                            <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center">
                                IEWS
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Viewer */}
            {showImageViewer && (
                <ImageViewer
                    imagePath={selectedImagePath}
                    onClose={() => {
                        setShowImageViewer(false);
                        setSelectedImagePath('');
                    }}
                />
            )}
            
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask E-Invoice bot"
                title="Ask E-Invoice bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="E-Invoice"
                />
            )}
        </>
    );
};

export default EInvoice;
