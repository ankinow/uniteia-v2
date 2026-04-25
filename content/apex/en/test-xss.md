---
title: Malicious Article
slug: test-xss
lang: en
subjects: [security]
referral_links: []
---

# Malicious Content

<script>alert('xss')</script>

This is a test article designed to verify that the markdown renderer correctly sanitizes
malicious HTML tags and other potentially dangerous content. We need to ensure that the
rendered output does not execute any scripts and instead encodes the tags safely.
This paragraph exists to satisfy the minimum character count requirement of 100 characters
for the content field in our strict schema validation.

