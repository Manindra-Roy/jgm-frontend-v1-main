const SEO = ({ 
  title, 
  description, 
  keywords, 
  url, 
  image = "https://jgm-industries.com/brand-logo.png",
  type = "website",
  themeColor = "#0d5e45" // Default brand primary green
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="theme-color" content={themeColor} />
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {url && <meta property="twitter:url" content={url} />}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </>
  );
};

export default SEO;
