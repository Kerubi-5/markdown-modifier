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
        let parsed = matter(content);

        const imageRegex = /!\[\]\((Media\/[^)]+)\)/; // Matches the first markdown image syntax
        const matches = content.match(imageRegex);

        if (matches) {
          // Directly manipulate the raw frontmatter to add imagePath if not already present
          let frontmatterRaw = parsed.matter;
          if (!frontmatterRaw.includes('imagePath:')) {
            // Append imagePath directly to raw frontmatter
            frontmatterRaw += `\nimagePath: ${matches[1]}`;
            // Reconstruct content with updated frontmatter and original body
            const newContent = `---\n${frontmatterRaw}\n---\n${parsed.content}`;
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated file: ${filePath}`);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
};

modifyMarkdownFiles('./_notes'); // Assuming '_notes' is relative to the current working directory
