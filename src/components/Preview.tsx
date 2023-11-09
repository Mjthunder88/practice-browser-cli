import './preview.css'
import { useEffect, useRef } from "react";
interface PreviewProps {
  code: string;
}

const html = `
<html>
  <head></head>
  <body>
  <div id="root"></div>  
    <script>
      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (err) {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtim Error</h4>' + err + '</div>'
          console.error(err);
        }
      }, false);
    </script>
  </body>
</html>
`;

// * the target till target what esbuild will try and transpile the users code too

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // * Resets the iframe before it transpiles and bundles the code the user put in.
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, "*");
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

export default Preview;
