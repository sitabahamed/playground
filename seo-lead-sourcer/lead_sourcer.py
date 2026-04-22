#!/usr/bin/env python3
"""SEO Lead Sourcing Tool — finds contact emails on websites for backlink outreach."""

import argparse
import csv
import json
import re
import time
from datetime import datetime
from urllib.parse import urljoin, urlparse

import requests
import tldextract
from bs4 import BeautifulSoup
from colorama import Fore, Style, init

init(autoreset=True)

# Only match emails with a valid alphabetic-only TLD (avoids @2x.png etc.)
EMAIL_RE = re.compile(
    r"[a-zA-Z0-9._%+\-]{2,}@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}(?!\.\w)",
    re.IGNORECASE,
)

OBFUSCATION_RE = re.compile(
    r"[a-zA-Z0-9._%+\-]+\s*[\[\(]?at[\]\)]?\s*[a-zA-Z0-9.\-]+\s*[\[\(]?dot[\]\)]?\s*[a-zA-Z]{2,}",
    re.IGNORECASE,
)

CONTACT_PATH_HINTS = [
    "/contact", "/contact-us", "/about", "/about-us",
    "/get-in-touch", "/reach-us", "/write-for-us",
    "/contribute", "/advertise", "/partner",
]

IGNORED_EMAIL_DOMAINS = {
    "example.com", "test.com", "domain.com", "email.com",
    "yourdomain.com", "sampleemail.com", "wix.com",
    "squarespace.com", "wordpress.com", "shopify.com",
}

# Email addresses from these providers are kept (could be owner contact)
PERSONAL_PROVIDER_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com",
    "outlook.com", "icloud.com", "protonmail.com",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def log(msg, color=Fore.WHITE):
    print(color + msg + Style.RESET_ALL)


def normalize_obfuscated(text):
    def replace(m):
        raw = m.group(0)
        raw = re.sub(r"\s*[\[\(]?at[\]\)]?\s*", "@", raw, flags=re.IGNORECASE)
        raw = re.sub(r"\s*[\[\(]?dot[\]\)]?\s*", ".", raw, flags=re.IGNORECASE)
        return raw
    return OBFUSCATION_RE.sub(replace, text)


FAKE_EXTENSIONS = re.compile(
    r"\.(png|jpg|jpeg|gif|svg|webp|ico|bmp|pdf|zip|css|js|mp4|mp3|woff|ttf)$",
    re.IGNORECASE,
)

def extract_emails_from_text(text):
    text = normalize_obfuscated(text)
    found = set(EMAIL_RE.findall(text))
    cleaned = set()
    for e in found:
        e = e.lower().rstrip(".")
        # Skip if TLD looks like a file extension (image, font, etc.)
        if FAKE_EXTENSIONS.search(e):
            continue
        # Must have at least one dot in domain part
        local, _, domain_part = e.partition("@")
        if "." not in domain_part:
            continue
        # TLD must be letters only
        tld = domain_part.rsplit(".", 1)[-1]
        if not tld.isalpha():
            continue
        if domain_part not in IGNORED_EMAIL_DOMAINS:
            cleaned.add(e)
    return cleaned


def get_page(url, timeout=12, retries=2):
    for attempt in range(retries + 1):
        try:
            resp = requests.get(
                url, headers=HEADERS, timeout=timeout,
                allow_redirects=True, verify=False,
            )
            if resp.status_code == 200:
                return resp.text
            if resp.status_code in (403, 429) and attempt < retries:
                time.sleep(2 ** attempt)
        except Exception:
            if attempt < retries:
                time.sleep(1)
    return None


def find_contact_urls(base_url, html):
    soup = BeautifulSoup(html, "lxml")
    found = set()
    base_netloc = urlparse(base_url).netloc

    for a in soup.find_all("a", href=True):
        href = a["href"].lower()
        if any(hint in href for hint in CONTACT_PATH_HINTS):
            full = urljoin(base_url, a["href"])
            if urlparse(full).netloc == base_netloc:
                found.add(full)

    for hint in CONTACT_PATH_HINTS:
        found.add(urljoin(base_url, hint))

    return list(found)[:8]


def scrape_emails_from_site(base_url):
    emails = set()
    html = get_page(base_url)
    if not html:
        return emails

    emails |= extract_emails_from_text(html)
    contact_urls = find_contact_urls(base_url, html)

    for url in contact_urls:
        page_html = get_page(url)
        if page_html:
            emails |= extract_emails_from_text(page_html)
        time.sleep(0.4)

    return emails


# ── Search backends ───────────────────────────────────────────────────────────

def search_duckduckgo(keyword, num_results):
    """Search via DuckDuckGo with retry on rate-limit."""
    try:
        from duckduckgo_search import DDGS
    except ImportError:
        return []

    results = []
    seen_domains = set()

    for attempt in range(3):
        try:
            with DDGS() as ddgs:
                for r in ddgs.text(keyword, max_results=num_results * 3):
                    url = r.get("href", "")
                    if not url:
                        continue
                    ext = tldextract.extract(url)
                    domain = f"{ext.domain}.{ext.suffix}"
                    if not domain or domain in seen_domains:
                        continue
                    seen_domains.add(domain)
                    results.append({
                        "url": f"https://{domain}",
                        "domain": domain,
                        "title": r.get("title", ""),
                        "snippet": r.get("body", ""),
                    })
                    if len(results) >= num_results:
                        break
            if results:
                return results
        except Exception as e:
            if "Ratelimit" in str(e) and attempt < 2:
                wait = 10 * (attempt + 1)
                log(f"  [!] DuckDuckGo rate-limit, retrying in {wait}s...", Fore.YELLOW)
                time.sleep(wait)
            else:
                log(f"  [!] DuckDuckGo error: {e}", Fore.RED)
                break

    return results


def search_google_scrape(keyword, num_results):
    """Scrape Google search results (no API key required, best-effort)."""
    results = []
    seen_domains = set()
    start = 0

    while len(results) < num_results:
        url = (
            f"https://www.google.com/search"
            f"?q={requests.utils.quote(keyword)}&num=10&start={start}&hl=en"
        )
        html = get_page(url, timeout=15)
        if not html:
            break

        soup = BeautifulSoup(html, "lxml")
        links = soup.select("a[href]")
        found_this_page = 0

        for a in links:
            href = a.get("href", "")
            if not href.startswith("/url?q="):
                continue
            actual_url = href.split("/url?q=")[1].split("&")[0]
            if not actual_url.startswith("http"):
                continue
            ext = tldextract.extract(actual_url)
            domain = f"{ext.domain}.{ext.suffix}"
            if not domain or domain in seen_domains or "google" in domain:
                continue
            seen_domains.add(domain)
            results.append({
                "url": f"https://{domain}",
                "domain": domain,
                "title": a.get_text(strip=True)[:120],
                "snippet": "",
            })
            found_this_page += 1
            if len(results) >= num_results:
                break

        if found_this_page == 0:
            break
        start += 10
        time.sleep(2)

    return results


def search_websites(keyword, num_results=20, engine="auto"):
    log(f"\n[*] Searching ({engine}): '{keyword}'", Fore.CYAN)

    results = []

    if engine in ("auto", "ddg"):
        results = search_duckduckgo(keyword, num_results)

    if not results and engine in ("auto", "google"):
        log("  [~] Falling back to Google scrape...", Fore.YELLOW)
        results = search_google_scrape(keyword, num_results)

    log(f"[+] Found {len(results)} unique domains", Fore.GREEN)
    return results


# ── URL file mode ─────────────────────────────────────────────────────────────

def load_urls_from_file(path):
    """Load a list of URLs or domains from a plain text file (one per line)."""
    sites = []
    seen = set()
    with open(path, encoding="utf-8") as f:
        for line in f:
            url = line.strip()
            if not url or url.startswith("#"):
                continue
            if not url.startswith("http"):
                url = "https://" + url
            ext = tldextract.extract(url)
            domain = f"{ext.domain}.{ext.suffix}"
            if domain in seen:
                continue
            seen.add(domain)
            sites.append({
                "url": f"https://{domain}",
                "domain": domain,
                "title": "",
                "snippet": "",
            })
    return sites


# ── Core orchestration ────────────────────────────────────────────────────────

def process_sites(sites, keyword, delay):
    leads = []
    for i, site in enumerate(sites, 1):
        domain = site["domain"]
        base_url = f"https://{domain}"
        log(f"  [{i}/{len(sites)}] {base_url}", Fore.YELLOW)

        emails = scrape_emails_from_site(base_url)

        lead = {
            "keyword": keyword,
            "domain": domain,
            "website": base_url,
            "emails": ", ".join(sorted(emails)) if emails else "",
            "email_count": len(emails),
            "title": site.get("title", ""),
            "snippet": site.get("snippet", "")[:200],
            "found_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        }
        leads.append(lead)

        if emails:
            log(f"    → {len(emails)} email(s): {', '.join(sorted(emails))}", Fore.GREEN)
        else:
            log("    → no emails found", Fore.WHITE)

        time.sleep(delay)
    return leads


def source_leads(keywords, num_results, output_file, output_format, delay, engine, urls_file):
    all_leads = []
    seen_domains = set()

    if urls_file:
        sites = load_urls_from_file(urls_file)
        log(f"\n[+] Loaded {len(sites)} URLs from {urls_file}", Fore.CYAN)
        new_sites = [s for s in sites if s["domain"] not in seen_domains]
        seen_domains.update(s["domain"] for s in new_sites)
        all_leads.extend(process_sites(new_sites, "manual", delay))
    else:
        for keyword in keywords:
            sites = search_websites(keyword, num_results, engine)
            new_sites = [s for s in sites if s["domain"] not in seen_domains]
            seen_domains.update(s["domain"] for s in new_sites)
            all_leads.extend(process_sites(new_sites, keyword, delay))

    if not output_file:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"leads_{ts}.{output_format}"

    save_results(all_leads, output_file, output_format)
    print_summary(all_leads)
    return all_leads


def save_results(leads, output_file, fmt):
    if fmt == "json":
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(leads, f, indent=2, ensure_ascii=False)
    else:
        fields = ["keyword", "domain", "website", "emails", "email_count",
                  "title", "snippet", "found_at"]
        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(leads)

    log(f"\n[✓] Saved {len(leads)} leads → {output_file}", Fore.GREEN)


def print_summary(leads):
    total = len(leads)
    with_email = sum(1 for l in leads if l["emails"])
    log(f"\n{'='*48}", Fore.CYAN)
    log(f"  Total sites scraped : {total}", Fore.CYAN)
    log(f"  Sites with emails   : {with_email}", Fore.GREEN)
    log(f"  Sites without emails: {total - with_email}", Fore.YELLOW)
    log(f"  Success rate        : {with_email/total*100:.0f}%" if total else "  No results", Fore.CYAN)
    log(f"{'='*48}\n", Fore.CYAN)


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="SEO Lead Sourcing Tool — find contact emails for backlink outreach",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Search by keyword
  python lead_sourcer.py -k "travel blog" -n 15

  # Multiple keywords, JSON output
  python lead_sourcer.py -k "fitness tips" "nutrition blog" -n 20 -f json

  # Provide your own list of URLs (one per line)
  python lead_sourcer.py --urls-file my_sites.txt -o leads.csv

  # Use Google scraper instead of DuckDuckGo
  python lead_sourcer.py -k "tech blog" --engine google
        """,
    )
    parser.add_argument(
        "-k", "--keywords",
        nargs="+",
        default=[],
        help="Keywords/niches to search for",
    )
    parser.add_argument(
        "--urls-file",
        default=None,
        help="Path to a text file with one URL/domain per line (skips search)",
    )
    parser.add_argument(
        "-n", "--num-results",
        type=int,
        default=15,
        help="Sites to find per keyword (default: 15)",
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Output filename (auto-generated if not set)",
    )
    parser.add_argument(
        "-f", "--format",
        choices=["csv", "json"],
        default="csv",
        help="Output format (default: csv)",
    )
    parser.add_argument(
        "-d", "--delay",
        type=float,
        default=1.5,
        help="Delay in seconds between site requests (default: 1.5)",
    )
    parser.add_argument(
        "--engine",
        choices=["auto", "ddg", "google"],
        default="auto",
        help="Search engine to use (default: auto — tries DDG then Google)",
    )

    args = parser.parse_args()

    if not args.keywords and not args.urls_file:
        parser.error("Provide --keywords or --urls-file")

    log("\n╔══════════════════════════════════════╗", Fore.CYAN)
    log("║   SEO Lead Sourcing Tool              ║", Fore.CYAN)
    log("║   Backlink Outreach Email Finder      ║", Fore.CYAN)
    log("╚══════════════════════════════════════╝\n", Fore.CYAN)

    # suppress SSL warnings from unverified requests
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    source_leads(
        keywords=args.keywords,
        num_results=args.num_results,
        output_file=args.output,
        output_format=args.format,
        delay=args.delay,
        engine=args.engine,
        urls_file=args.urls_file,
    )


if __name__ == "__main__":
    main()
