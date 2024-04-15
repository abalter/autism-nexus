

class MML {
  constructor() {
    // The constructor should be either empty or private in some languages
    // JavaScript does not support private constructors, so we ensure singleton using a static method
    if (MML.instance) {
      return MML.instance;
    }
    MML.instance = this;

    // Example property
    this.processedTextCache = {};

    // Define the hierarchy of tags
    this.section_tags = ['article', 'section', 'sub-section', 'sub-sub-section', 'sub-sub-sub-section'];

    // Create a regular expression that matches any of the specified tags followed by any text until the next newline
    this.section_tag_regex = new RegExp(`(<(${tags.join('|')})[^>]*>)([^\\n]*)\\n`, 'gi');

    this.domParser = new DOMParser();

    this.markdownParser = markdownit({
      html: true,
      linkify: true,
      typographer: true
    });

  }

  processText(text) {
    console.log(`processText called with \n${text}`);

    // if (this.processedTextCache[text]) {
    //   console.log('Returning cached result');
    //   return this.processedTextCache[text];
    // }

    console.log('Processing text');

    // Put section headings in heading tags
    text = this.wrapTextWithTitleTag(text);
    // Render any markdown
    text = this.markdownParser.render(text);
    const doc = this.domParser.parseFromString(htmlString, 'text/html');
    text = this.unnestHierarchy(doc)

    // this.processedTextCache[text] = text;
    return text;
  }

  static getInstance() {
    if (!MML.instance) {
      MML.instance = new MML();
    }
    return MML.instance;
  }
}


MML.prototype.wrapHeading = wrapHeading;
MML.prototype.getSectionTagLevel = getSectionTagLevel;
MML.prototype.unnestHierarchy = unnestHierarchy;


function wrapHeading(text) {
  // Wraps all text following a section tag to the newline in the appropriate heading tag.
  // article -> h0, section -> h1, etc.
  // So `<section id="section-2"> Section Number Two` becomes `<section id="section-2"><h1>Section Number Two</h2>`


  // Replace matches with the original tag, followed by the matched text wrapped in a <title> tag, and then the newline
  return text.replace(this.section_tag_regex, (match, p1, p2, p3) => {
    let level = this.section_tags.indexOf(p2);
    // p1 is the full opening tag (e.g., <section>)
    // p2 is the tag name (e.g., section), which we don't use in the replacement
    // p3 is the text to be wrapped with <title>
    return `${p1}\n<h${level}>${p3}</h${level}>\n`;
  });
}

function getSectionTagLevel(tagName) {
  return tagHierarchy.indexOf(tagName.toLowerCase());
}

function unnestElement(element) {
  let parent = element.parentNode;
  while (parent && parent !== document.body) {
    const parentIndex = getSectionTagLevel(parent.tagName.toLowerCase());
    const elementIndex = getSectionTagLevel(element.tagName.toLowerCase());

    // Check if the element is wrongly nested within a parent of lower or equal hierarchy
    if (parentIndex >= 0 && elementIndex <= parentIndex) {
      const grandParent = parent.parentNode;

      // Safety check: If there's no grandparent (i.e., parent is at the top level), break
      if (!grandParent) break;

      // Move the element to be a sibling of its parent, right after the parent
      if (parent.nextSibling) {
        grandParent.insertBefore(element, parent.nextSibling);
      } else {
        grandParent.appendChild(element);
      }
    } else {
      // If the hierarchy is correct, no need to unnest further
      break;
    }

    // Update the parent for the next iteration, in case further unnesting is needed
    parent = element.parentNode;
  }
}

function unnestHierarchy(my_document) {
  // console.log("in unnestHierarchy: \n" + my_document);

  // Create a combined selector for all elements in the hierarchy
  const selector = tagHierarchy.join(', ');
  // Select all elements within the specified hierarchy
  const elements = my_document.querySelectorAll(selector);
  // console.log(`elements: ${elements}`);

  elements.forEach(element => {
    // console.log(`element: ${element.nodeName}`);

    unnestElement(element);
  });

  return (my_document)
}
















