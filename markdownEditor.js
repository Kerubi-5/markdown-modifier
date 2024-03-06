import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const modifyMarkdownFiles = (dirPath) => {
  // Ensure we're working with an absolute path
  const absoluteDirPath = path.resolve(dirPath);
  console.log(`Processing directory: ${absoluteDirPath}`);

  const files = fs.readdirSync(absoluteDirPath);

  files.forEach((file) => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(absoluteDirPath, file);
      console.log(`Processing file: ${filePath}`);
      try {
        // Directly read and write without encoding the file path
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);

        if (parsed.data.tags && parsed.data.tags.includes('Articles')) {
          const imageRegex = /!\[\]\((Media\/[^)]+)\)/; // Matches the markdown image syntax
          const matches = content.match(imageRegex);

          if (matches) {
            parsed.data.src = matches[1];
            const newContent = matter.stringify(parsed.content, parsed.data);
            fs.writeFileSync(filePath, newContent);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
};

// Use an absolute path here
modifyMarkdownFiles(path.resolve('./_notes'));
