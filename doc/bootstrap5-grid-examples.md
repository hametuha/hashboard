# Bootstrap 5 グリッドシステムの変更点と対応例

Bootstrap 5ではグリッドシステムに関連していくつかの重要な変更があります。このドキュメントでは、主な変更点と対応方法を説明します。

## 主な変更点

1. **gutterの扱いが変更**
   - `.no-gutters`クラスが廃止され、`.g-0`に変更
   - gutterの幅を制御するための新しいクラス（`.g-*`, `.gx-*`, `.gy-*`）が追加

2. **コンテナの変更**
   - `.container-fluid`の動作が若干変更
   - 新しい`.container-*`クラスが追加（例：`.container-sm`, `.container-md`など）

3. **行と列のクラス**
   - 基本的な`.row`と`.col-*`クラスは同じだが、内部実装が変更

## 対応例

### 1. gutterの扱い

**Bootstrap 4:**
```scss
// gutterなしの行
.row.no-gutters {
  margin-right: 0;
  margin-left: 0;
  
  > .col,
  > [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}
```

**Bootstrap 5:**
```scss
// gutterなしの行
.row.g-0 {
  --bs-gutter-x: 0;
}

// 水平方向のgutterのみ調整
.row.gx-2 {
  --bs-gutter-x: 0.5rem;
}

// 垂直方向のgutterのみ調整
.row.gy-3 {
  --bs-gutter-y: 1rem;
}
```

### 2. カスタムグリッドの例

**Bootstrap 4:**
```scss
.hb-container {
  $pad: 1.5rem;
  padding: 0 $pad;
  @media only screen and (max-width: map-get($grid-breakpoints, md)) {
    padding: 0 $pad / 2;
  }
}

.row {
  @extend %clearfix;
  $row-pad: -1.5rem;
  margin-right: $row-pad;
  margin-left: $row-pad;
  @media only screen and (max-width: map-get($grid-breakpoints, md)) {
    margin-right: $row-pad / 2;
    margin-left: $row-pad / 2;
  }
}
```

**Bootstrap 5:**
```scss
.hb-container {
  $pad: 1.5rem;
  padding: 0 $pad;
  @media only screen and (max-width: map-get($grid-breakpoints, md)) {
    padding: 0 $pad / 2;
  }
}

.row {
  --bs-gutter-x: 3rem;
  @media only screen and (max-width: map-get($grid-breakpoints, md)) {
    --bs-gutter-x: 1.5rem;
  }
}
```

### 3. レスポンシブグリッドの例

**Bootstrap 4:**
```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">カラム1</div>
    <div class="col-12 col-md-6 col-lg-4">カラム2</div>
    <div class="col-12 col-md-12 col-lg-4">カラム3</div>
  </div>
</div>
```

**Bootstrap 5:**
```html
<div class="container">
  <div class="row g-4">
    <div class="col-12 col-md-6 col-lg-4">カラム1</div>
    <div class="col-12 col-md-6 col-lg-4">カラム2</div>
    <div class="col-12 col-md-12 col-lg-4">カラム3</div>
  </div>
</div>
```

## 既存のSCSSファイルの修正例

### _layout.scss の修正例

**変更前:**
```scss
.hb-container {
  $pad: 1.5rem;
  padding: 0 $pad;
  @media #{$medium-and-down} {
    padding: 0 $pad / 2;
  }
}

.row {
  @extend %clearfix;
}
```

**変更後:**
```scss
.hb-container {
  $pad: 1.5rem;
  padding: 0 $pad;
  @media #{$medium-and-down} {
    padding: 0 $pad / 2;
  }
}

.row {
  // clearfixは不要になりました（Bootstrap 5では自動的に適用）
  // 必要に応じてgutterを調整
  --bs-gutter-x: 1.5rem;
  @media #{$medium-and-down} {
    --bs-gutter-x: 0.75rem;
  }
}
```

## 注意点

1. Bootstrap 5では、CSSカスタムプロパティ（CSS変数）を使用してgutterを制御しています
2. レスポンシブデザインのためのブレークポイント変数は同じですが、使用方法が若干異なる場合があります
3. フレックスボックスの使用が増え、より柔軟なレイアウトが可能になっています
