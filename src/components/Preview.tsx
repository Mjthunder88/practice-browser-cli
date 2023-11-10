import "./preview.css";
import { useEffect, useRef } from "react";
interface PreviewProps {
  code: string;
  err: string;
}

const html = `
<html>
  <head>
    <style>html {background-color: white;}</style>
  </head>
  <body>
  <div id="root"></div>  
    <script>
      const handleError = (err) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtim Error</h4>' + err + '</div>'
        console.error(err)
      };

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error)
      });

      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (err) {
          handleError(err)
        }
      }, false);
    </script>
  </body>
</html>
`;

// * the target till target what esbuild will try and transpile the users code too

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // * Resets the iframe before it transpiles and bundles the code the user put in.
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">Reference Error: {err}</div>}
    </div>
  );
};

export default Preview;
