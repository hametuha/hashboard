# CLAUDEへの指示書

このリポジトリはWordPressプラグインです。

プラグインとしても利用できますが、それは開発用で、本来はcomposerパッケージとして利用します。

## ローカル開発

- @wordpress/env(wp-env）を使って、ローカル開発環境を構築します。Dockerで動作し、ポートは `8888` です。
- wp-envはpackage.json記載のコマンドで利用することができます。
  - npm start: wp-envを起動します。
  - npm stop: wp-envを停止します。
  - npm run cli: wp-envのCLIを実行します。
  - npm test : wp-envのDocker環境の中でPHPUnitを実行します。
  - npm run test:js : jestによるテストを行います。
- @wordpress/scriptsを使って、JavaScriptのビルドやテストを行います。
  - コマンドはnpm scriptsに定義されています。
  - その他、各種設定ファイルがプロジェクトルートにあります。これらのルールに基本的には従います。
- composerでは依存関係を定義します。
  - phpcsはWordPress Coding Standardを利用します。`composer lint`でコードのチェックを行います。`composer fix` ではphpcbfで自動修正します。
  - composer testではPHPUnitを実行しますが、ローカル開発ではDocker環境で実行するため、このスクリプトはGitHub Actions用です。
- wordpress ディレクトリにはWordPressコアを入れます。.gitignoreされていますが、これはPHPStormなどのIDEでの補完のために必要です。

## プラグインとしての利用

このプラグインはレイアウトフレームワークのようなもので、WordPressのダッシュボードを拡張するためのものです。
プロフィールページなどの基本的なページは存在しますが、あくまで利用者が拡張することを想定しています。
したがって、ローカル開発では「簡単なモックアプページを用意する」必要があります。
このために、`test/app/Bootstrap.php` を用意しており、プラグインファイル `hashboard.php` がローカル環境（require --dev）で読み込まれた場合に、モックアプリケーションを起動します。

## フレームワークの技術的変遷

### Vue.jsからReactへの移行（完了済み）

このライブラリは2017年から開発されており、当初はVue.js 1.x系を採用していました。当時はWordPressがどのJavaScriptライブラリを標準採用するか定かではなかったためです。

その後、WordPressがReactを採用することが明確になったため、2024-2025年にかけてVue.jsからReactへの完全移行を実施し、**2025年1月時点で移行は完了**しています。

#### 移行の成果
- ✅ すべてのコンポーネントがReact（`@wordpress/element`）で実装済み
- ✅ Vue.js依存コードの完全削除済み
- ✅ `@kunoichi/grab-deps`によるES6+JSXビルドシステム構築済み
- ✅ WordPress標準パッケージ（`@wordpress/components`、`@wordpress/i18n`）への統合完了

現在、`assets/js`フォルダ内のすべてのコンポーネントはReactで実装されており、WordPressのエコシステムと完全に統合されています。

## 特殊なビルドシステム

このプロジェクトは`@kunoichi/grab-deps`を使用した特殊なビルドシステムを採用しています。

### ビルドの特徴

1. **ES Next + JSX対応**
   - `src/js`ディレクトリ内のファイルはES6+モジュール構文とJSXで記述可能
   - React JSXコンポーネントも自動的にトランスパイルされる

2. **import文の自動グローバル展開**
   - `@wordpress/*`パッケージ（例：`@wordpress/element`）はWordPressのグローバルオブジェクト（`wp.element`）に自動変換
   - `@hb/*`の名前空間インポートも将来的にサポート予定

3. **グローバル名前空間への自動登録**
   - ES6 export文は自動的にWordPress互換のグローバル名前空間に変換される
   - `export const foo = ...` → `window.hb.namespace.foo = ...`

### ビルド設定

```json
{
  "grabDeps": {
    "namespace": "hb",
    "srcDir": "assets/js",
    "autoHandleGeneration": true,
    "autoImportDetection": true,
    "globalExportGeneration": true
  }
}
```

### ビルドコマンド

```bash
npm run build:js    # ES6+JSX → WordPressグローバル互換JS
npm run dump        # wp-dependencies.json生成
```

### 例: ES6+JSXからWordPressグローバルへの変換

**入力** (`src/js/components/example.jsx`):
```javascript
import { useState } from '@wordpress/element';

export const MyComponent = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

**出力** (`assets/js/components/example.js`):
```javascript
// 自動生成されたトランスパイル済みコード
const { useState } = wp.element;
// ... ミニファイ化されたReactコンポーネント

// グローバル登録
window.hb = window.hb || {};
window.hb.components = window.hb.components || {};
window.hb.components.example = { MyComponent };
```

このシステムにより、モダンなES6+JSX開発体験を保ちながら、WordPressのレガシーなグローバル名前空間との互換性を確保しています。

## テスト戦略

### Jest環境でのWordPress依存関係対応

WordPressパッケージ（`@wordpress/element`, `@wordpress/i18n`, `@wordpress/components`など）を使用するコンポーネントもJestでテスト可能です。

#### テスト環境設定

**jest.config.js**:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@wordpress/element$': '<rootDir>/node_modules/@wordpress/element',
    '^@wordpress/i18n$': '<rootDir>/node_modules/@wordpress/i18n',
    '^@wordpress/components$': '<rootDir>/node_modules/@wordpress/components',
  },
};
```

**jest.setup.js**:
```javascript
// WordPress グローバルオブジェクトのモック
global.wp = {
  element: require('@wordpress/element'),
  i18n: require('@wordpress/i18n'),
  components: require('@wordpress/components'),
};
```

#### テスト分類

1. **シンプルなユーティリティ関数**
   - `src/js/filters/numbers.js`のような純粋関数
   - 外部依存関係なし、Jestで完全テスト

2. **WordPress依存コンポーネント**
   - `@wordpress/*`パッケージを使用するReactコンポーネント
   - Jest + React Testing Libraryでテスト可能
   - 上記のモック設定で`wp.element.useState`などが利用可能

3. **grab-deps生成コンポーネント**
   - ビルド後の`window.hb.components.*`形式
   - グローバル名前空間経由でのテスト

#### テスト例

```javascript
// WordPress依存関係のテスト
test('wp.element is available', () => {
  expect(wp.element.useState).toBeDefined();
});

// コンポーネントのテスト
test('component renders correctly', () => {
  const { HbComponent } = window.hb.components.example;
  render(<HbComponent prop="value" />);
  // assertions...
});
```

この設定により、依存関係の複雑さに関係なく、統一されたJest環境ですべてのコンポーネントをテストできます。

## ListTableコンポーネントの使用方法

ListTableコンポーネントは、依存性注入パターンを採用しており、様々なデータ型とカスタムレンダリングに対応しています。

### 基本的な使用方法

```javascript
// 基本的な投稿リスト
const posts = [
  { id: 1, title: { rendered: 'Hello World' }, link: '/post/1', date: '2024-01-01' },
  { id: 2, title: { rendered: 'React Tutorial' }, link: '/post/2', date: '2024-01-02' },
];

window.hb.components.listTable({
  items: posts,
  curPage: 1,
  totalPage: 5,
  onPageChanged: (page) => console.log('Page:', page)
});
```

### カスタムレンダリング

#### ユーザーリスト（renderItemの例）
```javascript
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: '/avatar1.jpg', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatar2.jpg', role: 'Editor' },
];

const renderUserItem = (user) => React.createElement('div', {
  className: 'd-flex align-items-center'
}, [
  React.createElement('img', {
    key: 'avatar',
    src: user.avatar,
    alt: user.name,
    className: 'rounded-circle me-3',
    width: 40,
    height: 40
  }),
  React.createElement('div', { key: 'info', className: 'flex-grow-1' }, [
    React.createElement('h6', { key: 'name', className: 'mb-0' }, user.name),
    React.createElement('small', { key: 'email', className: 'text-muted' }, user.email)
  ]),
  React.createElement('span', {
    key: 'role',
    className: 'badge bg-secondary'
  }, user.role)
]);

window.hb.components.listTable({
  items: users,
  renderItem: renderUserItem,
  listClass: 'list-item p-3',
  onPageChanged: (page) => console.log('Page:', page)
});
```

#### ヘッダーとフィルター（renderHeaderの例）
```javascript
const renderHeader = () => React.createElement('div', {
  className: 'mb-3'
}, [
  React.createElement('div', { key: 'row', className: 'row' }, [
    React.createElement('div', { key: 'title', className: 'col-md-6' }, [
      React.createElement('h3', { key: 'h3' }, 'Products')
    ]),
    React.createElement('div', { key: 'search', className: 'col-md-6' }, [
      React.createElement('input', {
        key: 'input',
        type: 'text',
        className: 'form-control',
        placeholder: 'Search products...'
      })
    ])
  ])
]);

window.hb.components.listTable({
  items: products,
  renderHeader: renderHeader,
  renderItem: renderProductItem,
  onPageChanged: (page) => console.log('Page:', page)
});
```

#### 空状態のカスタマイズ（renderEmptyの例）
```javascript
const renderEmpty = () => React.createElement('div', {
  className: 'text-center py-5'
}, [
  React.createElement('i', {
    key: 'icon',
    className: 'material-icons text-muted',
    style: { fontSize: '48px' }
  }, 'inbox'),
  React.createElement('p', {
    key: 'message',
    className: 'mt-3 text-muted'
  }, 'No items found'),
  React.createElement('button', {
    key: 'button',
    className: 'btn btn-primary'
  }, 'Add First Item')
]);

window.hb.components.listTable({
  items: [],
  renderEmpty: renderEmpty,
  onPageChanged: (page) => console.log('Page:', page)
});
```

### カスタムコンポーネントの注入

#### カスタムローディング
```javascript
const CustomLoading = ({ loading }) => {
  if (!loading) return null;
  return React.createElement('div', {
    className: 'custom-loading text-center py-4'
  }, [
    React.createElement('div', {
      key: 'spinner',
      className: 'spinner-border text-primary'
    }),
    React.createElement('p', {
      key: 'text',
      className: 'mt-2'
    }, 'Loading data...')
  ]);
};

window.hb.components.listTable({
  items: data,
  loading: true,
  LoadingComponent: CustomLoading,
  onPageChanged: (page) => console.log('Page:', page)
});
```

#### カスタムページネーション
```javascript
const CustomPagination = ({ current, total, onPageChanged }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  
  return React.createElement('nav', {}, [
    React.createElement('ul', {
      key: 'pagination',
      className: 'pagination justify-content-center'
    }, [
      // Previous button
      React.createElement('li', {
        key: 'prev',
        className: `page-item ${current === 1 ? 'disabled' : ''}`
      }, [
        React.createElement('a', {
          key: 'link',
          className: 'page-link',
          href: '#',
          onClick: (e) => {
            e.preventDefault();
            if (current > 1) onPageChanged(current - 1);
          }
        }, 'Previous')
      ]),
      // Page numbers
      ...pages.map(page => 
        React.createElement('li', {
          key: page,
          className: `page-item ${page === current ? 'active' : ''}`
        }, [
          React.createElement('a', {
            key: 'link',
            className: 'page-link',
            href: '#',
            onClick: (e) => {
              e.preventDefault();
              onPageChanged(page);
            }
          }, page.toString())
        ])
      ),
      // Next button
      React.createElement('li', {
        key: 'next',
        className: `page-item ${current === total ? 'disabled' : ''}`
      }, [
        React.createElement('a', {
          key: 'link',
          className: 'page-link',
          href: '#',
          onClick: (e) => {
            e.preventDefault();
            if (current < total) onPageChanged(current + 1);
          }
        }, 'Next')
      ])
    ])
  ]);
};

window.hb.components.listTable({
  items: data,
  curPage: 1,
  totalPage: 5,
  PaginationComponent: CustomPagination,
  onPageChanged: (page) => console.log('Page:', page)
});
```

### プロパティ一覧

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `items` | Array | `[]` | 表示するアイテムの配列 |
| `loading` | Boolean | `false` | ローディング状態 |
| `curPage` | Number | `1` | 現在のページ番号 |
| `totalPage` | Number | `1` | 総ページ数 |
| `listClass` | String | `'list-item hb-post-list-item'` | リストアイテムのCSSクラス |
| `wrapperClass` | String | `''` | ラッパーの追加CSSクラス |
| `listWrapperClass` | String | `'list-group hb-post-list'` | リストコンテナのCSSクラス |
| `onPageChanged` | Function | - | ページ変更時のコールバック |
| `renderHeader` | Function | - | ヘッダーのレンダリング関数 |
| `renderItem` | Function | - | アイテムのレンダリング関数 |
| `renderEmpty` | Function | - | 空状態のレンダリング関数 |
| `LoadingComponent` | Component | - | カスタムローディングコンポーネント |
| `PaginationComponent` | Component | - | カスタムページネーションコンポーネント |

### デフォルトコンポーネントの使用

ListTableコンポーネントは以下の既存コンポーネントを自動的に使用します：
- `window.hb.components.loading` - ローディングインジケーター
- `window.hb.components.pagination` - ページネーション

これらのコンポーネントが利用可能な場合、プレースホルダーの代わりに使用されます。

## Hashboardフレームワークについて

このプラグインは**会員制サイトのためのユーザーダッシュボードを作るフレームワーク**です。

### 重要な特徴

1. **フロントエンド向けダッシュボード**
   - `/dashboard` などの公開URLでアクセス
   - WordPress管理画面（wp-admin）ではなく、フロントエンド側にユーザー専用ページを提供
   - ログインが必要な会員制機能

2. **拡張前提の設計**
   - デフォルトのページ数は最小限（`app/Hametuha/Hashboard/Screens`参照）
   - 実際の利用では開発者が拡張してカスタムページを作成
   - フレームワークとしての柔軟性を重視

3. **KitchenSinkの役割**
   - フレームワークのテスト・デモ用途
   - 各種コンポーネントの動作確認
   - 開発者向けの参考実装

### Claude用開発支援機能

ローカル開発環境では、Claude（AI）が直接Hashboardダッシュボードにアクセスできる自動ログイン機能を実装しています。

#### 使用方法

```bash
# Claude識別ヘッダーを付けてアクセス
curl -H "X-Claude-Debug: true" -L http://localhost:8888/dashboard/kitchen-sink/components
```

#### 実装詳細

- `tests/app/Bootstrap.php`の`auto_login_for_claude()`メソッドで実装
- ローカル環境（`WP_DEBUG=true`）でのみ動作
- `X-Claude-Debug: true`ヘッダーで自動的に`claude`ユーザーとしてログイン
- セキュリティ：本番環境では絶対に動作しない仕組み

#### 利用可能なURL

- `/dashboard/` - メインダッシュボード
- `/dashboard/kitchen-sink/bootstrap` - Bootstrapコンポーネントテスト
- `/dashboard/kitchen-sink/components` - WordPressコンポーネントテスト  
- `/dashboard/kitchen-sink/charts` - チャートコンポーネントテスト
- `/dashboard/kitchen-sink/tables` - テーブルコンポーネントテスト

この機能により、Claude（AI）が実際のHTMLレスポンス、JSファイルの読み込み、コンポーネントの動作を直接確認できます。
