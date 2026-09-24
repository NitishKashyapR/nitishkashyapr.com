#!/usr/bin/env python3
"""
Automated Cache-Busting Script for GitHub Pages
Generates and injects unique version hashes/timestamps into all linked assets
across HTML files to ensure browsers always fetch the freshest code.
"""

import os
import re
import sys
import time

def run_cache_bust(version_tag=None):
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    if not version_tag:
        # Generate timestamp and git hash if available
        timestamp = int(time.time())
        try:
            import subprocess
            sha = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=root_dir).decode().strip()
            version_tag = f"{sha}_{timestamp}"
        except Exception:
            version_tag = f"build_{timestamp}"
            
    print(f"Applying automated cache-busting version: v={version_tag}")
    
    html_files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    # Target assets to version
    asset_patterns = [
        (r'(index\.css)(\?v=[^"\'\s>]+)?', r'\1?v=' + version_tag),
        (r'(script\.js)(\?v=[^"\'\s>]+)?', r'\1?v=' + version_tag),
        (r'(favicon\.png)(\?v=[^"\'\s>]+)?', r'\1?v=' + version_tag),
        (r'(assets/hero-photo\.webp)(\?v=[^"\'\s>]+)?', r'\1?v=' + version_tag),
        (r'(assets/hero-photo\.png)(\?v=[^"\'\s>]+)?', r'\1?v=' + version_tag),
    ]
    
    modified_count = 0
    for filename in html_files:
        filepath = os.path.join(root_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for pattern, replacement in asset_patterns:
            new_content = re.sub(pattern, replacement, new_content)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  [OK] Updated cache-busting tags in {filename}")
            modified_count += 1
        else:
            print(f"  [-] No changes needed in {filename}")
            
    print(f"Cache-busting successfully applied across {modified_count} HTML files.")
    return version_tag

if __name__ == '__main__':
    tag = sys.argv[1] if len(sys.argv) > 1 else None
    run_cache_bust(tag)
