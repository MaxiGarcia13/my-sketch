import { createRoot } from 'react-dom/client';
import { Sketch } from './sketch';

createRoot(document.getElementById('root')!).render(
  <>
    <Sketch />

    <footer className="footer">
      by Maximiliano Garcia Mortigliengo
      (
      <a href="https://github.com/MaxiGarcia13/my-sketch" target="_blank" role="noopener noreferrer">repo</a>
      )
    </footer>
  </>,
);
