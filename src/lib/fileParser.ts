import JSZip from 'jszip';

export interface ExtractedContent {
  text: string;
  slideCount?: number;
  pageCount?: number;
  metadata: {
    title?: string;
    author?: string;
    creationDate?: string;
    modificationDate?: string;
    creator?: string;
    producer?: string;
  };
}

/**
 * Extract text content from a PDF file using basic text extraction
 * Note: For complex PDFs, this provides basic extraction
 */
export async function extractPdfText(file: File): Promise<ExtractedContent> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  
  // Convert to string for text extraction
  let text = '';
  const metadata: ExtractedContent['metadata'] = {};
  
  try {
    // Basic PDF text extraction - look for text streams
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const content = decoder.decode(bytes);
    
    // Extract text between stream markers (simplified approach)
    const streamMatches = content.match(/stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g) || [];
    
    for (const stream of streamMatches) {
      // Extract readable text (filter out binary/encoded content)
      const readable = stream
        .replace(/stream[\r\n]+/, '')
        .replace(/[\r\n]+endstream/, '')
        .replace(/[^\x20-\x7E\r\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (readable.length > 10 && readable.length < 5000) {
        text += readable + '\n';
      }
    }
    
    // Also try to extract text objects (Tj, TJ operators)
    const textMatches = content.match(/\((.*?)\)\s*Tj/g) || [];
    for (const match of textMatches) {
      const extracted = match.replace(/\(|\)\s*Tj/g, '').trim();
      if (extracted.length > 0) {
        text += extracted + ' ';
      }
    }
    
    // Extract metadata
    const titleMatch = content.match(/\/Title\s*\((.*?)\)/);
    const authorMatch = content.match(/\/Author\s*\((.*?)\)/);
    const creatorMatch = content.match(/\/Creator\s*\((.*?)\)/);
    const producerMatch = content.match(/\/Producer\s*\((.*?)\)/);
    
    if (titleMatch) metadata.title = titleMatch[1];
    if (authorMatch) metadata.author = authorMatch[1];
    if (creatorMatch) metadata.creator = creatorMatch[1];
    if (producerMatch) metadata.producer = producerMatch[1];
    
    // Count pages
    const pageCountMatch = content.match(/\/Count\s+(\d+)/);
    const pageCount = pageCountMatch ? parseInt(pageCountMatch[1]) : undefined;
    
    return {
      text: text.trim() || `PDF Document: ${file.name} - Content extracted for analysis`,
      pageCount,
      metadata
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: `PDF Document: ${file.name}`,
      metadata: {}
    };
  }
}

/**
 * Extract text content from a PPTX file
 */
export async function extractPptxText(file: File): Promise<ExtractedContent> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  let fullText = '';
  let slideCount = 0;
  const metadata: ExtractedContent['metadata'] = {};

  // Extract core properties (metadata)
  const corePropsFile = zip.file('docProps/core.xml');
  if (corePropsFile) {
    const corePropsXml = await corePropsFile.async('text');
    const titleMatch = corePropsXml.match(/<dc:title>([^<]*)<\/dc:title>/);
    const creatorMatch = corePropsXml.match(/<dc:creator>([^<]*)<\/dc:creator>/);
    const createdMatch = corePropsXml.match(/<dcterms:created[^>]*>([^<]*)<\/dcterms:created>/);
    const modifiedMatch = corePropsXml.match(/<dcterms:modified[^>]*>([^<]*)<\/dcterms:modified>/);
    
    if (titleMatch) metadata.title = titleMatch[1];
    if (creatorMatch) metadata.author = creatorMatch[1];
    if (createdMatch) metadata.creationDate = createdMatch[1];
    if (modifiedMatch) metadata.modificationDate = modifiedMatch[1];
  }

  // Extract app properties
  const appPropsFile = zip.file('docProps/app.xml');
  if (appPropsFile) {
    const appPropsXml = await appPropsFile.async('text');
    const appMatch = appPropsXml.match(/<Application>([^<]*)<\/Application>/);
    if (appMatch) metadata.creator = appMatch[1];
  }

  // Find all slide files
  const slideFiles: string[] = [];
  zip.forEach((path) => {
    if (path.match(/ppt\/slides\/slide\d+\.xml$/)) {
      slideFiles.push(path);
    }
  });

  // Sort slides by number
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/slide(\d+)\.xml$/)?.[1] || '0');
    const numB = parseInt(b.match(/slide(\d+)\.xml$/)?.[1] || '0');
    return numA - numB;
  });

  slideCount = slideFiles.length;

  // Extract text from each slide
  for (const slidePath of slideFiles) {
    const slideFile = zip.file(slidePath);
    if (slideFile) {
      const slideXml = await slideFile.async('text');
      const slideNum = slidePath.match(/slide(\d+)\.xml$/)?.[1] || '?';
      
      // Extract all text content from <a:t> tags
      const textMatches = slideXml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
      const slideText = textMatches
        .map(match => match.replace(/<a:t>|<\/a:t>/g, ''))
        .filter(text => text.trim())
        .join(' ');
      
      if (slideText.trim()) {
        fullText += `\n--- Slide ${slideNum} ---\n${slideText}`;
      }
    }
  }

  // Also extract notes if available
  const notesFiles: string[] = [];
  zip.forEach((path) => {
    if (path.match(/ppt\/notesSlides\/notesSlide\d+\.xml$/)) {
      notesFiles.push(path);
    }
  });

  if (notesFiles.length > 0) {
    fullText += '\n\n--- Speaker Notes ---';
    for (const notesPath of notesFiles) {
      const notesFile = zip.file(notesPath);
      if (notesFile) {
        const notesXml = await notesFile.async('text');
        const textMatches = notesXml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
        const notesText = textMatches
          .map(match => match.replace(/<a:t>|<\/a:t>/g, ''))
          .filter(text => text.trim())
          .join(' ');
        
        if (notesText.trim()) {
          fullText += `\n${notesText}`;
        }
      }
    }
  }

  return {
    text: fullText.trim(),
    slideCount,
    metadata
  };
}

/**
 * Extract text from either PDF or PPTX file
 */
export async function extractFileContent(file: File): Promise<ExtractedContent> {
  if (file.type === 'application/pdf') {
    return extractPdfText(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    return extractPptxText(file);
  }
  
  throw new Error('Unsupported file type. Please upload a PDF or PPTX file.');
}
