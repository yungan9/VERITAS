import { useState, useEffect, useRef } from 'react';

declare global {
    interface Window {
        sensitivity?: string;
    }
}

function App() {
    const [sensitivity, setSensitivity] = useState('medium');
    const [language, setLanguage] = useState<'ko' | 'en'>('en');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSensitivityTooltip, setShowSensitivityTooltip] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const text = {
        en: {
            title: 'Fake Review Detector',
            sensitivity: 'Sensitivity',
            options: ['Sensitive', 'Balanced', 'Precise'],
            start: 'Run Detector',
            sensitivityTooltip: `Sensitive: Casts a wide net, including subtle fake reviews.\nBalanced: Reasonable balance between false positives and negatives.\nPrecise: Shows only high-confidence fake reviews.`,
        },
        ko: {
            title: '가짜 리뷰 탐지기',
            sensitivity: '민감도',
            options: ['민감', '균형', '정밀'],
            start: '탐지 시작',
            sensitivityTooltip: `민감: 가짜일 가능성이 있는 리뷰까지 넓게 탐지합니다.\n균형: 가짜로 의심되는 리뷰를 적절한 범위에서 탐지합니다.\n정밀: 가짜일 가능성이 매우 높은 리뷰만 신중하게 탐지합니다.`,
        },
    }[language];

    const handleClick = () => {
        if (typeof window !== 'undefined' && window.chrome?.tabs) {
            window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
                const tab = tabs[0];
                if (!tab.id) return;

                window.chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (sensitivity: string) => {
                        window.sensitivity = sensitivity;
                    },
                    args: [sensitivity],
                });

                window.chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js'],
                });
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            style={{
                width: '320px',
                height: '480px',
                background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)',
                padding: '24px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                }}
            />
            <div
                ref={dropdownRef}
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    🌐 {language === 'en' ? 'EN' : '한국어'}
                </button>

                {showDropdown && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            marginTop: '8px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            zIndex: 1000,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {[
                            { code: 'en', label: '🇺🇸 English' },
                            { code: 'ko', label: '🇰🇷 한국어' },
                        ].map((lang) => (
                            <div
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code as 'ko' | 'en');
                                    setShowDropdown(false);
                                }}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    color: '#333',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    transition: 'background 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(70, 130, 180, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {lang.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div
                    style={{
                        fontSize: '48px',
                        marginBottom: '12px',
                        position: 'relative',
                        display: 'inline-block',
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #87CEEB 0%, #ffffff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '48px',
                            position: 'relative',
                        }}
                    >
                        🛡️
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '20px',
                            fontWeight: '900',
                            color: '#1E90FF',
                            textShadow: '0 1px 3px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5)',
                            fontFamily: 'Arial, sans-serif',
                            letterSpacing: '1px',
                        }}
                    >
                        V
                    </div>
                </div>
                <h1
                    style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white',
                        margin: '0',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '-0.5px',
                    }}
                >
                    {text.title}
                </h1>
            </div>

            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    marginBottom: showSensitivityTooltip ? '120px' : '24px',
                    position: 'relative',
                    transition: 'margin-bottom 0.3s ease',
                    zIndex: 5,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <h3
                        style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            margin: '0',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        }}
                    >
                        {text.sensitivity}
                    </h3>
                    <span
                        style={{
                            fontSize: '16px',
                            cursor: 'help',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                        }}
                        onMouseEnter={() => setShowSensitivityTooltip(true)}
                        onMouseLeave={() => setShowSensitivityTooltip(false)}
                    >
                            ❔
                        </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
                    {['low', 'medium', 'high'].map((value, i) => (
                        <button
                            key={value}
                            onClick={() => setSensitivity(value)}
                            style={{
                                flex: '1',
                                maxWidth: '80px',
                                padding: '12px 4px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: sensitivity === value ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
                                backgroundColor: sensitivity === value
                                    ? 'rgba(255, 255, 255, 0.25)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                transform: sensitivity === value ? 'scale(1.02)' : 'scale(1)',
                                textAlign: 'center',
                            }}
                            onMouseEnter={(e) => {
                                if (sensitivity !== value) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sensitivity !== value) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                        >
                            {text.options[i]}
                        </button>
                    ))}
                </div>

                {showSensitivityTooltip && (
                    <div
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            color: '#333',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            padding: '12px',
                            fontSize: '12px',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.4',
                            marginTop: '8px',
                        }}
                    >
                        {text.sensitivityTooltip}
                    </div>
                )}
            </div>

            <button
                onClick={handleClick}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s infinite',
                    }}
                />
                {text.start}
            </button>

            <div
                style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    paddingTop: '16px',
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        gap: '8px',
                        opacity: '0.7',
                    }}
                >
                    {['✨', '🔒', '⚡'].map((emoji, i) => (
                        <span
                            key={i}
                            style={{
                                fontSize: '20px',
                                animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            }}
                        >
                                {emoji}
                            </span>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}

export default App;