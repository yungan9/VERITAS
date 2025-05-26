function App() {
    const handleClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (!tab.id) return;

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js'],
            });
        });
        console.log("실행");
    };

    return (
        <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
            <h2>🧹 Review Collector</h2>
            <button
                onClick={handleClick}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#2c7df6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '12px',
                }}
            >
                Collect Reviews
            </button>
        </div>
    );
}

export default App;
