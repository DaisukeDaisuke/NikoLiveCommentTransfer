# NikoLiveCommentTransfer
ニコ生のコメントを棒読みちゃんのhttpサーバーに転送するchrome系拡張機能です。生放送での使用を想定した暴走防止の制限があります。

# インストール方法
棒読みちゃんを[ダウンロード](https://chi.usamimi.info/Program/Application/BouyomiChan/)します。  
  
最新の拡張機能を[ダウンロード](https://github.com/DaisukeDaisuke/NikoLiveCommentTransfer/archive/refs/heads/main.zip)して任意の場所に展開します。  
  
拡張機能の管理画面`chrome://extensions/`を開き、右上の`デベロッパー モード`をオンにし、`パッケージ化されていない拡張機能を読み込む`をクリックして`NikoLiveCommentTransfer-main`フォルダを選択します。  
  
棒読みちゃんを起動した上で、ニコ生の放送ページを開き、読み上げを開始します。  

# 制限
- 放送ページ読み込みから1秒の間に来たコメントは読み上げません。
- 3つ以上のdom変更があった場合無視します。
- 0.1秒間に1回チェックされるキューに3つ以上コメントがインキューされていた場合は無視します。
- 4文字以上の同じコメントは読み上げません。ポップアップメニューから手動でリセットできるほか、1日に1回ニコ生を開いた時にリセットされます。
- `/好きな\d+人が来場しました$/`のようなinfoメッセージは無視します。
