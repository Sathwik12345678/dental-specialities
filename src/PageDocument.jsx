import React, { useEffect } from 'react';

function loadScripts(scripts) {
  return scripts.reduce((queue, item) => queue.then(() => new Promise((done) => {
    const script = document.createElement('script');
    if (item.type) script.type = item.type;
    if (item.src) {
      script.src = item.src;
      script.onload = script.onerror = done;
      document.body.appendChild(script);
    } else {
      script.text = item.text;
      document.body.appendChild(script);
      script.remove();
      done();
    }
  })), Promise.resolve());
}

export default function PageDocument({ page }) {
  useEffect(() => {
    window.LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/public/queries';
    document.title = page.title;
    document.body.className = page.bodyClass;
    const styles = page.styles.map((css) => {
      const style = document.createElement('style');
      style.dataset.pageStyle = 'true';
      style.textContent = css;
      document.head.appendChild(style);
      return style;
    });
    loadScripts(page.scripts);
    return () => {
      styles.forEach((style) => style.remove());
      document.body.className = '';
    };
  }, [page]);

  return <main dangerouslySetInnerHTML={{ __html: page.body }} />;
}
