#!/bin/bash

# mailhogコンテナを停止
if [ -f compose.yaml ]; then
  echo "mailhogコンテナを停止しています..."
  docker compose down
  echo "mailhogコンテナを停止しました。"
else
  echo "compose.yamlが見つかりません。スキップします。"
fi