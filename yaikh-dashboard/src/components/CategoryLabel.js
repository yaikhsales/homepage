import React from 'react';

const CategoryLabel = ({ label }) => (
    <div className="bg-slate-800/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-600 shadow-lg text-center min-w-[80px]">
        {label}
    </div>
);

export default CategoryLabel;