document.addEventListener('DOMContentLoaded', () => {
    const readCountSpan = document.getElementById('readCount');
    const resetButton = document.getElementById('resetButton');

    // 既読コメント数を表示
    chrome.storage.local.get('readComments', data => {
        if (data.readComments) {
            readCountSpan.textContent = data.readComments.length;
        }
    });

    // リセットボタンがクリックされたとき
    resetButton.addEventListener('click', () => {
        chrome.storage.local.set({ readComments: [] }, () => {
            readCountSpan.textContent = '0';
            alert('既読コメントがリセットされました。');
        });
    });
});
