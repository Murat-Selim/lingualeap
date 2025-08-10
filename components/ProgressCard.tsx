
import React from 'react';

interface ProgressCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ icon, label, value }) => {
    return (
        <div className="bg-slate-100/80 p-4 rounded-lg flex items-center gap-4 w-full">
            <div className="p-2">{icon}</div>
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
};

export default ProgressCard;
