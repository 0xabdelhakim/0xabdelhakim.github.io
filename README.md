# Research Portfolio for GitHub Pages

Minimal, static academic portfolio built with plain HTML, CSS, and JavaScript.

## Structure

- `index.html`: semantic page shell and SEO metadata
- `assets/css/styles.css`: full visual system, layout, and responsive behavior
- `assets/js/content.js`: all editable portfolio data in one place
- `assets/js/main.js`: rendering, navigation, reveal animations, and BibTeX copy
- `assets/images/profile-placeholder.svg`: placeholder portrait area
- `assets/images/favicon.svg`: favicon
- `assets/images/og-preview.svg`: Open Graph preview image
- `robots.txt`: crawl directive
- `sitemap.xml`: basic sitemap placeholder

## Edit First

Open `assets/js/content.js` and replace:

1. Name, title, intro, location, email, and social links
2. CV URL and profile image path
3. News items
4. Projects / publications
5. Site URL in `site.url`

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select the `main` branch and `/ (root)` folder.
5. Save and wait for GitHub Pages to publish the site.
6. If you use a custom domain, add a `CNAME` file and update `site.url` plus `sitemap.xml`.

## Local Preview

Any static file server works. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
