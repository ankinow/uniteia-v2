---
slug: test-invalid-schema
lang: en
title: Missing Schema Fields Fixture
---
This article intentionally omits required frontmatter fields such as subjects and referral_links.
The body is still long enough to exercise the content loading path and prove that runtime schema
validation is not enforced in the worker bundle. It should load without throwing and leave the
missing fields undefined.
