// =============================================================================
// INFERENCE ENGINE - Rust WASM Implementation
// =============================================================================
// Purpose: High-performance edge inference using pure Rust
// Features: Similarity search, classification, keyword extraction
// =============================================================================

use crate::models::*;
use wasm_bindgen::prelude::*;
use std::time::Instant;

// =============================================================================
// COSINE SIMILARITY (Core Algorithm)
// =============================================================================

/// Calculate cosine similarity between two vectors
#[wasm_bindgen]
pub fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    if a.len() != b.len() || a.is_empty() {
        return 0.0;
    }

    let mut dot_product = 0.0;
    let mut norm_a = 0.0;
    let mut norm_b = 0.0;

    for i in 0..a.len() {
        dot_product += a[i] * b[i];
        norm_a += a[i] * a[i];
        norm_b += b[i] * b[i];
    }

    let denominator = norm_a.sqrt() * norm_b.sqrt();
    if denominator == 0.0 {
        return 0.0;
    }

    dot_product / denominator
}

/// Batch cosine similarity for search
#[wasm_bindgen]
pub fn batch_cosine_similarity(query: &[f32], corpus: &[f32], embedding_dim: u32) -> Vec<f32> {
    let num_embeddings = corpus.len() / embedding_dim as usize;
    let mut results = Vec::with_capacity(num_embeddings);

    for i in 0..num_embeddings {
        let start = i * embedding_dim as usize;
        let end = start + embedding_dim as usize;
        let embedding = &corpus[start..end];
        let similarity = cosine_similarity(query, embedding);
        results.push(similarity);
    }

    results
}

// =============================================================================
// SIMILARITY SEARCH
// =============================================================================

#[wasm_bindgen]
pub fn similarity_search(request: &JsValue) -> Result<JsValue, JsValue> {
    let start = Instant::now();

    // Deserialize request from TS
    let search_req: SimilaritySearchRequest = serde_wasm_bindgen::from_value(request.clone())
        .map_err(|e| JsValue::from_str(&format!("Deserialization error: {:?}", e)))?;

    let mut results: Vec<SimilaritySearchResult> = Vec::new();

    // Calculate similarities
    for embedding in &search_req.corpus {
        let score = cosine_similarity(&search_req.query_vector, &embedding.values);

        if score >= search_req.min_score {
            results.push(SimilaritySearchResult {
                id: embedding.id.clone(),
                score,
                metadata: embedding.metadata.clone(),
            });
        }
    }

    // Sort by score descending
    results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());

    // Limit to top_k
    results.truncate(search_req.top_k as usize);

    // Serialize back to TS
    serde_wasm_bindgen::to_value(&results)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {:?}", e)))
        .map(|v| {
            log(&format!("[Rust WASM] Similarity search completed in {}ms", start.elapsed().as_millis()));
            v
        })
}

// =============================================================================
// KEYWORD EXTRACTION (TF-IDF Light)
// =============================================================================

#[wasm_bindgen]
pub fn extract_keywords(text: &str, num_keywords: u32) -> Vec<String> {
    let text_lower = text.to_lowercase();
    let words: Vec<&str> = text_lower
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| w.len() > 2)
        .collect();

    // Simple word frequency
    let mut freq: std::collections::HashMap<&str, u32> = std::collections::HashMap::new();
    for word in &words {
        *freq.entry(word).or_insert(0) += 1;
    }

    // Sort by frequency
    let mut word_freq: Vec<(&str, u32)> = freq.into_iter().collect();
    word_freq.sort_by(|a, b| b.1.cmp(&a.1));

    // Return top N keywords
    word_freq
        .into_iter()
        .take(num_keywords as usize)
        .map(|(w, _)| w.to_string())
        .collect()
}

// =============================================================================
// SENTIMENT ANALYSIS (Rule-based Light)
// =============================================================================

#[wasm_bindgen]
pub fn analyze_sentiment(text: &str) -> f32 {
    let positive_words = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "best", "awesome", "happy"];
    let negative_words = ["bad", "terrible", "awful", "horrible", "worst", "hate", "sad", "angry", "disappointed", "poor"];

    let text_lower = text.to_lowercase();
    let words: Vec<&str> = text_lower.split(|c: char| !c.is_alphanumeric()).collect();

    let mut score = 0.0;
    for word in &words {
        if positive_words.contains(&word) {
            score += 1.0;
        } else if negative_words.contains(&word) {
            score -= 1.0;
        }
    }

    // Normalize to -1.0 to 1.0
    if words.is_empty() {
        0.0
    } else {
        (score / words.len() as f32 * 10.0).clamp(-1.0, 1.0)
    }
}

// =============================================================================
// CLASSIFICATION (Zero-shot Light)
// =============================================================================

#[wasm_bindgen]
pub fn classify_text(request: &JsValue) -> Result<JsValue, JsValue> {
    let start = Instant::now();

    let class_req: ClassificationRequest = serde_wasm_bindgen::from_value(request.clone())
        .map_err(|e| JsValue::from_str(&format!("Deserialization error: {:?}", e)))?;

    let input_lower = class_req.input.to_lowercase();
    let mut scores: Vec<(String, f32)> = Vec::new();

    for category in &class_req.categories {
        let cat_lower = category.to_lowercase();
        let mut matches = 0;

        // Simple keyword matching
        for word in input_lower.split_whitespace() {
            if cat_lower.contains(word) || word.len() > 3 && cat_lower.contains(word) {
                matches += 1;
            }
        }

        let normalized_score = (matches as f32 / class_req.input.len() as f32 * 10.0).clamp(0.0, 1.0);
        scores.push((category.clone(), normalized_score));
    }

    // Sort by score
    scores.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    // Create result
    let result = ClassificationResult {
        category: scores.first().map(|s| s.0.clone()).unwrap_or_default(),
        confidence: scores.first().map(|s| s.1).unwrap_or(0.0),
        all_scores: scores,
    };

    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {:?}", e)))
        .map(|v| {
            log(&format!("[Rust WASM] Classification completed in {}ms", start.elapsed().as_millis()));
            v
        })
}

// =============================================================================
// STRUCTURED EXTRACTION (Regex-based)
// =============================================================================

#[wasm_bindgen]
pub fn extract_emails(text: &str) -> Vec<String> {
    let email_regex = regex::Regex::new(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}").unwrap();
    email_regex.find_iter(text)
        .map(|m| m.as_str().to_string())
        .collect()
}

#[wasm_bindgen]
pub fn extract_urls(text: &str) -> Vec<String> {
    let url_regex = regex::Regex::new(r"https?://[^\s<>\"]+").unwrap();
    url_regex.find_iter(text)
        .map(|m| m.as_str().to_string())
        .collect()
}

#[wasm_bindgen]
pub fn extract_numbers(text: &str) -> Vec<String> {
    let num_regex = regex::Regex::new(r"\d+(\.\d+)?").unwrap();
    num_regex.find_iter(text)
        .map(|m| m.as_str().to_string())
        .collect()
}
