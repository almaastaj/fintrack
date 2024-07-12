import React from "react";

function Modal({ show, onClose, children }) {
    return (
        <div
            style={{
                transform: show ? "translateX(0%)" : "translateX(-200%)",
            }}
            className="absolute top-8 left-0 w-full h-[90vh] z-10 transition-all duration-500"
        >
            <div className="container mx-auto max-w-2xl h-[90vh] rounded-3xl bg-teal-400 py-4 px-4 overflow-auto no-scrollbar">
                <button
                    onClick={() => {
                        onClose(false);
                    }}
                    className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
