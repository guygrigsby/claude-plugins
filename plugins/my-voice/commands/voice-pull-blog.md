---
name: voice:pull-blog
description: "Fetch a blog index URL, walk to each post, and save the prose into the corpus."
arguments:
  - name: url
    description: "The blog's index URL or a single post URL. If an index, follow the post links."
    required: true
---

You are pulling blog posts into the voice corpus.

## Step 1: Resolve config

- `$VOICE_HOME`: default `~/.claude/voice/`. Output goes to `$VOICE_HOME/corpus/blog/`.

## Step 2: Fetch the URL

Use WebFetch on the provided URL. If it redirects (especially repeatedly), follow the redirect chain. Some sites (Medium with custom domains) bounce through identity gateways before landing on the real content; keep following.

## Step 3: Identify posts

If the URL is a profile or index, extract every post link from the rendered page. If it's a single post, treat it as the only target.

For each unique post URL, fetch the page and ask the WebFetch model: "Return only the prose paragraphs written by the author. Skip code blocks, image captions, headings, comments, and platform boilerplate. Keep the prose verbatim, in order. I'm sampling writing voice; do not paraphrase."

## Step 4: Write to disk

Append all extracted prose to `$VOICE_HOME/corpus/blog/all_posts.md`. Format:

```markdown
---

## <post title>

Source: <post url>
Pulled: <today's date>

> <prose paragraph 1>
>
> <prose paragraph 2>
> ...
```

Dedupe by post URL: if a post is already present in the file (search for the source URL line), skip it.

## Step 5: Flag fetch quality

Some WebFetch responses come back as summaries instead of verbatim prose. If a post's extracted body looks like a third-person summary ("The author explains that...") rather than first-person prose, mark it in the file with:

```
> (NOTE: WebFetch returned a summary instead of verbatim text. Re-fetch on next pass.)
```

## Step 6: Update the manifest

Append to `$VOICE_HOME/manifest.md` under the blog section: date, posts added, posts skipped (already present), posts flagged for re-fetch.

## Step 7: Report

Print: posts found, posts saved, posts skipped, posts flagged. Stop.
