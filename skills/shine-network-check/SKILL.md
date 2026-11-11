---
name: shine-network-check
description: "Network diagnostics using Globalping MCP — ping, traceroute, DNS lookup from global probes. Also checks SSL certs via sslmon MCP."
argument-hint: "<domain, IP, or URL>"
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Run network diagnostics on the given target:

1. **Ping:** latency from 5+ geographic locations via `globalping` MCP.
   - Fallback: local `ping -c 5` via Bash.
2. **DNS resolution:** verify A, AAAA, CNAME, MX records from multiple probes.
   - Fallback: `dig` / `nslookup` via Bash.
3. **Traceroute:** network path analysis.
   - Fallback: `traceroute` / `mtr` via Bash.
4. **SSL check (if HTTPS URL):** `sslmon` MCP → cert expiry, chain validity, protocol versions.
   - Fallback: `openssl s_client -connect <host>:443` via Bash.
5. **Security headers (if URL):** check HSTS, CSP, X-Frame-Options, X-Content-Type-Options.
   - Via `curl -I <url>` via Bash.

Output: latency table (by region), DNS records, SSL status, header audit, recommendations.
</objective>

<guardrails>
- Never run intrusive scans (port scans, vulnerability probing) without explicit approval.
- Use read-only diagnostic tools only.
- If `globalping` MCP unavailable → fall back to local tools, note the reduced coverage.
- For SSL issues: recommend fix, never auto-modify server config.
</guardrails>
