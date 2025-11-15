import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHtml(html) {
  // Allow Quill tags and common attributes. Tune config as needed.
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p','b','i','u','strong','em','a','ul','ol','li','br','h1','h2','h3','h4','h5','img','pre','code','table','thead','tbody','tr','th','td','iframe','blockquote'
    ],
    ALLOWED_ATTR: ['href','src','alt','title','class','style','width','height','frameborder','allow','allowfullscreen']
  });
}
