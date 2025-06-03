# Bootstrap 5 JavaScriptコンポーネントの変更点と対応例

Bootstrap 5では、jQueryへの依存がなくなり、JavaScriptコンポーネントの使用方法が大きく変更されています。このドキュメントでは、主な変更点と対応方法を説明します。

## 主な変更点

1. **jQueryの依存関係の削除**
   - Bootstrap 5はjQueryに依存しなくなりました
   - すべてのJavaScriptコンポーネントがバニラJavaScriptで書き直されています

2. **データ属性の変更**
   - `data-toggle`が`data-bs-toggle`に変更
   - `data-target`が`data-bs-target`に変更
   - その他のデータ属性も同様に`data-bs-*`プレフィックスが追加

3. **JavaScriptの初期化方法の変更**
   - jQueryプラグインの代わりに、JavaScriptのコンストラクタを使用

4. **イベントの変更**
   - jQueryイベントの代わりに、ネイティブのJavaScriptイベントを使用

## 対応例

### 1. モーダルダイアログ

**Bootstrap 4 (jQuery):**
```javascript
// HTML
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  モーダルを開く
</button>

// JavaScript
$('#exampleModal').modal('show');
$('#exampleModal').modal('hide');

// イベント
$('#exampleModal').on('shown.bs.modal', function () {
  // モーダルが表示された後の処理
});
```

**Bootstrap 5 (バニラJS):**
```javascript
// HTML
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  モーダルを開く
</button>

// JavaScript
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
myModal.show();
myModal.hide();

// イベント
document.getElementById('exampleModal').addEventListener('shown.bs.modal', function () {
  // モーダルが表示された後の処理
});
```

### 2. ドロップダウンメニュー

**Bootstrap 4 (jQuery):**
```javascript
// HTML
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
    ドロップダウンボタン
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">アクション1</a>
    <a class="dropdown-item" href="#">アクション2</a>
    <a class="dropdown-item" href="#">アクション3</a>
  </div>
</div>

// JavaScript
$('#dropdownMenuButton').dropdown('toggle');

// イベント
$('#dropdownMenuButton').on('shown.bs.dropdown', function () {
  // ドロップダウンが表示された後の処理
});
```

**Bootstrap 5 (バニラJS):**
```javascript
// HTML
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
    ドロップダウンボタン
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">アクション1</a>
    <a class="dropdown-item" href="#">アクション2</a>
    <a class="dropdown-item" href="#">アクション3</a>
  </div>
</div>

// JavaScript
const dropdown = new bootstrap.Dropdown(document.getElementById('dropdownMenuButton'));
dropdown.toggle();

// イベント
document.getElementById('dropdownMenuButton').addEventListener('shown.bs.dropdown', function () {
  // ドロップダウンが表示された後の処理
});
```

### 3. タブ

**Bootstrap 4 (jQuery):**
```javascript
// HTML
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">ホーム</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">プロフィール</a>
  </li>
</ul>

// JavaScript
$('#myTab a[href="#profile"]').tab('show');

// イベント
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  // タブが表示された後の処理
});
```

**Bootstrap 5 (バニラJS):**
```javascript
// HTML
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">ホーム</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">プロフィール</button>
  </li>
</ul>

// JavaScript
const triggerTabList = [].slice.call(document.querySelectorAll('#myTab button'));
const tabToShow = document.querySelector('#profile-tab');
const tab = new bootstrap.Tab(tabToShow);
tab.show();

// イベント
document.querySelector('button[data-bs-toggle="tab"]').addEventListener('shown.bs.tab', function (e) {
  // タブが表示された後の処理
});
```

## 既存のJavaScriptファイルの修正例

### hashboard-helper.js の修正例

**変更前 (jQuery):**
```javascript
// モーダルを開く
$('#userModal').modal('show');

// ドロップダウンを初期化
$('.dropdown-toggle').dropdown();

// ツールチップを初期化
$('[data-toggle="tooltip"]').tooltip();

// タブを初期化
$('#myTab a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});

// イベントリスナー
$('#myModal').on('hidden.bs.modal', function () {
  // モーダルが非表示になった後の処理
});
```

**変更後 (バニラJS):**
```javascript
// モーダルを開く
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
userModal.show();

// ドロップダウンを初期化
const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new bootstrap.Dropdown(dropdownToggleEl);
});

// ツールチップを初期化
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// タブを初期化
const tabTriggerList = [].slice.call(document.querySelectorAll('#myTab button'));
tabTriggerList.forEach(function (tabTriggerEl) {
  tabTriggerEl.addEventListener('click', function (event) {
    event.preventDefault();
    const tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
  });
});

// イベントリスナー
document.getElementById('myModal').addEventListener('hidden.bs.modal', function () {
  // モーダルが非表示になった後の処理
});
```

## 注意点

1. Bootstrap 5では、すべてのデータ属性に`bs-`プレフィックスが追加されています
2. jQueryセレクタの代わりに、`document.querySelector`や`document.getElementById`などのネイティブJavaScriptメソッドを使用します
3. jQueryイベントの代わりに、`addEventListener`を使用します
4. Bootstrap 5では、JavaScriptコンポーネントを使用するには、`bootstrap.bundle.min.js`をインクルードする必要があります（jQueryは不要）
5. 既存のjQueryコードを一度にすべて変換するのではなく、段階的に移行することをお勧めします

## 参考リソース

- [Bootstrap 5 JavaScript Documentation](https://getbootstrap.com/docs/5.3/getting-started/javascript/)
- [Bootstrap 5 Components](https://getbootstrap.com/docs/5.3/components/)
