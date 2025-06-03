# Bootstrap 5 フォームコンポーネントの変更点と対応例

Bootstrap 5ではフォームコンポーネントに関連して多くの変更があります。このドキュメントでは、主な変更点と対応方法を説明します。

## 主な変更点

1. **クラス名の変更**
   - `.form-group`クラスが廃止され、スペーシングユーティリティ（`.mb-3`など）に置き換え
   - カスタムフォームコントロールのクラス名が変更（例：`.custom-control`→`.form-check`）

2. **フォームレイアウトの変更**
   - フォームグリッドシステムが変更
   - 水平フォームの構造が変更

3. **フォーム検証の変更**
   - 検証スタイルとフィードバックの仕組みが変更

## 対応例

### 1. 基本的なフォーム

**Bootstrap 4:**
```html
<form>
  <div class="form-group">
    <label for="exampleInputEmail1">メールアドレス</label>
    <input type="email" class="form-control" id="exampleInputEmail1">
    <small class="form-text text-muted">あなたのメールアドレスを入力してください。</small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">パスワード</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">ログイン状態を保存する</label>
  </div>
  <button type="submit" class="btn btn-primary">送信</button>
</form>
```

**Bootstrap 5:**
```html
<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">メールアドレス</label>
    <input type="email" class="form-control" id="exampleInputEmail1">
    <div class="form-text">あなたのメールアドレスを入力してください。</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">パスワード</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">ログイン状態を保存する</label>
  </div>
  <button type="submit" class="btn btn-primary">送信</button>
</form>
```

### 2. カスタムフォームコントロール

**Bootstrap 4:**
```html
<div class="custom-control custom-checkbox">
  <input type="checkbox" class="custom-control-input" id="customCheck1">
  <label class="custom-control-label" for="customCheck1">カスタムチェックボックス</label>
</div>

<div class="custom-control custom-radio">
  <input type="radio" class="custom-control-input" id="customRadio1" name="customRadio">
  <label class="custom-control-label" for="customRadio1">カスタムラジオ1</label>
</div>
```

**Bootstrap 5:**
```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="flexCheckDefault">
  <label class="form-check-label" for="flexCheckDefault">
    カスタムチェックボックス
  </label>
</div>

<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
  <label class="form-check-label" for="flexRadioDefault1">
    カスタムラジオ1
  </label>
</div>
```

### 3. 入力グループ

**Bootstrap 4:**
```html
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">@</span>
  </div>
  <input type="text" class="form-control" placeholder="ユーザー名" aria-label="ユーザー名" aria-describedby="basic-addon1">
</div>
```

**Bootstrap 5:**
```html
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="ユーザー名" aria-label="ユーザー名" aria-describedby="basic-addon1">
</div>
```

## 既存のSCSSファイルの修正例

### _form.scss の修正例

**変更前:**
```scss
.hb-form{
  & + & {
    &:before {
      content: "";
      display: block;
      margin: 0 auto $fieldset-margin;
      height: $fieldset-border-height;
      width: $fieldset-border-width;
      background-color: $filedset-border-color;
    }
  }
}

.hb-fieldset{
  padding: 0.35em 0 0.75em;
  @extend %hb-row;
  border-color: $fieldset-color;
  margin-bottom: $fieldset-margin;
  &-description{
    color: $fieldset-color;
    padding: 0 0 0.5rem;
  }
  legend {
    color: $fieldset-color;
    padding: 5px 0;
    font-weight: bold;
  }
  .form-row{
    margin-bottom: 1em;
  }
}
```

**変更後:**
```scss
.hb-form{
  & + & {
    &:before {
      content: "";
      display: block;
      margin: 0 auto $fieldset-margin;
      height: $fieldset-border-height;
      width: $fieldset-border-width;
      background-color: $filedset-border-color;
    }
  }
}

.hb-fieldset{
  padding: 0.35em 0 0.75em;
  @extend %hb-row;
  border-color: $fieldset-color;
  margin-bottom: $fieldset-margin;
  &-description{
    color: $fieldset-color;
    padding: 0 0 0.5rem;
  }
  legend {
    color: $fieldset-color;
    padding: 5px 0;
    font-weight: bold;
  }
  // .form-rowは廃止されたため、代わりにrow g-3を使用
  .row{
    --bs-gutter-y: 1em;
  }
}
```

## 注意点

1. Bootstrap 5では、フォームレイアウトがよりシンプルになり、ユーティリティクラスを多用する傾向があります
2. カスタムフォームコントロールが標準化され、`.custom-*`プレフィックスが削除されました
3. フォームバリデーションのマークアップとスタイルが変更されています
4. `.form-row`クラスが廃止され、代わりに`.row`と`.g-*`クラスを使用します
5. 入力グループの`.input-group-prepend`と`.input-group-append`が廃止され、`.input-group-text`を直接使用します
