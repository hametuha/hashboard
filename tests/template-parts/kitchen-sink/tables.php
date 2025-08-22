<?php
/**
 * Tables test page
 *
 * @var Hametuha\Hashboard $hashboard
 */
?>
<h1 class="mb-4">Table Components Test</h1>

<section class="mb-5">
	<h2>List Table</h2>
	<p>汎用的なリストテーブルコンポーネントのテストです。</p>
	
	<div class="card">
		<div class="card-body">
			<div id="list-table-test"></div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Post List</h2>
	<p>投稿一覧専用のコンポーネントのテストです。</p>
	
	<div class="card">
		<div class="card-body">
			<div id="post-list-test"></div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Custom Rendered Table</h2>
	<p>カスタムレンダリングを使用したテーブルの例です。</p>
	
	<div class="card">
		<div class="card-body">
			<div id="custom-table-test"></div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Table with Filters</h2>
	<p>フィルター機能付きのテーブルの例です。</p>
	
	<div class="card">
		<div class="card-body">
			<div class="mb-3">
				<div class="row">
					<div class="col-md-4">
						<input type="text" class="form-control" id="table-search" placeholder="検索...">
					</div>
					<div class="col-md-4">
						<select class="form-control" id="table-filter-status">
							<option value="">すべてのステータス</option>
							<option value="published">公開</option>
							<option value="draft">下書き</option>
							<option value="pending">レビュー待ち</option>
						</select>
					</div>
					<div class="col-md-4">
						<button class="btn btn-primary" id="table-filter-apply">フィルター適用</button>
						<button class="btn btn-secondary" id="table-filter-reset">リセット</button>
					</div>
				</div>
			</div>
			<div id="filtered-table-test"></div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Loading & Empty States</h2>
	<p>ローディングと空状態のテストです。</p>
	
	<div class="row">
		<div class="col-md-6">
			<div class="card">
				<div class="card-header">ローディング状態</div>
				<div class="card-body">
					<button class="btn btn-sm btn-primary mb-2" id="toggle-loading">Toggle Loading</button>
					<div id="loading-table-test"></div>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<div class="card">
				<div class="card-header">空状態</div>
				<div class="card-body">
					<button class="btn btn-sm btn-primary mb-2" id="toggle-empty">Toggle Empty</button>
					<div id="empty-table-test"></div>
				</div>
			</div>
		</div>
	</div>
</section>