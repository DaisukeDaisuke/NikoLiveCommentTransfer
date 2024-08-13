// 監視対象のクラス名
const targetClass = "___table___Htukt.___table___jcLK6.table";

// 無視する正規表現の配列
const ignorePatterns = [
    /好きな\d+人が来場しました$/,
    /^\d+分延長しました$/,
    /^放送者のサポーターが\d+人来場しました$/,
    /^ニコニ広告枠から\d+人が来場しました$/,
    /\d+位にランクインしました$/,
    /がリクエストされました$/,
];

// オブザーバーの設定
const config = { childList: true, subtree: true };

// コメントキューと既読コメントリスト
let commentQueue = [];
let readComments = [];

// 0.1秒ごとにキューを処理
setInterval(() => {
    if (commentQueue.length >= 3) {
        commentQueue = [];
        return;
    }

    if (commentQueue.length > 0) {
        const commentText = commentQueue.shift();
        if (commentText.length > 3) {
            // 10文字以上のコメントは既読リストに追加
            readComments.push(commentText);
            // 保存
            chrome.storage.local.set({ readComments: readComments });
        }
        chrome.runtime.sendMessage({ text: commentText }, response => {
            console.log('Response from background:', response);
        });
    }
}, 100);

setInterval(() => {
    chrome.storage.local.get('readComments', data => {
        if (data.readComments) {
            readComments = data.readComments;
        }
    });
}, 10000);

// コメントが無視パターンに一致するかチェックする関数
function matchesIgnorePatterns(text) {
    return ignorePatterns.some(pattern => pattern.test(text));
}

// 変更が検出された場合のコールバック関数
const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (mutation.addedNodes.length >= 2) {
                return;
            }

            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const commentTextElement = node.querySelector('.comment-text');
                    if (commentTextElement) {
                        let commentText = commentTextElement.innerText;
                        // URLを削除
                        commentText = commentText.replace(/http(s)?:\/\/\S+/g, '');

                        // 無視パターンに一致しない場合のみキューに追加
                        if (!matchesIgnorePatterns(commentText)) {
                            if (commentText.length > 5) {
                                // 10文字以上のコメントは既読チェック
                                if (!readComments.includes(commentText)) {
                                    commentQueue.push(commentText);
                                }
                            } else {
                                // 10文字以下のコメントは無条件で追加
                                commentQueue.push(commentText);
                            }
                        }
                    }
                }
            });
        }
    }
};

// 日本の日付を取得する関数
function getJapanDate() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const japanTime = new Date(utc + (3600000 * 9));
    return japanTime.toISOString().split('T')[0];
}

// 初期化時に既読コメントと前回の日付をロード
chrome.storage.local.get(['readComments', 'lastResetDate'], data => {
    const today = getJapanDate();
    if (data.lastResetDate !== today) {
        console.log(today);
        // 日付が違う場合はリセット
        readComments = [];
        chrome.storage.local.set({ readComments: [], lastResetDate: today });
    } else if (data.readComments) {
        readComments = data.readComments;
    }
});

setTimeout(() => {
    // オブザーバーのインスタンスを生成
    const observer = new MutationObserver(callback);
    // ターゲットノードの監視を開始
    const targetNode = document.querySelector(".___table___Htukt.___table___jcLK6.table");
    if (targetNode) {
        observer.observe(targetNode, config);
    }
}, 1000);


