import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const modifyMarkdownFiles = (dirPath) => {
  const absoluteDirPath = path.resolve(dirPath);
  console.log(`Processing directory: ${absoluteDirPath}`);

  const files = fs.readdirSync(absoluteDirPath);

  files.forEach((file) => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(absoluteDirPath, file);
      console.log(`Processing file: ${filePath}`);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);

        const imageRegex = /!\[\]\((Media\/[^)]+)\)/; // Matches the first markdown image syntax
        const matches = content.match(imageRegex);

        if (matches) {
          parsed.data.imagePath = matches[1];
          const newContent = matter.stringify(parsed.content, parsed.data);
          fs.writeFileSync(filePath, newContent);
          console.log(`Updated file: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
};

modifyMarkdownFiles(path.resolve('./_notes'));
