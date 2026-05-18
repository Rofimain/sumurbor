-- Jalankan di Supabase SQL Editor jika project sudah ada sebelum patch SEO.
-- Menambah pengaturan SEO ke tabel settings (aman di-run berulang).

insert into settings (key, value) values
  ('canonical_url', ''),
  ('sitemap_enabled', 'true'),
  ('sitemap_include_services', 'true'),
  ('sitemap_include_projects', 'true'),
  ('sitemap_include_articles', 'true'),
  ('sitemap_extra_urls', ''),
  ('sitemap_priority_home', '1'),
  ('sitemap_changefreq_home', 'weekly'),
  ('sitemap_priority_static', '0.7'),
  ('sitemap_changefreq_static', 'monthly'),
  ('robots_disallow_extra', ''),
  ('seo_global_noindex', 'false'),
  ('google_site_verification', ''),
  ('bing_site_verification', ''),
  ('analytics_enabled', 'true'),
  ('google_analytics_id', ''),
  ('google_tag_manager_id', '')
on conflict (key) do nothing;
