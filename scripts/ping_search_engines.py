#!/usr/bin/env python3
"""
Search Engine Indexing & Ping Script for nitishkashyapr.github.io/nitishkashyapr.com

Pings:
1. IndexNow API (Bing, Yandex, Seznam, Naver) for instant indexation of updated URLs
2. Sitemap endpoints
"""

import json
import sys
import urllib.request
import urllib.error

INDEXNOW_KEY = "b2f4c9a87d1e0f3b5a8c2d1e4f9b7a6c"
HOST = "nitishkashyapr.github.io"
KEY_LOCATION = f"https://{HOST}/nitishkashyapr.com/{INDEXNOW_KEY}.txt"

URL_LIST = [
    f"https://{HOST}/nitishkashyapr.com/",
    f"https://{HOST}/nitishkashyapr.com/resume.html",
    f"https://{HOST}/nitishkashyapr.com/cv.html",
    f"https://{HOST}/nitishkashyapr.com/llms.txt",
    f"https://{HOST}/nitishkashyapr.com/llms-full.txt",
]

def ping_indexnow():
    payload = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": URL_LIST
    }
    data = json.dumps(payload).encode("utf-8")
    
    endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow"
    ]
    
    for endpoint in endpoints:
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "NitishKashyapR-SEOBot/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                print(f"[IndexNow] {endpoint} -> HTTP {response.status} (URLs submitted successfully)")
        except urllib.error.HTTPError as e:
            # 200, 202 are success; 422 may indicate key not yet live on server if tested before push
            print(f"[IndexNow] {endpoint} -> HTTP {e.code}: {e.reason}")
        except Exception as e:
            print(f"[IndexNow] {endpoint} error: {e}")

def ping_sitemaps():
    sitemap_url = f"https://{HOST}/nitishkashyapr.com/sitemap.xml"
    sitemap_pings = [
        f"https://www.bing.com/ping?sitemap={sitemap_url}",
    ]
    for url in sitemap_pings:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                print(f"[Sitemap Ping] {url} -> HTTP {response.status}")
        except urllib.error.HTTPError as e:
            print(f"[Sitemap Ping] {url} -> HTTP {e.code}")
        except Exception as e:
            print(f"[Sitemap Ping] {url} error: {e}")

if __name__ == "__main__":
    print(f"=== Pinging Search Engines for {HOST}/nitishkashyapr.com ===")
    ping_indexnow()
    ping_sitemaps()
    print("=== Search Engine Ping Complete ===")
