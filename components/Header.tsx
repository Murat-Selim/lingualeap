
import React from 'react';
import { LogoIcon } from '../constants';

const Header: React.FC = () => {
    return (
        <header className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-3">
                <LogoIcon />
                <h1 className="text-4xl font-bold text-slate-800">LinguaLeap</h1>
            </div>
            <p className="text-slate-500 mt-2">Master English with AI-powered Azerbaijani dialogues.</p>
        </header>
    );
};

export default Header;
