# Recursion Prevention Plugin

This repo contains a simple plugin to detect recursion caused by Payload hooks. For example, if you have a hook that updates a document, which in turn, fires another hook which again updates that same document, you could cause an infinite recursion.

This plugin detects those infinite recursions and will throw an error to short-circuit any faulty logic before the server crashes.

### Running locally

To run this repository locally, perform the following steps.

1. Clone the repo
1. Run `cp .env.example .env` to create an environment variable file
1. Run `pnpm i` to install dependencies
1. Run `pnpm dev` and then create a post to watch the plugin detect and throw when the post is created
