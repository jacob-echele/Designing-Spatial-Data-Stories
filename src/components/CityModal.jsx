import { useState, useEffectEvent } from "react";

function CityModal() {
    return (
        <div
            className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl">Modal Title</h2>

            <div className="mt-4">
            <p className="text-pretty text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            </div>
        </div>
        </div>
    );
}

export default CityModal