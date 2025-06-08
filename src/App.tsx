import { useState } from 'react';

declare global {
    interface Window {
        sensitivity?: string;
    }
}

function App() {
    const [sensitivity, setSensitivity] = useState('medium');

    const handleClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (!tab.id) return;

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (sensitivity) => {
                    window.sensitivity = sensitivity;
                },
                args: [sensitivity],
            });

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js'],
            });
        });
    };

    return (
        <div
            style={{
                padding: '24px 16px',
                fontFamily: 'Segoe UI, sans-serif',
                background: '#f8f9fa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '24px',
                width: '300px',

            }}
        >
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#343a40', margin: 0 }}>
                Fake Review Detector
            </h2>

            <div style={{ width: '100%' }}>
                <p style={{ fontWeight: 600, marginBottom: '12px' }}>Sensitivity</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                        { label: 'Sensitive', value: 'low' },
                        { label: 'Balanced', value: 'medium' },
                        { label: 'Precise', value: 'high' },
                    ].map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setSensitivity(value)}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: sensitivity === value ? '#2c7df6' : '#ced4da',
                                backgroundColor: sensitivity === value ? '#2c7df6' : '#fff',
                                color: sensitivity === value ? '#fff' : '#495057',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleClick}
                style={{
                    width: '100%',
                    padding: '12px 0',
                    backgroundColor: '#2c7df6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '18px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                }}
            >
                Start
            </button>
        </div>
    );
}

export default App;
