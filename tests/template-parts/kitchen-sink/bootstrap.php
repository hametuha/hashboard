<?php
/**
 * Render HTML for Bootstrap and Hashboard kitchen sink.
 *
 * @param string $page
 */
?>
<div class="py-5">
	<h1>Bootstrap 5 & React コンポーネントテスト</h1>
	<p class="lead">このページはBootstrap 5コンポーネントとReactコンポーネントのテスト用です。</p>

	<!-- タイポグラフィ -->
	<section class="mb-5">
		<h2>タイポグラフィ</h2>
		<div class="card">
			<div class="card-body">
				<h1>h1. Bootstrap見出し</h1>
				<h2>h2. Bootstrap見出し</h2>
				<h2>h3. Bootstrap見出し</h2>
				<h4>h4. Bootstrap見出し</h4>
				<h5>h5. Bootstrap見出し</h5>
				<h6>h6. Bootstrap見出し</h6>

				<hr>

				<p class="lead">
					これはリードパラグラフです。目立つように大きめのテキストが使われています。
				</p>
				<p>
					これは通常のパラグラフです。Bootstrap 5では、フォントサイズ、行の高さ、間隔が最適化されています。
				</p>
				<p>
					<small>これは小さいテキストです。</small>
				</p>

				<hr>

				<p>
					<mark>ハイライト</mark>
					テキスト
				</p>
				<p>
					<del>削除</del>
					テキスト
				</p>
				<p><s>取り消し線</s> テキスト</p>
				<p>
					<ins>挿入</ins>
					テキスト
				</p>
				<p><u>下線</u> テキスト</p>
				<p><strong>太字</strong> テキスト</p>
				<p><em>イタリック</em> テキスト</p>
			</div>
		</div>
	</section>

	<!-- ボタン -->
	<section class="mb-5">
		<h2>ボタン</h2>
		<div class="card">
			<div class="card-body">
				<h4>ボタンスタイル</h4>
				<div class="mb-3">
					<button type="button" class="btn btn-primary">Primary</button>
					<button type="button" class="btn btn-secondary">Secondary</button>
					<button type="button" class="btn btn-success">Success</button>
					<button type="button" class="btn btn-danger">Danger</button>
					<button type="button" class="btn btn-warning">Warning</button>
					<button type="button" class="btn btn-info">Info</button>
					<button type="button" class="btn btn-light">Light</button>
					<button type="button" class="btn btn-dark">Dark</button>
					<button type="button" class="btn btn-link">Link</button>
				</div>

				<h4>アウトラインボタン</h4>
				<div class="mb-3">
					<button type="button" class="btn btn-outline-primary">Primary</button>
					<button type="button" class="btn btn-outline-secondary">Secondary</button>
					<button type="button" class="btn btn-outline-success">Success</button>
					<button type="button" class="btn btn-outline-danger">Danger</button>
					<button type="button" class="btn btn-outline-warning">Warning</button>
					<button type="button" class="btn btn-outline-info">Info</button>
					<button type="button" class="btn btn-outline-light">Light</button>
					<button type="button" class="btn btn-outline-dark">Dark</button>
				</div>

				<h4>ボタンサイズ</h4>
				<div class="mb-3">
					<button type="button" class="btn btn-primary btn-lg">大きいボタン</button>
					<button type="button" class="btn btn-primary">通常ボタン</button>
					<button type="button" class="btn btn-primary btn-sm">小さいボタン</button>
				</div>

				<h4>ボタン状態</h4>
				<div class="mb-3">
					<button type="button" class="btn btn-primary active">アクティブ</button>
					<button type="button" class="btn btn-primary" disabled>無効</button>
				</div>
			</div>
		</div>
	</section>

	<!-- カード -->
	<section class="mb-5">
		<h2>カード</h2>
		<div class="row">
			<div class="col-md-4 mb-4">
				<div class="card">
					<img src="https://via.placeholder.com/300x200" class="card-img-top" alt="サンプル画像">
					<div class="card-body">
						<h5 class="card-title">カードタイトル</h5>
						<p class="card-text">
							カードの内容をここに書きます。テキストの長さに応じてカードの高さが調整されます。</p>
						<a href="#" class="btn btn-primary">ボタン</a>
					</div>
				</div>
			</div>

			<div class="col-md-4 mb-4">
				<div class="card">
					<div class="card-header">
						特集
					</div>
					<div class="card-body">
						<h5 class="card-title">特別なタイトル</h5>
						<p class="card-text">ヘッダーとフッターを持つカードの例です。</p>
						<a href="#" class="btn btn-primary">ボタン</a>
					</div>
					<div class="card-footer text-muted">
						2日前
					</div>
				</div>
			</div>

			<div class="col-md-4 mb-4">
				<div class="card text-white bg-primary">
					<div class="card-header">ヘッダー</div>
					<div class="card-body">
						<h5 class="card-title">プライマリーカード</h5>
						<p class="card-text">背景色を持つカードの例です。</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- フォーム -->
	<section class="mb-5">
		<h2>フォーム</h2>
		<div class="card">
			<div class="card-body">
				<form>
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">メールアドレス</label>
						<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
						<div id="emailHelp" class="form-text">あなたのメールアドレスを入力してください。</div>
					</div>

					<div class="mb-3">
						<label for="exampleInputPassword1" class="form-label">パスワード</label>
						<input type="password" class="form-control" id="exampleInputPassword1">
					</div>

					<div class="mb-3 form-check">
						<input type="checkbox" class="form-check-input" id="exampleCheck1">
						<label class="form-check-label" for="exampleCheck1">ログイン状態を保存する</label>
					</div>

					<div class="mb-3">
						<label for="exampleSelect" class="form-label">選択メニュー</label>
						<select class="form-select" id="exampleSelect">
							<option selected>選択してください</option>
							<option value="1">オプション 1</option>
							<option value="2">オプション 2</option>
							<option value="3">オプション 3</option>
						</select>
					</div>

					<div class="mb-3">
						<label for="exampleTextarea" class="form-label">テキストエリア</label>
						<textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
					</div>

					<div class="mb-3">
						<label for="formFile" class="form-label">ファイル選択</label>
						<input class="form-control" type="file" id="formFile">
					</div>

					<fieldset class="mb-3">
						<legend>ラジオボタン</legend>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
							<label class="form-check-label" for="flexRadioDefault1">
								デフォルトラジオ
							</label>
						</div>
						<div class="form-check">
							<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
								checked>
							<label class="form-check-label" for="flexRadioDefault2">
								デフォルトで選択されたラジオ
							</label>
						</div>
					</fieldset>

					<button type="submit" class="btn btn-primary">送信</button>
				</form>
			</div>
		</div>
	</section>

	<!-- ナビゲーション -->
	<section class="mb-5">
		<h2>ナビゲーション</h2>
		<div class="card mb-4">
			<div class="card-header">
				ナビゲーションタブ
			</div>
			<div class="card-body">
				<ul class="nav nav-tabs">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="#">アクティブ</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#">リンク</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#">リンク</a>
					</li>
					<li class="nav-item">
						<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">無効</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				ナビゲーションバー
			</div>
			<div class="card-body">
				<nav class="navbar navbar-expand-lg navbar-light bg-light">
					<div class="container-fluid">
						<a class="navbar-brand" href="#">Navbar</a>
						<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
							data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
							aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"></span>
						</button>
						<div class="collapse navbar-collapse" id="navbarNav">
							<ul class="navbar-nav">
								<li class="nav-item">
									<a class="nav-link active" aria-current="page" href="#">ホーム</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="#">機能</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="#">価格</a>
								</li>
								<li class="nav-item">
									<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">無効</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</section>

	<!-- ページネーション -->
	<section class="mb-5">
		<h2>ページネーション</h2>
		<div class="card">
			<div class="card-body">
				<nav aria-label="Page navigation example">
					<ul class="pagination">
						<li class="page-item">
							<a class="page-link" href="#" aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
							</a>
						</li>
						<li class="page-item"><a class="page-link" href="#">1</a></li>
						<li class="page-item"><a class="page-link" href="#">2</a></li>
						<li class="page-item"><a class="page-link" href="#">3</a></li>
						<li class="page-item">
							<a class="page-link" href="#" aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
							</a>
						</li>
					</ul>
				</nav>

				<nav aria-label="Page navigation example">
					<ul class="pagination pagination-lg">
						<li class="page-item disabled">
							<a class="page-link" href="#" tabindex="-1" aria-disabled="true">前へ</a>
						</li>
						<li class="page-item active" aria-current="page">
							<a class="page-link" href="#">1</a>
						</li>
						<li class="page-item"><a class="page-link" href="#">2</a></li>
						<li class="page-item"><a class="page-link" href="#">3</a></li>
						<li class="page-item">
							<a class="page-link" href="#">次へ</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</section>

	<!-- アラート -->
	<section class="mb-5">
		<h2>アラート</h2>
		<div class="card">
			<div class="card-body">
				<div class="alert alert-primary" role="alert">
					これはプライマリーアラートです。
				</div>
				<div class="alert alert-secondary" role="alert">
					これはセカンダリーアラートです。
				</div>
				<div class="alert alert-success" role="alert">
					これは成功アラートです。
				</div>
				<div class="alert alert-danger" role="alert">
					これは危険アラートです。
				</div>
				<div class="alert alert-warning" role="alert">
					これは警告アラートです。
				</div>
				<div class="alert alert-info" role="alert">
					これは情報アラートです。
				</div>
				<div class="alert alert-light" role="alert">
					これは明るいアラートです。
				</div>
				<div class="alert alert-dark" role="alert">
					これは暗いアラートです。
				</div>
			</div>
		</div>
	</section>

	<!-- モーダル -->
	<section class="mb-5">
		<h2>モーダル</h2>
		<div class="card">
			<div class="card-body">
				<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
					モーダルを開く
				</button>

				<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
					aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel">モーダルタイトル</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal"
									aria-label="Close"></button>
							</div>
							<div class="modal-body">
								モーダルの内容をここに書きます。
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
								<button type="button" class="btn btn-primary">保存</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- グリッドシステム -->
	<section class="mb-5">
		<h2>グリッドシステム</h2>
		<div class="card">
			<div class="card-body">
				<div class="row mb-3">
					<div class="col-sm-4">
						<div class="p-3 bg-primary text-white">.col-sm-4</div>
					</div>
					<div class="col-sm-4">
						<div class="p-3 bg-primary text-white">.col-sm-4</div>
					</div>
					<div class="col-sm-4">
						<div class="p-3 bg-primary text-white">.col-sm-4</div>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-md-6">
						<div class="p-3 bg-success text-white">.col-md-6</div>
					</div>
					<div class="col-md-6">
						<div class="p-3 bg-success text-white">.col-md-6</div>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-lg-3">
						<div class="p-3 bg-info text-white">.col-lg-3</div>
					</div>
					<div class="col-lg-6">
						<div class="p-3 bg-info text-white">.col-lg-6</div>
					</div>
					<div class="col-lg-3">
						<div class="p-3 bg-info text-white">.col-lg-3</div>
					</div>
				</div>
			</div>
		</div>
	</section>

</div>
