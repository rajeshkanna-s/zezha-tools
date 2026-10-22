<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap — Zezha Tools</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 24px;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
            border: 1px solid #e2e8f0;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 28px 32px;
            color: #ffffff;
          }
          .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .header h1 span.badge {
            background: #f59e0b;
            color: #0f172a;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            text-transform: uppercase;
          }
          .header p {
            margin: 0;
            font-size: 13px;
            color: #94a3b8;
            line-height: 1.5;
          }
          .stats-bar {
            background: #f1f5f9;
            padding: 12px 32px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }
          .stats-bar strong {
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
          }
          th {
            background: #f8fafc;
            color: #475569;
            text-align: left;
            padding: 12px 18px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 700;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 11px 18px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            vertical-align: middle;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
            color: #1d4ed8;
          }
          .priority-tag {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            background: #ecfdf5;
            color: #047857;
          }
          .priority-tag.high {
            background: #fef3c7;
            color: #b45309;
          }
          .footer {
            padding: 20px 32px;
            font-size: 11.5px;
            color: #64748b;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            background: #f8fafc;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>
              Zezha Tools XML Sitemap
              <span class="badge">Google Verified</span>
            </h1>
            <p>
              This XML sitemap is processed by Googlebot, Bingbot, and search engines for automated crawling and instant indexation of all web utilities and calculators.
            </p>
          </div>
          <div class="stats-bar">
            <div>
              Total URLs in Sitemap: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
            </div>
            <div>
              Primary Domain: <strong>https://zezhatools.com</strong>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">URL Location</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 20%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="priority-tag">
                      <xsl:if test="sitemap:priority &gt;= 0.9">
                        <xsl:attribute name="class">priority-tag high</xsl:attribute>
                      </xsl:if>
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            Generated automatically for Zezha Tools (https://zezhatools.com). Compliant with Sitemaps.org protocol 0.9.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
