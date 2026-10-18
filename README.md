# Campus Evidence Finder

A small, browser-only evidence retrieval app for public BITS Pilani Hyderabad
academic information. It ranks four curated institutional pages with BM25 and
shows a short evidence excerpt, the page URL, and the date it was checked. It
does not call an LLM, answer personal eligibility questions, or send searches
to a server.

## Run locally

Requires Node.js 20+ for evaluation and Python 3 for a local static server.

```sh
python -m http.server 8000
```

Open `http://localhost:8000`. No package installation or API key is required.

## Evaluate retrieval

```sh
node src/evaluate.js
node --test
```

The nine hand-labeled queries measure whether a relevant source is in the top
three (Hit@3) and its reciprocal rank (MRR@3). They do not measure answer
accuracy, completeness, citation faithfulness, or broad-corpus performance.
Keep this distinction when reporting results.

## Sources and limits

The source snippets were written from these public institutional pages, last
checked on 2026-10-18:

- [Academic Undergraduate Studies Division — Hyderabad](https://www.bits-pilani.ac.in/hyderabad/academic-undergraduate-studies-division/)
- [Institute Important Academic Documents](https://academic.bits-pilani.ac.in/Institute_Important_Documents.aspx)
- [Academic Regulations 2023](https://academic.bits-pilani.ac.in/Downloads/Academic-Regulations-2023.pdf)
- [BITSAT 2026 Scholarships](https://admissions.bits-pilani.ac.in/FD/scholarship.html)

Regulations may be superseded. Scholarship terms apply to the admission cohort
described on the official page; they are not individual eligibility decisions.
Use the linked pages and official contacts for decisions.

## Deploy

This static site can be served from any static host. For GitHub Pages, enable
Pages for the default branch and publish from the repository root. The same
files run without environment secrets or an external inference service.

## License

The implementation is MIT licensed. Institutional names and linked source
content remain the property of their respective owners.
