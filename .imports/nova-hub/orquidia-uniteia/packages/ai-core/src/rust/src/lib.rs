// =============================================================================
// ORQUIDIA INFERENCE ENGINE - Rust WASM Core
// =============================================================================
// Purpose: High-performance, edge-native inference using WebAssembly
// Stack: Rust 2024 + wasm-bindgen
// =============================================================================

use wasm_bindgen::prelude::*;
use std::collections::HashMap;

// =============================================================================
// WASM ENTRY POINT & LOGGING
// =============================================================================

#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
    
    #[cfg(feature = "console_log")]
    console_log::init_with_level!(log::Level::Info).unwrap();
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

fn wasm_log(msg: &str) {
    log(msg);
}

// =============================================================================
// VERSION INFO (Exposed to TypeScript)
// =============================================================================

#[wasm_bindgen]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[wasm_bindgen]
pub fn get_rustc_version() -> String {
    // Read at runtime instead of compile time
    std::env::var("RUSTC_VERSION").unwrap_or_else(|_| "unknown".to_string())
}

// =============================================================================
// SIMPLE VECTOR OPERATIONS (Exposed to TypeScript)
// =============================================================================

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

    let denominator = (norm_a.sqrt()) * (norm_b.sqrt());
    if denominator == 0.0 {
        return 0.0;
    }

    dot_product / denominator
}

// Simple keyword extraction (no serde)
#[wasm_bindgen]
pub fn extract_keywords(text: &str, num_keywords: u32) -> String {
    let text_lower = text.to_lowercase();
    let words: Vec<&str> = text_lower
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| w.len() > 2)
        .collect();

    // Simple word frequency
    let mut freq: HashMap<&str, u32> = HashMap::new();
    for word in &words {
        *freq.entry(word).or_insert(0) += 1;
    }

    // Sort by frequency
    let mut word_freq: Vec<(&str, u32)> = freq.into_iter().collect();
    word_freq.sort_by(|a, b| b.1.cmp(&a.1));

    // Return top N keywords as JSON array
    let keywords: Vec<String> = word_freq
        .into_iter()
        .take(num_keywords as usize)
        .map(|(w, _)| format!(r#""{}""#, w))
        .collect();

    format!("[{}]", keywords.join(", "))
}

// Simple sentiment analysis (returns JSON object)
#[wasm_bindgen]
pub fn analyze_sentiment(text: &str) -> String {
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

    let normalized = if words.is_empty() { 0.0 } else { (score / words.len() as f32 * 10.0).clamp(-1.0, 1.0) };

    format!(r#"{{"sentiment": {:.4}}}"#, normalized)
}

// Simple email extraction (returns JSON array)
#[wasm_bindgen]
pub fn extract_emails(text: &str) -> String {
    // Simple pattern matching for emails without regex crate
    let mut emails: Vec<String> = Vec::new();
    let chars: Vec<char> = text.chars().collect();
    let mut i = 0;
    
    while i < chars.len() {
        // Look for @ symbol
        if chars[i] == '@' {
            // Find start of email (go backwards)
            let mut start = i;
            while start > 0 && (chars[start - 1].is_alphanumeric() || chars[start - 1] == '.' || chars[start - 1] == '_' || chars[start - 1] == '%' || chars[start - 1] == '-') {
                start -= 1;
            }
            
            // Find end of email (go forwards)
            let mut end = i;
            while end < chars.len() && (chars[end].is_alphanumeric() || chars[end] == '.' || chars[end] == '-') {
                end += 1;
            }
            
            if end > start + 1 {
                let email: String = chars[start..end].iter().collect();
                emails.push(format!(r#""{}""#, email));
            }
            i = end;
        } else {
            i += 1;
        }
    }

    format!("[{}]", emails.join(", "))
}

// Simple URL extraction (returns JSON array)
#[wasm_bindgen]
pub fn extract_urls(text: &str) -> String {
    // Simple pattern matching for URLs without regex crate
    let mut urls: Vec<String> = Vec::new();
    let chars: Vec<char> = text.chars().collect();
    let mut i = 0;
    
    while i < chars.len() {
        // Look for http:// or https://
        if chars[i] == 'h' && i + 7 <= chars.len() && &text[i..i+7] == "http://" {
            let mut end = i + 7;
            while end < chars.len() && !chars[end].is_whitespace() && chars[end] != '"' && chars[end] != '\'' && chars[end] != '<' {
                end += 1;
            }
            let url: String = chars[i..end].iter().collect();
            urls.push(format!(r#""{}""#, url));
            i = end;
        } else if chars[i] == 'h' && i + 8 <= chars.len() && &text[i..i+8] == "https://" {
            let mut end = i + 8;
            while end < chars.len() && !chars[end].is_whitespace() && chars[end] != '"' && chars[end] != '\'' && chars[end] != '<' {
                end += 1;
            }
            let url: String = chars[i..end].iter().collect();
            urls.push(format!(r#""{}""#, url));
            i = end;
        } else {
            i += 1;
        }
    }

    format!("[{}]", urls.join(", "))
}

// Simple number extraction (returns JSON array)
#[wasm_bindgen]
pub fn extract_numbers(text: &str) -> String {
    let mut numbers: Vec<String> = Vec::new();
    let chars: Vec<char> = text.chars().collect();
    let mut i = 0;
    
    while i < chars.len() {
        if chars[i].is_ascii_digit() {
            let mut end = i;
            while end < chars.len() && chars[end].is_ascii_digit() {
                end += 1;
            }
            // Check for decimal
            if end < chars.len() && chars[end] == '.' {
                let mut decimal_end = end + 1;
                while decimal_end < chars.len() && chars[decimal_end].is_ascii_digit() {
                    decimal_end += 1;
                }
                if decimal_end > end + 1 {
                    end = decimal_end;
                }
            }
            let num: String = chars[i..end].iter().collect();
            numbers.push(format!(r#""{}""#, num));
            i = end;
        } else {
            i += 1;
        }
    }

    format!("[{}]", numbers.join(", "))
}
