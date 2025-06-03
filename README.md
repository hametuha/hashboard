# Hashboard

Contributors: Takahashi_Fumiki, hametuha  
Tags: sns, login
Tested up to: 6.8
Stable tag: 0.8.7  
License: GPL 3.0 or later  
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Hashboard gives you a user-oriented and extensible dashboard.

![Hashboard Test](https://github.com/hametuha/hashboard/workflows/Hashboard%20Test/badge.svg?branch=master)

## Description

Dashboard library for WordPress.

## Installation

```
composer require hametuha/hashboard
```

## Development

#### Using mailhog

For debugging the mail sending feature, we use a local SMTP server called mailhog. Since an additional Docker container is added to the standard @wordpress/env, please follow these steps:

1. Run `npm start` to launch the WordPress Docker image.
2. Get the location where the Docker image is stored. Run `npm run cli install-path` and copy the last directory (hash value) of the displayed path. Example: `c5a62e6d70a5442fdf3872b2db2b666b`
2. Paste the hash value into a file named `.wp_install_path` and save it. This file is ignored by Git.
3. Run `npm run update`. This will execute `bin/after-start-script.sh` and add the mailhog container to wp-env.
4. Access http://localhost:8025 to connect to mailhog.
5. The [WP Mail SMTP](https://ja.wordpress.org/plugins/wp-mail-smtp/) plugin for local development is installed, and with this plugin, all emails sent by WordPress are forwarded to mailhog.
5. From the next time, you can start and stop with `npm start` and `npm stop`.

## Frequently Asked Questions 

W.I.P

## Changelog

See [releases](https://github.com/hametuha/hashboard/releases).

---

<p style="text-align: center;">
<img alt="hametuha.com" src="https://hametuha.co.jp/identities/hametuha-logo.svg" width="300" height="auto" /><br />
<strong>Go Forward While Looking Backward!</strong><br />
https://hametuha.com
<p>
