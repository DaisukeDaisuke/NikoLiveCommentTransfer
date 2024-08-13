chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.text) {
        const url = `http://localhost:50080/talk?text=${encodeURIComponent(message.text)}`;
        fetch(url)
            .then(response => response.text())
            .then(data => {
                console.log('Response from server:', data);
                sendResponse({ status: 'success', data: data });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ status: 'error', error: error });
            });
        // 非同期処理のため、trueを返してレスポンスを保持
        return true;
    }
});
