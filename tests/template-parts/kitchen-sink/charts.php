<?php
/**
 * Charts test page
 *
 * @var Hametuha\Hashboard $hashboard
 */
?>
<h1 class="mb-4">Chart Components Test</h1>

<section class="mb-5">
	<h2>Bar Chart</h2>
	<p>テスト用の棒グラフを表示します。月別売上データの例です。</p>
	
	<div class="card">
		<div class="card-body">
			<div id="bar-chart-test" style="height: 400px;"></div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Line Chart</h2>
	<p>テスト用の折れ線グラフを表示します。訪問者数の推移の例です。</p>
	
	<div class="card">
		<div class="card-body">
			<div id="line-chart-test" style="height: 400px;"></div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Multiple Datasets</h2>
	<p>複数のデータセットを持つグラフの例です。</p>
	
	<div class="row">
		<div class="col-md-6">
			<div class="card">
				<div class="card-header">売上と利益の比較</div>
				<div class="card-body">
					<div id="bar-chart-multiple" style="height: 300px;"></div>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<div class="card">
				<div class="card-header">複数カテゴリの推移</div>
				<div class="card-body">
					<div id="line-chart-multiple" style="height: 300px;"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="mb-5">
	<h2>Interactive Controls</h2>
	<p>動的にデータを更新するグラフの例です。</p>
	
	<div class="card">
		<div class="card-body">
			<div class="mb-3">
				<button class="btn btn-primary" id="chart-update-btn">データを更新</button>
				<button class="btn btn-secondary" id="chart-toggle-type">グラフタイプ切替</button>
			</div>
			<div id="interactive-chart" style="height: 350px;"></div>
		</div>
	</div>
</section>