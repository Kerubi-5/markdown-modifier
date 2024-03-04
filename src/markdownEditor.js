import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const modifyMarkdownFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(dirPath, file);
      try {
        const content = fs.readFileSync(encodeURI(filePath), 'utf8');
        const parsed = matter(content);

        if (parsed.data.tags && parsed.data.tags.includes('Articles')) {
          const imageRegex = /!\[\]\((Media\/[^)]+)\)/; // Matches the markdown image syntax
          const matches = content.match(imageRegex);

          if (matches) {
            parsed.data.src = matches[1];
            const newContent = matter.stringify(parsed.content, parsed.data);
            fs.writeFileSync(encodeURI(filePath), newContent);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  });
};

modifyMarkdownFiles('./_notes');
