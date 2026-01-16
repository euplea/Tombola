/**
 * Copyright (c) 2026 Fabio Orengo. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setIsVisible(true);

        // Auto-dismiss timer
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for exit animation to finish before unmounting
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleManualClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    // Styles based on type
    const styles = {
        success: 'bg-emerald-500 text-white shadow-emerald-900/20',
        error: 'bg-red-500 text-white shadow-red-900/20',
        info: 'bg-indigo-500 text-white shadow-indigo-900/20'
    };

    const icons = {
        success: <CheckCircle size={24} />,
        error: <AlertCircle size={24} />,
        info: <Info size={24} />
    };

    return (
        <div
            className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[100] transform transition-all duration-300 ease-out
        flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl min-w-[320px] max-w-[90vw]
        ${styles[type]}
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'}
      `}
        >
            <div className="shrink-0 animate-bounce-short">
                {icons[type]}
            </div>

            <p className="font-bold text-sm leading-tight grow">
                {message}
            </p>

            <button
                onClick={handleManualClose}
                className="shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
