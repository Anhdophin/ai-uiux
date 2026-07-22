export function renderRichBlocks(blocks = []) {
  const wrapper = document.createElement('div');
  wrapper.className = 'rich-content';

  blocks.forEach((block) => {
    if (block.type === 'paragraph') {
      const p = document.createElement('p');
      p.textContent = block.text;
      wrapper.appendChild(p);
      return;
    }

    if (block.type === 'quote') {
      const quote = document.createElement('blockquote');
      quote.innerHTML = `<p>${block.text ?? ''}</p>${block.author ? `<footer>— ${block.author}</footer>` : ''}`;
      wrapper.appendChild(quote);
      return;
    }

    if (block.type === 'list') {
      const ul = document.createElement('ul');
      (block.items || []).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      wrapper.appendChild(ul);
      return;
    }

    if (block.type === 'image') {
      const figure = document.createElement('figure');
      figure.className = 'detail-image';
      figure.innerHTML = `
        <img src="${block.src}" alt="${block.alt || ''}">
        ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
      `;
      wrapper.appendChild(figure);
      return;
    }

    if (block.type === 'note') {
      const note = document.createElement('div');
      note.className = 'note-box';
      note.textContent = block.text ?? '';
      wrapper.appendChild(note);
    }
  });

  return wrapper;
}
