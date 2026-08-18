# urugi-blog

山村留学売木学園の非公式ブログクライアントアプリ

[https://sanson.urugi.jp/blog/](https://sanson.urugi.jp/blog/) の内容をスクレイピングして表示する、非公式のNext.js製Web PWAです。データベースは持たず、リクエストごとに元サイトをスクレイピング（キャッシュあり）します。Cloudflare Workersへのデプロイを想定しています。

## 開発

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## デプロイ（Cloudflare Workers）

`main` ブランチへの push で GitHub Actions（`.github/workflows/deploy.yml`）が自動的に `wrangler deploy` を実行します。初回のみ、リポジトリに以下のシークレットを設定してください。

- `CLOUDFLARE_API_TOKEN`: Cloudflareダッシュボード（[dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)）で「Edit Cloudflare Workers」テンプレートのAPIトークンを発行し、`gh secret set CLOUDFLARE_API_TOKEN` またはGitHubのリポジトリ設定（Settings → Secrets and variables → Actions）から登録してください。

手動でデプロイする場合は `pnpm cf:deploy` を実行してください。

