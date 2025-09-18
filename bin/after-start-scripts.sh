# 1. .wp_install_path からハッシュ値を読み込む、なければ終了。
if [ ! -f .wp_install_path ]; then
  echo ".wp_install_path ファイルが見つかりません。mailhogのインストールをスキップします。"
  exit 0
fi
hash_value=$(cat .wp_install_path)

# 2. compose.template.yaml の %network% をハッシュ値で置き換え
sed "s/%NETWORK_NAME%/${hash_value}/g" compose.template.yaml > compose.yaml

# 3. 結果を出力（確認用、必要なければ削除可）
echo "ハッシュ値: ${hash_value} で compose.yml を作成しました。"

docker compose up -d

echo "mailhogは http://localhost:8025 で確認できます。"
