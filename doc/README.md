# Bootstrap 4から5への移行ドキュメント

このディレクトリには、WordPressプラグイン「hashboard」をBootstrap 4から5に移行するためのドキュメントが含まれています。また、Sassの新しいバージョンに対応するためのガイドも提供しています。

## ドキュメント一覧

1. [移行計画の概要](migration-bootstrap.md) - Bootstrap 4から5への移行計画の全体像
2. [package.json更新例](bootstrap5-package.json.example) - 依存関係を更新するためのpackage.jsonの例
3. [変数オーバーライド更新例](bootstrap5-override.scss.example) - Bootstrap 5用の変数オーバーライドの例
4. [メインSCSSファイル更新例](bootstrap5-hashboard.scss.example) - メインSCSSファイルの更新例（@importと@useの両方の例を含む）
5. [グリッドシステム変更ガイド](bootstrap5-grid-examples.md) - Bootstrap 5のグリッドシステムの変更点と対応例
6. [フォームコンポーネント変更ガイド](bootstrap5-form-examples.md) - Bootstrap 5のフォームコンポーネントの変更点と対応例
7. [JavaScript変更ガイド](bootstrap5-javascript-examples.md) - Bootstrap 5のJavaScriptコンポーネントの変更点と対応例

## 移行手順の概要

1. **依存関係の更新**
   - package.jsonの更新
   - npm installの実行

2. **SCSSファイルの修正**
   - 変数定義の更新
   - グリッドシステムの更新
   - コンポーネント別SCSSファイルの更新
   - 新しいSass構文への対応

3. **JavaScriptの更新**
   - jQueryに依存しているコードの特定
   - バニラJSへの移行
   - データ属性の更新

4. **テストと修正**
   - ビルドテスト
   - 視覚的なテスト
   - 機能テスト

## 推奨される移行アプローチ

移行作業は一度にすべてを行うのではなく、段階的に進めることをお勧めします：

1. まず依存関係を更新し、ビルドが通るかを確認
2. 次に基本的なレイアウトとグリッドシステムを更新
3. 続いてフォームコンポーネントを更新
4. 最後にJavaScriptコンポーネントを更新

各ステップごとにビルドとテストを行い、問題が発生した場合はその都度修正することで、移行作業をより確実に進めることができます。

## 参考リソース

- [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.0/migration/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Sass Documentation](https://sass-lang.com/documentation/)
