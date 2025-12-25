use serde::{Deserialize, Serialize};
use font_kit::source::SystemSource;
use std::collections::HashSet;
use std::path::PathBuf;
use std::process::Command;

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
async fn show_font_in_finder(font_name: String) -> Result<String, String> {
    // Common font paths to search
    let font_paths = vec![
        // macOS system fonts - try different extensions
        format!("/System/Library/Fonts/{}.ttf", font_name),
        format!("/System/Library/Fonts/{}.otf", font_name),
        format!("/System/Library/Fonts/{}.ttc", font_name),
        format!("/System/Library/Fonts/Supplemental/{}.ttf", font_name),
        format!("/System/Library/Fonts/Supplemental/{}.otf", font_name),
        format!("/System/Library/Fonts/Supplemental/{}.ttc", font_name),
        format!("/Library/Fonts/{}.ttf", font_name),
        format!("/Library/Fonts/{}.otf", font_name),
        format!("/Library/Fonts/{}.ttc", font_name),
        format!("/Users/{}/Library/Fonts/{}.ttf", std::env::var("USER").unwrap_or_default(), font_name),
        format!("/Users/{}/Library/Fonts/{}.otf", std::env::var("USER").unwrap_or_default(), font_name),
        format!("/Users/{}/Library/Fonts/{}.ttc", std::env::var("USER").unwrap_or_default(), font_name),
        
        // Windows fonts
        format!("C:\\Windows\\Fonts\\{}.ttf", font_name),
        format!("C:\\Windows\\Fonts\\{}.otf", font_name),
        format!("C:\\Windows\\Fonts\\{}.ttc", font_name),
        
        // Linux fonts
        format!("/usr/share/fonts/truetype/{}/{}.ttf", font_name.to_lowercase(), font_name),
        format!("/usr/share/fonts/opentype/{}/{}.otf", font_name.to_lowercase(), font_name),
        format!("/usr/share/fonts/{}.ttf", font_name),
        format!("/usr/share/fonts/{}.otf", font_name),
        format!("/usr/share/fonts/{}.ttc", font_name),
    ];
    
    // Find the first existing font file
    let mut found_path: Option<PathBuf> = None;
    for path_str in &font_paths {
        let path = PathBuf::from(path_str);
        if path.exists() {
            found_path = Some(path);
            break;
        }
    }
    
    // Platform-specific implementation to show in file manager
    #[cfg(target_os = "macos")]
    {
        if let Some(path) = found_path {
            let output = Command::new("open")
                .args(&["-R", path.to_str().unwrap()])
                .output()
                .map_err(|e| format!("Failed to open Finder: {}", e))?;
                
            if output.status.success() {
                Ok(format!("Opened {} in Finder", path.display()))
            } else {
                // Fallback: open fonts folder
                let _ = Command::new("open").args(&["/System/Library/Fonts/"]).output();
                Ok("Opened Fonts folder in Finder".to_string())
            }
        } else {
            // Fallback: open fonts folder
            let output = Command::new("open")
                .args(&["/System/Library/Fonts/"])
                .output()
                .map_err(|e| format!("Failed to open Finder: {}", e))?;
                
            if output.status.success() {
                Ok("Opened Fonts folder in Finder".to_string())
            } else {
                Err("Failed to open Finder".to_string())
            }
        }
    }
    
    #[cfg(target_os = "windows")]
    {
        if let Some(path) = found_path {
            let output = Command::new("explorer")
                .args(&["/select,", path.to_str().unwrap()])
                .output()
                .map_err(|e| format!("Failed to open Explorer: {}", e))?;
                
            if output.status.success() {
                Ok(format!("Opened {} in Explorer", path.display()))
            } else {
                // Fallback: open fonts folder
                let _ = Command::new("explorer").args(&["C:\\Windows\\Fonts\\"]).output();
                Ok("Opened Fonts folder in Explorer".to_string())
            }
        } else {
            // Fallback: open fonts folder
            let output = Command::new("explorer")
                .args(&["C:\\Windows\\Fonts\\"])
                .output()
                .map_err(|e| format!("Failed to open Explorer: {}", e))?;
                
            if output.status.success() {
                Ok("Opened Fonts folder in Explorer".to_string())
            } else {
                Err("Failed to open Explorer".to_string())
            }
        }
    }
    
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        // Linux and other Unix-like systems
        if let Some(path) = found_path {
            // Try to open file manager with the specific file
            let parent = path.parent().unwrap_or(&path);
            let output = Command::new("xdg-open")
                .args(&[parent.to_str().unwrap()])
                .output()
                .map_err(|e| format!("Failed to open file manager: {}", e))?;
                
            if output.status.success() {
                Ok(format!("Opened {} in file manager", parent.display()))
            } else {
                // Fallback: open fonts folder
                let _ = Command::new("xdg-open").args(&["/usr/share/fonts/"]).output();
                Ok("Opened fonts folder in file manager".to_string())
            }
        } else {
            // Fallback: open fonts folder
            let output = Command::new("xdg-open")
                .args(&["/usr/share/fonts/"])
                .output()
                .map_err(|e| format!("Failed to open file manager: {}", e))?;
                
            if output.status.success() {
                Ok("Opened fonts folder in file manager".to_string())
            } else {
                Err("Failed to open file manager".to_string())
            }
        }
    }
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
        .invoke_handler(tauri::generate_handler![get_system_fonts, show_font_in_finder, health_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
