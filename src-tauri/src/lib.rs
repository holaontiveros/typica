use serde::{Deserialize, Serialize};
use font_kit::source::SystemSource;
use std::collections::HashSet;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FontInfo {
    name: String,
    family: String,
    style: String,
    weight: String,
    #[serde(rename = "type")]
    font_type: String,
}

// Font classification helper
fn classify_font(family_name: &str) -> String {
    let lower_name = family_name.to_lowercase();
    
    if lower_name.contains("mono") || lower_name.contains("courier") || 
       lower_name.contains("console") || lower_name.contains("code") {
        "monospace".to_string()
    } else if lower_name.contains("script") || lower_name.contains("brush") || 
              lower_name.contains("handwriting") || lower_name.contains("cursive") {
        "cursive".to_string()
    } else if lower_name.contains("times") || lower_name.contains("georgia") || 
              lower_name.contains("garamond") || lower_name.contains("serif") {
        "serif".to_string()
    } else if lower_name.contains("fantasy") || lower_name.contains("impact") || 
              lower_name.contains("papyrus") || lower_name.contains("decorative") {
        "fantasy".to_string()
    } else {
        "sans-serif".to_string()
    }
}

// Font weight detection helper
fn detect_font_weight(family_name: &str) -> String {
    let lower_name = family_name.to_lowercase();
    
    if lower_name.contains("thin") || lower_name.contains("hairline") || 
       lower_name.contains("ultralight") || lower_name.contains("extra light") {
        "thin".to_string()
    } else if lower_name.contains("light") && !lower_name.contains("ultralight") && 
              !lower_name.contains("extra light") {
        "light".to_string()
    } else if lower_name.contains("medium") {
        "medium".to_string()
    } else if lower_name.contains("semibold") || lower_name.contains("semi bold") || 
              lower_name.contains("demi") {
        "semibold".to_string()
    } else if lower_name.contains("extrabold") || lower_name.contains("extra bold") || 
              lower_name.contains("ultra bold") {
        "extrabold".to_string()
    } else if lower_name.contains("black") || lower_name.contains("heavy") {
        "black".to_string()
    } else if lower_name.contains("bold") {
        "bold".to_string()
    } else {
        "regular".to_string()
    }
}

#[tauri::command]
async fn get_system_fonts() -> Result<Vec<FontInfo>, String> {
    let source = SystemSource::new();
    let mut fonts = Vec::new();
    let mut seen_families = HashSet::new();
    
    // Get all font families
    let families = source.all_families()
        .map_err(|e| format!("Failed to get font families: {}", e))?;
    
    for family_name in families {
        if seen_families.contains(&family_name) {
            continue;
        }
        seen_families.insert(family_name.clone());
        
        // Try to get font handles for this family
        match source.select_family_by_name(&family_name) {
            Ok(_family_handle) => {
                let font_type = classify_font(&family_name);
                let weight = detect_font_weight(&family_name);
                
                fonts.push(FontInfo {
                    name: family_name.clone(),
                    family: family_name.clone(),
                    style: "normal".to_string(),
                    weight,
                    font_type,
                });
            },
            Err(_) => {
                // Skip fonts that can't be loaded
                continue;
            }
        }
    }
    
    // Sort fonts alphabetically
    fonts.sort_by(|a, b| a.name.cmp(&b.name));
    
    Ok(fonts)
}

#[tauri::command]
async fn health_check() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_system_fonts, health_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
