---
slug: test-invalid-schema
lang: en
title: Missing Schema Fields Fixture
---
This article intentionally omits required frontmatter fields such as subjects and referral_links.
Runtime schema validation IS enforced — validateContent() and validateMarkdownFrontmatter() will
reject this fixture. It exists solely to verify that the build-time content:check gate and unit
tests correctly detect invalid frontmatter schemas. The content:check script intentionally skips
this file (and other test fixtures) so the production gate passes while still allowing the fixture
to exist for testing purposes.
